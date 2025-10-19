import { Mic, MicOff, Video, VideoOff, MonitorUp, Circle, Square, PhoneOff } from "lucide-react";

type Props = {
  muted: boolean; camera: boolean; recording: boolean;
  onToggleMic: () => void; onToggleCam: () => void; onScreenShare: () => void; onRecord: () => void; onLeave: () => void;
};
export default function ControlsBar({ muted, camera, recording, onToggleMic, onToggleCam, onScreenShare, onRecord, onLeave }: Props) {
  return (
    <div className="controls">
      <button className="btn" onClick={onToggleMic}>{muted ? <MicOff size={18} /> : <Mic size={18} />} {muted ? "Unmute" : "Mute"}</button>
      <button className="btn" onClick={onToggleCam}>{camera ? <Video size={18} /> : <VideoOff size={18} />} {camera ? "Stop" : "Start"}</button>
      <button className="btn" onClick={onScreenShare}><MonitorUp size={18} /> Share</button>
      <button className="btn primary" onClick={onRecord}>{recording ? <Square size={16} /> : <Circle size={16} />} {recording ? "Stop Rec" : "Record"}</button>
      <button className="btn danger" onClick={onLeave}><PhoneOff size={18} /> Leave</button>
    </div>
  );
}
