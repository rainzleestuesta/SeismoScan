// src/components/AssessBar.tsx
export default function AssessBar({ onHere, onMyLocation }:{
  onHere: ()=>void; onMyLocation: ()=>void;
}) {
  return (
    <div className="absolute left-1/2 -translate-x-1/2 bottom-6 z-40 flex items-center gap-3">
      <button onClick={onMyLocation} className="px-5 py-3 rounded-full shadow-lg bg-emerald-600 text-white hover:bg-emerald-700">
        Assess my current location
      </button>
      <button onClick={onHere} className="px-5 py-3 rounded-full shadow-lg bg-indigo-600 text-white hover:bg-indigo-700">
        Assess map center
      </button>
    </div>
  );
}
