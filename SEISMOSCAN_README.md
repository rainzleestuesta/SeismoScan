# SeismoScan

An interactive earthquake safety map that lets users **assess hazard at a specific spot and find the nearest safe open area** using an intuitive web map.

SeismoScan is a React + MapLibre web app that overlays **fault lines**, **open evacuation areas**, and **hazard scores** on top of a configurable basemap, then guides the user toward a safer location if a strong quake hits.

---

## Features

- 🗺️ **Interactive map UI**
  - Pan/zoom a MapLibre map with a fixed center marker.
  - Optional MapTiler basemap via API key.

- 📍 **Point-based hazard assessment**
  - Assess hazard at the current map center.
  - Quickly re-center and assess **your current GPS location**.

- 🧭 **Nearest safe area navigation**
  - Loads a set of **safe open areas in NCR** (e.g., parks, open spaces).
  - Finds the **nearest safe area** using distance and/or estimated travel time.
  - Requests a **walking route** via OSRM and draws it on the map.
  - Generates a **Google Maps directions URL** for step-by-step navigation.

- ⚠️ **Fault line overlay**
  - Loads a GeoJSON of **fault traces** from a configurable URL.
  - Renders faults as styled line layers on top of the basemap.

- 📊 **Hazard summary panel**
  - Shows the latest hazard assessment for the chosen location.
  - Displays banded risk level (e.g., Low / Moderate / High) with color cues.
  - Offers a one-click navigation button to the closest safe area.

- 💬 **Explainable risk**
  - A chat-style modal explains **why** a location is assessed as low or high hazard.
  - Helps non-technical users understand the contributing risk factors.

---

## How It Works

1. **Map & location**
   - The app opens with a MapLibre map centered on a default coordinate (`DEFAULT_CENTER`).
   - A fixed center marker indicates **where the assessment will be run**.

2. **Hazard assessment**
   - When the user taps **“Assess here”** (or similar action), the app calls `fetchHazard(lat, lon)` from `src/services/hazard.ts`.
   - The returned hazard result is stored in state and displayed in the `HazardPanel`.

3. **Faults & safe areas**
   - On startup, the app:
     - Loads **fault lines** via `loadFaultsGeoJSON(FAULTS_URL)` from `src/services/faults.ts`.
     - Fetches **open areas in NCR** via `fetchOpenAreasNCR()` from `src/services/osm.ts`.
   - Both faults and safe areas are rendered as separate layers/symbols on the map.

4. **Routing to safety**
   - When the user wants to navigate to safety:
     - The app picks the **nearest safe area** using helpers like `nearestByETA` / `nearestByDistance`.
     - It requests a **walkable route** via `osrmRoute(origin, destination)` from `src/services/routing.ts`.
     - The route geometry is added as a line source on the map.
     - A `gmapsDirectionsUrl(...)` is generated so users can open the same route in Google Maps.

5. **Geospatial utilities**
   - `src/lib/geo.ts` provides utilities such as:
     - `kmBetween` – Haversine distance between two coordinates.
     - `bearingFrom` – Compass bearing from point A to B.
     - `bandColor` – Color mapping for hazard bands (Low / Moderate / High).

---

## Tech Stack

- **Frontend**
  - [React 18](https://react.dev/)
  - [TypeScript](https://www.typescriptlang.org/)
  - [Vite](https://vitejs.dev/)
- **Maps & Geospatial**
  - [MapLibre GL JS](https://maplibre.org/projects/maplibre-gl-js/)
  - Optional [MapTiler](https://www.maptiler.com/) basemap
- **Testing**
  - [Vitest](https://vitest.dev/)
  - [Testing Library](https://testing-library.com/) for React

---

## Getting Started

### Prerequisites

- **Node.js** v18+ (or a recent LTS)
- **npm** or **pnpm** / **yarn** (commands below use `npm`)

### Installation

```bash
# Clone this repository
git clone https://github.com/your-username/seismoscan.git
cd seismoscan

# Install dependencies
npm install
```

### Environment Variables

Create a `.env.local` (or `.env`) file at the project root and configure:

```bash
# Optional: MapTiler basemap
VITE_MAPTILER_KEY=your_maptiler_api_key

# Required: URL to a GeoJSON file of fault lines
VITE_FAULTS_URL=https://your-domain/path/to/faults.geojson
```

Other services (hazard scoring, open areas, routing) are configured inside `src/services` and may also rely on additional `VITE_*` environment variables. Check:

- `src/services/hazard.ts`
- `src/services/osm.ts`
- `src/services/routing.ts`

for the full list of external endpoints and configuration options.

> If no `VITE_MAPTILER_KEY` is provided, SeismoScan falls back to a public demo MapLibre style.

### Development Server

```bash
npm run dev
```

Open the printed local URL (usually `http://localhost:5173`) in your browser to use SeismoScan in development mode.

### Production Build

```bash
npm run build
npm run preview
```

`npm run build` outputs a static production bundle to the `dist` directory, and `npm run preview` serves it locally for testing.

### Testing

```bash
# Run all tests once
npm test

# Watch mode
npm run test:watch
```

---

## Project Structure

Key files and directories (as used in this codebase):

```text
src/
  main.tsx            # App entrypoint (ReactDOM.render)
  App.tsx             # Root component: orchestrates map, hazard, modals

  components/
    MapView.tsx       # MapLibre map, markers, and layer setup
    AssessBar.tsx     # UI controls to run hazard assessment / use my location
    HazardPanel.tsx   # Summary panel with risk band, scores, and navigate button
    ExplainModal.tsx  # Modal with chat-style explanation of the hazard result

  services/
    hazard.ts         # fetchHazard(...) – call hazard scoring backend
    faults.ts         # loadFaultsGeoJSON(...) – load fault line GeoJSON
    osm.ts            # fetchOpenAreasNCR(...) – load safe open areas in NCR
    routing.ts        # nearestByETA, nearestByDistance, osrmRoute, gmapsDirectionsUrl

  lib/
    geo.ts            # kmBetween, bearingFrom, bandColor, and other geospatial helpers

  styles.css          # Layout and component styling
```

---

## Disclaimer

SeismoScan is a **prototype / research tool** and is **not a certified hazard assessment system**.

- Hazard scores and maps are approximations based on available data and models.
- Always follow guidance from:
  - Your local disaster risk reduction offices
  - Official seismological agencies
  - Emergency services

Use this app as a **decision support and educational tool**, not as your sole source of safety information.

---

## License

This project is released under the **MIT License**. See `LICENSE` for details.
