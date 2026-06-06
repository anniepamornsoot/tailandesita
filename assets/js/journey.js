/* ============================================================
   Tailandesita Travel — homepage Journey flow
   - Path tabs
   - Path 1: group calendar deposit / waitlist modal
   - Path 2: 4-step configurator that generates an itinerary
   ============================================================ */

(function () {
  'use strict';

  var section = document.querySelector('.journey-section');
  if (!section) return;

  // ---------- Path tabs ----------
  var tabs = section.querySelectorAll('.journey-tab');
  var paths = section.querySelectorAll('.journey-path');
  function activatePath(which) {
    var target = null;
    tabs.forEach(function (t) {
      var on = t.getAttribute('data-path') === which;
      if (on) target = t;
      t.classList.toggle('active', on);
      t.setAttribute('aria-selected', on ? 'true' : 'false');
    });
    paths.forEach(function (p) {
      var on = p.getAttribute('data-path') === which;
      p.classList.toggle('is-active', on);
      if (on) p.removeAttribute('hidden');
      else p.setAttribute('hidden', '');
    });
    return target;
  }

  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      activatePath(tab.getAttribute('data-path'));
    });
  });

  // If the page is loaded with #configurador, jump straight to the custom
  // path so visitors coming from the tours page land on the calculator.
  function openCalculatorFromHash() {
    if ((location.hash || '').replace('#', '') !== 'configurador') return;
    activatePath('custom');
    section.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  openCalculatorFromHash();
  window.addEventListener('hashchange', openCalculatorFromHash);

  // ---------- Modal (deposit + waitlist) ----------
  var modal = document.getElementById('journey-modal');
  var modalBody = document.getElementById('modal-body');
  var modalClose = document.getElementById('modal-close');

  function openModal(html) {
    modalBody.innerHTML = html;
    modal.removeAttribute('hidden');
    document.body.style.overflow = 'hidden';
  }
  function closeModal() {
    modal.setAttribute('hidden', '');
    document.body.style.overflow = '';
    modalBody.innerHTML = '';
  }
  modalClose && modalClose.addEventListener('click', closeModal);
  modal && modal.addEventListener('click', function (e) {
    if (e.target === modal) closeModal();
  });
  document.addEventListener('keydown', function (e) {
    if (!modal || modal.hasAttribute('hidden')) return;
    if (e.key === 'Escape') closeModal();
  });

  function fmtMoney(n) {
    return '$' + n.toLocaleString('es-ES').replace(/,/g, '.');
  }

  function depositHTML(data) {
    var deposit = Math.round(data.precio * 0.3);
    return '' +
      '<span class="modal-eyebrow">Reservar plaza · grupo</span>' +
      '<h3>' + data.nombre + '</h3>' +
      '<p>Asegura tu lugar con un depósito del 30%. Si no podemos confirmar, te devolvemos el 100%.</p>' +
      '<div class="modal-summary"><dl>' +
        '<dt>Fechas</dt><dd>' + data.fechas + '</dd>' +
        '<dt>Precio</dt><dd>' + fmtMoney(data.precio) + ' USD / persona</dd>' +
        '<dt>Depósito hoy</dt><dd><strong>' + fmtMoney(deposit) + ' USD</strong></dd>' +
      '</dl></div>' +
      '<form class="modal-form" data-mode="deposit">' +
        '<label><span>Tu nombre</span><input type="text" name="nombre" required placeholder="Nombre y apellidos" /></label>' +
        '<label><span>Email</span><input type="email" name="email" required placeholder="tu@email.com" /></label>' +
        '<label><span>Teléfono / WhatsApp</span><input type="tel" name="telefono" placeholder="+34 ..." /></label>' +
        '<button type="submit" class="btn btn-primary modal-cta">Pagar depósito de ' + fmtMoney(deposit) + '</button>' +
        '<p class="modal-fine">Pago seguro con Stripe. Recibirás un email de confirmación en minutos.</p>' +
      '</form>';
  }

  function waitlistHTML(data) {
    return '' +
      '<span class="modal-eyebrow">Lista de espera</span>' +
      '<h3>' + data.nombre + '</h3>' +
      '<p>Esta salida está completa. Apúntate a la lista y te avisamos en cuanto se libere una plaza.</p>' +
      '<div class="modal-summary"><dl>' +
        '<dt>Fechas</dt><dd>' + data.fechas + '</dd>' +
      '</dl></div>' +
      '<form class="modal-form" data-mode="waitlist">' +
        '<label><span>Tu nombre</span><input type="text" name="nombre" required /></label>' +
        '<label><span>Email</span><input type="email" name="email" required /></label>' +
        '<button type="submit" class="btn btn-primary modal-cta">Apuntarme a la lista</button>' +
        '<p class="modal-fine">Sin compromiso. Avisamos por email solamente si se libera tu plaza.</p>' +
      '</form>';
  }

  function successHTML(mode) {
    if (mode === 'waitlist') {
      return '<div class="modal-success">' +
        '<div class="modal-success-ico">✓</div>' +
        '<h3>Estás en la lista</h3>' +
        '<p>Te avisaremos por email si se libera una plaza para esta salida. Mientras, Esmeranda puede sugerirte fechas alternativas.</p>' +
        '<button type="button" class="btn btn-ghost" data-modal-close>Cerrar</button>' +
        '</div>';
    }
    return '<div class="modal-success">' +
      '<div class="modal-success-ico">✓</div>' +
      '<h3>¡Plaza reservada!</h3>' +
      '<p>Recibirás un email con la confirmación, los detalles del grupo y los siguientes pasos para abonar el resto del viaje.</p>' +
      '<button type="button" class="btn btn-primary" data-modal-close>Perfecto</button>' +
      '</div>';
  }

  // Delegate clicks: book / waitlist buttons + modal form submit + modal close inside content
  section.addEventListener('click', function (e) {
    var book = e.target.closest('[data-book]');
    if (book) {
      try { openModal(depositHTML(JSON.parse(book.getAttribute('data-book')))); } catch (err) {}
      return;
    }
    var wl = e.target.closest('[data-waitlist]');
    if (wl) {
      try { openModal(waitlistHTML(JSON.parse(wl.getAttribute('data-waitlist')))); } catch (err) {}
    }
  });
  modal && modal.addEventListener('submit', function (e) {
    if (e.target.matches('.modal-form')) {
      e.preventDefault();
      var mode = e.target.getAttribute('data-mode');
      modalBody.innerHTML = successHTML(mode);
    }
  });
  modal && modal.addEventListener('click', function (e) {
    if (e.target.matches('[data-modal-close]')) closeModal();
  });

  // ============================================================
  //   Path 2 · Configurator
  // ============================================================
  var configWrap = document.getElementById('config-wrap');
  var configResult = document.getElementById('config-result');
  if (!configWrap || !configResult) return;

  var state = {
    step: 1,
    groupSize: null,
    duration: null,
    interests: [],
    month: null
  };
  var TOTAL_STEPS = 4;

  var stepEls = configWrap.querySelectorAll('.config-step');
  var progressEls = configWrap.querySelectorAll('.progress-step');
  var nextBtn = document.getElementById('config-next');
  var backBtn = document.getElementById('config-back');
  var restartBtn = document.getElementById('config-restart');

  function currentStepEl() {
    return configWrap.querySelector('.config-step[data-step="' + state.step + '"]');
  }
  function showStep() {
    stepEls.forEach(function (s) {
      var on = parseInt(s.getAttribute('data-step'), 10) === state.step;
      s.classList.toggle('is-active', on);
      if (on) s.removeAttribute('hidden'); else s.setAttribute('hidden', '');
    });
    progressEls.forEach(function (p) {
      var n = parseInt(p.getAttribute('data-step'), 10);
      p.classList.toggle('active', n === state.step);
      p.classList.toggle('completed', n < state.step);
    });
    backBtn.hidden = state.step === 1;
    nextBtn.textContent = state.step === TOTAL_STEPS ? 'Ver mi propuesta' : 'Continuar';
    nextBtn.disabled = !isStepValid();
  }
  function isStepValid() {
    if (state.step === 1) return state.groupSize != null;
    if (state.step === 2) return state.duration != null;
    if (state.step === 3) return state.interests.length > 0;
    if (state.step === 4) return state.month != null;
    return false;
  }

  // Option click handlers (delegated)
  configWrap.addEventListener('click', function (e) {
    var btn = e.target.closest('.config-options button');
    if (!btn) return;
    var holder = btn.closest('.config-options');
    var name = holder.getAttribute('data-name');
    var multi = holder.getAttribute('data-multi') === 'true';
    var value = btn.getAttribute('data-value');

    if (multi) {
      var arr = state[name] || [];
      if (arr.indexOf(value) === -1) arr.push(value);
      else arr.splice(arr.indexOf(value), 1);
      state[name] = arr;
      btn.classList.toggle('is-selected');
    } else {
      holder.querySelectorAll('button').forEach(function (b) { b.classList.remove('is-selected'); });
      btn.classList.add('is-selected');
      var coerced = (name === 'groupSize' || name === 'duration' || name === 'month')
        ? parseInt(value, 10)
        : value;
      state[name] = coerced;
    }
    nextBtn.disabled = !isStepValid();
  });

  nextBtn.addEventListener('click', function () {
    if (!isStepValid()) return;
    if (state.step < TOTAL_STEPS) {
      state.step++;
      showStep();
    } else {
      renderResult();
      configWrap.style.display = 'none';
      configResult.removeAttribute('hidden');
      configResult.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
  backBtn.addEventListener('click', function () {
    if (state.step > 1) { state.step--; showStep(); }
  });
  restartBtn.addEventListener('click', function () {
    state = { step: 1, groupSize: null, duration: null, interests: [], month: null };
    configWrap.querySelectorAll('.config-options button.is-selected').forEach(function (b) {
      b.classList.remove('is-selected');
    });
    showStep();
    configResult.setAttribute('hidden', '');
    configWrap.style.display = '';
    configWrap.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  // ---------- Itinerary generation ----------
  var DAY_POOL = [
    { titulo: 'Bangkok · Templos del río', desc: 'Wat Pho, Wat Arun y paseo en barca por el Chao Phraya con guía en español.', tags: ['templos'] },
    { titulo: 'Bangkok · Mercados y comida callejera', desc: 'Chatuchak o Or Tor Kor + ruta gastronómica nocturna por Chinatown.', tags: ['mercados', 'gastronomia'] },
    { titulo: 'Bangkok · Clase de cocina y rooftop', desc: 'Aprendes pad thai y curry con chef local. Cierre en rooftop con vistas.', tags: ['gastronomia'] },
    { titulo: 'Ayutthaya · Antigua capital', desc: 'Templos UNESCO, Buda entre raíces y barca al atardecer.', tags: ['templos'] },
    { titulo: 'Damnoen Saduak · Mercado flotante', desc: 'Excursión temprana al mercado flotante más auténtico de la zona.', tags: ['mercados'] },
    { titulo: 'Chiang Mai · Doi Suthep al amanecer', desc: 'Subida al templo más sagrado del norte antes de los autobuses turísticos.', tags: ['templos', 'montanas'] },
    { titulo: 'Chiang Mai · Santuario ético de elefantes', desc: 'Día completo con elefantes rescatados. Sin paseos, sin shows.', tags: ['vida-salvaje'] },
    { titulo: 'Chiang Mai · Mercado nocturno y cocina del norte', desc: 'Khao soi y sai oua con una abuela tailandesa, después al mercado.', tags: ['gastronomia', 'mercados'] },
    { titulo: 'Chiang Mai · Trekking ligero y cascadas', desc: 'Caminata por el Doi Inthanon con paradas en cascadas y poblados étnicos.', tags: ['montanas', 'vida-salvaje'] },
    { titulo: 'Pai · Cascadas y aguas termales', desc: 'Día relajado en el valle del río Pai con paradas en termas naturales.', tags: ['montanas'] },
    { titulo: 'Phuket · Phi Phi en barco privado', desc: 'Maya Bay, Pileh Lagoon y snorkel en aguas cristalinas, sin masas.', tags: ['playas'] },
    { titulo: 'Krabi · Cuatro islas y kayak', desc: 'Tup Island, Chicken Island y kayak entre formaciones de roca caliza.', tags: ['playas', 'vida-salvaje'] },
    { titulo: 'Koh Lanta · Día de playa y atardecer', desc: 'Mañana libre en playa virgen, masaje y cena con los pies en la arena.', tags: ['playas'] },
    { titulo: 'Kanchanaburi · Erawan y río Kwai', desc: 'Cascadas de 7 niveles + ruta histórica del puente sobre el río Kwai.', tags: ['montanas'] },
    { titulo: 'Sukhothai · Otro reino antiguo', desc: 'Templos de la primera capital tailandesa, en bici entre lotos.', tags: ['templos'] }
  ];

  function generateItinerary(opts) {
    var days = [];
    days.push({ titulo: 'Llegada a Bangkok', desc: 'Recogida en el aeropuerto Suvarnabhumi y traslado a tu hotel. Cena ligera en Sukhumvit y briefing del viaje con tu guía.' });

    var matching = DAY_POOL.filter(function (d) {
      return d.tags.some(function (t) { return opts.interests.indexOf(t) !== -1; });
    });
    if (matching.length === 0) matching = DAY_POOL.slice();

    var middle = opts.duration - 2;
    var used = {};
    for (var i = 0; i < middle; i++) {
      var pick;
      var attempts = 0;
      do {
        pick = matching[(i * 3 + attempts) % matching.length];
        attempts++;
      } while (used[pick.titulo] && attempts < matching.length);
      used[pick.titulo] = true;
      days.push({ titulo: pick.titulo, desc: pick.desc });
    }

    days.push({ titulo: 'Día libre y despedida', desc: 'Mañana libre para compras, spa o un último mango sticky rice. Traslado al aeropuerto.' });
    return days;
  }

  function calcPrice(opts) {
    var rates = { 2: 230, 4: 200, 6: 180, 8: 165, 10: 155, 12: 140 };
    var rate = rates[opts.groupSize] || 180;
    var perPerson = rate * opts.duration;
    perPerson = Math.round(perPerson / 10) * 10;
    return {
      perPerson: perPerson,
      total: perPerson * opts.groupSize
    };
  }

  var MONTHS_ES = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
  var INTEREST_LABELS = {
    'templos': 'templos',
    'playas': 'playas',
    'montanas': 'montañas',
    'gastronomia': 'gastronomía',
    'mercados': 'mercados',
    'vida-salvaje': 'vida salvaje'
  };

  function renderResult() {
    var itinerary = generateItinerary(state);
    var price = calcPrice(state);

    document.getElementById('result-title').textContent =
      'Tu Tailandia en ' + state.duration + ' días';

    var groupLabel = state.groupSize === 12 ? '12+ personas' : state.groupSize + ' personas';
    var interests = state.interests.map(function (k) { return INTEREST_LABELS[k] || k; }).join(', ');
    document.getElementById('result-summary').textContent =
      groupLabel + ' · ' + interests + ' · viaje en ' + MONTHS_ES[state.month - 1] + ' 2026';

    var ol = document.getElementById('result-days');
    ol.innerHTML = '';
    itinerary.forEach(function (d) {
      var li = document.createElement('li');
      li.innerHTML = '<div><strong>' + d.titulo + '</strong><span>' + d.desc + '</span></div>';
      ol.appendChild(li);
    });

    document.getElementById('result-per-person').innerHTML =
      fmtMoney(price.perPerson) + ' <small style="color:rgba(255,255,255,0.85);font-size:1rem;">USD</small>';
    document.getElementById('result-total').textContent = fmtMoney(price.total) + ' USD';

    var cta = document.getElementById('result-request-cta');
    var subject = 'Solicitud tour privado · ' + groupLabel + ' · ' + state.duration + ' días · ' + MONTHS_ES[state.month - 1];
    var body = [
      'Hola Esme,',
      '',
      'Me gustaría reservar el tour privado que diseñé en el configurador:',
      '',
      '· Personas: ' + groupLabel,
      '· Días: ' + state.duration,
      '· Intereses: ' + interests,
      '· Mes: ' + MONTHS_ES[state.month - 1] + ' 2026',
      '· Precio estimado: ' + fmtMoney(price.perPerson) + ' USD por persona (' + fmtMoney(price.total) + ' USD total grupo)',
      '',
      '¿Podemos hablar para concretar fechas, hoteles y siguiente paso?',
      '',
      'Gracias!'
    ].join('\n');
    cta.href = 'mailto:hola@tailandesita.com' +
      '?subject=' + encodeURIComponent(subject) +
      '&body=' + encodeURIComponent(body);
  }

  showStep();
})();
