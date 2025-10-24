// src/components/MapView.tsx
import React, { useEffect, useRef } from "react";
import { initMap } from "../hooks/useMapLibre";

export default function MapView({ styleUrl, center, zoom, onReady }:{
  styleUrl: string; center: [number, number]; zoom: number; onReady: (map:any)=>void;
}) {
  const ref = useRef<HTMLDivElement|null>(null);
  useEffect(() => {
    if (!ref.current) return;
    const map = initMap(ref.current, styleUrl, center, zoom);
    map.on("load", () => {
      map.resize();
      onReady(map);
    });
    const onResize = () => map.resize();
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      map.remove();
    };
  }, [styleUrl]);
  return <div ref={ref} className="map-canvas" />;
}
