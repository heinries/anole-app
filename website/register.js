'use strict';
(() => {
  const form = document.querySelector('#register-form');
  if (!form) return;
  form.reset();
  const scheme = document.querySelector('#scheme');
  const schemes = ['wildlife', 'heat', 'maintenance', 'accessibility'];
  const review = document.querySelector('#topic-review');
  function updateColour() {
    const colour = schemes.includes(scheme.value) ? scheme.value : 'wildlife';
    document.querySelector('#scheme-preview').className = 'topic-swatch ' + colour;
    document.querySelector('#topic-card').className = 'project-tile ' + colour;
  }
  updateColour();
  scheme.addEventListener('change', updateColour);
  form.querySelector('[type="submit"]').disabled = false;
  form.addEventListener('submit', event => {
    event.preventDefault();
    document.querySelector('#preview-topic').textContent = document.querySelector('#topic').value.trim();
    document.querySelector('#preview-brief').textContent = document.querySelector('#brief').value.trim();
    const fields = ['Place', 'Observation date', 'Verification status', ...[...form.querySelectorAll('[name="fields"]:checked')].map(input => input.value)];
    const custom = document.querySelector('#custom-field').value.trim();
    if (custom) fields.push(custom);
    const summary = document.querySelector('#topic-summary');
    summary.replaceChildren();
    for (const [label, value] of [['Colour scheme', scheme.selectedOptions[0].textContent], ['Observation fields', fields.join(' · ')]]) {
      const dt = document.createElement('dt');
      const dd = document.createElement('dd');
      dt.textContent = label; dd.textContent = value;
      summary.append(dt, dd);
    }
    form.hidden = true; review.hidden = false; review.focus();
  });
  document.querySelector('#edit-topic').addEventListener('click', () => {
    review.hidden = true; form.hidden = false;
    document.querySelector('#topic').focus();
  });
})();
