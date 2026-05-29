/* ============================================================
   Tailandesita Travel — Single group tour page renderer
   Reads ?tour=<id> from URL, finds the tour in
   window.TAILANDESITA_GROUP_TOURS and fills the DOM.
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

  // ---------- Page title + meta ----------
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
      return '' +
        '<li>' +
          '<span class="iti-time">' + d.dia + '</span>' +
          '<div>' +
            '<h3>' + d.titulo + '</h3>' +
            '<p>' + d.desc + '</p>' +
          '</div>' +
        '</li>';
    }).join('');
  }

  // ---------- Departures (open period & available seats) ----------
  var depEl = document.getElementById('tour-departures');
  if (depEl && tour.departures) {
    var tourHref = 'tour-program.html?tour=' + encodeURIComponent(tour.id);
    var rows = tour.departures.map(function (d) {
      var statusClass = 'dep-status dep-status-' + d.estado;
      var actionBtn;
      if (d.estado === 'full') {
        actionBtn = '<a class="btn btn-ghost btn-sm dep-cta" href="' + tourHref + '">Lista de espera</a>';
      } else {
        actionBtn = '<a class="btn btn-primary btn-sm dep-cta" href="' + tourHref + '">Reservar plaza →</a>';
      }
      return '' +
        '<div class="dep-row" data-estado="' + d.estado + '">' +
          '<div class="dep-dates"><strong>' + d.fechas + '</strong><span>' + d.dias + '</span></div>' +
          '<div class="' + statusClass + '">' + d.etiqueta + '</div>' +
          '<div class="dep-price"><strong>' + fmtMoney(d.precio) + '</strong><span>USD / persona</span></div>' +
          '<div class="dep-action">' + actionBtn + '</div>' +
        '</div>';
    }).join('');
    depEl.innerHTML = rows;
  }

  // ---------- FAQ ----------
  var faqEl = document.getElementById('tour-faq');
  if (faqEl && tour.faq) {
    faqEl.innerHTML = tour.faq.map(function (f) {
      return '' +
        '<details class="faq-item">' +
          '<summary><span class="faq-q">' + f.q + '</span><span class="faq-toggle-icon" aria-hidden="true"></span></summary>' +
          '<div class="faq-body"><p>' + f.a + '</p></div>' +
        '</details>';
    }).join('');
  }

  // ---------- Testimonials ----------
  var tEl = document.getElementById('tour-testimonios');
  if (tEl && tour.testimonios) {
    tEl.innerHTML = tour.testimonios.map(function (t) {
      return '' +
        '<blockquote>' +
          '<div class="t-stars">★★★★★</div>' +
          '<p>"' + t.texto + '"</p>' +
          '<footer>— ' + t.autor + ', ' + t.origen + '</footer>' +
        '</blockquote>';
    }).join('');
  }

  // ---------- Sidebar booking card ----------
  setHTML('book-price', fmtMoney(tour.precioDesde) + ' <small>USD / persona</small>');
  var depositoEl = document.getElementById('book-deposit');
  if (depositoEl) {
    var dep = Math.round(tour.precioDesde * tour.depositoPct / 100);
    depositoEl.innerHTML = 'Reserva con un depósito del ' + tour.depositoPct + '% (<strong>' + fmtMoney(dep) + ' USD</strong>). Confirmación en menos de 24 h.';
  }
  setHTML('book-duration-badge', tour.duracion.split(' ')[0] + 'd');

  // ---------- Booking modal (deposit / waitlist from departures table) ----------
  var modal = document.getElementById('book-modal');
  var modalBody = document.getElementById('book-modal-body');
  var modalClose = document.getElementById('book-modal-close');

  function openModal(html) {
    if (!modal) return;
    modalBody.innerHTML = html;
    modal.removeAttribute('hidden');
    document.body.style.overflow = 'hidden';
  }
  function closeModal() {
    if (!modal) return;
    modal.setAttribute('hidden', '');
    document.body.style.overflow = '';
    modalBody.innerHTML = '';
  }
  if (modalClose) modalClose.addEventListener('click', closeModal);
  if (modal) modal.addEventListener('click', function (e) {
    if (e.target === modal) closeModal();
  });
  document.addEventListener('keydown', function (e) {
    if (modal && !modal.hasAttribute('hidden') && e.key === 'Escape') closeModal();
  });

  function depositHTML(fechas, precio) {
    var deposit = Math.round(precio * tour.depositoPct / 100);
    return '' +
      '<span class="modal-eyebrow">Reservar plaza · grupo</span>' +
      '<h3>' + tour.nombre + '</h3>' +
      '<p>Asegura tu lugar con un depósito del ' + tour.depositoPct + '%. Si no podemos confirmar, te devolvemos el 100%.</p>' +
      '<div class="modal-summary"><dl>' +
        '<dt>Fechas</dt><dd>' + fechas + '</dd>' +
        '<dt>Precio</dt><dd>' + fmtMoney(precio) + ' USD / persona</dd>' +
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
  function waitlistHTML(fechas) {
    return '' +
      '<span class="modal-eyebrow">Lista de espera</span>' +
      '<h3>' + tour.nombre + '</h3>' +
      '<p>Esta salida está completa. Apúntate a la lista y te avisamos en cuanto se libere una plaza.</p>' +
      '<div class="modal-summary"><dl>' +
        '<dt>Fechas</dt><dd>' + fechas + '</dd>' +
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
      return '<div class="modal-success"><div class="modal-success-ico">✓</div>' +
        '<h3>Estás en la lista</h3>' +
        '<p>Te avisaremos por email si se libera una plaza para esta salida.</p>' +
        '<button type="button" class="btn btn-ghost" data-modal-close>Cerrar</button></div>';
    }
    return '<div class="modal-success"><div class="modal-success-ico">✓</div>' +
      '<h3>¡Plaza reservada!</h3>' +
      '<p>Recibirás un email con la confirmación y los siguientes pasos.</p>' +
      '<button type="button" class="btn btn-primary" data-modal-close>Perfecto</button></div>';
  }

  document.addEventListener('click', function (e) {
    var book = e.target.closest('[data-book]');
    if (book && book.classList.contains('dep-cta')) {
      var fechas = book.getAttribute('data-book');
      var precio = parseInt(book.getAttribute('data-price'), 10);
      openModal(depositHTML(fechas, precio));
      return;
    }
    var wl = e.target.closest('[data-waitlist]');
    if (wl && wl.classList.contains('dep-cta')) {
      openModal(waitlistHTML(wl.getAttribute('data-waitlist')));
      return;
    }
    if (e.target.matches('[data-modal-close]')) closeModal();
  });
  if (modal) modal.addEventListener('submit', function (e) {
    if (e.target.matches('.modal-form')) {
      e.preventDefault();
      modalBody.innerHTML = successHTML(e.target.getAttribute('data-mode'));
    }
  });

  // ---------- Sidebar quick request form ----------
  var bookForm = document.getElementById('book-form');
  var bookThanks = document.getElementById('book-thanks');
  if (bookForm) {
    bookForm.addEventListener('submit', function (e) {
      e.preventDefault();
      bookForm.hidden = true;
      if (bookThanks) bookThanks.hidden = false;
    });
  }
})();
