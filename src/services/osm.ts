// src/services/osm.ts
export type SafeArea = { name: string; coords: [number, number] }

export async function fetchOpenAreasNCR(): Promise<SafeArea[]> {
  const bbox = { s: 14.2, w: 120.9, n: 14.9, e: 121.2 }
  const q = `
[out:json][timeout:25];
(
  way["leisure"="park"](${bbox.s},${bbox.w},${bbox.n},${bbox.e});
  relation["leisure"="park"](${bbox.s},${bbox.w},${bbox.n},${bbox.e});
  way["landuse"="recreation_ground"](${bbox.s},${bbox.w},${bbox.n},${bbox.e});
  way["amenity"="plaza"](${bbox.s},${bbox.w},${bbox.n},${bbox.e});
  way["leisure"="pitch"](${bbox.s},${bbox.w},${bbox.n},${bbox.e});
  node["emergency"="assembly_point"](${bbox.s},${bbox.w},${bbox.n},${bbox.e});
);
out center tags;`
  const endpoints = [
    "https://overpass-api.de/api/interpreter",
    "https://overpass.kumi.systems/api/interpreter",
  ]
  for (const ep of endpoints) {
    try {
      const r = await fetch(ep, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `data=${encodeURIComponent(q)}`,
      })
      const data = await r.json()
      const elements = data?.elements ?? []
      return elements.flatMap((el: any): SafeArea[] => {
        const name =
          el?.tags?.name ||
          el?.tags?.["name:en"] ||
          el?.tags?.amenity ||
          el?.tags?.leisure ||
          "Open space"
        if (el.type === "node" && el.lat && el.lon) return [{ name, coords: [el.lon, el.lat] }]
        if (el.center?.lat && el.center?.lon)
          return [{ name, coords: [el.center.lon, el.center.lat] }]
        return []
      })
    } catch {
      // Overpass endpoint failed — try next mirror
    }
  }
  return [] // let UI fall back to seed list
}
