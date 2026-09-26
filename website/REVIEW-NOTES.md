# Anole static-site review

Inspected the existing index, examples, About, Capture, map, detail and help pages before editing. The on-disk draft is `examples.html`; `examples.htms` and `porfolio.html` were not present. The About origin story, Bole, Johann (Hein) Ries and Mike To are preserved.

## Working screens and interactions

- Home links prominently to four Example Pages with distinct project colours.
- Four QR codes are generated locally and encode the exact corresponding phone-demo URL on the current host/path. The matching text links work independently.
- `mobile.html?project=heat`, `maintenance`, `wildlife` or `accessibility` shows one matching sample pin and links to the matching Capture preview. Missing/invalid choices show a project picker.
- Master Map retains vendored Leaflet: pan, zoom, reset, marker popups and project filters. All pins, descriptions and dates are explicitly fictional/unverified. Lists remain usable when tiles fail; a plain-text summary is available without JavaScript.
- Capture supports project-specific fields, place/date, local image selection, review, editing and image removal. Reload clears the preview. No upload, storage, submission, GPS or map insertion occurs.
- Official Houston OEM map and Houston 311 links remain external sources. No official records are imported or submitted.

## Concept previews

The How to start walkthrough illustrates topic creation, field choice, QR sharing, collection and map review. Project creation/publishing, real observation collection, moderation, verification, persistence and integrations are not implemented. Species identifications remain unverified; accessibility observations do not assign a facility rating.

## Validation — 26 September 2026

- Chrome checked every HTML screen and all four phone variants at 320, 390 and 1440 px: no horizontal page overflow.
- HTML5 parsing found no structural errors; local file links resolve and no page has duplicate `aria-current="page"` markers.
- Tested all map filters, marker popups, zoom/reset, hash-selected filters, matching capture links and missing/invalid project choices (including reserved and HTML-like values).
- Tested image selection, review, edit, removal and clearing on reload. No JavaScript runtime errors.
- Independently decoded all four rendered QR codes and matched their payloads to the exact demo anchor URLs.
- Visually inspected phone-demo and desktop example screenshots. External OSM tile requests were blocked during browser automation; tile-failure behaviour passed. Live basemap delivery was not verified in this pass and requires network access.
- QR codes generated on localhost/file URLs cannot open this computer from another phone. Open the site through an address reachable by the phone before scanning; no deployment was performed.

Only `website/` repository files changed. No Flask/backend or server configuration changes, commit or push.
