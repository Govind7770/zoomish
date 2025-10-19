import { useState } from "react";
import { useNavigate } from "react-router-dom";

function MicSelector({ value, onChange }: { value?: string; onChange: (id?: string) => void }) {
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  useState(() => { navigator.mediaDevices.enumerateDevices().then(setDevices); });
  const audios = devices.filter(d => d.kind === "audioinput");
  return (
    <select className="field" value={value ?? ""} onChange={e => onChange(e.target.value || undefined)}>
      <option value="">Default Mic</option>
      {audios.map(d => <option key={d.deviceId} value={d.deviceId}>{d.label || d.deviceId}</option>)}
    </select>
  );
}

function CamSelector({ value, onChange }: { value?: string; onChange: (id?: string) => void }) {
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  useState(() => { navigator.mediaDevices.enumerateDevices().then(setDevices); });
  const videos = devices.filter(d => d.kind === "videoinput");
  return (
    <select className="field" value={value ?? ""} onChange={e => onChange(e.target.value || undefined)}>
      <option value="">Default Camera</option>
      {videos.map(d => <option key={d.deviceId} value={d.deviceId}>{d.label || d.deviceId}</option>)}
    </select>
  );
}

export default function Lobby() {
  const nav = useNavigate();
  const [name, setName] = useState("");
  const [roomId, setRoomId] = useState("");
  const [audio, setAudio] = useState<string | undefined>();
  const [video, setVideo] = useState<string | undefined>();

  const valid = name.trim().length > 0 && roomId.trim().length > 0;

  return (
    <div className="lobby-wrap">
      <div className="app-bg" />
      <div className="card lobby-card">
        <div className="lobby-head">
          <h1>Join meeting</h1>
          <div className="accent-bar" />
        </div>

        <div className="form-group">
          <label>Display name</label>
          <input className="field" placeholder="e.g. Govind Mantri" value={name} onChange={(e) => setName(e.target.value)} />
          <small>Shown to other participants</small>
        </div>

        <div className="form-group">
          <label>Room ID</label>
          <input className="field" placeholder="e.g. team-sync-101" value={roomId} onChange={(e) => setRoomId(e.target.value)} />
          <small>Use the same ID to join with others</small>
        </div>

        <div className="device-grid">
          <div className="form-group">
            <label>Microphone</label>
            <MicSelector value={audio} onChange={setAudio} />
          </div>
          <div className="form-group">
            <label>Camera</label>
            <CamSelector value={video} onChange={setVideo} />
          </div>
        </div>

        <button
          className="btn cta"
          onClick={() => {
            sessionStorage.setItem("name", name.trim());
            sessionStorage.setItem("roomId", roomId.trim());
            sessionStorage.setItem("prefs", JSON.stringify({ audio, video }));
            nav(`/room/${encodeURIComponent(roomId.trim())}`);
          }}
          disabled={!valid}
        >
          Continue
        </button>
      </div>
    </div>
  );
}
