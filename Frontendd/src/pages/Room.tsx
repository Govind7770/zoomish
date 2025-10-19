// src/pages/Room.tsx
import "../styles/room.css";
import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import LayoutGrid from "../components/LayoutGrid";
import ControlsBar from "../components/ControlsBar";
import ChatPanel from "../components/ChatPanel";
import ParticipantsPanel from "../components/ParticipantsPanel";
import TimerSyncIndicator from "../components/TimerSyncIndicator";
import { useMeeting } from "../store/meetingStore";
import { useChat } from "../store/chatStore";
import { connectSignaling } from "../rtc/signaling";
import { createPeer } from "../rtc/webrtc";
import { getMedia } from "../rtc/devices";
import { startLocalRecording, stopLocalRecording } from "../rtc/recording";
import { mountUploader } from "../rtc/uploader";
import { getScreen } from "../rtc/screenshare";
import { setTrackEnabled } from "../utils/media";
import { newId } from "../utils/id";
import Whiteboard from "../components/Whiteboard";
type PeerObj = Awaited<ReturnType<typeof createPeer>>;

export default function Room() {
  const { roomId: roomParam } = useParams();
  const nav = useNavigate();

  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [muted, setMuted] = useState(false);
  const [camera, setCamera] = useState(true);
  const [recording, setRecording] = useState(false);
  const [skew, setSkew] = useState(0);

  const peersRef = useRef<Record<string, PeerObj>>({});
  const socketRef = useRef<any>(null);
  const sendChatRef = useRef<((text: string) => void) | null>(null);

  const meeting = useMeeting();
  const chat = useChat();

  const handlersBound = useRef(false);
  const joinedRef = useRef(false);

  useEffect(() => {
    const name = (sessionStorage.getItem("name") || "Guest").toString();
    const roomId = (roomParam || sessionStorage.getItem("roomId") || "demo").toString();
    const prefs = JSON.parse(sessionStorage.getItem("prefs") || "{}");

    mountUploader(import.meta.env.VITE_API_BASE);
    let cleanup: (() => void) | null = null;

    getMedia(prefs).then(async (stream) => {
      setLocalStream(stream);

      const base = import.meta.env.VITE_SIGNALING_URL || "http://localhost:3001";
      const socket = connectSignaling(base);
      socketRef.current = socket;

      if (!handlersBound.current) {
        handlersBound.current = true;

        socket.on("joined", async ({ selfId, peers }: { selfId: string; peers: string[] }) => {
          meeting.setRoom(roomId, selfId);
          meeting.setName(name);

          for (const remoteId of peers) {
            const p = await createPeer(
              true,
              remoteId,
              stream,
              (s) => onRemote(remoteId, s),
              (msg) => socket.emit("signal", msg)
            );
            peersRef.current[remoteId] = p;
            if (!meeting.peers[remoteId]) meeting.addPeer(remoteId);
          }
        });

        socket.on("signal", async (msg: any) => {
          const { type, from, name: remoteName } = msg || {};
          if (!type || !from) return;

          if (type === "peer-join") {
            if (!meeting.peers[from]) meeting.addPeer(from, { name: remoteName });
            return;
          }

          let p = peersRef.current[from];
          if ((!p || p.pc.connectionState === "closed") && localStream) {
            p = await createPeer(
              false,
              from,
              localStream,
              (s) => onRemote(from, s),
              (m) => socket.emit("signal", m)
            );
            peersRef.current[from] = p;
            if (!meeting.peers[from]) meeting.addPeer(from, { name: remoteName });
          }

          if (type === "offer") await p.handleOffer(msg.sdp);
          else if (type === "answer") await p.handleAnswer(msg.sdp);
          else if (type === "candidate") await p.handleIce(msg.candidate);
        });

        socket.on("left", ({ peerId }: { peerId: string }) => {
          const p = peersRef.current[peerId];
          if (p) {
            try {
              p.pc.close();
            } catch {}
            delete peersRef.current[peerId];
          }
          meeting.removePeer(peerId);
        });

        socket.on("chat", ({ from, text, at }) => {
          chat.add({ id: newId(), from, text, at });
        });

        socket.on("pong-time", (serverTime: number, t0: number) => {
          const t3 = Date.now();
          const rtt = t3 - t0;
          const offset = serverTime + rtt / 2 - t3;
          setSkew(offset);
        });
      }

      if (!joinedRef.current) {
        joinedRef.current = true;
        socket.emit("join", { roomId, name });
      }

      sendChatRef.current = (text: string) => {
        const msg = (text || "").trim();
        if (!msg) return;
        socket.emit("chat", { text: msg, at: Date.now() });
      };

      const pingIv = setInterval(() => {
        const t0 = Date.now();
        socket.emit("ping-time", t0);
      }, 5000);

      cleanup = () => {
        clearInterval(pingIv);
        try {
          socket.close();
        } catch {}
        handlersBound.current = false;
        joinedRef.current = false;
      };
    });

    function onRemote(id: string, s: MediaStream) {
      meeting.updatePeer(id, { stream: s });
    }

    return () => {
      Object.values(peersRef.current).forEach((p) => p.pc.close());
      peersRef.current = {};
      localStream?.getTracks().forEach((t) => t.stop());
      if (cleanup) cleanup();
    };
  }, [roomParam]);

  function toggleMic() {
    setMuted((v) => {
      const next = !v;
      setTrackEnabled(localStream, "audio", !next);
      return next;
    });
  }

  function toggleCam() {
    setCamera((v) => {
      const next = !v;
      setTrackEnabled(localStream, "video", next);
      return next;
    });
  }

  async function shareScreen() {
    try {
      const ds = await getScreen();
      const screenTrack = ds.getVideoTracks()[0];

      Object.values(peersRef.current).forEach((p) => {
        const sender = p.pc.getSenders().find((s) => s.track?.kind === "video");
        if (sender) sender.replaceTrack(screenTrack);
      });

      const newStream = new MediaStream([
        ...(localStream?.getAudioTracks() || []),
        screenTrack,
      ]);
      setLocalStream(newStream);

      screenTrack.onended = () => {
        if (!localStream) return;
        const camTrack = localStream.getVideoTracks()[0];
        Object.values(peersRef.current).forEach((p) => {
          const sender = p.pc.getSenders().find((s) => s.track?.kind === "video");
          if (sender) sender.replaceTrack(camTrack);
        });
        setLocalStream(localStream);
      };
    } catch (err) {
      console.error("Screen share error:", err);
    }
  }

  function startStopRec() {
    if (!localStream) return;
    if (!recording) {
      const sessionId = newId();
      const userId = sessionStorage.getItem("userId") || newId();
      sessionStorage.setItem("sessionId", sessionId);
      sessionStorage.setItem("userId", userId);
      startLocalRecording(localStream, { roomId: useMeeting.getState().roomId!, userId, sessionId });
      setRecording(true);
    } else {
      stopLocalRecording();
      setRecording(false);
    }
  }

  function leave() {
    Object.values(peersRef.current).forEach((p) => p.pc.close());
    localStream?.getTracks().forEach((t) => t.stop());
    socketRef.current?.close?.();
    sendChatRef.current = null;
    nav("/");
  }

  const st = useMeeting.getState();
  const peerList = Object.values(st.peers).filter((p) => p.id !== st.selfId);

  return (
    <div className="room">
      <div className="app-bg" />
      <div className="topbar">
        <div className="brand">
          <svg width="22" height="22" viewBox="0 0 24 24">
            <defs>
              <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#6366f1" />
                <stop offset="1" stopColor="#38bdf8" />
              </linearGradient>
            </defs>
            <circle cx="12" cy="12" r="10" fill="url(#g)" />
          </svg>
          <span>Zoomish Studio</span>
          <span className="badge-live">LIVE</span>
        </div>
        <div className="indicator">Secure | {new Date().toLocaleTimeString()}</div>
      </div>

      <div className="layout">
        <div style={{ flex: 1, minWidth: 0 }}>
          <LayoutGrid
            selfLabel={st.name || "Me"}
            selfStream={localStream || undefined}
            peers={peerList}
          />
        </div>
        <div className="sidebar">
          <div className="panel card">
            <ParticipantsPanel peers={peerList} />
            <div style={{ height: 8 }} />
            <TimerSyncIndicator skewMs={skew} />
          </div>
          <ChatPanel send={(text) => sendChatRef.current?.(text)} />
        </div>
      </div>

      <ControlsBar
        muted={!!muted}
        camera={!!camera}
        recording={!!recording}
        onToggleMic={toggleMic}
        onToggleCam={toggleCam}
        onScreenShare={shareScreen}
        onRecord={startStopRec}
        onLeave={leave}
      />
    </div>
  );
}
