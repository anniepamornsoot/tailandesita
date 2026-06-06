/* ============================================================
   Tailandesita Travel — Tours hub renderer
   Renders two card grids on tours.html:
     • Joint group tours (fixed dates) — from
       window.TAILANDESITA_GROUP_TOURS, excluding flexibleDate
       tours like the Ayutthaya 1-day excursion.
     • Private group tours — from window.TAILANDESITA_TOURS,
       filtered to entries marked `private: true`.
   ============================================================ */

(function () {
  'use strict';

  var DEST_LABEL = {
    bangkok: 'Bangkok',
    phuket: 'Phuket',
    'chiang-mai': 'Chiang Mai',
    ayutthaya: 'Ayutthaya',
    kanchanaburi: 'Kanchanaburi',
    multi: 'Multi-región'
  };

  function fmtMoney(n) { return '$' + n.toLocaleString('es-ES').replace(/,/g, '.'); }

  // ---------- Joint group tour card ----------
  function buildJointCard(tour) {
    var img = (tour.gallery && tour.gallery[0]) || '';
    var href = 'tour-program.html?tour=' + encodeURIComponent(tour.id);
    var card = document.createElement('article');
    card.className = 'tour-card hub-tour-card';
    card.setAttribute('data-destino', tour.id);
    card.innerHTML =
      '<a class="tour-img" href="' + href + '" style="background-image:url(\'' + img + '\')" aria-label="' + tour.nombre + '">' +
        '<span class="tour-days">' + tour.duracion + '</span>' +
      '</a>' +
      '<div class="tour-body">' +
        '<h3>' + tour.nombre + '</h3>' +
        '<p>' + tour.ciudades + '</p>' +
        '<div class="tour-meta">' +
          '<span>' + tour.grupo + '</span>' +
        '</div>' +
        '<div class="tour-footer">' +
          '<span class="tour-price">Desde ' + fmtMoney(tour.precioDesde) + ' <small>/ persona</small></span>' +
          '<a class="tour-link" href="' + href + '">Ver programa →</a>' +
        '</div>' +
      '</div>';
    return card;
  }

  // ---------- Private group tour card ----------
  function buildPrivateCard(tour) {
    var href = tour.pagina ? tour.pagina : ('contact.html?tour=' + encodeURIComponent(tour.id));
    var ciudades = (tour.ciudades || []).join(' · ');
    var destLabel = DEST_LABEL[tour.destino] || tour.destino;
    var card = document.createElement('article');
    card.className = 'tour-card hub-tour-card';
    card.setAttribute('data-destino', tour.destino);
    card.innerHTML =
      '<a class="tour-img" href="' + href + '" style="background-image:url(\'' + tour.imagen + '\')" aria-label="' + tour.nombre + '">' +
        '<span class="tour-chip">Tour privado · ' + destLabel + '</span>' +
        '<span class="tour-days">' + tour.duracionDias + (tour.duracionDias === 1 ? ' día' : ' días') + '</span>' +
      '</a>' +
      '<div class="tour-body">' +
        '<h3>' + tour.nombre + '</h3>' +
        '<p>' + tour.resumen + '</p>' +
        '<div class="tour-meta">' +
          (ciudades ? '<span>' + ciudades + '</span>' : '') +
          '<span>Hasta ' + (tour.maxPersonas || 12) + ' personas</span>' +
        '</div>' +
        '<div class="tour-footer">' +
          '<span class="tour-price">Desde ' + fmtMoney(tour.precioDesde) + ' <small>USD / persona</small></span>' +
          '<a class="tour-link" href="' + href + '">Pedir presupuesto →</a>' +
        '</div>' +
      '</div>';
    return card;
  }

  // ---------- Joint grid ----------
  var jointGrid = document.getElementById('joint-grid');
  if (jointGrid && window.TAILANDESITA_GROUP_TOURS) {
    var jointList = Object.keys(window.TAILANDESITA_GROUP_TOURS)
      .map(function (k) { return window.TAILANDESITA_GROUP_TOURS[k]; })
      .filter(function (t) { return !t.flexibleDate; });
    jointList.sort(function (a, b) { return (a.precioDesde || 0) - (b.precioDesde || 0); });
    jointList.forEach(function (t) { jointGrid.appendChild(buildJointCard(t)); });
    var jointCount = document.getElementById('joint-count');
    if (jointCount) jointCount.textContent = jointList.length;
  }

  // ---------- Private grid ----------
  var privateGrid = document.getElementById('private-grid');
  if (privateGrid && window.TAILANDESITA_TOURS) {
    var privateList = window.TAILANDESITA_TOURS.filter(function (t) { return t.private; });
    privateList.sort(function (a, b) { return (a.precioDesde || 0) - (b.precioDesde || 0); });
    privateList.forEach(function (t) { privateGrid.appendChild(buildPrivateCard(t)); });
    var privateCount = document.getElementById('private-count');
    if (privateCount) privateCount.textContent = privateList.length;
  }

  // ---------- Scroll-to-destination on hash ----------
  // Preserves the old behavior of tours.html#bangkok etc. by scrolling
  // to the first card whose destino matches the hash.
  function scrollToDestinationHash() {
    var hash = (location.hash || '').replace('#', '');
    if (!hash) return;
    if (['joint', 'private', 'faq'].indexOf(hash) !== -1) return; // section anchors handled by browser
    var match = document.querySelector('.hub-tour-card[data-destino="' + hash + '"]') ||
                document.querySelector('.hub-tour-card[data-destino*="' + hash + '"]');
    if (match) match.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
  scrollToDestinationHash();
  window.addEventListener('hashchange', scrollToDestinationHash);
})();
