// src/services/hazard.ts
import type { HazardAssessment } from "../types/hazard";
import { kmBetween } from "../lib/geo";

const API_BASE = import.meta.env.VITE_API_BASE || "";
export const DEFAULT_CENTER = { lat: 14.5995, lon: 120.9842 };

export async function fetchHazard(lat: number, lon: number): Promise<HazardAssessment> {
  if (API_BASE) {
    try {
      const res = await fetch(`${API_BASE.replace(/\/$/, "")}/hazard?lat=${lat}&lon=${lon}`);
      if (!res.ok) throw new Error(await res.text());
      return await res.json();
    } catch (e) {
      console.warn("Hazard API failed, falling back to mock:", e);
    }
  }
  return mockAssess(lat, lon); // fallback
}

// moved from your canvas (unchanged math)
type HazardLevel = "Low" | "Moderate" | "High";

export function mockAssess(lat: number, lon: number): HazardAssessment {
  const seededNoise = (x: number, y: number) => {
    const s = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
    return s - Math.floor(s);
  };
  const n = seededNoise(lat, lon);
  const d1 = kmBetween([lon, lat], [121.0, 14.4]);
  const d2 = kmBetween([lon, lat], [121.2, 14.8]);
  const faultKm = Math.min(d1, d2);
  const pga = Math.min(0.6, 0.12 + 0.45 * n);
  const pick = (v: number): HazardLevel => (v < 0.33 ? "Low" : v < 0.66 ? "Moderate" : "High");
  const liq = pick((n * 1.7) % 1);
  const eils = pick(((1 - n) * 1.3) % 1);
  const tsunami = lat < 15 && lon < 121.1 && lon > 120.8;
  const fFault = (dKm: number) => { const d0 = 1.0; const x = 1 - Math.exp(-d0 / Math.max(dKm, 1e-6)); return Math.max(0, Math.min(1, x)); };
  const fPga = (g: number) => Math.max(0, Math.min(1, g / 0.6));
  const catScore = (lbl: HazardLevel) => (lbl === "High" ? 1 : lbl === "Moderate" ? 0.6 : 0.2);
  const val = 0.35*fFault(faultKm) + 0.30*fPga(pga) + 0.20*catScore(liq) + 0.15*catScore(eils) + 0.05*(tsunami?1:0);
  const shi = Math.round(100 * Math.max(0, Math.min(1, val)) * 10) / 10;
  const band = shi >= 66.7 ? "High" : shi >= 33.3 ? "Moderate" : "Low";
  return { lat, lon, shi, band, components: { fault_km: +faultKm.toFixed(3), pga_g: +pga.toFixed(3), liquefaction: liq, eils, tsunami } };
}

export function initialExplanation(a: HazardAssessment) {
  const c = a.components;
  const lines = [
    `This location is rated **${a.band}** with a Site Hazard Index of **${a.shi}/100**.`,
    `Key drivers: ~${c.fault_km.toFixed(1)} km from mapped faults, PGA≈${c.pga_g.toFixed(2)}g, Liquefaction: ${c.liquefaction}, EILS: ${c.eils}${c.tsunami ? ", Tsunami zone: likely" : ""}.`,
    "This index blends fault proximity (35%), shaking intensity (30%), ground failure (20%), intensity level (15%), and tsunami potential (5%)."
  ];
  return lines.join("\n");
}

export function replyFor(question: string, a: HazardAssessment) {
  const text = (question || "").toLowerCase();
  const c = a.components;
  const out: string[] = [];
  const tip = (s: string) => out.push("• " + s);

  if (text.includes("how") || text.includes("safe") || text.includes("earthquake")) {
    tip("Drop, Cover, Hold On during strong shaking. Stay away from windows and heavy furniture.");
    tip("After shaking stops, move to an open area away from buildings, poles, and trees.");
    if (c.liquefaction !== "Low") tip("Avoid soft/reclaimed ground, riverbanks, and areas with visible sand boils or water seepage.");
    if (c.pga_g >= 0.30) tip("Expect falling objects; secure heavy items and be cautious of aftershocks.");
    if (c.fault_km < 2) tip("You’re within ~2 km of a mapped fault; avoid over/underpasses and inspect structures before re-entry.");
    if (c.tsunami) tip("If near the coast and shaking is long/strong, evacuate inland to higher ground immediately.");
  }
  if (text.includes("tsunami")) tip("Move inland or to higher ground (≥10–20 m elevation if available). Wait for official all-clear.");
  if (text.includes("liquefaction")) tip("Avoid riverbanks and reclaimed land after shaking; watch for lateral spreading.");
  if (text.includes("fault")) tip("Near-fault effects can intensify shaking and rupture; avoid bridges and steep slopes.");
  if (text.includes("pga") || text.includes("shaking")) tip(`PGA ~${c.pga_g.toFixed(2)}g suggests strong shaking—brace tall furniture, check gas/electrics.`);
  if (text.includes("evacu") || text.includes("route") || text.includes("open area")) tip("Use the Navigate button or Open in Google Maps for the nearest open area.");

  if (!out.length) out.push("Ask about fault distance, PGA, liquefaction, EILS, or tsunami exposure for tailored guidance.");
  return out.join("\n");
}
