import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

export type PeerEntry = {
  id: string;
  stream?: MediaStream;
  name?: string;
  muted?: boolean;
  camera?: boolean;
  screenshare?: boolean;
};

type MeetingState = {
  roomId: string | null;
  selfId: string | null;
  name: string;
  peers: Record<string, PeerEntry>;
  setRoom: (roomId: string, selfId: string) => void;
  setName: (n: string) => void;
  addPeer: (id: string, entry?: Partial<PeerEntry>) => void;
  removePeer: (id: string) => void;
  updatePeer: (id: string, patch: Partial<PeerEntry>) => void;
  reset: () => void;
};

export const useMeeting = create<MeetingState>()(
  immer((set, get) => ({
    roomId: null,
    selfId: null,
    name: "",
    peers: {},
    setRoom: (roomId, selfId) => set(s => { s.roomId = roomId; s.selfId = selfId; }),
    setName: (n) => set(s => { s.name = n; }),
    addPeer: (id, entry = {}) => set(s => { if (!s.peers[id]) s.peers[id] = { id, ...entry }; }),
    removePeer: (id) => set(s => { delete s.peers[id]; }),
    updatePeer: (id, patch) => set(s => { s.peers[id] = { ...(s.peers[id] || { id }), ...patch }; }),
    reset: () => set(() => ({ roomId: null, selfId: null, name: "", peers: {} }))
  }))
);
