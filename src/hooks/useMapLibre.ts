// src/hooks/useMapLibre.ts
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

export function initMap(container: HTMLDivElement, styleUrl: string, center: [number, number], zoom: number) {
  const map = new maplibregl.Map({
    container, style: styleUrl, center, zoom, attributionControl: true
  });
  map.addControl(new maplibregl.NavigationControl({ showCompass: true }), "top-right");
  return map;
}
