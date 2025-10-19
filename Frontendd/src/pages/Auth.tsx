import { useState } from "react";
export default function Auth({ onLogin }: { onLogin: (user: { name: string }) => void }) {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (name.trim()) onLogin({ name });
  }
  return (
    <div style={{
      display: "grid", placeItems: "center", minHeight: "100dvh",
      background: "linear-gradient(135deg, #6366f1 0%, #38bdf8 100%)"
    }}>
      <form style={{
        background: "#181c2fda", borderRadius: 18, boxShadow: "0 16px 56px #0008",
        padding: 40, minWidth: 340, width: "90%", maxWidth: 400, display: "grid", gap: 24
      }} onSubmit={submit}>
        <h1 style={{ textAlign: "center", margin: 0 }}>{isLogin ? "Sign In" : "Sign Up"}</h1>
        <input type="text" placeholder="Enter name" value={name}
          onChange={e => setName(e.target.value)} className="field" required />
        <button className="btn cta" style={{ width: "100%" }}>
          {isLogin ? "Sign In" : "Sign Up"}
        </button>
        <div style={{ textAlign: "center", color: "#93c5fd", fontSize: 13 }}>
          {isLogin ? "Don't have an account?" : "Already have an account?"}
          <button
            style={{ border: "none", background: "transparent", color: "#3b82f6", marginLeft: 8, cursor: "pointer" }}
            type="button" onClick={() => setIsLogin(v => !v)}
          >
            {isLogin ? "Sign Up" : "Sign In"}
          </button>
        </div>
      </form>
    </div>
  );
}
