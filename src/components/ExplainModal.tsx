// src/components/ExplainModal.tsx
import type { HazardAssessment } from "../types/hazard";
import { initialExplanation, replyFor } from "../services/hazard";
import { useRef } from "react";

export default function ExplainModal({ assessment, onClose }:{
  assessment: HazardAssessment;
  onClose: ()=>void;
}) {
  const chatDiv = useRef<HTMLDivElement|null>(null);
  const inputRef = useRef<HTMLInputElement|null>(null);
  const messages = useRef<{role:"assistant"|"user"; text:string}[]>([
    { role:"assistant", text: initialExplanation(assessment) }
  ]);

  const rerender = () => chatDiv.current && (chatDiv.current.innerHTML = messages.current.map(m =>
    `<div class="mb-2 ${m.role==="assistant"?"text-gray-900":"text-gray-700"}">
       <div class="text-xs text-gray-500 mb-0.5">${m.role==="assistant"?"Assistant":"You"}</div>
       <div class="px-3 py-2 rounded-xl ${m.role==="assistant"?"bg-white shadow":"bg-indigo-50"}">${m.text}</div>
     </div>`).join(""));

  setTimeout(rerender, 0);

  function send() {
    const v = (inputRef.current?.value || "").trim();
    if (!v) return;
    messages.current.push({ role:"user", text: v });
    messages.current.push({ role:"assistant", text: replyFor(v, assessment) });
    inputRef.current!.value = "";
    rerender();
  }

  return (
    <div className="absolute inset-0 z-50" style={{ background:"rgba(0,0,0,0.45)" }}>
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[680px] max-w-[95vw] bg-white rounded-2xl shadow-2xl p-4">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold">Assessment assistant</h3>
          <div className="ml-auto"><button onClick={onClose} className="px-2 py-1 rounded-lg border">Close</button></div>
        </div>
        <div ref={chatDiv} className="mt-2 h-[380px] max-h-[60vh] overflow-y-auto rounded-xl border bg-gray-50 p-3" />
        <div className="mt-3 flex items-center gap-2">
          <input ref={inputRef} onKeyDown={(e)=>{ if(e.key==="Enter"){ e.preventDefault(); send(); }}} placeholder="Ask about this site… e.g., 'how to be safe here?'" className="flex-1 border rounded-xl px-3 py-2" />
          <button onClick={send} className="px-3 py-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700">Send</button>
        </div>
        <div className="mt-2 text-[11px] text-gray-500">Responses are generated from your current on-screen assessment.</div>
      </div>
    </div>
  );
}
