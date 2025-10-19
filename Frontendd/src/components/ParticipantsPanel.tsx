export default function ParticipantsPanel({ peers }: { peers: { id: string; name?: string }[] }) {
  const count = peers.length;
  return (
    <div>
      <h3>Participants ({count})</h3>
      {peers.map(p => (
        <div key={p.id} style={{ padding: "6px 0" }}>{p.name || p.id}</div>
      ))}
    </div>
  );
}
