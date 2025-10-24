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
    map.on("load", ()=>onReady(map));
    return () => map.remove();
  }, [styleUrl]);
  return <div ref={ref} className="absolute inset-0" />;
}
