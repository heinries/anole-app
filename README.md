# Anole Capturing App

Anole is a Houston Hackathon 2026 concept that helps community organisers collect local observations and share them on a map. A creator would choose a topic and useful questions, then invite neighbours through a link or QR code.

The interactive prototype demonstrates this idea through heat relief, accessibility, wildlife sightings and municipal maintenance.

## Try the demo

Visit [Anole](https://anole.duckdns.org), open the four projects on the [Example Pages](https://anole.duckdns.org/examples.html), and scan their QR codes to try the mobile demos.

## What works today

- Four mobile demos with matching links and QR codes.
- An interactive map with fictional sample pins, filters, popups, zoom and reset controls.
- Observation lists when map tiles are unavailable.
- Capture previews with topic-specific questions, place and date fields, optional local image selection, and review controls.
- A topic setup preview with a title, description, colour scheme and observation fields.
- A separate Flask API with a health endpoint and questionnaire storage in SQLite.

## Prototype limitations

**Sample map pins are fictional and unverified.** The capture preview does not save or publish observations, upload images, or add map pins. Reloading clears the preview.

Topic setup does not create an account or publish a topic. The website is not connected to the separate questionnaire API. Map tiles require an internet connection; interactive previews and QR generation require JavaScript.

## Run locally

You need Python 3. Run these commands from the repository root.

### Website

No build step or dependency installation is required:

```bash
python3 -m http.server 8000 --directory website
```

Open [http://localhost:8000](http://localhost:8000). To test QR codes with a phone, use an address your phone can reach. `localhost` on the phone refers to the phone itself.

### Optional Python backend

In another terminal, from the repository root:

```bash
python3 -m venv .venv
. .venv/bin/activate
python -m pip install -r backend/requirements.txt
python backend/app.py
```

These commands use a macOS or Linux shell. Check the [health endpoint](http://127.0.0.1:5000/api/health). The development server listens on `127.0.0.1:5000` and does not serve the website.

`POST /api/questionnaire` accepts JSON with required `first_name`, `last_name`, `email` and five-digit `zip_code` fields. Successful submissions create or use `backend/data/hackathon.db`. This API stores questionnaire records, not public map observations.

## Planned features

- Live topic creation and secure accounts.
- Persistent observations and a creator dashboard.
- Moderation and an API for other projects.

## People

Johann Ries developed the concept and interactive demo. Michael To reviewed the project and advised on production architecture and security.

## License

[MIT License](LICENSE), copyright © 2026 Johann (Hein) Ries. Vendored libraries retain their own licenses: [Leaflet](website/vendor/leaflet/LICENSE) and [QR Code Generator](website/vendor/qrcode/LICENSE).