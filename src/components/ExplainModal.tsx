// src/components/ExplainModal.tsx
import { useState, useEffect, useRef } from "react"
import type { HazardAssessment } from "../types/hazard"
import { initialExplanation, replyFor } from "../services/hazard"

/** Tiny inline markdown → HTML: **bold** and leading • bullets */
function renderMd(text: string): string {
  return text
    .split("\n")
    .map(line => {
      // bold
      line = line.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      // bullet lines starting with •
      if (line.startsWith("• ")) {
        line = `<li>${line.slice(2)}</li>`
      }
      return line
    })
    .join("<br/>")
}

type Message = { role: "assistant" | "user"; text: string }

export default function ExplainModal({
  assessment,
  onClose,
}: {
  assessment: HazardAssessment
  onClose: () => void
}) {
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", text: initialExplanation(assessment) },
  ])
  const [input, setInput] = useState("")
  const chatEndRef = useRef<HTMLDivElement | null>(null)

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  function send() {
    const v = input.trim()
    if (!v) return
    const reply = replyFor(v, assessment)
    setMessages(prev => [...prev, { role: "user", text: v }, { role: "assistant", text: reply }])
    setInput("")
  }

  function handleKey(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault()
      send()
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">Assessment assistant</h3>
          <button onClick={onClose} className="modal-close">
            Close
          </button>
        </div>

        <div className="modal-chat">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`chat-message ${m.role === "assistant" ? "chat-message-assistant" : "chat-message-user"}`}
            >
              <div className="chat-message-label">
                {m.role === "assistant" ? "Assistant" : "You"}
              </div>
              <div
                className="chat-message-bubble"
                dangerouslySetInnerHTML={{ __html: renderMd(m.text) }}
              />
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>

        <div className="modal-input-row">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Ask about this site… e.g., 'how to be safe here?'"
            className="modal-input"
            autoFocus
          />
          <button onClick={send} className="btn btn-indigo">
            Send
          </button>
        </div>
        <div className="modal-footnote">
          Responses are generated from your current on-screen assessment.
        </div>
      </div>
    </div>
  )
}
