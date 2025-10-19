import { useNavigate } from "react-router-dom";

export default function Landing() {
  const nav = useNavigate();

  return (
    <div style={{ minHeight: "100dvh", background: "linear-gradient(180deg,#0b1228,#0e1a3a)" }}>
      {/* Top nav */}
      <header style={{
        height: 64, display: "flex", alignItems: "center", padding: "0 20px",
        borderBottom: "1px solid rgba(255,255,255,.08)"
      }}>
        <div style={{ fontSize: 26, fontWeight: 800, color: "#86b7ff" }}>zoomish</div>

        <nav style={{ marginLeft: 18, display: "flex", alignItems: "center", gap: 18, color: "#cbd5e1", fontSize: 14 }}>
          <a href="#" style={{ color: "inherit", textDecoration: "none" }}>Products ▾</a>
          <a href="#" style={{ color: "inherit", textDecoration: "none" }}>AI ▾</a>
          <a href="#" style={{ color: "inherit", textDecoration: "none" }}>Solutions ▾</a>
          <a href="#" style={{ color: "inherit", textDecoration: "none" }}>Pricing</a>
        </nav>

        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 10 }}>
          <button onClick={() => nav("/signin")} style={btnGhost}>Sign in</button>
          <button onClick={() => nav("/signup")} style={btnPrimary}>Sign up</button>
          <button onClick={() => nav("/lobby")} style={btnGhost}>Meet</button>
        </div>
      </header>

      {/* Announcement bar */}
      <div style={{
        maxWidth: 1200, margin: "12px auto 0", background: "rgba(12,18,40,.6)",
        border: "1px solid rgba(255,255,255,.08)", color: "#dbeafe", borderRadius: 12,
        padding: "10px 12px", display: "flex", alignItems: "center", gap: 12
      }}>
        <div style={{ flex: 1 }}>
          Zoomish is a Leader in the 2025 Magic Quadrant for Workplace Collaboration.
        </div>
        <button style={{ ...pill, background: "#2753ff" }} onClick={() => alert("Opening report...")}>
          Read the report
        </button>
        <button style={{ ...pill, background: "transparent", border: "1px solid rgba(255,255,255,.18)" }} onClick={() => {}}>
          ✕
        </button>
      </div>

      {/* Hero */}
      <section style={{ maxWidth: 1100, margin: "40px auto 0", textAlign: "center", color: "#e2e8f0" }}>
        <h1 style={{
          margin: 0,
          fontSize: 54,
          lineHeight: 1.15,
          color: "#eaf2ff",
          textShadow: "0 2px 22px rgba(88,127,255,.25)"
        }}>
          Find out what's possible<br />when work connects
        </h1>
        <p style={{ marginTop: 14, color: "#9fb4da", fontSize: 16 }}>
          Connect, collaborate, and reach goals — with built‑in AI doing the heavy lifting.
        </p>
        <div style={{ display: "flex", justifyContent: "center", gap: 12, marginTop: 18 }}>
          <button style={btnPrimary} onClick={() => nav("/signup")}>Get started free</button>
          <button style={btnGhost} onClick={() => nav("/signin")}>Sign in</button>
        </div>
      </section>

      {/* Product strip */}
      <section style={{ maxWidth: 1250, margin: "36px auto 0", padding: "0 16px" }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(8, 1fr)",
          gap: 14,
          overflowX: "auto",
          paddingBottom: 10
        }}>
          {[
            { label: "Meetings" },
            { label: "AI Companion" },
            { label: "Team Chat" },
            { label: "Phone" },
            { label: "Whiteboard" },
            { label: "Webinars" },
            { label: "Docs" },
            { label: "Contact Center" }
          ].map((card) => (
            <div key={card.label} style={cardWrap}>
              <div style={cardThumb} />
              <div style={{ padding: 10, color: "#cdd6f4", fontWeight: 700 }}>{card.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA band */}
      <section style={{ maxWidth: 1100, margin: "28px auto 0", color: "#cbd5e1",
        border: "1px solid rgba(255,255,255,.08)", background: "rgba(17,24,39,.55)", borderRadius: 14, padding: 18 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
          <div>
            <div style={{ fontWeight: 800, color: "#e5edff" }}>Ready to connect your team?</div>
            <div style={{ fontSize: 13, color: "#9fb4da" }}>Start a meeting or explore products tailored to the org.</div>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button style={btnPrimary} onClick={() => nav("/lobby")}>Start a meeting</button>
            <button style={btnGhost} onClick={() => nav("/home")}>Explore products</button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ maxWidth: 1100, margin: "36px auto", color: "#93a4c6", fontSize: 13, padding: "0 16px" }}>
        © {new Date().getFullYear()} Zoomish — All rights reserved.
      </footer>
    </div>
  );
}

const btnPrimary: React.CSSProperties = {
  height: 40,
  padding: "0 16px",
  borderRadius: 10,
  border: "1px solid #2f54ff",
  background: "linear-gradient(180deg,#3d66ff,#2b55ff)",
  color: "#fff",
  fontWeight: 800,
  cursor: "pointer"
};

const btnGhost: React.CSSProperties = {
  height: 40,
  padding: "0 14px",
  borderRadius: 10,
  border: "1px solid rgba(255,255,255,.18)",
  background: "transparent",
  color: "#cfe0ff",
  fontWeight: 700,
  cursor: "pointer"
};

const pill: React.CSSProperties = {
  height: 32,
  padding: "0 12px",
  borderRadius: 999,
  border: "none",
  color: "#fff",
  fontWeight: 700,
  cursor: "pointer"
};

const cardWrap: React.CSSProperties = {
  minWidth: 180,
  border: "1px solid rgba(255,255,255,.10)",
  background: "rgba(17,24,39,.55)",
  borderRadius: 16,
  overflow: "hidden"
};

const cardThumb: React.CSSProperties = {
  height: 120,
  background: "linear-gradient(135deg,#1f3b86,#2748a8,#345bda)"
};
