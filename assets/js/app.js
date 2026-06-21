/* Tailandesita Travel — front-end script
   Handles: mobile nav, tour search/filter, blog filter, footer year */

(function () {
  'use strict';

  // ---------- Footer year ----------
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ---------- Sticky header scroll state (full-hero pages) ----------
  if (document.body.classList.contains('has-fullhero')) {
    var header = document.querySelector('.site-header');
    var onScroll = function () {
      if (!header) return;
      if (window.scrollY > 40) header.classList.add('is-scrolled');
      else header.classList.remove('is-scrolled');
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // ---------- Mobile nav ----------
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.querySelector('.site-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var isOpen = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
  }

  // ---------- Destination labels ----------
  var DEST_LABEL = {
    bangkok: 'Bangkok',
    phuket: 'Phuket',
    'chiang-mai': 'Chiang Mai',
    ayutthaya: 'Ayutthaya',
    kanchanaburi: 'Kanchanaburi',
    multi: 'Multidestino'
  };

  function durationBucket(days) {
    if (days <= 3) return 'short';
    if (days <= 7) return 'mid';
    return 'long';
  }

  function formatDate(d) {
    if (!d) return '';
    try {
      var parts = d.split('-');
      return parts[2] + '/' + parts[1] + '/' + parts[0];
    } catch (e) { return d; }
  }

  function tourMatches(tour, filters) {
    if (filters.destino && tour.destino !== filters.destino) {
      // allow multi-destination tours to match a chosen city
      if (!(tour.destino === 'multi' && tour.ciudades && tour.ciudades.some(function (c) {
        return c.toLowerCase().replace(/\s+/g, '-') === filters.destino;
      }))) {
        return false;
      }
    }
    if (filters.duracion && durationBucket(tour.duracionDias) !== filters.duracion) {
      return false;
    }
    if (filters.personas) {
      var n = parseInt(filters.personas, 10);
      if (!isNaN(n)) {
        if (tour.minPersonas && n < tour.minPersonas) return false;
        if (tour.maxPersonas && n > tour.maxPersonas) return false;
      }
    }
    return true;
  }

  function scoreTour(tour, filters) {
    var score = 0;
    if (filters.destino && tour.destino === filters.destino) score += 10;
    if (filters.destino && tour.destino === 'multi' && tour.ciudades && tour.ciudades.some(function (c) {
      return c.toLowerCase().replace(/\s+/g, '-') === filters.destino;
    })) score += 6;
    if (filters.duracion && durationBucket(tour.duracionDias) === filters.duracion) score += 5;
    if (filters.personas) {
      var n = parseInt(filters.personas, 10);
      if (!isNaN(n) && n >= (tour.minPersonas || 1) && n <= (tour.maxPersonas || 30)) score += 3;
    }
    return score;
  }

  function buildCard(tour, filters) {
    var card = document.createElement('article');
    card.className = 'tour-card';
    card.dataset.id = tour.id;

    var bookUrl;
    if (tour.pagina) {
      var qs = [];
      if (filters.fecha) qs.push('fecha=' + encodeURIComponent(filters.fecha));
      if (filters.personas) qs.push('personas=' + encodeURIComponent(filters.personas));
      bookUrl = tour.pagina + (qs.length ? '?' + qs.join('&') : '');
    } else {
      bookUrl = 'contact.html?tour=' + encodeURIComponent(tour.id) +
        (filters.fecha ? '&fecha=' + encodeURIComponent(filters.fecha) : '') +
        (filters.personas ? '&personas=' + encodeURIComponent(filters.personas) : '');
    }

    var ciudades = (tour.ciudades || []).join(' · ');
    var destinoLabel = DEST_LABEL[tour.destino] || tour.destino;

    card.innerHTML =
      '<a class="tour-img" href="' + bookUrl + '" style="background-image:url(\'' + tour.imagen + '\')" aria-label="' + tour.nombre + '">' +
      '<span class="tour-chip">' + destinoLabel + '</span>' +
      '<span class="tour-days">' + tour.duracionDias + (tour.duracionDias === 1 ? ' día' : ' días') + '</span>' +
      '</a>' +
      '<div class="tour-body">' +
      '<h3>' + tour.nombre + '</h3>' +
      '<p>' + tour.resumen + '</p>' +
      '<div class="tour-meta">' +
      (ciudades ? '<span>' + ciudades + '</span>' : '') +
      '<span>' + (tour.minPersonas || 1) + '–' + (tour.maxPersonas || 12) + ' pers.</span>' +
      '</div>' +
      '<div class="tour-footer">' +
      '<span class="tour-price">Desde $' + tour.precioDesde + ' <small>USD / persona</small></span>' +
      '<a class="tour-link" href="' + bookUrl + '">Reservar →</a>' +
      '</div>' +
      '</div>';

    return card;
  }

  function renderTours(filters) {
    var grid = document.getElementById('tours-grid');
    var empty = document.getElementById('tours-empty');
    var summary = document.getElementById('search-summary');
    if (!grid) return;

    var tours = (window.TAILANDESITA_TOURS || []).slice();
    var list = tours.filter(function (t) { return tourMatches(t, filters); });

    // Sort: best match first, then by duration ascending
    list.sort(function (a, b) {
      var sa = scoreTour(a, filters);
      var sb = scoreTour(b, filters);
      if (sb !== sa) return sb - sa;
      return a.duracionDias - b.duracionDias;
    });

    grid.innerHTML = '';
    list.forEach(function (t) { grid.appendChild(buildCard(t, filters)); });

    if (empty) empty.hidden = list.length !== 0;

    if (summary) {
      var hasAny = Object.keys(filters).some(function (k) { return filters[k]; });
      if (!hasAny) {
        summary.textContent = 'Mostrando ' + list.length + ' programas. Usa los filtros para encontrar el tuyo.';
      } else {
        var bits = [];
        if (filters.destino) bits.push('en ' + (DEST_LABEL[filters.destino] || filters.destino));
        if (filters.duracion === 'short') bits.push('1–3 días');
        if (filters.duracion === 'mid') bits.push('4–7 días');
        if (filters.duracion === 'long') bits.push('8+ días');
        if (filters.personas) bits.push('para ' + filters.personas + ' personas');
        if (filters.fecha) bits.push('desde el ' + formatDate(filters.fecha));
        summary.textContent = list.length + ' tour(s) ' + bits.join(', ') + '.';
      }
    }
  }

  function readFilters(form) {
    var data = new FormData(form);
    return {
      destino: (data.get('destino') || '').toString(),
      fecha: (data.get('fecha') || '').toString(),
      personas: (data.get('personas') || '').toString(),
      duracion: (data.get('duracion') || '').toString()
    };
  }

  function applyHashDestination(form) {
    var hash = (location.hash || '').replace('#', '');
    if (!hash) return;
    var select = form.querySelector('select[name="destino"]');
    if (select && [].slice.call(select.options).some(function (o) { return o.value === hash; })) {
      select.value = hash;
    }
  }

  // ---------- Wire up tour search on pages that have it ----------
  var searchForm = document.getElementById('tour-search');
  var toursGrid = document.getElementById('tours-grid');
  if (searchForm) {
    applyHashDestination(searchForm);
    renderTours(readFilters(searchForm));
    searchForm.addEventListener('submit', function (e) {
      e.preventDefault();
      renderTours(readFilters(searchForm));
      var results = document.getElementById('buscar') || document.getElementById('tours-grid');
      if (results) results.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
    // live filter on destination/duration changes
    ['destino', 'duracion'].forEach(function (name) {
      var el = searchForm.querySelector('[name="' + name + '"]');
      if (el) el.addEventListener('change', function () { renderTours(readFilters(searchForm)); });
    });
    window.addEventListener('hashchange', function () {
      applyHashDestination(searchForm);
      renderTours(readFilters(searchForm));
    });
  } else if (toursGrid) {
    // Grid is on a page without a search form (e.g. the homepage).
    // The homepage section is now "Excursiones de un día" — show
    // the 3 cheapest 1-day tours as a teaser; the "Ver todas las
    // excursiones" CTA above the grid links to the full catalog.
    var all = (window.TAILANDESITA_TOURS || []).slice();
    var dayTrips = all
      .filter(function (t) { return t.duracionDias === 1; })
      .sort(function (a, b) { return (a.precioDesde || 0) - (b.precioDesde || 0); })
      .slice(0, 3);
    toursGrid.innerHTML = '';
    dayTrips.forEach(function (t) { toursGrid.appendChild(buildCard(t, {})); });
    var emptyEl = document.getElementById('tours-empty');
    if (emptyEl) emptyEl.hidden = dayTrips.length !== 0;
  }


  // ---------- Blog filters ----------
  var blogChips = document.querySelectorAll('.filters .filter-chip');
  if (blogChips.length) {
    blogChips.forEach(function (chip) {
      chip.addEventListener('click', function () {
        blogChips.forEach(function (c) { c.classList.remove('active'); });
        chip.classList.add('active');
        var cat = chip.getAttribute('data-filter');
        document.querySelectorAll('.blog-list .blog-card').forEach(function (card) {
          if (cat === 'all' || card.getAttribute('data-cat') === cat) {
            card.style.display = '';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  // ---------- FAQ ----------
  var faqList = document.getElementById('faq-list');
  if (faqList && window.TAILANDESITA_FAQ) {
    var state = { cat: 'all', q: '' };

    function renderFaq() {
      var q = state.q.trim().toLowerCase();
      var items = window.TAILANDESITA_FAQ.filter(function (f) {
        if (state.cat !== 'all' && f.categoria !== state.cat) return false;
        if (!q) return true;
        var haystack = (f.pregunta + ' ' + f.respuesta + ' ' + f.respuestaWhatsApp).toLowerCase();
        return haystack.indexOf(q) !== -1;
      });

      faqList.innerHTML = '';
      items.forEach(function (f) {
        var details = document.createElement('details');
        details.className = 'faq-item';
        details.dataset.id = f.id;
        details.dataset.cat = f.categoria;
        var summary = document.createElement('summary');
        summary.innerHTML = '<span class="faq-q">' + f.pregunta + '</span><span class="faq-toggle-icon" aria-hidden="true"></span>';
        details.appendChild(summary);

        var body = document.createElement('div');
        body.className = 'faq-body';
        body.innerHTML = f.respuesta +
          '<div class="faq-actions">' +
          '<button type="button" class="btn btn-copy" data-copy-id="' + f.id + '">' +
          '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>' +
          '<span>Copiar para WhatsApp</span>' +
          '</button>' +
          '<a class="btn btn-ghost btn-sm" href="https://wa.me/66000000000" target="_blank" rel="noopener">Abrir WhatsApp</a>' +
          '</div>' +
          '<p class="faq-toast" hidden>¡Copiado! Pégalo en WhatsApp.</p>';
        details.appendChild(body);
        faqList.appendChild(details);
      });

      var empty = document.getElementById('faq-empty');
      if (empty) empty.hidden = items.length !== 0;
    }

    faqList.addEventListener('click', function (e) {
      var btn = e.target.closest('.btn-copy');
      if (!btn) return;
      var id = btn.getAttribute('data-copy-id');
      var item = window.TAILANDESITA_FAQ.find(function (f) { return f.id === id; });
      if (!item) return;
      var toast = btn.closest('.faq-body').querySelector('.faq-toast');
      var doneOk = function () {
        btn.classList.add('is-done');
        var label = btn.querySelector('span');
        var old = label.textContent;
        label.textContent = '¡Copiado!';
        if (toast) { toast.hidden = false; }
        setTimeout(function () {
          btn.classList.remove('is-done');
          label.textContent = old;
          if (toast) toast.hidden = true;
        }, 2400);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(item.respuestaWhatsApp).then(doneOk).catch(function () {
          fallbackCopy(item.respuestaWhatsApp); doneOk();
        });
      } else {
        fallbackCopy(item.respuestaWhatsApp); doneOk();
      }
    });

    function fallbackCopy(text) {
      var ta = document.createElement('textarea');
      ta.value = text;
      ta.setAttribute('readonly', '');
      ta.style.position = 'absolute';
      ta.style.left = '-9999px';
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand('copy'); } catch (e) {}
      document.body.removeChild(ta);
    }

    var faqChips = document.querySelectorAll('.faq-cats .filter-chip');
    faqChips.forEach(function (chip) {
      chip.addEventListener('click', function () {
        faqChips.forEach(function (c) { c.classList.remove('active'); });
        chip.classList.add('active');
        state.cat = chip.getAttribute('data-cat');
        renderFaq();
      });
    });

    var search = document.getElementById('faq-search-input');
    if (search) {
      search.addEventListener('input', function () {
        state.q = search.value;
        renderFaq();
      });
    }

    renderFaq();
  }

  // ---------- Lightbox (tour gallery) ----------
  var lightbox = document.getElementById('tour-lightbox');
  var lbTriggers = document.querySelectorAll('[data-lightbox]');
  if (lightbox && lbTriggers.length) {
    var lbImg = lightbox.querySelector('.lightbox-img');
    var lbCounter = lightbox.querySelector('.lightbox-counter');
    var lbClose = lightbox.querySelector('.lightbox-close');
    var lbPrev = lightbox.querySelector('.lightbox-prev');
    var lbNext = lightbox.querySelector('.lightbox-next');

    var images = [];
    lbTriggers.forEach(function (el, i) {
      images.push(el.getAttribute('data-lightbox'));
      el.addEventListener('click', function () { openLB(i); });
    });
    var current = 0;

    function openLB(i) {
      current = i;
      updateLB();
      lightbox.classList.add('is-open');
      document.body.style.overflow = 'hidden';
    }
    function closeLB() {
      lightbox.classList.remove('is-open');
      document.body.style.overflow = '';
    }
    function nextLB() { current = (current + 1) % images.length; updateLB(); }
    function prevLB() { current = (current - 1 + images.length) % images.length; updateLB(); }
    function updateLB() {
      lbImg.src = images[current];
      if (lbCounter) lbCounter.textContent = (current + 1) + ' / ' + images.length;
    }

    lbClose && lbClose.addEventListener('click', closeLB);
    lbPrev && lbPrev.addEventListener('click', prevLB);
    lbNext && lbNext.addEventListener('click', nextLB);
    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox) closeLB();
    });
    document.addEventListener('keydown', function (e) {
      if (!lightbox.classList.contains('is-open')) return;
      if (e.key === 'Escape') closeLB();
      if (e.key === 'ArrowRight') nextLB();
      if (e.key === 'ArrowLeft') prevLB();
    });
  }

  // ---------- Prefill booking/contact forms from ?fecha=..&personas=.. ----------
  var bookForm = document.getElementById('book-form');
  if (bookForm && location.search) {
    var bp = new URLSearchParams(location.search);
    var bf = bookForm.querySelector('[name="fecha"]');
    var bp_p = bookForm.querySelector('[name="personas"]');
    if (bp.get('fecha') && bf) bf.value = bp.get('fecha');
    if (bp.get('personas') && bp_p) bp_p.value = bp.get('personas');
  }

  // ---------- Prefill contact form from ?tour=..&fecha=..&personas=.. ----------
  var contactForm = document.getElementById('contact-form');
  if (contactForm && location.search) {
    var params = new URLSearchParams(location.search);
    var msg = contactForm.querySelector('[name="mensaje"]');
    var fecha = contactForm.querySelector('[name="fecha"]');
    var personas = contactForm.querySelector('[name="personas"]');
    if (params.get('tour') && msg) {
      msg.value = 'Me interesa el tour: ' + params.get('tour') + '. ';
    }
    if (params.get('fecha') && fecha) fecha.value = params.get('fecha');
    if (params.get('personas') && personas) personas.value = params.get('personas');
  }
})();
