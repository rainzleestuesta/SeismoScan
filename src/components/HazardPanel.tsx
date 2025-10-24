// src/components/HazardPanel.tsx
import { bandColor } from "../lib/geo";
import type { HazardAssessment } from "../types/hazard";

export default function HazardPanel({
  res,
  onNavigate,
  gmapsHref,
  navTargetName,
  onExplain,
  canNavigate
}:{
  res: HazardAssessment;
  onNavigate: () => void;
  gmapsHref?: string|null;
  navTargetName?: string|null;
  onExplain: () => void;
  canNavigate: boolean;
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
          <button
            onClick={onNavigate}
            className="hazard-action-button primary"
            type="button"
            disabled={!canNavigate}
          >
            <span className="hazard-action-icon" aria-hidden>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M12 3L4 20.5L12 17L20 20.5L12 3Z"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinejoin="round"
                />
                <path d="M12 11.5V14.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                <circle cx="12" cy="9.5" r="1" fill="currentColor" />
              </svg>
            </span>
            <span className="hazard-action-copy">
              <span className="hazard-action-title">Navigate</span>
              <span className="hazard-action-sub">Nearest open area</span>
            </span>
          </button>
          {gmapsHref && (
            <a
              href={gmapsHref}
              target="_blank"
              rel="noopener noreferrer"
              className="hazard-action-button secondary"
            >
              <span className="hazard-action-icon" aria-hidden>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M12 21C12 21 6 14.914 6 10.5C6 7.46243 8.46243 5 11.5 5C14.5376 5 17 7.46243 17 10.5C17 14.914 12 21 12 21Z"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinejoin="round"
                  />
                  <circle cx="12" cy="10.5" r="2.5" stroke="currentColor" strokeWidth="1.6" />
                </svg>
              </span>
              <span className="hazard-action-copy">
                <span className="hazard-action-title">Open in Google Maps</span>
                <span className="hazard-action-sub">
                  {navTargetName ? navTargetName : "See route details"}
                </span>
              </span>
            </a>
          )}
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
