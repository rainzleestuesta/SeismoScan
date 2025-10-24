// src/types/hazard.ts
export type HazardBand = "Low" | "Moderate" | "High";

export interface HazardComponents {
  fault_km: number;
  pga_g: number;
  liquefaction: "Low" | "Moderate" | "High";
  eils: "Low" | "Moderate" | "High";
  tsunami: boolean;
}

export interface HazardAssessment {
  lat: number;
  lon: number;
  shi: number; // 0–100
  band: HazardBand;
  components: HazardComponents;
}
