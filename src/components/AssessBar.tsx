// src/components/AssessBar.tsx
export default function AssessBar({
  onHere,
  onMyLocation,
}: {
  onHere: () => void
  onMyLocation: () => void
}) {
  return (
    <div className="assess-bar">
      <button onClick={onMyLocation} className="btn btn-green">
        Assess my current location
      </button>
      <button onClick={onHere} className="btn btn-indigo">
        Assess map center
      </button>
    </div>
  )
}
