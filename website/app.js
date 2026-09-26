'use strict';
(() => {
 const projects = window.anoleProjects || {};
 const keys = Object.keys(projects);
 const choice = new URLSearchParams(location.search).get('project');
 const valid = Object.hasOwn(projects, choice);
 const guidance = (host, p) => {
   host.textContent = p.guidance + ' ';
   if (p.link) { const a = document.createElement('a'); a.href = p.link; a.textContent = p.linkText + ' ↗'; host.append(a); }
 };
 function card(key, index) {
   const p = projects[key], a = document.createElement('a');
   a.className = 'observation topic-theme ' + key; a.dataset.category = key; a.dataset.lat = p.lat; a.dataset.lng = p.lng; a.href = 'place.html#' + key;
   a.innerHTML = `<span class="number">${String(index + 1).padStart(2, '0')}</span><div><span class="eyebrow">${p.name} / FICTIONAL DEMO</span><h3>${p.title}</h3><p>${p.place} · fictional place</p><span class="condition">Fictional / unverified</span><p class="observation-meta">Source: Anole demo<br>Observation date (fictional): <time datetime="2026-09-24">24 September 2026</time><br>Verification: unverified</p><p class="follow-up">${p.detail}</p></div>`;
   return a;
 }
 const mobile = document.querySelector('#mobile-project');
 if (mobile && valid) {
   const p = projects[choice]; mobile.hidden = false;
   document.querySelector('#project-picker').hidden = true;
   document.querySelector('#project-title').textContent = p.name;
   document.querySelector('#project-description').textContent = p.description;
   document.querySelector('.phone-content').classList.add('topic-theme', choice);
   document.title = p.name + ' · Anole phone demo';
   document.querySelector('#mobile-capture').href = 'questionnaire.html?project=' + choice;
   guidance(document.querySelector('#project-guidance'), p);
 } else if (mobile && choice !== null) {
   document.querySelector('#project-description').textContent = 'That project is not available. Choose one of these four examples.';
 }
 const list = document.querySelector('#observations');
 if (list && (!mobile || valid)) keys.forEach((key, i) => { if (!mobile || key === choice) list.append(card(key, i)); });
 const filters = document.querySelector('#filters');
 if (filters) {
   ['all', ...keys].forEach(key => { const b = document.createElement('button'); b.type = 'button'; b.dataset.filter = key; b.textContent = key === 'all' ? 'All observations' : projects[key].name; b.addEventListener('click', () => { history.replaceState(null, '', '#' + key); filter(key); }); filters.append(b); });
   function filter(key) {
     if (!keys.includes(key)) key = 'all';
     filters.querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.filter === key)));
     list.querySelectorAll('.observation').forEach(c => { c.hidden = key !== 'all' && c.dataset.category !== key; });
     document.querySelector('#result-count').textContent = `${key === 'all' ? keys.length : 1} fictional sample${key === 'all' ? 's' : ''}`;
   }
   filter(location.hash.slice(1)); window.addEventListener('hashchange', () => filter(location.hash.slice(1)));
 }
 const details = document.querySelector('#sample-details');
 if (details) keys.forEach((key,i) => { const section = document.createElement('section'); section.id = key; section.className = 'sample-detail section topic-theme ' + key; section.append(card(key,i)); const note = document.createElement('p'); note.className = 'notice'; guidance(note,projects[key]); section.append(note); const a = document.createElement('a'); a.className = 'button'; a.href = 'questionnaire.html?project=' + key; a.textContent = 'Try this capture preview →'; section.append(a); details.append(section); });
 document.querySelectorAll('.qr').forEach(host => {
   try {
     const link = host.closest('article').querySelector('.demo-link');
     const qr = qrcode(0, 'M'); qr.addData(link.href, 'Byte'); qr.make();
     host.innerHTML = qr.createSvgTag({cellSize: 4, margin: 16, scalable: true});
     host.querySelector('svg').setAttribute('role', 'img');
     host.querySelector('svg').setAttribute('aria-label', 'QR code: ' + link.href);
   } catch { host.textContent = 'QR unavailable. Use the demo link.'; }
 });
 const qrNote = document.querySelector('#qr-note');
 if (qrNote && (location.protocol === 'file:' || ['localhost','127.0.0.1','[::1]'].includes(location.hostname))) qrNote.textContent = 'Local preview: these QR codes point to this computer’s address. To scan from a phone, open this site through a host address your phone can reach. Codes then update automatically.';
 const form = document.querySelector('#capture-form');
 if (!form) return;
 form.reset();
 const category = document.querySelector('#category');
 if (valid) category.value = choice;
 const fields = document.querySelector('#project-fields');
 const drafts = {};
 function template() {
   const p = projects[category.value];
   const layout = document.querySelector('.capture-layout');
   layout.classList.remove(...keys);
   layout.classList.add('topic-theme', category.value);
   document.querySelector('#capture-title').textContent = p.name;
   document.querySelector('#capture-description').textContent = p.description;
   document.title = p.name + ' · Capture preview · Anole';
   document.querySelector('#maintenance-report').hidden = category.value !== 'maintenance';
   const url = new URL(location.href);
   url.searchParams.set('project', category.value);
   history.replaceState(null, '', url);
   guidance(document.querySelector('#template-hint'), p);
   fields.replaceChildren();
   p.fields.forEach((label,i) => {
     const id = 'detail-' + i, l = document.createElement('label'), input = document.createElement('input');
     l.htmlFor = id; l.textContent = label; input.id = id; input.maxLength = 240; input.required = true; input.dataset.label = label;
     input.value = (drafts[category.value] || [])[i] || '';
     fields.append(l,input);
   });
   const back = document.querySelector('#capture-back'); back.href = 'mobile.html?project=' + category.value; back.textContent = '← ' + p.name + ' phone demo';
 }
 let previous = category.value;
 template();
 category.addEventListener('change', () => { drafts[previous] = [...fields.querySelectorAll('input')].map(x => x.value); previous = category.value; template(); });
 const file = document.querySelector('#photo'), photo = document.querySelector('#photo-preview'), status = document.querySelector('#photo-status'), remove = document.querySelector('#remove-photo');
 let objectUrl;
 function clearPhoto() { if (objectUrl) URL.revokeObjectURL(objectUrl); objectUrl = null; photo.removeAttribute('src'); photo.hidden = true; remove.hidden = true; file.value = ''; status.textContent = 'No image selected or uploaded.'; }
 remove.addEventListener('click', clearPhoto);
 file.addEventListener('change', () => {
   const selected = file.files[0];
   if (!selected) { clearPhoto(); return; }
   if (!selected.type.startsWith('image/') || selected.size > 15 * 1024 * 1024) { clearPhoto(); status.textContent = 'Choose an image file smaller than 15 MB.'; return; }
   if (objectUrl) URL.revokeObjectURL(objectUrl);
   objectUrl = URL.createObjectURL(selected); photo.src = objectUrl; photo.hidden = false; remove.hidden = false;
   status.textContent = selected.name + ' · local preview only, not uploaded.';
 });
 photo.addEventListener('error', () => { clearPhoto(); status.textContent = 'This image could not be displayed. Choose a supported image format.'; });
 form.querySelector('[type="submit"]').disabled = false;
 const review = document.querySelector('#capture-review');
 form.addEventListener('submit', event => {
   event.preventDefault(); const content = document.querySelector('#review-content'); content.replaceChildren();
   const values = [['Project',projects[category.value].name],['Place',document.querySelector('#location').value],['Observation date',document.querySelector('#date').value], ...[...fields.querySelectorAll('input')].map(x => [x.dataset.label,x.value]), ['Notes',document.querySelector('#notes').value || 'None'],['Image',file.files[0] ? file.files[0].name + ' (local only)' : 'None selected'],['Verification','Unverified browser preview']];
   values.forEach(([key,value]) => { const dt = document.createElement('dt'), dd = document.createElement('dd'); dt.textContent = key; dd.textContent = value; content.append(dt,dd); });
   if (objectUrl) { const img = document.createElement('img'); img.src = objectUrl; img.alt = 'Selected image, local preview only'; content.append(img); }
   form.hidden = true; review.hidden = false; review.focus();
 });
 document.querySelector('#edit-preview').addEventListener('click', () => { review.hidden = true; form.hidden = false; category.focus(); });
})();
