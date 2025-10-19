// src/rtc/recording.ts
import { newId } from "../utils/id";

let recorder: MediaRecorder | null = null;
let recordedChunks: Blob[] = [];

export function startLocalRecording(stream: MediaStream, meta: any = {}) {
  if (recorder) {
    console.warn("Recording already in progress");
    return;
  }

  recordedChunks = [];
  recorder = new MediaRecorder(stream, { mimeType: "video/webm; codecs=vp9,opus" });

  recorder.ondataavailable = (e) => {
    if (e.data && e.data.size > 0) recordedChunks.push(e.data);
  };

  recorder.onstop = async () => {
    const blob = new Blob(recordedChunks, { type: "video/webm" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `recording-${meta.roomId || newId()}.webm`;
    a.click();

    try {
      const formData = new FormData();
      formData.append("file", blob, `recording-${Date.now()}.webm`);
      formData.append("roomId", meta.roomId || "");
      await fetch(`${import.meta.env.VITE_API_BASE}/upload`, {
        method: "POST",
        body: formData,
      });
      console.log("Recording uploaded successfully");
    } catch (err) {
      console.warn("Upload failed (maybe no endpoint):", err);
    }

    recorder = null;
    recordedChunks = [];
  };

  recorder.start(500);
  console.log("🎥 Recording started");
}

export function stopLocalRecording() {
  if (!recorder) return;
  recorder.stop();
  console.log("🛑 Recording stopped");
}
