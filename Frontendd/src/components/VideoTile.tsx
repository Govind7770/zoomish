import { useEffect, useRef } from "react";

export default function VideoTile({ stream, label }: { stream?: MediaStream; label: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => { if (ref.current && stream) ref.current.srcObject = stream; }, [stream]);
  return (
    <div className="tile card">
      <video ref={ref} autoPlay playsInline muted />
      <div className="label">{label}</div>
    </div>
  );
}
