// src/components/HazardPanel.tsx
import { bandColor } from "../lib/geo"
import type { HazardAssessment } from "../types/hazard"

export default function HazardPanel({
  res,
  onNavigate,
  gmapsHref,
  navTargetName,
  onExplain,
}: {
  res: HazardAssessment
  onNavigate: () => void
  gmapsHref?: string | null
  navTargetName?: string | null
  onExplain: () => void
}) {
  const c = res.components
  const color = bandColor(res.band)

  return (
    <div className="hazard-panel">
      <div className="hazard-card">
        {/* Risk header */}
        <div className="hazard-header" style={{ borderColor: color }}>
          <div className="hazard-header-top">
            <span className="hazard-label">SITE HAZARD INDEX</span>
            <span className="hazard-band-pill" style={{ background: `${color}22`, color, borderColor: `${color}55` }}>
              {res.band} Risk
            </span>
          </div>
          <div className="hazard-score-row">
            <span className="hazard-score" style={{ color }}>{res.shi.toFixed(1)}</span>
            <span className="hazard-score-denom">/100</span>
            <div className="hazard-score-bar-track">
              <div className="hazard-score-bar-fill" style={{ width: `${res.shi}%`, background: color }} />
            </div>
          </div>
        </div>

        {/* Metric rows */}
        <div className="hazard-metrics">
          <MetricRow icon="⚡" label="Fault Distance" value={`${c.fault_km.toFixed(2)} km`} />
          <MetricRow icon="📳" label="Peak Ground Accel." value={`${c.pga_g.toFixed(3)} g`} />
          <MetricRow icon="💧" label="Liquefaction" value={c.liquefaction} level={c.liquefaction} />
          <MetricRow icon="🏗️" label="Intensity Level (EILS)" value={c.eils} level={c.eils} />
          <MetricRow icon="🌊" label="Tsunami Zone" value={c.tsunami ? "Yes ⚠️" : "No"} />
        </div>

        {/* Actions */}
        <div className="hazard-actions">
          <button onClick={onNavigate} className="btn btn-primary">
            <span>🧭</span> Navigate to nearest open area
          </button>
          <a
            onClick={!gmapsHref ? onNavigate : undefined}
            href={gmapsHref || "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-secondary"
          >
            <span>📍</span> {navTargetName ? `Open in Maps — ${navTargetName}` : "Open in Google Maps"}
          </a>
          <button onClick={onExplain} className="hazard-explain">
            ✨ Explain with AI
          </button>
        </div>
      </div>
    </div>
  )
}

function MetricRow({
  icon,
  label,
  value,
  level,
}: {
  icon: string
  label: string
  value: string
  level?: "Low" | "Moderate" | "High"
}) {
  const levelColor = level
    ? level === "High"
      ? "#ef4444"
      : level === "Moderate"
        ? "#f59e0b"
        : "#10b981"
    : undefined

  return (
    <div className="metric-row">
      <span className="metric-icon">{icon}</span>
      <div className="metric-text">
        <div className="metric-label">{label}</div>
        <div className="metric-value" style={levelColor ? { color: levelColor } : undefined}>
          {value}
        </div>
      </div>
    </div>
  )
}
