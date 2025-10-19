import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const nav = useNavigate();
  const [showSchedule, setShowSchedule] = useState(false);
  const [schedRoom, setSchedRoom] = useState("");
  const [schedTime, setSchedTime] = useState("");

  function genRoomId() {
    return Math.random().toString(36).slice(2, 8).toUpperCase();
  }

  function startHost() {
    const id = genRoomId();
    nav(`/room/${id}`);
  }

  function joinRoom() {
    const id = prompt("Enter Room ID to join");
    if (!id) return;
    nav(`/room/${id.trim()}`);
  }

  function scheduleMeeting(e: React.FormEvent) {
    e.preventDefault();
    const id = (schedRoom || genRoomId()).toUpperCase();
    const schedules = JSON.parse(localStorage.getItem("schedules") || "[]");
    schedules.push({ id, at: schedTime || "Now", who: sessionStorage.getItem("name") || "Me" });
    localStorage.setItem("schedules", JSON.stringify(schedules));
    setShowSchedule(false);
    alert(`Meeting scheduled: ${id} at ${schedTime || "Now"}`);
    nav(`/room/${id}`);
  }

  return (
    <div style={{ minHeight: "100dvh", background: "#f7f8fa", color: "#0f172a" }}>
      {/* Header */}
      <header style={{
        position: "sticky", top: 0, zIndex: 20,
        height: 64, display: "flex", alignItems: "center", padding: "0 20px",
        borderBottom: "1px solid #e6eaf2", background: "#fff"
      }}>
        <div style={{ fontSize: 26, color: "#0b5cff", fontWeight: 800 }}>zoomish</div>
        <nav style={{ marginLeft: 24, display: "flex", gap: 18, color: "#475569", fontSize: 14 }}>
          <a href="#" style={{ color: "inherit", textDecoration: "none" }}>Products</a>
          <a href="#" style={{ color: "inherit", textDecoration: "none" }}>Solutions</a>
          <a href="#" style={{ color: "inherit", textDecoration: "none" }}>Resources</a>
          <a href="#" style={{ color: "inherit", textDecoration: "none" }}>Plans & Pricing</a>
        </nav>
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 12 }}>
          <button
            onClick={() => nav("/lobby")}
            style={{
              height: 36, padding: "0 14px", borderRadius: 8,
              border: "none", background: "#0b5cff", color: "#fff", cursor: "pointer", fontWeight: 700
            }}>
            Start meeting
          </button>
        </div>
      </header>

      <div style={{ display: "grid", gridTemplateColumns: "260px 1fr", gap: 18, maxWidth: 1200, margin: "18px auto", padding: "0 16px" }}>
        {/* Sidebar */}
        <aside style={{ background: "#fff", border: "1px solid #e6eaf2", borderRadius: 12, padding: 10, height: "fit-content" }}>
          <Sidebar />
        </aside>

        {/* Main content */}
        <main style={{ display: "grid", gap: 18 }}>
          {/* Profile strip */}
          <section style={{
            background: "#fff", border: "1px solid #e6eaf2", borderRadius: 12, padding: 16,
            display: "flex", alignItems: "center", justifyContent: "space-between"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{
                width: 54, height: 54, borderRadius: 12, background: "#eef2ff",
                display: "grid", placeItems: "center", color: "#6366f1", fontWeight: 800
              }}>
                {(sessionStorage.getItem("name") || "Z")[0]?.toUpperCase()}
              </div>
              <div>
                <div style={{ fontWeight: 700 }}>
                  {sessionStorage.getItem("name") || "Zoomish User"}
                </div>
                <div style={{ fontSize: 13, color: "#64748b" }}>Plan: Workplace Basic</div>
              </div>
            </div>
            <button
              onClick={() => alert("Plan management placeholder")}
              style={{ height: 34, padding: "0 12px", borderRadius: 8, border: "1px solid #d0d7e3", background: "#fff", cursor: "pointer" }}>
              Manage Plan
            </button>
          </section>

          {/* Promo and right card */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 18 }}>
            {/* Promo */}
            <section style={{
              background: "#fff", border: "1px solid #e6eaf2", borderRadius: 12, padding: 0, overflow: "hidden"
            }}>
              <div style={{
                display: "grid",
                gridTemplateColumns: "1fr 320px",
                alignItems: "center"
              }}>
                <div style={{ padding: 22 }}>
                  <h2 style={{ margin: "0 0 8px 0", fontSize: 24 }}>Limited time offer!</h2>
                  <p style={{ margin: "0 0 16px 0", color: "#475569" }}>
                    Take an additional 15% off when upgrading to Zoomish Workplace Pro annual.
                  </p>
                  <button style={{
                    height: 40, padding: "0 16px", borderRadius: 999, border: "none",
                    background: "#0b5cff", color: "#fff", fontWeight: 700, cursor: "pointer"
                  }}>Get Offer</button>
                </div>
                <div style={{ background: "linear-gradient(135deg,#eff6ff,#e0f2fe)" , height: "100%", minHeight: 140 }} />
              </div>
            </section>

            {/* Download + Quick actions */}
            <section style={{ display: "grid", gap: 18 }}>
              <div style={{
                background: "#fff", border: "1px solid #e6eaf2", borderRadius: 12, padding: 16
              }}>
                <h3 style={{ marginTop: 0 }}>Download Zoom</h3>
                <p style={{ color: "#475569", marginTop: 6 }}>
                  Start, join and schedule meetings directly from the Zoomish Desktop Client.
                </p>
                <button style={{
                  height: 36, padding: "0 14px", borderRadius: 8,
                  border: "none", background: "#0b5cff", color: "#fff", cursor: "pointer", fontWeight: 700
                }}>Download Zoom</button>
                <div style={{ marginTop: 8, fontSize: 12, color: "#64748b", cursor: "pointer" }}>
                  Do not show again
                </div>
              </div>

              {/* Quick action buttons */}
              <div style={{
                background: "#fff", border: "1px solid #e6eaf2", borderRadius: 12, padding: 16
              }}>
                <div style={{ display: "flex", gap: 12 }}>
                  <Pill icon="🗓" label="Schedule" onClick={() => setShowSchedule(true)} />
                  <Pill icon="🔗" label="Join" onClick={joinRoom} />
                  <Pill icon="🎥" label="Host" onClick={startHost} />
                  <Pill icon="🧑‍🏫" label="Whiteboard" onClick={() => nav(`/whiteboard/${genRoomId()}`)} />
                </div>
                <div style={{ marginTop: 12, fontSize: 12, color: "#64748b" }}>
                  Personal Meeting ID
                </div>
                <div style={{ fontWeight: 700, letterSpacing: 1 }}>878 898 8948</div>
              </div>
            </section>
          </div>

          {/* Activity section */}
          <section style={{
            background: "#fff", border: "1px solid #e6eaf2", borderRadius: 12, padding: 16
          }}>
            <h3 style={{ marginTop: 0 }}>Your Activity</h3>
            <div style={{ display: "flex", gap: 10 }}>
              <button style={{
                height: 32, padding: "0 12px", borderRadius: 8, border: "1px solid #d0d7e3", background: "#fff", cursor: "pointer"
              }}>+ New</button>
              <button style={{
                height: 32, padding: "0 12px", borderRadius: 8, border: "1px solid #d0d7e3", background: "#fff", cursor: "pointer"
              }}>View More</button>
            </div>
            <ul style={{ marginTop: 12, paddingLeft: 18, color: "#64748b", fontSize: 14 }}>
              {(JSON.parse(localStorage.getItem("schedules") || "[]") as any[]).slice(-5).reverse().map((s, i) => (
                <li key={i}>Scheduled {s.id} at {s.at} by {s.who}</li>
              ))}
            </ul>
          </section>
        </main>
      </div>

      {/* Footer */}
      <footer style={{ maxWidth: 1200, margin: "24px auto", padding: "0 16px", color: "#64748b", fontSize: 13 }}>
        <div>© {new Date().getFullYear()} Zoomish</div>
      </footer>

      {/* Schedule modal */}
      {showSchedule && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,.35)", display: "grid", placeItems: "center"
        }}>
          <form onSubmit={scheduleMeeting} style={{
            width: "min(420px,92vw)", background: "#fff", borderRadius: 12, padding: 18,
            border: "1px solid #e6eaf2", boxShadow: "0 18px 44px rgba(0,0,0,.18)"
          }}>
            <h3 style={{ marginTop: 0 }}>Schedule a meeting</h3>
            <div style={{ display: "grid", gap: 10 }}>
              <label style={{ fontSize: 13, color: "#475569" }}>Room ID (optional)</label>
              <input
                value={schedRoom}
                onChange={e => setSchedRoom(e.target.value)}
                placeholder="Leave blank for auto ID"
                style={{ height: 40, borderRadius: 8, border: "1px solid #cbd5e1", padding: "0 10px" }}
              />
              <label style={{ fontSize: 13, color: "#475569" }}>Time</label>
              <input
                type="datetime-local"
                value={schedTime}
                onChange={e => setSchedTime(e.target.value)}
                style={{ height: 40, borderRadius: 8, border: "1px solid #cbd5e1", padding: "0 10px" }}
              />
              <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 6 }}>
                <button type="button" onClick={() => setShowSchedule(false)} style={{
                  height: 36, padding: "0 14px", borderRadius: 8, border: "1px solid #d0d7e3", background: "#fff", cursor: "pointer"
                }}>Cancel</button>
                <button type="submit" style={{
                  height: 36, padding: "0 14px", borderRadius: 8, border: "none", background: "#0b5cff", color: "#fff", cursor: "pointer", fontWeight: 700
                }}>Schedule</button>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

