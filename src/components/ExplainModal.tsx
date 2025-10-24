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

  const rerender = () => {
    if (!chatDiv.current) return;
    chatDiv.current.innerHTML = messages.current
      .map(m =>
        `<div class="chat-message ${m.role === "assistant" ? "chat-message-assistant" : "chat-message-user"}">
           <div class="chat-message-label">${m.role === "assistant" ? "Assistant" : "You"}</div>
           <div class="chat-message-bubble">${m.text}</div>
         </div>`
      )
      .join("");
  };

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
    <div className="modal-overlay">
      <div className="modal-card">
        <div className="modal-header">
          <h3 className="modal-title">Assessment assistant</h3>
          <button onClick={onClose} className="modal-close">Close</button>
        </div>
        <div ref={chatDiv} className="modal-chat" />
        <div className="modal-input-row">
          <input
            ref={inputRef}
            onKeyDown={(e: any)=>{ if(e.key==="Enter"){ e.preventDefault(); send(); }}}
            placeholder="Ask about this site… e.g., 'how to be safe here?'"
            className="modal-input"
          />
          <button onClick={send} className="btn btn-indigo">Send</button>
        </div>
        <div className="modal-footnote">Responses are generated from your current on-screen assessment.</div>
      </div>
    </div>
  );
}
