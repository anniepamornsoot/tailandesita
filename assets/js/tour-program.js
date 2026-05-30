/* ============================================================
   Tailandesita Travel — Single group tour page renderer
   Reads ?tour=<id> from URL, finds the tour in
   window.TAILANDESITA_GROUP_TOURS and fills the DOM. Also
   owns the sidebar booking widget (Iceland-style: participant
   counters + date picker + booking summary + Ir al carrito)
   and the payment modal (Datos → Pago → Confirmación).
   ============================================================ */

(function () {
  'use strict';

  var data = window.TAILANDESITA_GROUP_TOURS || {};
  var params = new URLSearchParams(window.location.search);
  var id = params.get('tour');
  var tour = id ? data[id] : null;

  var notFound = document.getElementById('tour-not-found');
  var content = document.getElementById('tour-content-root');

  if (!tour) {
    if (notFound) notFound.hidden = false;
    if (content) content.hidden = true;
    return;
  }
  if (notFound) notFound.hidden = true;
  if (content) content.hidden = false;

  document.title = tour.nombre.replace(/&amp;/g, '&') + ' — Tailandesita Travel';
  var metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) metaDesc.setAttribute('content', tour.lede);

  function fmtMoney(n) { return '$' + n.toLocaleString('es-ES').replace(/,/g, '.'); }
  function setText(id, val) { var el = document.getElementById(id); if (el) el.textContent = val; }
  function setHTML(id, html) { var el = document.getElementById(id); if (el) el.innerHTML = html; }
  function maxGroupSize() {
    var m = (tour.grupo || '').match(/(\d+)/);
    return m ? parseInt(m[1], 10) : 12;
  }

  // ---------- Header ----------
  setHTML('tour-tag', tour.tag);
  setHTML('tour-title', tour.nombre);
  setText('tour-lede', tour.lede);
  setText('crumb-name', tour.nombre.replace(/&amp;/g, '&'));

  var quick = document.getElementById('tour-quick');
  if (quick) {
    quick.innerHTML =
      '<li><strong>' + tour.duracion + '</strong><span>de duración</span></li>' +
      '<li><strong>' + tour.grupo + '</strong><span>grupo reducido</span></li>' +
      '<li><strong>Español</strong><span>guía local</span></li>' +
      '<li><strong>★ ' + tour.rating + '</strong><span>(' + tour.reseñas + ' reseñas)</span></li>';
  }

  // ---------- Gallery ----------
  var gallery = document.getElementById('tour-gallery');
  if (gallery && tour.gallery && tour.gallery.length) {
    var imgs = tour.gallery.slice(0, 5);
    gallery.innerHTML = imgs.map(function (src, idx) {
      var classes = ['gallery-item'];
      if (idx === 0) classes.push('gallery-item-main');
      if (idx === imgs.length - 1) classes.push('gallery-item-more');
      var inner = (idx === imgs.length - 1) ? '<span class="gallery-more">+ Ver todas las fotos</span>' : '';
      return '<button type="button" class="' + classes.join(' ') +
        '" data-lightbox="' + src + '" style="background-image:url(\'' + src + '\')" aria-label="Ver foto ' + (idx + 1) + '">' +
        inner + '</button>';
    }).join('');
  }

  // ---------- About / includes / itinerary / testimonials / FAQ ----------
  if (tour.about) setHTML('tour-about-body', tour.about.map(function (p) { return '<p>' + p + '</p>'; }).join(''));
  if (tour.incluye) setHTML('tour-incluye', tour.incluye.map(function (i) { return '<li>' + i + '</li>'; }).join(''));
  if (tour.noIncluye) setHTML('tour-no-incluye', tour.noIncluye.map(function (i) { return '<li>' + i + '</li>'; }).join(''));
  if (tour.itinerario) setHTML('tour-itinerary', tour.itinerario.map(function (d) {
    return '<li><span class="iti-time">' + d.dia + '</span><div><h3>' + d.titulo + '</h3><p>' + d.desc + '</p></div></li>';
  }).join(''));
  if (tour.faq) setHTML('tour-faq', tour.faq.map(function (f) {
    return '<details class="faq-item"><summary><span class="faq-q">' + f.q +
      '</span><span class="faq-toggle-icon" aria-hidden="true"></span></summary>' +
      '<div class="faq-body"><p>' + f.a + '</p></div></details>';
  }).join(''));
  if (tour.testimonios && tour.testimonios.length) {
    var cards = tour.testimonios.map(function (t) {
      return '<blockquote><div class="t-stars">★★★★★</div><p>"' + t.texto + '"</p><footer>— ' + t.autor + ', ' + t.origen + '</footer></blockquote>';
    });
    // Render the cards twice so we can slide forward forever and
    // snap back invisibly once we've moved a full set.
    setHTML('tour-testimonios',
      '<div class="testimonios-track" id="testimonios-track">' + cards.concat(cards).join('') + '</div>');
    startTestimonialsCarousel(tour.testimonios.length);
  }

  function startTestimonialsCarousel(count) {
    if (count < 2) return;
    var track = document.getElementById('testimonios-track');
    var viewport = track && track.parentElement;
    if (!track || !viewport) return;
    var STEP_MS = 4500;
    var DUR = 600;
    var i = 0;
    var timer = null;

    function advance() {
      i++;
      var card = track.querySelector('blockquote');
      if (!card) return;
      var cs = window.getComputedStyle(track);
      var gap = parseFloat(cs.gap) || 18;
      var cw = card.getBoundingClientRect().width;
      var offset = (cw + gap) * i;
      track.style.transition = 'transform ' + DUR + 'ms ease';
      track.style.transform = 'translateX(-' + offset + 'px)';
      if (i >= count) {
        setTimeout(function () {
          track.style.transition = 'none';
          track.style.transform = 'translateX(0)';
          i = 0;
          void track.offsetWidth; // force reflow before next transition
        }, DUR);
      }
    }

    function start() { stop(); timer = setInterval(advance, STEP_MS); }
    function stop() { if (timer) { clearInterval(timer); timer = null; } }

    start();
    viewport.addEventListener('mouseenter', stop);
    viewport.addEventListener('mouseleave', start);
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) stop(); else start();
    });
  }

  // ---------- Departures: info only (date · price · status badge), no CTAs ----------
  function statusBadge(d) {
    var label, cls;
    if (d.estado === 'full') { label = 'Completo'; cls = 'full'; }
    else if (d.estado === 'last') { label = 'Últimas ' + d.plazas + ' plazas'; cls = 'last'; }
    else { label = d.plazas + ' plazas disponibles'; cls = 'available'; }
    return '<span class="dep-status dep-status-' + cls + '">' + label + '</span>';
  }
  var depEl = document.getElementById('tour-departures');
  if (depEl && tour.departures) {
    depEl.innerHTML = tour.departures.map(function (d) {
      return '<div class="dep-row" data-estado="' + d.estado + '">' +
        '<div class="dep-dates"><strong>' + d.fechas + '</strong><span>' + d.dias + '</span></div>' +
        '<div class="dep-price"><strong>' + fmtMoney(d.precio) + '</strong><span>USD / persona</span></div>' +
        '<div class="dep-availability">' + statusBadge(d) + '</div>' +
      '</div>';
    }).join('');
  }

  // ============================================================
  //   Sidebar booking widget
  // ============================================================
  var widget = document.getElementById('booking-widget');
  var dateBlock = document.getElementById('bw-date-block');
  var ticket = document.getElementById('bw-ticket');
  var memberInput = document.getElementById('bw-member');
  var bwCta = document.getElementById('bw-cta');
  var bwTitle = document.getElementById('bw-title');

  if (bwTitle) bwTitle.textContent = 'Reservar — ' + tour.nombre.replace(/&amp;/g, '&');

  var bookingState = {
    depIndex: null,
    counts: { adultos: 1, adolescentes: 0, ninos: 0 },
    member: '',
    showCalendar: true
  };

  // Pre-select first available departure
  var firstAvail = (tour.departures || []).findIndex(function (d) { return d.estado !== 'full'; });
  if (firstAvail >= 0) { bookingState.depIndex = firstAvail; bookingState.showCalendar = false; }

  function totalParticipants() {
    return bookingState.counts.adultos + bookingState.counts.adolescentes + bookingState.counts.ninos;
  }
  function selectedDeparture() {
    if (bookingState.depIndex == null) return null;
    return tour.departures[bookingState.depIndex];
  }
  function priceFor(category) {
    var dep = selectedDeparture();
    var base = dep ? dep.precio : tour.precioDesde;
    if (category === 'adolescentes') return Math.round(base * 0.85 / 10) * 10;
    if (category === 'ninos') return Math.round(base * 0.55 / 10) * 10;
    return base;
  }
  function lineTotal() {
    return priceFor('adultos') * bookingState.counts.adultos +
           priceFor('adolescentes') * bookingState.counts.adolescentes +
           priceFor('ninos') * bookingState.counts.ninos;
  }
  function depositTotal() {
    return Math.round(lineTotal() * (tour.depositoPct || 30) / 100);
  }
  function isOversubscribed() {
    var dep = selectedDeparture();
    if (!dep || dep.estado === 'full') return true;
    if (totalParticipants() === 0) return true;
    if (totalParticipants() > dep.plazas) return true;
    if (totalParticipants() > maxGroupSize()) return true;
    return false;
  }

  function renderCounters() {
    Object.keys(bookingState.counts).forEach(function (k) {
      var row = widget.querySelector('[data-counter="' + k + '"]');
      if (!row) return;
      var val = row.querySelector('[data-val]');
      if (val) val.textContent = bookingState.counts[k];
      var minus = row.querySelector('[data-step="-1"]');
      if (minus) minus.disabled = bookingState.counts[k] <= (k === 'adultos' ? 1 : 0);
    });
  }

  function renderDateBlock() {
    if (!dateBlock) return;
    if (bookingState.showCalendar || bookingState.depIndex == null) {
      // List of available departures
      var rows = (tour.departures || []).map(function (d, i) {
        var disabled = d.estado === 'full';
        var statusText = d.estado === 'full' ? 'Completo'
          : (d.estado === 'last' ? 'Últimas ' + d.plazas : d.plazas + ' plazas');
        return '<button type="button" class="bw-date-option" data-dep="' + i + '"' +
          (disabled ? ' disabled aria-disabled="true"' : '') + '>' +
          '<span class="bw-date-info"><strong>' + d.fechas + '</strong>' +
          '<small>' + d.dias + ' · ' + fmtMoney(d.precio) + ' USD / persona</small></span>' +
          '<span class="bw-date-status bw-date-status-' + d.estado + '">' + statusText + '</span>' +
          '</button>';
      }).join('');
      dateBlock.innerHTML =
        '<h4 class="bw-section-title">Elige tu fecha</h4>' +
        '<div class="bw-date-list">' + rows + '</div>';
    } else {
      var d = selectedDeparture();
      dateBlock.innerHTML =
        '<button type="button" class="bw-date-back" id="bw-date-back" aria-label="Cambiar fecha">' +
          '<span class="bw-date-back-arrow" aria-hidden="true">‹</span>' +
          '<span class="bw-date-back-label"><strong>' + d.fechas + '</strong><small>' + d.dias + ' · ' + fmtMoney(d.precio) + ' USD / persona</small></span>' +
        '</button>' +
        '<a href="#" class="bw-date-back-link" id="bw-show-calendar">Volver al calendario</a>';
    }
  }

  function renderTicket() {
    if (!ticket) return;
    var dep = selectedDeparture();
    if (!dep) {
      ticket.innerHTML = '<p class="bw-ticket-empty">Elige una fecha para ver el resumen.</p>';
      return;
    }
    var lines = [];
    if (bookingState.counts.adultos > 0) {
      lines.push({ label: 'Adultos × ' + bookingState.counts.adultos, total: priceFor('adultos') * bookingState.counts.adultos });
    }
    if (bookingState.counts.adolescentes > 0) {
      lines.push({ label: 'Adolescentes × ' + bookingState.counts.adolescentes, total: priceFor('adolescentes') * bookingState.counts.adolescentes });
    }
    if (bookingState.counts.ninos > 0) {
      lines.push({ label: 'Niños × ' + bookingState.counts.ninos, total: priceFor('ninos') * bookingState.counts.ninos });
    }
    var linesHTML = lines.length
      ? lines.map(function (l) { return '<div class="bw-ticket-line"><span>' + l.label + '</span><strong>' + fmtMoney(l.total) + '</strong></div>'; }).join('')
      : '<div class="bw-ticket-line bw-ticket-empty"><span>Añade al menos un participante</span></div>';

    ticket.innerHTML =
      '<article class="bw-ticket-card">' +
        '<div class="bw-ticket-stub">' +
          '<h5>' + tour.nombre + '</h5>' +
          '<p>' + tour.duracion + '</p>' +
        '</div>' +
        '<div class="bw-ticket-perf">' +
          '<span class="bw-ticket-date-day">' + dep.fechas.split('–')[0].trim() + '</span>' +
          '<span class="bw-ticket-date-rest">→ ' + (dep.fechas.split('–')[1] || '').trim() + '</span>' +
        '</div>' +
        '<div class="bw-ticket-body">' +
          linesHTML +
          '<div class="bw-ticket-line bw-ticket-total"><span>Total</span><strong>' + fmtMoney(lineTotal()) + ' USD</strong></div>' +
        '</div>' +
      '</article>';
  }

  function renderCTA() {
    if (!bwCta) return;
    var dep = selectedDeparture();
    var disabled = !dep || dep.estado === 'full' || totalParticipants() === 0;
    bwCta.disabled = disabled;
    var note = '';
    if (dep && dep.estado !== 'full' && totalParticipants() > dep.plazas) {
      note = '<p class="bw-cta-note">Solo quedan ' + dep.plazas + ' plazas para esta fecha.</p>';
    } else if (dep && totalParticipants() > maxGroupSize()) {
      note = '<p class="bw-cta-note">Esta salida tiene un máximo de ' + maxGroupSize() + ' viajeros.</p>';
    }
    // Insert / replace note after the CTA
    var existing = widget.querySelector('.bw-cta-note');
    if (existing) existing.remove();
    if (note) bwCta.insertAdjacentHTML('afterend', note);
  }

  function renderWidget() {
    renderCounters();
    renderDateBlock();
    renderTicket();
    renderCTA();
  }

  // Counter clicks
  if (widget) {
    widget.addEventListener('click', function (e) {
      var btn = e.target.closest('.bw-counter-btn');
      if (btn) {
        var row = btn.closest('[data-counter]');
        var key = row.getAttribute('data-counter');
        var step = parseInt(btn.getAttribute('data-step'), 10);
        var next = bookingState.counts[key] + step;
        var min = key === 'adultos' ? 1 : 0;
        var max = maxGroupSize();
        if (next < min) next = min;
        if (totalParticipants() - bookingState.counts[key] + next > max) return;
        bookingState.counts[key] = next;
        renderWidget();
        return;
      }
      var dateOpt = e.target.closest('.bw-date-option');
      if (dateOpt && !dateOpt.disabled) {
        bookingState.depIndex = parseInt(dateOpt.getAttribute('data-dep'), 10);
        bookingState.showCalendar = false;
        renderWidget();
        return;
      }
      if (e.target.closest('#bw-show-calendar') || e.target.closest('#bw-date-back')) {
        e.preventDefault();
        bookingState.showCalendar = true;
        renderWidget();
        return;
      }
    });
  }
  if (memberInput) memberInput.addEventListener('input', function () {
    bookingState.member = memberInput.value;
  });

  renderWidget();

  // ============================================================
  //   Payment modal — Datos → Pago → Confirmación
  // ============================================================
  var modal = document.getElementById('checkout-modal');
  var modalBody = document.getElementById('checkout-body');
  var modalClose = document.getElementById('checkout-close');
  var modalProgress = document.getElementById('checkout-progress');

  var payState = {
    step: 1,
    nombre: '', apellido: '', email: '', telefono: '',
    pais: '', direccion: '', notas: '',
    metodo: 'card',
    aceptaTerminos: false
  };

  function openCheckout() {
    if (!modal) return;
    if (isOversubscribed()) return;
    payState.step = 1;
    modal.removeAttribute('hidden');
    document.body.style.overflow = 'hidden';
    renderPayStep();
  }
  function closeCheckout() {
    if (!modal) return;
    modal.setAttribute('hidden', '');
    document.body.style.overflow = '';
  }
  if (modalClose) modalClose.addEventListener('click', closeCheckout);
  if (modal) modal.addEventListener('click', function (e) {
    if (e.target === modal) closeCheckout();
  });
  document.addEventListener('keydown', function (e) {
    if (modal && !modal.hasAttribute('hidden') && e.key === 'Escape') closeCheckout();
  });

  function updateProgress() {
    if (!modalProgress) return;
    modalProgress.querySelectorAll('.cp-step').forEach(function (s) {
      var n = parseInt(s.getAttribute('data-step'), 10);
      s.classList.toggle('is-active', n === payState.step);
      s.classList.toggle('is-done', n < payState.step);
    });
  }

  function orderSummaryHTML() {
    var dep = selectedDeparture();
    var lines = [];
    if (bookingState.counts.adultos > 0) lines.push({ l: 'Adultos × ' + bookingState.counts.adultos, t: priceFor('adultos') * bookingState.counts.adultos });
    if (bookingState.counts.adolescentes > 0) lines.push({ l: 'Adolescentes × ' + bookingState.counts.adolescentes, t: priceFor('adolescentes') * bookingState.counts.adolescentes });
    if (bookingState.counts.ninos > 0) lines.push({ l: 'Niños × ' + bookingState.counts.ninos, t: priceFor('ninos') * bookingState.counts.ninos });
    var t = lineTotal();
    var d = depositTotal();
    var resto = t - d;
    return '<div class="co-order">' +
      '<div class="co-order-meta">' + tour.nombre + ' · ' + (dep ? dep.fechas : '—') + '</div>' +
      lines.map(function (x) { return '<div class="co-order-line"><span>' + x.l + '</span><strong>' + fmtMoney(x.t) + '</strong></div>'; }).join('') +
      '<div class="co-order-line"><span>Subtotal</span><strong>' + fmtMoney(t) + ' USD</strong></div>' +
      '<div class="co-order-line"><span>Depósito hoy (' + (tour.depositoPct || 30) + '%)</span><strong>' + fmtMoney(d) + ' USD</strong></div>' +
      '<div class="co-order-line co-order-total"><span>A pagar hoy</span><strong>' + fmtMoney(d) + ' USD</strong></div>' +
      (resto > 0 ? '<div class="co-order-fine">Resto · ' + fmtMoney(resto) + ' USD se cobra 60 días antes de la salida.</div>' : '') +
      '</div>';
  }

  function renderPayStep() {
    updateProgress();
    if (payState.step === 1) return renderDatos();
    if (payState.step === 2) return renderPago();
    if (payState.step === 3) return renderListo();
  }

  function renderDatos() {
    modalBody.innerHTML =
      '<div class="co-step">' +
        '<h4 class="co-step-title">Tus datos</h4>' +
        '<p class="co-step-sub">Necesitamos estos datos para emitir la reserva y los seguros.</p>' +
        orderSummaryHTML() +
        '<form class="co-form" id="co-form-datos" novalidate>' +
          '<div class="co-row">' +
            '<label class="co-field"><span>Nombre *</span><input type="text" name="nombre" required value="' + payState.nombre + '"/></label>' +
            '<label class="co-field"><span>Apellido *</span><input type="text" name="apellido" required value="' + payState.apellido + '"/></label>' +
          '</div>' +
          '<div class="co-row">' +
            '<label class="co-field"><span>Email *</span><input type="email" name="email" required value="' + payState.email + '"/></label>' +
            '<label class="co-field"><span>Teléfono / WhatsApp *</span><input type="tel" name="telefono" required value="' + payState.telefono + '"/></label>' +
          '</div>' +
          '<label class="co-field"><span>País de residencia *</span><input type="text" name="pais" required value="' + payState.pais + '" placeholder="España, México, Argentina..."/></label>' +
          '<label class="co-field"><span>Dirección de facturación</span><input type="text" name="direccion" value="' + payState.direccion + '" placeholder="Calle y número, ciudad, código postal (opcional)"/></label>' +
          '<label class="co-field"><span>Notas para el organizador</span><textarea name="notas" rows="2" placeholder="Alergias, edades, vuelos, peticiones especiales...">' + payState.notas + '</textarea></label>' +
        '</form>' +
        '<div class="co-controls">' +
          '<button type="button" class="btn btn-ghost" data-co-cancel>Cancelar</button>' +
          '<button type="button" class="btn btn-primary" data-co-next>Continuar al pago →</button>' +
        '</div>' +
      '</div>';
  }

  function renderPago() {
    var d = depositTotal();
    modalBody.innerHTML =
      '<div class="co-step">' +
        '<h4 class="co-step-title">Revisa y paga</h4>' +
        '<p class="co-step-sub">Hoy abonas el ' + (tour.depositoPct || 30) + '% para bloquear tu plaza. El resto se cobra 60 días antes de la salida.</p>' +
        orderSummaryHTML() +
        '<fieldset class="co-pay">' +
          '<legend>Método de pago</legend>' +
          '<label class="co-pay-option' + (payState.metodo === 'card' ? ' is-checked' : '') + '">' +
            '<input type="radio" name="metodo" value="card"' + (payState.metodo === 'card' ? ' checked' : '') + ' />' +
            '<span class="co-pay-radio" aria-hidden="true"></span>' +
            '<span><strong>Tarjeta de crédito o débito</strong><small>Visa, Mastercard, Amex. Procesado por Stripe.</small></span>' +
          '</label>' +
          '<label class="co-pay-option' + (payState.metodo === 'transfer' ? ' is-checked' : '') + '">' +
            '<input type="radio" name="metodo" value="transfer"' + (payState.metodo === 'transfer' ? ' checked' : '') + ' />' +
            '<span class="co-pay-radio" aria-hidden="true"></span>' +
            '<span><strong>Transferencia bancaria</strong><small>Recibes los datos por email. Confirma tu plaza al recibir el pago.</small></span>' +
          '</label>' +
        '</fieldset>' +
        '<label class="co-terms"><input type="checkbox" name="terminos"' + (payState.aceptaTerminos ? ' checked' : '') + ' /> He leído y acepto los <a href="#" target="_blank">términos y condiciones</a> y la política de cancelación.</label>' +
        '<div class="co-controls">' +
          '<button type="button" class="btn btn-ghost" data-co-back>← Atrás</button>' +
          '<button type="button" class="btn btn-primary" data-co-pay>Pagar ' + fmtMoney(d) + ' USD</button>' +
        '</div>' +
      '</div>';
  }

  function renderListo() {
    var dep = selectedDeparture();
    var orderId = 'TLD-2026-' + Math.floor(1000 + Math.random() * 9000);
    modalBody.innerHTML =
      '<div class="co-step co-step-success">' +
        '<div class="co-success-ico">✓</div>' +
        '<h4 class="co-step-title">¡Pedido recibido!</h4>' +
        '<p class="co-step-sub">Hemos cobrado tu depósito y te hemos enviado la confirmación a <strong>' + (payState.email || 'tu email') + '</strong>.</p>' +
        '<div class="co-order co-order-receipt">' +
          '<div class="co-order-line"><span>Nº de pedido</span><strong>' + orderId + '</strong></div>' +
          '<div class="co-order-line"><span>Programa</span><strong>' + tour.nombre + '</strong></div>' +
          '<div class="co-order-line"><span>Fechas</span><strong>' + (dep ? dep.fechas : '—') + '</strong></div>' +
          '<div class="co-order-line"><span>Viajeros</span><strong>' + totalParticipants() + '</strong></div>' +
          '<div class="co-order-line co-order-total"><span>Pagado hoy</span><strong>' + fmtMoney(depositTotal()) + ' USD</strong></div>' +
        '</div>' +
        '<p class="co-fine">Esmeranda te escribirá personalmente en menos de 24 horas con los siguientes pasos y un grupo de WhatsApp con el resto del grupo.</p>' +
        '<div class="co-controls">' +
          '<button type="button" class="btn btn-primary" data-co-cancel>Perfecto</button>' +
        '</div>' +
      '</div>';
  }

  function validateDatos(form) {
    var bad = [];
    ['nombre', 'apellido', 'email', 'telefono', 'pais'].forEach(function (n) {
      var el = form.querySelector('[name="' + n + '"]');
      var val = el.value.trim();
      if (!val) { bad.push(el); el.setAttribute('aria-invalid', 'true'); } else el.removeAttribute('aria-invalid');
      payState[n] = val;
    });
    var notas = form.querySelector('[name="notas"]');
    if (notas) payState.notas = notas.value.trim();
    var direccion = form.querySelector('[name="direccion"]');
    if (direccion) payState.direccion = direccion.value.trim();
    var emailEl = form.querySelector('[name="email"]');
    if (emailEl.value && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(emailEl.value)) {
      bad.push(emailEl);
      emailEl.setAttribute('aria-invalid', 'true');
    }
    return bad.length === 0;
  }

  // Delegated handlers
  document.addEventListener('click', function (e) {
    if (e.target.closest('#bw-cta')) {
      e.preventDefault();
      openCheckout();
      return;
    }
    if (!modal || modal.hasAttribute('hidden')) return;
    if (e.target.closest('[data-co-cancel]')) { closeCheckout(); return; }
    if (e.target.closest('[data-co-back]')) {
      payState.step = Math.max(1, payState.step - 1);
      renderPayStep();
      return;
    }
    if (e.target.closest('[data-co-next]')) {
      if (payState.step === 1) {
        var form = document.getElementById('co-form-datos');
        if (!form || !validateDatos(form)) return;
        payState.step = 2;
        renderPayStep();
      }
      return;
    }
    if (e.target.closest('[data-co-pay]')) {
      var terms = modalBody.querySelector('input[name="terminos"]');
      var method = modalBody.querySelector('input[name="metodo"]:checked');
      if (!terms || !terms.checked) {
        if (terms) terms.setAttribute('aria-invalid', 'true');
        var lbl = modalBody.querySelector('.co-terms');
        if (lbl) lbl.classList.add('is-error');
        return;
      }
      if (method) payState.metodo = method.value;
      payState.aceptaTerminos = true;
      var payBtn = e.target.closest('[data-co-pay]');
      if (payBtn) { payBtn.disabled = true; payBtn.textContent = 'Procesando...'; }
      setTimeout(function () { payState.step = 3; renderPayStep(); }, 900);
      return;
    }
  });

  document.addEventListener('change', function (e) {
    if (!modal || modal.hasAttribute('hidden')) return;
    if (e.target.matches('input[name="metodo"]')) {
      payState.metodo = e.target.value;
      modalBody.querySelectorAll('.co-pay-option').forEach(function (o) { o.classList.remove('is-checked'); });
      var lbl = e.target.closest('.co-pay-option');
      if (lbl) lbl.classList.add('is-checked');
    }
  });
})();
