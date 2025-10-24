// src/services/routing.ts
import { kmBetween, bearingFrom } from "../lib/geo";

const OSRM = import.meta.env.VITE_OSRM_BASE || "https://router.project-osrm.org/route/v1/foot";

export const gmapsDirectionsUrl = (
  originLat: number,
  originLon: number,
  [destLon, destLat]: [number, number],
  mode: "walking" | "driving" | "bicycling" = "walking"
) =>
  `https://www.google.com/maps/dir/?api=1&origin=${originLat},${originLon}&destination=${destLat},${destLon}&travelmode=${mode}`;

const cache = new Map<string, { duration?: number; geometry?: any }>();
const key = (a: [number, number], b: [number, number]) => `${a[0]},${a[1]}|${b[0]},${b[1]}`;

export async function osrmDuration(a: [number,number], b: [number,number]) {
  const k = key(a,b);
  if (cache.get(k)?.duration != null) return cache.get(k)!.duration!;
  const res = await fetch(`${OSRM}/${a[0]},${a[1]};${b[0]},${b[1]}?overview=false`);
  const j = await res.json().catch(() => ({}));
  const d = j?.routes?.[0]?.duration ?? null;
  cache.set(k, { ...(cache.get(k)||{}), duration: d });
  return d;
}

export async function osrmRoute(a: [number,number], b: [number,number]) {
  const k = key(a,b);
  if (cache.get(k)?.geometry) return cache.get(k)!.geometry!;
  const res = await fetch(`${OSRM}/${a[0]},${a[1]};${b[0]},${b[1]}?overview=full&geometries=geojson`);
  const j = await res.json().catch(() => ({}));
  const geom = j?.routes?.[0]?.geometry ?? null;
  cache.set(k, { ...(cache.get(k)||{}), geometry: geom, duration: j?.routes?.[0]?.duration });
  return geom;
}

export function nearestByDistance(origin: [number,number], list: {name:string;coords:[number,number]}[], k=8) {
  return list
    .map(s => ({ ...s, _km: kmBetween(origin, s.coords) }))
    .sort((a,b)=>a._km-b._km)
    .slice(0, Math.min(k, list.length));
}

export async function nearestByETA(origin: [number,number], list: {name:string;coords:[number,number]}[]) {
  const candidates = nearestByDistance(origin, list, 12);
  if (!candidates.length) return null;
  const durs = await Promise.all(candidates.map(c => osrmDuration(origin, c.coords)));
  let best = 0, bestDur = Infinity;
  durs.forEach((d,i)=>{ if (typeof d === "number" && d < bestDur) { bestDur = d; best = i; }});
  return candidates[best] ?? candidates[0];
}

export { bearingFrom };
