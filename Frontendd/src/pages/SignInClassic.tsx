import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SignInClassic({ onLogin }: { onLogin?: () => void }) {
  const nav = useNavigate();

  // form state
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);

    const id = identifier.trim();
    const pw = password;
    if (!id || !pw) {
      setErr("Please enter both email/phone and password.");
      return;
    }

    try {
      setLoading(true);
      const base = import.meta.env.VITE_API_BASE || "http://localhost:3002";
      const res = await fetch(`${base}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // keep cookies if backend uses httpOnly sessions
        body: JSON.stringify({ identifier: id, password: pw })
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.message || `Login failed (${res.status})`);
      }

      const data = await res.json().catch(() => ({}));
      // Accept both cookie and token flows
      if (data?.token) {
        sessionStorage.setItem("auth_token", data.token);
      }
      sessionStorage.setItem("name", data?.user?.name || id);

      onLogin?.();
      setLoading(false);
      nav("/home", { replace: true });
    } catch (e: any) {
      setLoading(false);
      setErr(e?.message || "Login failed. Please try again.");
    }
  }

  return (
    <div style={{ minHeight: "100dvh", background: "#fff", color: "#0f172a" }}>
      {/* Header */}
      <header style={{
        height: 64, display: "flex", alignItems: "center", padding: "0 22px",
        borderBottom: "1px solid #eef2f7", background: "#fff"
      }}>
        <div style={{ fontSize: 26, color: "#0b5cff", fontWeight: 800 }}>zoomish</div>
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 18, fontSize: 14 }}>
          <button
            onClick={() => nav("/signup")}
            style={{ color: "#64748b", background: "transparent", border: "none", cursor: "pointer" }}
            title="Create an account"
          >
            New to Zoomish?
          </button>
          <a href="#" style={{ color: "#64748b", textDecoration: "none" }}>Support</a>
          <a href="#" style={{ color: "#64748b", textDecoration: "none" }}>English ▾</a>
        </div>
      </header>

      {/* Two equal columns */}
      <main style={{
        maxWidth: 1100,
        margin: "0 auto",
        display: "grid",
        gridTemplateColumns: "520px 520px",
        justifyContent: "space-between",
        gap: 24,
        padding: "36px 16px"
      }}>
        {/* Left promo - fully blue fill, no Read now */}
        <div style={{
          border: "1px solid #e8edf5", borderRadius: 16, overflow: "hidden",
          boxShadow: "0 12px 28px rgba(0,0,0,.04)", maxWidth: 520, width: "100%"
        }}>
          <div style={{
            minHeight: 420,
            background: "linear-gradient(180deg,#2563eb,#3b82f6)",
            color: "#fff",
            padding: 28,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center"
          }}>
            <h2 style={{ margin: 0, fontSize: 28, lineHeight: 1.25 }}>
              Zoomish recognized in the 2025 Magic Quadrant
            </h2>
            <p style={{ margin: "12px 0 0", opacity: .95, maxWidth: 520 }}>
              Read the full report and see why leaders choose Zoomish.
            </p>
          </div>
        </div>

        {/* Right: compact Sign in card */}
        <div style={{
          border: "1px solid #e8edf5",
          borderRadius: 16,
          background: "#fff",
          padding: 28,
          boxShadow: "0 12px 28px rgba(0,0,0,.04)",
          alignSelf: "start",
          maxWidth: 520,
          width: "100%"
        }}>
          <h1 style={{ margin: "6px 0 18px", fontSize: 32 }}>Sign in</h1>

          <form onSubmit={submit} style={{ display: "grid", gap: 12 }}>
            <input
              value={identifier}
              onChange={e => setIdentifier(e.target.value)}
              placeholder="Email or phone number"
              autoComplete="username"
              style={{
                height: 44, padding: "0 12px", borderRadius: 8, border: "1px solid #cbd5e1",
                fontSize: 15, background: "#fff", color: "#0f172a", outline: "none"
              }}
              onFocus={(e) => (e.currentTarget.style.boxShadow = "0 0 0 3px rgba(99,102,241,.20)")}
              onBlur={(e) => (e.currentTarget.style.boxShadow = "none")}
            />

            <div style={{ position: "relative" }}>
              <input
                type={showPw ? "text" : "password"}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Password"
                autoComplete="current-password"
                style={{
                  width: "100%", height: 44, padding: "0 44px 0 12px",
                  borderRadius: 8, border: "1px solid #cbd5e1",
                  fontSize: 15, background: "#fff", color: "#0f172a", outline: "none"
                }}
                onFocus={(e) => (e.currentTarget.style.boxShadow = "0 0 0 3px rgba(99,102,241,.20)")}
                onBlur={(e) => (e.currentTarget.style.boxShadow = "none")}
              />
              <button
                type="button"
                onClick={() => setShowPw(v => !v)}
                style={{
                  position: "absolute", right: 8, top: 6,
                  height: 32, padding: "0 10px", borderRadius: 6,
                  border: "1px solid #d0d7e3", background: "#fff", cursor: "pointer", color: "#475569"
                }}
                aria-label={showPw ? "Hide password" : "Show password"}
              >
                {showPw ? "Hide" : "Show"}
              </button>
            </div>

            {err && <div style={{ color: "#dc2626", fontSize: 13 }}>{err}</div>}

            <button type="submit" disabled={loading} style={{
              height: 44, borderRadius: 8, border: "none",
              background: loading ? "#93c5fd" : "#0b5cff",
              color: "#fff", fontWeight: 800, cursor: loading ? "not-allowed" : "pointer"
            }}>
              {loading ? "Signing in..." : "Next"}
            </button>
          </form>

          {/* Divider */}
          <div style={{
            margin: "18px 0", display: "grid",
            gridTemplateColumns: "1fr auto 1fr", alignItems: "center", gap: 12, color: "#94a3b8", fontSize: 13
          }}>
            <div style={{ height: 1, background: "#e2e8f0" }} />
            <span>Or sign in with</span>
            <div style={{ height: 1, background: "#e2e8f0" }} />
          </div>

          {/* One line: Apple, Google, Facebook, Microsoft */}
          <div style={{ display: "flex", gap: 12, flexWrap: "nowrap" }}>
            {[
              { label: "Apple", emoji: "" },
              { label: "Google", emoji: "🟢" },
              { label: "Facebook", emoji: "📘" },
              { label: "Microsoft", emoji: "🪟" }
            ].map(btn => (
              <button
                key={btn.label}
                style={{
                  flex: "0 0 140px",
                  height: 40,
                  borderRadius: 10,
                  border: "1px solid #e2e8f0",
                  background: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  cursor: "pointer",
                  whiteSpace: "nowrap"
                }}
                onClick={() => alert(`${btn.label} sign-in placeholder`)}
              >
                <span style={{ fontSize: 16 }}>{btn.emoji}</span>
                <span style={{ fontSize: 13, color: "#0f172a" }}>{btn.label}</span>
              </button>
            ))}
          </div>

          <div style={{ marginTop: 18, display: "flex", gap: 14, color: "#64748b", fontSize: 13 }}>
            <a href="#" style={{ color: "#0b5cff" }}>Help</a>
            <a href="#" style={{ color: "#0b5cff" }}>Terms</a>
            <a href="#" style={{ color: "#0b5cff" }}>Privacy</a>
          </div>

          <p style={{ marginTop: 16, color: "#94a3b8", fontSize: 12 }}>
            Protected by reCAPTCHA. Privacy Policy and Terms of Service apply.
          </p>
        </div>
      </main>
    </div>
  );
}
