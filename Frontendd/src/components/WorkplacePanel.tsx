const workspaceOptions = [
  { label: "Meetings", icon: "🎥" }, { label: "Team Chat", icon: "💬" },
  { label: "Phone", icon: "📞" }, { label: "Mail & Calendar", icon: "📅" },
  { label: "Scheduler", icon: "⏰" }, { label: "Docs", icon: "📄" },
  { label: "Whiteboard", icon: "📝" }, { label: "Clips", icon: "🎬" },
  { label: "Tasks", icon: "📋" },
];
export default function WorkplacePanel() {
  return (
    <div className="workplace-panel card">
      <h2 style={{ marginBottom: 18 }}>Zoom Workplace</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20 }}>
        {workspaceOptions.map(opt => (
          <div key={opt.label} style={{
            display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
            background: "#181c2f", borderRadius: 10, padding: 18, cursor: "pointer"
          }}>
            <span style={{ fontSize: 28 }}>{opt.icon}</span>
            <span style={{ fontSize: 14, color: "#93c5fd" }}>{opt.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
