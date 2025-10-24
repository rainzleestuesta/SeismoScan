// src/components/HazardPanel.tsx
import { bandColor } from "../lib/geo";
import type { HazardAssessment } from "../types/hazard";

export default function HazardPanel({
  res, onNavigate, gmapsHref, navTargetName, onExplain
}:{
  res: HazardAssessment;
  onNavigate: () => void;
  gmapsHref?: string|null;
  navTargetName?: string|null;
  onExplain: () => void;
}) {
  return (
    <div className="absolute right-4 top-20 w-[380px] max-w-[90vw] z-30">
      <div className="rounded-2xl shadow-xl bg-white/95 backdrop-blur p-5 border border-gray-100">
        <div className="text-sm font-semibold text-gray-800">Site Hazard Assessment</div>
        <div className="mt-2 flex items-center gap-3">
          <div className="text-4xl font-semibold text-gray-900 leading-none">{res.shi.toFixed(1)}</div>
          <div className="text-gray-400">/ 100</div>
          <span className="ml-auto text-xs font-semibold px-2.5 py-1 rounded-full border"
            style={{ color: bandColor(res.band), borderColor: bandColor(res.band), background: `${bandColor(res.band)}20` }}>
            {res.band} Risk
          </span>
        </div>

        <div className="mt-3 h-px bg-gray-200" />
        <div className="mt-3 space-y-2 text-[13px]">
          <Row label="Fault distance" value={`${res.components.fault_km.toFixed(2)} km`} />
          <Row label="Liquefaction" value={res.components.liquefaction} />
          <Row label="ELS" value={res.components.eils} />
          <Row label="Tsunami zone" value={res.components.tsunami ? "Yes" : "No"} />
        </div>

        <div className="mt-4 flex flex-col gap-2">
          <button onClick={onNavigate} className="px-4 py-2 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700">
            Navigate the nearest open Area
          </button>
          <a
            onClick={!gmapsHref ? onNavigate : undefined}
            href={gmapsHref || "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-xl bg-gray-100 text-gray-900 hover:bg-gray-200 block text-center">
            Open in Google Maps{navTargetName ? ` — ${navTargetName}` : ""}
          </a>
          <button onClick={onExplain} className="text-indigo-700 underline text-sm mt-1 self-start">Explain with AI</button>
        </div>
      </div>
    </div>
  );
}

function Row({label, value}:{label:string; value:string}) {
  return (
    <div className="flex items-center justify-between py-2 px-2 rounded-xl bg-gray-50">
      <div>
        <div className="text-gray-500 text-[11px]">{label}</div>
        <div className="font-semibold">{value}</div>
      </div>
      <div className="text-emerald-600">🛈</div>
    </div>
  );
}
