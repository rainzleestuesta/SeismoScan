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
    <div className="hazard-panel">
      <div className="hazard-card">
        <div className="hazard-heading">Site Hazard Assessment</div>
        <div className="hazard-score-row">
          <div className="hazard-score">{res.shi.toFixed(1)}</div>
          <div className="hazard-score-total">/ 100</div>
          <span
            className="hazard-band"
            style={{
              color: bandColor(res.band),
              borderColor: bandColor(res.band),
              background: `${bandColor(res.band)}20`
            }}
          >
            {res.band} Risk
          </span>
        </div>

        <div className="hazard-divider" />
        <div className="hazard-list">
          <Row label="Fault distance" value={`${res.components.fault_km.toFixed(2)} km`} />
          <Row label="Liquefaction" value={res.components.liquefaction} />
          <Row label="ELS" value={res.components.eils} />
          <Row label="Tsunami zone" value={res.components.tsunami ? "Yes" : "No"} />
        </div>

        <div className="hazard-actions">
          <button onClick={onNavigate} className="btn btn-green">
            Navigate the nearest open Area
          </button>
          <a
            onClick={!gmapsHref ? onNavigate : undefined}
            href={gmapsHref || "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="hazard-link"
          >
            Open in Google Maps{navTargetName ? ` — ${navTargetName}` : ""}
          </a>
          <button onClick={onExplain} className="hazard-explain">Explain with AI</button>
        </div>
      </div>
    </div>
  );
}

function Row({label, value}:{label:string; value:string}) {
  return (
    <div className="hazard-row">
      <div>
        <div className="hazard-row-label">{label}</div>
        <div className="hazard-row-value">{value}</div>
      </div>
      <div className="hazard-row-icon">🛈</div>
    </div>
  );
}
