import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SignUp() {
  const nav = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    if (!name.trim() || !email.trim() || !password) {
      setErr("Please fill all fields.");
      return;
    }
    try {
      setLoading(true);
      const base = import.meta.env.VITE_API_BASE || "http://localhost:3002";
      const res = await fetch(`${base}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name: name.trim(), email: email.trim(), password })
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data?.message || `Signup failed (${res.status})`);
      }
      if (data?.token) {
        sessionStorage.setItem("auth_token", data.token);
      }
      sessionStorage.setItem("name", data?.user?.name || name.trim());
      setLoading(false);
      nav("/home", { replace: true });
    } catch (e: any) {
      setLoading(false);
      setErr(e?.message || "Signup failed. Please try again.");
    }
  }

  return (
    <div style={{ minHeight: "100dvh", background: "#fff", color: "#0f172a" }}>
      {/* Header */}
      <header style={{
        height: 64, display: "flex", alignItems: "center", padding: "0 22px",
        borderBottom: "1px solid #eef2f7", background: "#fff"
      }}>
        <div style={{ fontSize: 26, color: "#0b5cff", fontWeight: 800, cursor: "pointer" }} onClick={() => nav("/")}>
          zoomish
        </div>
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 18, fontSize: 14 }}>
          <span style={{ color: "#64748b" }}>
            Already have an account?{" "}
            <a href="/signin" style={{ color: "#0b5cff", textDecoration: "none", fontWeight: 700 }}>Sign in</a>
          </span>
          <a href="#" style={{ color: "#64748b", textDecoration: "none" }}>Support</a>
          <a href="#" style={{ color: "#64748b", textDecoration: "none" }}>English ▾</a>
        </div>
      </header>

      {/* Two columns */}
      <main style={{
        maxWidth: 1100,
        margin: "0 auto",
        display: "grid",
        gridTemplateColumns: "520px 520px",
        justifyContent: "space-between",
        gap: 24,
        padding: "36px 16px"
      }}>
        {/* Left: benefits list */}
        <div style={{
          border: "1px solid #e8edf5", borderRadius: 16, padding: 22, background: "#fff",
          boxShadow: "0 12px 28px rgba(0,0,0,.04)"
        }}>
          <h3 style={{ marginTop: 0 }}>Create your free Basic account</h3>
          <ul style={{ lineHeight: 1.7, color: "#475569", margin: 0, paddingLeft: 18 }}>
            <li>Unlimited meetings up to 40 minutes and 100 participants</li>
            <li>Automated captions</li>
            <li>Secure, HD audio and video</li>
            <li>3 editable whiteboards</li>
            <li>Team chat and file sharing</li>
          </ul>
        </div>

        {/* Right: Let's Get Started */}
        <div style={{
          border: "1px solid #e8edf5", borderRadius: 16, padding: 28, background: "#fff",
          boxShadow: "0 12px 28px rgba(0,0,0,.04)"
        }}>
          <h1 style={{ marginTop: 0, fontSize: 32, textAlign: "center" }}>Let’s Get Started</h1>

          <form onSubmit={onSubmit} style={{ display: "grid", gap: 12, maxWidth: 520, margin: "0 auto" }}>
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Full Name"
              autoComplete="name"
              style={{
                height: 44, padding: "0 12px", borderRadius: 8, border: "1px solid #cbd5e1",
                fontSize: 15, background: "#fff", color: "#0f172a", outline: "none"
              }}
              onFocus={(e) => (e.currentTarget.style.boxShadow = "0 0 0 3px rgba(99,102,241,.20)")}
              onBlur={(e) => (e.currentTarget.style.boxShadow = "none")}
            />
            <input
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Email Address"
              autoComplete="email"
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
                autoComplete="new-password"
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
              {loading ? "Creating..." : "Continue"}
            </button>
          </form>

          <p style={{ color: "#64748b", fontSize: 12, textAlign: "center", marginTop: 10 }}>
            By proceeding, I agree to Zoomish’s Privacy Statement and Terms of Service.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", alignItems: "center", gap: 12, color: "#94a3b8", fontSize: 13, marginTop: 18 }}>
            <div style={{ height: 1, background: "#e2e8f0" }} />
            <span>Or sign up with</span>
            <div style={{ height: 1, background: "#e2e8f0" }} />
          </div>

          <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 12, flexWrap: "wrap" }}>
            {[
              { label: "SSO", emoji: "🔍" },
              { label: "Apple", emoji: "" },
              { label: "Google", emoji: "🟢" },
              { label: "Facebook", emoji: "📘" },
              { label: "Microsoft", emoji: "🪟" }
            ].map(btn => (
              <button
                key={btn.label}
                style={{
                  flex: "0 0 120px",
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
                onClick={() => alert(`${btn.label} signup placeholder`)}
              >
                <span style={{ fontSize: 16 }}>{btn.emoji}</span>
                <span style={{ fontSize: 13, color: "#0f172a" }}>{btn.label}</span>
              </button>
            ))}
          </div>

          <p style={{ color: "#94a3b8", fontSize: 12, textAlign: "center", marginTop: 16 }}>
            Zoomish is protected by reCAPTCHA and the Privacy Policy and Terms of Service apply.
          </p>
        </div>
      </main>
    </div>
  );
}
