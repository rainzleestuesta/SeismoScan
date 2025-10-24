// src/services/faults.ts
export async function loadFaultsGeoJSON(url: string) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}