function Sidebar() {
  const navigate = useNavigate();
  const Item = ({ label, to }: { label: string; to?: string }) => (
    <div
      onClick={() => to && navigate(to)}
      style={{ padding: "10px 12px", borderRadius: 8, color: "#0f172a", cursor: "pointer" }}
    >
      {label}
    </div>
  );
  return (
    <div style={{ display: "grid", gap: 4 }}>
      <Item label="Home" to="/home" />
      <div style={{ fontSize: 12, color: "#94a3b8", padding: "6px 12px" }}>My Products</div>
      <Item label="Meetings" />
      <Item label="Recordings" />
      <Item label="Hub" />
      <Item label="Whiteboards" to="/whiteboard" />
      <Item label="Notes" />
      <Item label="Clips" />
      <Item label="Docs" />
      <Item label="Tasks" />
      <div style={{ fontSize: 12, color: "#94a3b8", padding: "6px 12px" }}>Account</div>
      <Item label="My Account" />
      <Item label="Admin" />
      <Item label="Support" />
    </div>
  );
}

function Pill({ icon, label, onClick }: { icon: string; label: string; onClick: () => void }) {
  return (
    <button onClick={onClick} style={{
      display: "grid", placeItems: "center", width: 64, height: 64, borderRadius: 16,
      border: "1px solid #d0d7e3", background: "#fff", cursor: "pointer", fontWeight: 700
    }}>
      <div style={{ fontSize: 20 }}>{icon}</div>
      <div style={{ fontSize: 12, color: "#334155" }}>{label}</div>
    </button>
  );
}
