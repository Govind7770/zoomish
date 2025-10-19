import VideoTile from "./VideoTile";

export default function LayoutGrid({ selfLabel, selfStream, peers }: { selfLabel: string; selfStream?: MediaStream; peers: { id: string; name?: string; stream?: MediaStream }[] }) {
  return (
    <div className="stage">
      <VideoTile stream={selfStream} label={selfLabel} />
      {peers.map(p => (
        <VideoTile key={p.id} stream={p.stream} label={p.name || p.id} />
      ))}
    </div>
  );
}
