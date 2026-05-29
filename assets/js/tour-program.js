/* ============================================================
   Tailandesita Travel — Single group tour page renderer
   Reads ?tour=<id> from URL, finds the tour in
   window.TAILANDESITA_GROUP_TOURS and fills the DOM. Also
   owns the WooCommerce-style multi-step checkout modal.
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

  function fmtMoney(n) {
    return '$' + n.toLocaleString('es-ES').replace(/,/g, '.');
  }

  function setText(id, val) {
    var el = document.getElementById(id);
    if (el) el.textContent = val;
  }
  function setHTML(id, html) {
    var el = document.getElementById(id);
    if (el) el.innerHTML = html;
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
    var html = '';
    imgs.forEach(function (src, idx) {
      var classes = ['gallery-item'];
      if (idx === 0) classes.push('gallery-item-main');
      if (idx === imgs.length - 1) classes.push('gallery-item-more');
      var inner = (idx === imgs.length - 1)
        ? '<span class="gallery-more">+ Ver todas las fotos</span>'
        : '';
      html += '<button type="button" class="' + classes.join(' ') +
        '" data-lightbox="' + src + '" style="background-image:url(\'' + src + '\')" aria-label="Ver foto ' + (idx + 1) + '">' +
        inner + '</button>';
    });
    gallery.innerHTML = html;
  }

  // ---------- About ----------
  var aboutEl = document.getElementById('tour-about-body');
  if (aboutEl && tour.about) {
    aboutEl.innerHTML = tour.about.map(function (p) { return '<p>' + p + '</p>'; }).join('');
  }

  // ---------- Includes / not includes ----------
  var incluyeEl = document.getElementById('tour-incluye');
  if (incluyeEl && tour.incluye) {
    incluyeEl.innerHTML = tour.incluye.map(function (i) { return '<li>' + i + '</li>'; }).join('');
  }
  var noIncluyeEl = document.getElementById('tour-no-incluye');
  if (noIncluyeEl && tour.noIncluye) {
    noIncluyeEl.innerHTML = tour.noIncluye.map(function (i) { return '<li>' + i + '</li>'; }).join('');
  }

  // ---------- Itinerary ----------
  var itinEl = document.getElementById('tour-itinerary');
  if (itinEl && tour.itinerario) {
    itinEl.innerHTML = tour.itinerario.map(function (d) {
      return '<li>' +
        '<span class="iti-time">' + d.dia + '</span>' +
        '<div><h3>' + d.titulo + '</h3><p>' + d.desc + '</p></div>' +
        '</li>';
    }).join('');
  }

  // ---------- Departures (3 cols: date | price | action with availability) ----------
  function actionLabel(d) {
    if (d.estado === 'full') return 'Completo · Lista de espera';
    if (d.estado === 'last') return 'Últimas ' + d.plazas + ' plazas · Reservar';
    return d.plazas + ' plazas disponibles · Reservar';
  }
  var depEl = document.getElementById('tour-departures');
  if (depEl && tour.departures) {
    depEl.innerHTML = tour.departures.map(function (d, i) {
      var cta;
      if (d.estado === 'full') {
        cta = '<button type="button" class="dep-cta dep-cta-full" disabled>' + actionLabel(d) + '</button>';
      } else {
        cta = '<button type="button" class="dep-cta dep-cta-' + d.estado + '" data-dep="' + i + '">' +
                '<span class="dep-cta-label">' + actionLabel(d) + '</span>' +
                '<span class="dep-cta-arrow" aria-hidden="true">→</span>' +
              '</button>';
      }
      return '<div class="dep-row" data-estado="' + d.estado + '">' +
        '<div class="dep-dates"><strong>' + d.fechas + '</strong><span>' + d.dias + '</span></div>' +
        '<div class="dep-price"><strong>' + fmtMoney(d.precio) + '</strong><span>USD / persona</span></div>' +
        '<div class="dep-action">' + cta + '</div>' +
      '</div>';
    }).join('');
  }

  // ---------- FAQ ----------
  var faqEl = document.getElementById('tour-faq');
  if (faqEl && tour.faq) {
    faqEl.innerHTML = tour.faq.map(function (f) {
      return '<details class="faq-item">' +
        '<summary><span class="faq-q">' + f.q + '</span><span class="faq-toggle-icon" aria-hidden="true"></span></summary>' +
        '<div class="faq-body"><p>' + f.a + '</p></div>' +
        '</details>';
    }).join('');
  }

  // ---------- Testimonials ----------
  var tEl = document.getElementById('tour-testimonios');
  if (tEl && tour.testimonios) {
    tEl.innerHTML = tour.testimonios.map(function (t) {
      return '<blockquote>' +
        '<div class="t-stars">★★★★★</div>' +
        '<p>"' + t.texto + '"</p>' +
        '<footer>— ' + t.autor + ', ' + t.origen + '</footer>' +
        '</blockquote>';
    }).join('');
  }

  // ---------- Sidebar booking card ----------
  setHTML('book-price', fmtMoney(tour.precioDesde) + ' <small>USD / persona</small>');
  var factsEl = document.getElementById('book-facts');
  if (factsEl) {
    factsEl.innerHTML =
      '<li><span class="bf-ico">⏱</span><div><strong>' + tour.duracion + '</strong><small>Duración</small></div></li>' +
      '<li><span class="bf-ico">👥</span><div><strong>' + tour.grupo + '</strong><small>Tamaño del grupo</small></div></li>' +
      '<li><span class="bf-ico">🗣</span><div><strong>Español</strong><small>Guía local hispanohablante</small></div></li>' +
      '<li><span class="bf-ico">🛡</span><div><strong>Cancelación flexible</strong><small>Reembolso 100% si cancelamos</small></div></li>';
  }
  var depositoUSD = Math.round(tour.precioDesde * tour.depositoPct / 100);
  setHTML('book-trust', tour.depositoPct + '% de depósito (' + fmtMoney(depositoUSD) + ' USD) · Devolución 100% si nosotros cancelamos · Pago seguro con Stripe');

  // ============================================================
  //   Checkout modal — WooCommerce-style multi-step flow
  // ============================================================
  var modal = document.getElementById('checkout-modal');
  var modalBody = document.getElementById('checkout-body');
  var modalClose = document.getElementById('checkout-close');
  var modalProgress = document.getElementById('checkout-progress');

  var checkoutState = {
    step: 1,
    depIndex: null,
    personas: 2,
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    pais: '',
    direccion: '',
    notas: '',
    metodo: 'card',
    aceptaTerminos: false
  };

  function openCheckout(depIndex) {
    if (!modal) return;
    if (depIndex != null) checkoutState.depIndex = depIndex;
    if (checkoutState.depIndex == null) {
      // default to first available departure
      var firstAvail = tour.departures.findIndex(function (d) { return d.estado !== 'full'; });
      checkoutState.depIndex = firstAvail >= 0 ? firstAvail : 0;
    }
    checkoutState.step = 1;
    modal.removeAttribute('hidden');
    document.body.style.overflow = 'hidden';
    renderStep();
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
      s.classList.toggle('is-active', n === checkoutState.step);
      s.classList.toggle('is-done', n < checkoutState.step);
    });
  }

  function currentDeparture() {
    return tour.departures[checkoutState.depIndex] || tour.departures[0];
  }
  function lineTotal() {
    var dep = currentDeparture();
    return dep.precio * checkoutState.personas;
  }
  function depositTotal() {
    return Math.round(lineTotal() * tour.depositoPct / 100);
  }

  function renderStep() {
    updateProgress();
    if (checkoutState.step === 1) return renderStep1();
    if (checkoutState.step === 2) return renderStep2();
    if (checkoutState.step === 3) return renderStep3();
    if (checkoutState.step === 4) return renderStep4();
  }

  function renderStep1() {
    var options = tour.departures.map(function (d, i) {
      var disabled = d.estado === 'full';
      var checked = i === checkoutState.depIndex && !disabled;
      var statusText = d.estado === 'full'
        ? 'Completo'
        : (d.estado === 'last' ? 'Últimas ' + d.plazas + ' plazas' : d.plazas + ' plazas disponibles');
      var statusClass = 'dep-status dep-status-' + d.estado;
      return '<label class="co-dep-option' + (disabled ? ' is-disabled' : '') + (checked ? ' is-checked' : '') + '">' +
        '<input type="radio" name="dep" value="' + i + '"' + (checked ? ' checked' : '') + (disabled ? ' disabled' : '') + ' />' +
        '<span class="co-dep-radio" aria-hidden="true"></span>' +
        '<span class="co-dep-info">' +
          '<strong>' + d.fechas + '</strong>' +
          '<span class="co-dep-meta">' + d.dias + ' · ' + fmtMoney(d.precio) + ' USD / persona</span>' +
        '</span>' +
        '<span class="' + statusClass + '">' + statusText + '</span>' +
      '</label>';
    }).join('');

    var personOptions = '';
    for (var n = 1; n <= 12; n++) personOptions += '<option value="' + n + '"' + (n === checkoutState.personas ? ' selected' : '') + '>' + n + (n === 1 ? ' persona' : ' personas') + '</option>';

    modalBody.innerHTML =
      '<div class="co-step">' +
        '<h4 class="co-step-title">Elige tu fecha de salida</h4>' +
        '<p class="co-step-sub">Selecciona la salida que mejor te encaje. Te quedan ' +
          tour.departures.filter(function(d){return d.estado!=='full';}).length +
        ' fechas con plazas disponibles en 2026.</p>' +
        '<div class="co-dep-list">' + options + '</div>' +
        '<label class="co-field">' +
          '<span>¿Cuántas personas?</span>' +
          '<select name="personas">' + personOptions + '</select>' +
        '</label>' +
        '<div class="co-controls">' +
          '<button type="button" class="btn btn-ghost" data-co-cancel>Cancelar</button>' +
          '<button type="button" class="btn btn-primary" data-co-next>Continuar →</button>' +
        '</div>' +
      '</div>';
  }

  function renderStep2() {
    modalBody.innerHTML =
      '<div class="co-step">' +
        '<h4 class="co-step-title">Tus datos</h4>' +
        '<p class="co-step-sub">Necesitamos estos datos para emitir la reserva y los seguros. Mismo flujo que cualquier compra online segura.</p>' +
        '<form class="co-form" id="co-form-2" novalidate>' +
          '<div class="co-row">' +
            '<label class="co-field"><span>Nombre *</span><input type="text" name="nombre" required value="' + checkoutState.nombre + '" placeholder="María"/></label>' +
            '<label class="co-field"><span>Apellido *</span><input type="text" name="apellido" required value="' + checkoutState.apellido + '" placeholder="García"/></label>' +
          '</div>' +
          '<div class="co-row">' +
            '<label class="co-field"><span>Email *</span><input type="email" name="email" required value="' + checkoutState.email + '" placeholder="maria@email.com"/></label>' +
            '<label class="co-field"><span>Teléfono / WhatsApp *</span><input type="tel" name="telefono" required value="' + checkoutState.telefono + '" placeholder="+34 ..."/></label>' +
          '</div>' +
          '<label class="co-field"><span>País de residencia *</span><input type="text" name="pais" required value="' + checkoutState.pais + '" placeholder="España, México, Argentina..."/></label>' +
          '<label class="co-field"><span>Dirección de facturación</span><input type="text" name="direccion" value="' + checkoutState.direccion + '" placeholder="Calle y número, ciudad, código postal (opcional)"/></label>' +
          '<label class="co-field"><span>Notas para el organizador</span><textarea name="notas" rows="2" placeholder="Alergias, edades, vuelos, peticiones especiales...">' + checkoutState.notas + '</textarea></label>' +
        '</form>' +
        '<div class="co-controls">' +
          '<button type="button" class="btn btn-ghost" data-co-back>← Atrás</button>' +
          '<button type="button" class="btn btn-primary" data-co-next>Continuar al pago →</button>' +
        '</div>' +
      '</div>';
  }

  function renderStep3() {
    var dep = currentDeparture();
    var t = lineTotal();
    var d = depositTotal();
    var resto = t - d;

    modalBody.innerHTML =
      '<div class="co-step">' +
        '<h4 class="co-step-title">Revisa y paga</h4>' +
        '<p class="co-step-sub">Hoy abonas el ' + tour.depositoPct + '% para bloquear tu plaza. El resto se cobra 60 días antes de la salida.</p>' +
        '<div class="co-order">' +
          '<div class="co-order-line"><span>' + tour.nombre + ' × ' + checkoutState.personas + '</span><strong>' + fmtMoney(t) + '</strong></div>' +
          '<div class="co-order-meta">' + dep.fechas + ' · ' + tour.duracion + '</div>' +
          '<div class="co-order-line"><span>Subtotal</span><strong>' + fmtMoney(t) + ' USD</strong></div>' +
          '<div class="co-order-line"><span>Depósito hoy (' + tour.depositoPct + '%)</span><strong>' + fmtMoney(d) + ' USD</strong></div>' +
          '<div class="co-order-line co-order-total"><span>A pagar hoy</span><strong>' + fmtMoney(d) + ' USD</strong></div>' +
          '<div class="co-order-fine">Resto · ' + fmtMoney(resto) + ' USD se cobra 60 días antes de la salida.</div>' +
        '</div>' +
        '<fieldset class="co-pay">' +
          '<legend>Método de pago</legend>' +
          '<label class="co-pay-option' + (checkoutState.metodo === 'card' ? ' is-checked' : '') + '">' +
            '<input type="radio" name="metodo" value="card"' + (checkoutState.metodo === 'card' ? ' checked' : '') + ' />' +
            '<span class="co-pay-radio" aria-hidden="true"></span>' +
            '<span><strong>Tarjeta de crédito o débito</strong><small>Visa, Mastercard, Amex. Procesado por Stripe.</small></span>' +
          '</label>' +
          '<label class="co-pay-option' + (checkoutState.metodo === 'transfer' ? ' is-checked' : '') + '">' +
            '<input type="radio" name="metodo" value="transfer"' + (checkoutState.metodo === 'transfer' ? ' checked' : '') + ' />' +
            '<span class="co-pay-radio" aria-hidden="true"></span>' +
            '<span><strong>Transferencia bancaria</strong><small>Recibes los datos por email. Confirma tu plaza al recibir el pago.</small></span>' +
          '</label>' +
        '</fieldset>' +
        '<label class="co-terms"><input type="checkbox" name="terminos"' + (checkoutState.aceptaTerminos ? ' checked' : '') + ' /> He leído y acepto los <a href="#" target="_blank">términos y condiciones</a> y la política de cancelación.</label>' +
        '<div class="co-controls">' +
          '<button type="button" class="btn btn-ghost" data-co-back>← Atrás</button>' +
          '<button type="button" class="btn btn-primary" data-co-pay>Pagar ' + fmtMoney(d) + ' USD</button>' +
        '</div>' +
      '</div>';
  }

  function renderStep4() {
    var dep = currentDeparture();
    var orderId = 'TLD-2026-' + Math.floor(1000 + Math.random() * 9000);
    modalBody.innerHTML =
      '<div class="co-step co-step-success">' +
        '<div class="co-success-ico">✓</div>' +
        '<h4 class="co-step-title">¡Pedido recibido!</h4>' +
        '<p class="co-step-sub">Hemos cobrado tu depósito y te hemos enviado la confirmación a <strong>' + (checkoutState.email || 'tu email') + '</strong>.</p>' +
        '<div class="co-order co-order-receipt">' +
          '<div class="co-order-line"><span>Nº de pedido</span><strong>' + orderId + '</strong></div>' +
          '<div class="co-order-line"><span>Programa</span><strong>' + tour.nombre + '</strong></div>' +
          '<div class="co-order-line"><span>Fechas</span><strong>' + dep.fechas + '</strong></div>' +
          '<div class="co-order-line"><span>Viajeros</span><strong>' + checkoutState.personas + '</strong></div>' +
          '<div class="co-order-line co-order-total"><span>Pagado hoy</span><strong>' + fmtMoney(depositTotal()) + ' USD</strong></div>' +
        '</div>' +
        '<p class="co-fine">Esmeranda te escribirá personalmente en menos de 24 horas con los siguientes pasos y un grupo de WhatsApp con el resto del grupo.</p>' +
        '<div class="co-controls">' +
          '<button type="button" class="btn btn-primary" data-co-cancel>Perfecto</button>' +
        '</div>' +
      '</div>';
  }

  function validateStep2(form) {
    var bad = [];
    ['nombre', 'apellido', 'email', 'telefono', 'pais'].forEach(function (n) {
      var el = form.querySelector('[name="' + n + '"]');
      var val = el.value.trim();
      if (!val) { bad.push(el); el.setAttribute('aria-invalid', 'true'); }
      else el.removeAttribute('aria-invalid');
      checkoutState[n] = val;
    });
    var notas = form.querySelector('[name="notas"]');
    if (notas) checkoutState.notas = notas.value.trim();
    var direccion = form.querySelector('[name="direccion"]');
    if (direccion) checkoutState.direccion = direccion.value.trim();
    var emailEl = form.querySelector('[name="email"]');
    if (emailEl.value && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(emailEl.value)) {
      bad.push(emailEl);
      emailEl.setAttribute('aria-invalid', 'true');
    }
    return bad.length === 0;
  }

  // Delegated handlers for the modal body
  document.addEventListener('click', function (e) {
    // Open from departures-table action
    var depTrigger = e.target.closest('.dep-cta[data-dep]');
    if (depTrigger) {
      e.preventDefault();
      openCheckout(parseInt(depTrigger.getAttribute('data-dep'), 10));
      return;
    }
    // Open from sidebar button
    var sideTrigger = e.target.closest('#book-cta');
    if (sideTrigger) {
      e.preventDefault();
      openCheckout();
      return;
    }
    // Modal controls
    if (!modal || modal.hasAttribute('hidden')) return;
    if (e.target.closest('[data-co-cancel]')) { closeCheckout(); return; }
    if (e.target.closest('[data-co-back]')) {
      checkoutState.step = Math.max(1, checkoutState.step - 1);
      renderStep();
      return;
    }
    if (e.target.closest('[data-co-next]')) {
      if (checkoutState.step === 1) {
        // Validate selection (just take radio value + personas)
        var radio = modalBody.querySelector('input[name="dep"]:checked');
        if (!radio) return;
        checkoutState.depIndex = parseInt(radio.value, 10);
        var ps = modalBody.querySelector('select[name="personas"]');
        if (ps) checkoutState.personas = parseInt(ps.value, 10);
        checkoutState.step = 2;
        renderStep();
      } else if (checkoutState.step === 2) {
        var form = document.getElementById('co-form-2');
        if (!form || !validateStep2(form)) return;
        checkoutState.step = 3;
        renderStep();
      }
      return;
    }
    if (e.target.closest('[data-co-pay]')) {
      // Read terms + method
      var terms = modalBody.querySelector('input[name="terminos"]');
      var method = modalBody.querySelector('input[name="metodo"]:checked');
      if (!terms || !terms.checked) {
        if (terms) terms.setAttribute('aria-invalid', 'true');
        var lbl = modalBody.querySelector('.co-terms');
        if (lbl) lbl.classList.add('is-error');
        return;
      }
      if (method) checkoutState.metodo = method.value;
      checkoutState.aceptaTerminos = true;
      // Simulate WooCommerce-style processing
      var payBtn = e.target.closest('[data-co-pay]');
      if (payBtn) { payBtn.disabled = true; payBtn.textContent = 'Procesando...'; }
      setTimeout(function () {
        checkoutState.step = 4;
        renderStep();
      }, 900);
      return;
    }
  });

  // Track form input changes (so back/forward preserves data)
  document.addEventListener('change', function (e) {
    if (!modal || modal.hasAttribute('hidden')) return;
    if (e.target.matches('input[name="dep"]')) {
      checkoutState.depIndex = parseInt(e.target.value, 10);
      modalBody.querySelectorAll('.co-dep-option').forEach(function (o) { o.classList.remove('is-checked'); });
      var lbl = e.target.closest('.co-dep-option');
      if (lbl) lbl.classList.add('is-checked');
    }
    if (e.target.matches('select[name="personas"]')) {
      checkoutState.personas = parseInt(e.target.value, 10);
    }
    if (e.target.matches('input[name="metodo"]')) {
      checkoutState.metodo = e.target.value;
      modalBody.querySelectorAll('.co-pay-option').forEach(function (o) { o.classList.remove('is-checked'); });
      var lbl2 = e.target.closest('.co-pay-option');
      if (lbl2) lbl2.classList.add('is-checked');
    }
  });
})();
