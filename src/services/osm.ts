// src/services/osm.ts
export type SafeArea = { name: string; coords: [number, number] }

/** Hardcoded NCR open-area seed list (used as fallback if Overpass returns nothing). */
const NCR_SEEDS: SafeArea[] = [
  { name: "Luneta / Rizal Park", coords: [120.9822, 14.5764] },
  { name: "UP Diliman Academic Oval", coords: [121.0597, 14.656] },
  { name: "Quezon Memorial Circle", coords: [121.0363, 14.6524] },
  { name: "SM Mall of Asia Grounds", coords: [120.9832, 14.5336] },
  { name: "Ninoy Aquino Parks & Wildlife", coords: [121.0513, 14.6342] },
  { name: "Marikina Sports Center", coords: [121.107, 14.6498] },
  { name: "Villamor Air Base Grandstand", coords: [121.0062, 14.5218] },
  { name: "Plaza Miranda (Quiapo)", coords: [120.984, 14.5992] },
  { name: "Liwasang Bonifacio", coords: [120.9766, 14.5951] },
  { name: "Paco Park", coords: [120.99, 14.5764] },
  { name: "La Mesa Eco Park", coords: [121.066, 14.725] },
  { name: "Las Piñas–Parañaque Wetlands", coords: [120.986, 14.466] },
  { name: "Arroceros Forest Park", coords: [120.9793, 14.5908] },
  { name: "Manila Baywalk", coords: [120.974, 14.57] },
  { name: "Ynares Sports Center (Antipolo)", coords: [121.1768, 14.5867] },
  { name: "FTI Complex Open Grounds", coords: [121.049, 14.512] },
  { name: "Bagong Silang Open Field", coords: [121.035, 14.727] },
  { name: "Veterans Memorial Medical Grounds", coords: [121.0523, 14.633] },
]

export async function fetchOpenAreasNCR(): Promise<SafeArea[]> {
  const bbox = { s: 14.2, w: 120.9, n: 14.9, e: 121.2 }
  // Note: Excluded "pitch" (small sports courts) — they overwhelm the map
  // and are not useful as earthquake evacuation areas.
  const q = `
[out:json][timeout:25];
(
  way["leisure"="park"](${bbox.s},${bbox.w},${bbox.n},${bbox.e});
  relation["leisure"="park"](${bbox.s},${bbox.w},${bbox.n},${bbox.e});
  way["landuse"="recreation_ground"](${bbox.s},${bbox.w},${bbox.n},${bbox.e});
  way["amenity"="plaza"](${bbox.s},${bbox.w},${bbox.n},${bbox.e});
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
      const results: SafeArea[] = elements
        .flatMap((el: any): SafeArea[] => {
          // eslint-disable-line @typescript-eslint/no-explicit-any
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
        // Prefer named areas, limit to 60 to avoid clutter
        .sort((a: SafeArea, b: SafeArea) =>
          a.name === "Open space" ? 1 : b.name === "Open space" ? -1 : 0
        )
        .slice(0, 60)
      if (results.length > 0) return results
    } catch {
      // Overpass endpoint failed — try next mirror
    }
  }
  // Overpass failed or returned nothing — use hardcoded NCR seed list
  return NCR_SEEDS
}
