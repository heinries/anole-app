/* Anole demo map. Observation metadata lives in the static list, not a remote feed. */
(() => {
  'use strict';
  const container = document.querySelector('#observation-map');
  if (!container || container.closest("[hidden]")) return;
  const status = document.querySelector('#map-status');
  const stage = container.closest('.project-map-stage');
  const fallback = document.querySelector('#map-unavailable');
  const fallbackMessage = document.querySelector('#map-unavailable-message');
  let tileTimer;
  let mapState = 'loading';
  function showState(state) {
    mapState = state;
    if (stage) stage.dataset.mapState = state;
    if (fallback) fallback.hidden = state === 'ready';
    if (fallbackMessage) fallbackMessage.textContent = state === 'loading'
      ? 'Loading the real basemap…'
      : 'Map tiles are unavailable right now. Explore the demo observation below.';
    if (state !== 'loading') window.clearTimeout(tileTimer);
    status.textContent = state === 'ready'
      ? 'Demo map ready. All visible pins are fictional and unverified.'
      : state === 'loading'
        ? 'Loading OpenStreetMap tiles. The demo observation is available below.'
        : 'Basemap unavailable. The demo observation remains usable. Reset map to retry.';
  }
  function beginLoading() {
    window.clearTimeout(tileTimer);
    showState('loading');
    // A stalled connection must not leave an apparently finished, empty map.
    tileTimer = window.setTimeout(() => showState('unavailable'), 10000);
  }
  if (!window.L) {
    showState('unavailable');
    container.textContent = 'Map unavailable. Use the observation list below.';
    status.textContent = 'The map library could not load. The observation list remains available.';
    return;
  }
  container.replaceChildren();
  const map = L.map(container, { scrollWheelZoom: false, fadeAnimation: false, zoomAnimation: false, minZoom: 10, maxZoom: 17 });
  const home = [29.757, -95.384];
  map.setView(home, 13);
  // HTTPS tiles, normal browser caching and Referer; no prefetch or offline download.
  const tileUrl = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';
  let tiles;
  let batchFailed = false;
  if (location.protocol === 'http:' || location.protocol === 'https:') {
    tiles = L.tileLayer(tileUrl, {
      maxZoom: 19,
      keepBuffer: 0,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });
    tiles.on('loading', () => {
      batchFailed = false;
      beginLoading();
    });
    tiles.on('tileerror', () => {
      batchFailed = true;
      showState('unavailable');
    });
    tiles.on('load', () => showState(batchFailed ? 'unavailable' : 'ready'));
    tiles.addTo(map);
  } else {
    showState('unavailable');
    status.textContent = 'Open this page through an HTTP server to load the basemap. The demo observation is available below.';
  }
  // app.js reveals the selected project before this script runs. Recheck after
  // layout and whenever its visible size changes (including device rotation).
  requestAnimationFrame(() => map.invalidateSize({ pan: false }));
  if (window.ResizeObserver) {
    let previousSize = '';
    const resizeObserver = new ResizeObserver(entries => {
      const { width, height } = entries[0].contentRect;
      const size = width + 'x' + height;
      if (width && height && size !== previousSize) {
        previousSize = size;
        map.invalidateSize({ pan: false });
      }
    });
    resizeObserver.observe(container);
  }
  const markers = [...document.querySelectorAll('.observation')].map(card => {
    const category = card.dataset.category;
    const number = card.querySelector('.number').textContent;
    const title = card.querySelector('h3').textContent;
    const icon = L.divIcon({
      className: 'anole-map-marker topic-theme ' + category,
      html: '<span>' + number + '</span>',
      iconSize: [44, 44], iconAnchor: [22, 22]
    });
    const popup = document.createElement('div');
    const label = document.createElement('strong');
    label.textContent = 'FICTIONAL DEMO ' + number + ' · ' + title;
    popup.append(label);
    for (const selector of ['.condition', '.observation-meta', '.follow-up']) {
      const p = document.createElement('p');
      p.textContent = card.querySelector(selector).textContent;
      popup.append(p);
    }
    const link = document.createElement('a');
    link.href = card.getAttribute('href');
    link.textContent = 'Read sample details →';
    popup.append(link);
    const marker = L.marker([Number(card.dataset.lat), Number(card.dataset.lng)], {
      icon, title: 'Fictional demo ' + number + ': ' + title,
      alt: 'Fictional demo ' + number + ': ' + title,
      keyboard: true
    }).bindPopup(popup, { maxWidth: 240, maxHeight: 240 });
    return { category, marker };
  });
  function syncMarkers() {
    const selected = document.querySelector('[data-filter][aria-pressed="true"]');
    const category = selected ? selected.dataset.filter : 'all';
    map.closePopup();
    markers.forEach(item => {
      if (category === 'all' || item.category === category) item.marker.addTo(map);
      else map.removeLayer(item.marker);
    });
  }
  // app.js owns filtering; read its finished state without changing Capture or list logic.
  document.querySelectorAll('[data-filter]').forEach(button => {
    button.addEventListener('click', () => syncMarkers());
  });
  window.addEventListener('hashchange', syncMarkers);
  syncMarkers();
  const reset = document.querySelector('#reset-map');
  reset.disabled = false;
  reset.addEventListener('click', () => {
    const retry = mapState === 'unavailable';
    map.closePopup();
    map.invalidateSize({ pan: false });
    map.setView(home, 13);
    if (retry && tiles) tiles.redraw();
  });
})();
