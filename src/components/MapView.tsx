// src/components/MapView.tsx
import { useEffect, useRef } from "react"
import { initMap } from "../hooks/useMapLibre"

export default function MapView({
  styleUrl,
  center,
  zoom,
  onReady,
}: {
  styleUrl: string
  center: [number, number]
  zoom: number
  onReady: (map: any) => void // eslint-disable-line @typescript-eslint/no-explicit-any
}) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  // Keep a stable ref to onReady so the effect doesn't re-run when the
  // parent re-renders (onReady is defined inline in App and would change
  // every render, but the map must only be initialised once per styleUrl).
  const onReadyRef = useRef(onReady)
  useEffect(() => {
    onReadyRef.current = onReady
  })

  useEffect(() => {
    if (!containerRef.current) return
    const map = initMap(containerRef.current, styleUrl, center, zoom)
    map.on("load", () => {
      map.resize()
      onReadyRef.current(map)
    })
    const onResize = () => map.resize()
    window.addEventListener("resize", onResize)
    return () => {
      window.removeEventListener("resize", onResize)
      map.remove()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [styleUrl]) // intentionally omit center/zoom/onReady — map init is one-shot per style
  return <div ref={containerRef} className="map-canvas" />
}
