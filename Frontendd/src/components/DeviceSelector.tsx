import { useEffect, useState } from "react";

export default function DeviceSelector({ onChange }: { onChange: (ids: { audio?: string; video?: string }) => void }) {
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [audio, setAudio] = useState<string | undefined>();
  const [video, setVideo] = useState<string | undefined>();

  useEffect(() => { navigator.mediaDevices.enumerateDevices().then(setDevices); }, []);
  useEffect(() => { onChange({ audio, video }); }, [audio, video]);

  const audios = devices.filter(d => d.kind === "audioinput");
  const videos = devices.filter(d => d.kind === "videoinput");

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 8 }}>
      <select onChange={e => setAudio(e.target.value)} value={audio ?? ""}>
        <option value="">Default Mic</option>
        {audios.map(d => <option key={d.deviceId} value={d.deviceId}>{d.label || d.deviceId}</option>)}
      </select>
      <select onChange={e => setVideo(e.target.value)} value={video ?? ""}>
        <option value="">Default Camera</option>
        {videos.map(d => <option key={d.deviceId} value={d.deviceId}>{d.label || d.deviceId}</option>)}
      </select>
    </div>
  );
}
