/* Tailandesita Travel — front-end script
   Handles: mobile nav, tour search/filter, blog filter, footer year */

(function () {
  'use strict';

  // ---------- Footer year ----------
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

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

    var bookUrl = 'contact.html?tour=' + encodeURIComponent(tour.id) +
      (filters.fecha ? '&fecha=' + encodeURIComponent(filters.fecha) : '') +
      (filters.personas ? '&personas=' + encodeURIComponent(filters.personas) : '');

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
  if (searchForm) {
    applyHashDestination(searchForm);
    renderTours(readFilters(searchForm));
    searchForm.addEventListener('submit', function (e) {
      e.preventDefault();
      renderTours(readFilters(searchForm));
      var grid = document.getElementById('tours-grid');
      if (grid) grid.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
  }

  // ---------- Blog filters ----------
  var chips = document.querySelectorAll('.filter-chip');
  if (chips.length) {
    chips.forEach(function (chip) {
      chip.addEventListener('click', function () {
        chips.forEach(function (c) { c.classList.remove('active'); });
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
