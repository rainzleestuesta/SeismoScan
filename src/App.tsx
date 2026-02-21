// src/App.tsx
import { useRef, useState } from "react"
import MapView from "./components/MapView"
import AssessBar from "./components/AssessBar"
import HazardPanel from "./components/HazardPanel"
import ExplainModal from "./components/ExplainModal"
import { DEFAULT_CENTER, fetchHazard } from "./services/hazard"
import { loadFaultsGeoJSON } from "./services/faults"
import { fetchOpenAreasNCR, type SafeArea } from "./services/osm"
import {
  gmapsDirectionsUrl,
  nearestByETA,
  nearestByDistance,
  osrmRoute,
  bearingFrom,
} from "./services/routing"

const MAPTILER_KEY = import.meta.env.VITE_MAPTILER_KEY
const STYLE_URL = MAPTILER_KEY
  ? `https://api.maptiler.com/maps/streets/style.json?key=${MAPTILER_KEY}`
  : "https://demotiles.maplibre.org/style.json"
const FAULTS_URL = import.meta.env.VITE_FAULTS_URL as string

export default function App() {
  const mapRef = useRef<any>(null)
  const [center, setCenter] = useState(DEFAULT_CENTER)
  const [assessment, setAssessment] = useState<any>(null)
  const [safeAreas, setSafeAreas] = useState<SafeArea[]>([])
  const [gmapsUrl, setGmapsUrl] = useState<string | null>(null)
  const [navTarget, setNavTarget] = useState<string | null>(null)
  const [showExplain, setShowExplain] = useState(false)

  function onMapReady(map: any) {
    mapRef.current = map
    map.on("moveend", () => {
      const c = map.getCenter()
      setCenter({ lat: c.lat, lon: c.lng })
    })

    // sources/layers
    map.addSource("route", { type: "geojson", data: { type: "FeatureCollection", features: [] } })
    map.addLayer({
      id: "route-line",
      type: "line",
      source: "route",
      paint: { "line-color": "#2563eb", "line-width": 4, "line-opacity": 0.85 },
    })

    // faults
    loadFaultsGeoJSON(FAULTS_URL).then(gj => {
      map.addSource("faults-src", { type: "geojson", data: gj })
      map.addLayer({
        id: "faults-line",
        type: "line",
        source: "faults-src",
        paint: { "line-color": "#ef4444", "line-width": 2.5, "line-dasharray": [2, 2] },
      })
    })

    // safe areas
    fetchOpenAreasNCR().then(list => {
      const fc = {
        type: "FeatureCollection",
        features: list.map(s => ({
          type: "Feature",
          properties: { name: s.name },
          geometry: { type: "Point", coordinates: s.coords },
        })),
      }
      setSafeAreas(list)
      map.addSource("safe-src", { type: "geojson", data: fc })
      map.addLayer({
        id: "safe-circles",
        type: "circle",
        source: "safe-src",
        paint: {
          "circle-radius": 5,
          "circle-color": "#10b981",
          "circle-stroke-color": "#065f46",
          "circle-stroke-width": 1,
        },
      })
      map.addLayer({
        id: "safe-labels",
        type: "symbol",
        source: "safe-src",
        layout: {
          "text-field": ["get", "name"],
          "text-size": 11,
          "text-offset": [0, 1.2],
          "text-anchor": "top",
        },
        paint: { "text-color": "#065f46", "text-halo-color": "#fff", "text-halo-width": 1 },
      })
    })
  }

  async function assessHere() {
    const a = await fetchHazard(center.lat, center.lon)
    setAssessment(a)
    setGmapsUrl(null)
    setNavTarget(null)
  }

  function assessMyLocation() {
    if (!navigator.geolocation) return alert("Geolocation not supported.")
    navigator.geolocation.getCurrentPosition(
      async pos => {
        const a = await fetchHazard(pos.coords.latitude, pos.coords.longitude)
        setAssessment(a)
        setGmapsUrl(null)
        setNavTarget(null)
        mapRef.current?.easeTo({ center: [a.lon, a.lat], zoom: 15, duration: 800 })
      },
      err => alert(err.message),
      { enableHighAccuracy: true, timeout: 10000 }
    )
  }

  async function navigateToNearest() {
    if (!assessment || !safeAreas.length) return
    const origin: [number, number] = [assessment.lon, assessment.lat]
    const best =
      (await nearestByETA(origin, safeAreas)) || nearestByDistance(origin, safeAreas, 1)[0]
    if (!best) return
    setGmapsUrl(gmapsDirectionsUrl(assessment.lat, assessment.lon, best.coords, "walking"))
    setNavTarget(best.name)
    const geom = await osrmRoute(origin, best.coords)
    if (geom && mapRef.current) {
      const src = mapRef.current.getSource("route")
      src.setData({
        type: "FeatureCollection",
        features: [{ type: "Feature", properties: {}, geometry: geom }],
      })
      const coords = geom.coordinates as [number, number][]
      const br = bearingFrom(coords[0], coords[Math.min(5, coords.length - 1)])
      mapRef.current.fitBounds(
        coords.reduce(
          ([minX, minY, maxX, maxY], [x, y]) => [
            Math.min(minX, x),
            Math.min(minY, y),
            Math.max(maxX, x),
            Math.max(maxY, y),
          ],
          [coords[0][0], coords[0][1], coords[0][0], coords[0][1]] as any
        ),
        { padding: 64, duration: 900, pitch: 35, bearing: br }
      )
    }
  }

  return (
    <div className="app-shell">
      <MapView
        styleUrl={STYLE_URL}
        center={[center.lon, center.lat]}
        zoom={11}
        onReady={onMapReady}
      />
      <div className="map-marker">
        <svg
          width="64"
          height="64"
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M32 60c10.5-10.6 20-20.1 20-30A20 20 0 1 0 12 30c0 9.9 9.5 19.4 20 30z"
            fill="#F59E0B"
            stroke="#EA580C"
            strokeWidth="2"
          />
          <circle cx="32" cy="28" r="12" fill="#fff" />
          <path d="M30 21l-4 9h6l-2 7 8-10h-6l3-6h-5z" fill="#F59E0B" />
        </svg>
      </div>

      <AssessBar onHere={assessHere} onMyLocation={assessMyLocation} />

      {assessment && (
        <HazardPanel
          res={assessment}
          onNavigate={navigateToNearest}
          gmapsHref={gmapsUrl}
          navTargetName={navTarget}
          onExplain={() => setShowExplain(true)}
          canNavigate={!!safeAreas.length}
        />
      )}

      {assessment && showExplain && (
        <ExplainModal assessment={assessment} onClose={() => setShowExplain(false)} />
      )}
    </div>
  )
}
