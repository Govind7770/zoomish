import { create } from "zustand";

export type ChatMsg = { id: string; from: string; text: string; at: number };

type ChatState = {
  items: ChatMsg[];
  add: (m: ChatMsg) => void;
  clear: () => void;
};

export const useChat = create<ChatState>((set) => ({
  items: [],
  add: (m) => set((s) => ({ items: [...s.items, m] })), // ✅ immutable add
  clear: () => set({ items: [] })
}));
