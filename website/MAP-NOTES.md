# Anole map milestone

## Source review — 25 September 2026

- Houston OEM: https://houstonoem.org/extreme-heat/ links to the supplied cooling-centre experience: https://experience.arcgis.com/experience/9f7f09cf040641aa8f92a22025cf4419.
- Verified the Experience item configuration, rather than assuming it exposed an API. Its web map is `461bdd26d6ec452ca530fe6d41973f25`; that map references feature-service item `99f6279831a549ec8260da38ddc9b51c` (`COH_MassCare Public`).
- Layer: https://services3.arcgis.com/aDc3tOL5l9SNklhS/arcgis/rest/services/COH_MassCare_Public/FeatureServer/0 — `COH_Cooling_Centers`, displayed in the official map as “Daytime Cooling Centers”.
- Publisher provenance: linked by Houston Office of Emergency Management; ArcGIS owner `E176344_COHOEM`, portal `COHOEM.maps.arcgis.com`. The item's formal attribution field is empty.
- A read-only query returned point geometry in WGS84 (`outSR=4326`). Native geometry is Web Mercator (3857). Fields: `OBJECTID`, `NAME`, `PHONE`, `Status`, `Category`, `ADDRESS`, `Monday`, `Tuesday`, `Wednesday`, `Thursday`, `Friday`, `Saturday`, `Sunday`, `GlobalID`, `Holidays`.
- Layer data-edit timestamp: `1787331587757` (21 August 2026 UTC). Item modified: 24 August 2026, 18:46:29 UTC. Metadata timestamps are not evidence of current availability or a visit to an individual facility.
- Reuse terms: item `licenseInfo` and `accessInformation`, and service/layer copyright fields, are empty. Public query access does not establish a reuse licence. No official records or coordinates are republished in Anole.
- Inspected https://houston-mycity.opendata.arcgis.com/ and its City GIS organization (`NummVBqZSIJKUeVR`); an ArcGIS organization search for “cooling” returned zero items. Inspected https://data.houstontx.gov/; its CKAN `package_search?q=cooling` returned zero datasets. These searches are not an assertion that no other relevant dataset exists.

## Points actually used

All points are manually selected demonstration positions in Houston, not observed facilities or cooling centres. Their placement makes no assertion about the real place underneath. Project metadata is in `projects.js`. `app.js` builds matching cards; map popups read those same fields.

| Demo | Category | Latitude | Longitude |
| --- | --- | --- | --- |
| 01 | Heat relief | 29.7650 | -95.3900 |
| 02 | Municipal maintenance | 29.7580 | -95.3700 |
| 03 | Wildlife sightings | 29.7490 | -95.3820 |
| 04 | Accessibility | 29.7540 | -95.3980 |

Source: Anole fictional demo. All sample dates are 24 September 2026. Conditions are fictional/unverified. Follow-up: what people tried is not recorded; what worked is unknown. Storage of follow-up records is a future capability.

## Map operation and dependencies

Leaflet 1.9.4 is vendored in `vendor/leaflet/` with its BSD-2-Clause licence. Original project licence is unchanged. No npm/build step or API key.

Basemap: `https://tile.openstreetmap.org/{z}/{x}/{y}.png`, visibly attributed to OpenStreetMap contributors. Tile policy: https://operations.osmfoundation.org/policies/tiles/. Standard human interactive browsing with browser cache headers and HTTP Referer; no tile prefetch, bulk/offline download or proxy. Use an HTTP server, not a file URL, for tiles. Tile delivery requires network access and is best effort. Automated checks block external image requests; do not run automated pan/zoom crawls against OSM tiles.

Pan, zoom, numbered marker popups, category filtering and reset work in-browser. List links open existing sample details. Category filtering remains in `app.js`; separate `map.js` synchronizes markers. Cards remain available if Leaflet or tiles fail. Interactive project cards, filters and capture previews require JavaScript. The Master Map includes a plain-text sample summary without JavaScript. Capture supports local image selection and review without upload or storage.

No current cooling-centre feed, facility validation, route planning, GPS, posting, database storage or recorded follow-ups. The official OEM/ArcGIS link is a separate external information source.

Preview: `python3 -m http.server 8000 --directory website`, then open http://localhost:8000/explore.html.

## Reusable projects — 26 September 2026

`mobile.html?project=heat|maintenance|wildlife|accessibility` uses an allowlisted project choice. Missing or invalid choices display a project picker. Each valid phone page contains only that project’s sample pin.

Example QR codes are encoded locally using the vendored MIT-licensed QR Code Generator by Kazuhiko Arase (`vendor/qrcode/`). The payload is the corresponding demo anchor’s absolute URL, resolved against the current host and path. No external QR service receives URLs. Localhost/file URLs cannot be reached from another device; use an already reachable host for scanning. No deployment was performed. QR links provide discoverability, not authentication.

## Mobile map cards and HTTPS diagnosis

Checked all four deployed `https://anole.duckdns.org/mobile.html?project=…` pages in Chrome at 390 px wide. The tile URL is HTTPS (`https://tile.openstreetmap.org/{z}/{x}/{y}.png`); requested tiles returned HTTP 200 and decoded successfully. No console, failed-network, mixed-content or zero-size map errors were observed. The reported blank basemap could not be reproduced on the live site in this check.

The local update puts each mobile map in a white card, with a project-colour accent, header label, Reset control, rounded 240 px map and visible attribution. Tile errors or a 10-second loading timeout show a designed unavailable state and link to the observation below. Missing Leaflet also shows the fallback. Reset retries failed tiles; `invalidateSize` runs after layout and on nonzero container-size changes.

Validation: all four edited pages loaded real tiles under the HTTPS origin using browser-only local asset overrides. No files were published. Simulated tile failures passed at 320, 390 and 1440 px; fallback text, observation links, attribution, reset recovery and missing-library behaviour passed. Real-map and fallback phone screenshots were visually inspected. The deployed site still needs the local changes applied in a separate deployment.
