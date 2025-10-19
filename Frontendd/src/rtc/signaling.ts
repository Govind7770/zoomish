// src/rtc/signaling.ts
import { io, Socket } from "socket.io-client";

export type SignalClient = Socket;

// Backward-compatible signature: accepts 1 or 3 args.
// roomId/name are optional and ignored here; components emit "join" themselves.
export function connectSignaling(baseUrl: string, _roomId?: string, _name?: string): SignalClient {
  return io(baseUrl, {
    transports: ["websocket"],
    withCredentials: true
  });
}
