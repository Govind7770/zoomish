import { useEffect, useRef, useState } from "react";
import { useChat } from "../store/chatStore";
import { newId } from "../utils/id";

export default function ChatPanel({ send }: { send: (text: string) => void }) {
  const items = useChat((state) => state.items); // ✅ reactive subscription
  const add = useChat((state) => state.add);
  const [input, setInput] = useState("");
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [items]);

  function onSend() {
    const msg = input.trim();
    if (!msg) return;
    // Optional: local echo
    add({ id: newId(), from: "Me", text: msg, at: Date.now() });
    send(msg);
    setInput("");
  }

  return (
    <div className="panel card" style={{ display: "flex", flexDirection: "column", height: 380 }}>
      <div style={{ fontWeight: 800, marginBottom: 8 }}>Chat</div>
      <div
        ref={listRef}
        style={{
          flex: 1,
          overflowY: "auto",
          border: "1px solid rgba(255,255,255,.08)",
          borderRadius: 8,
          padding: 10,
          marginBottom: 8
        }}
      >
        {items.length === 0 ? (
          <div style={{ color: "#9fb4da", fontSize: 13 }}>No messages yet</div>
        ) : (
          items.map((m) => (
            <div key={m.id} style={{ marginBottom: 6 }}>
              <span style={{ color: "#9fb4da", marginRight: 6 }}>{m.from}</span>
              <span>{m.text}</span>
            </div>
          ))
        )}
      </div>

      <div style={{ display: "flex", gap: 8 }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              onSend();
            }
          }}
          placeholder="Message..."
          style={{
            flex: 1,
            height: 38,
            borderRadius: 8,
            border: "1px solid rgba(255,255,255,.14)",
            background: "transparent",
            color: "#e6eaf2",
            padding: "0 10px"
          }}
        />
        <button onClick={onSend} style={btn}>
          Send
        </button>
      </div>
    </div>
  );
}

const btn: React.CSSProperties = {
  height: 38,
  padding: "0 14px",
  borderRadius: 8,
  border: "1px solid rgba(255,255,255,.18)",
  background: "rgba(42,95,220,.25)",
  color: "#e6eaf2",
  cursor: "pointer",
  fontWeight: 700
};
