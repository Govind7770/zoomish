import axios from "axios";

export function mountUploader(apiBase: string) {
  let seq = 0;
  async function uploadChunk(buf: ArrayBuffer, meta: { roomId: string; userId: string; sessionId: string }) {
    const form = new FormData();
    form.append("roomId", meta.roomId);
    form.append("userId", meta.userId);
    form.append("sessionId", meta.sessionId);
    form.append("seq", String(seq++));
    form.append("ts", String(Date.now()));
    form.append("chunk", new Blob([buf], { type: "application/octet-stream" }), `chunk-${seq}.bin`);

    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        await axios.post(`${apiBase}/upload/chunk`, form, { timeout: 20000 });
        return;
      } catch (e) {
        if (attempt === 3) throw e;
        await new Promise(r => setTimeout(r, 1000 * attempt));
      }
    }
  }
  (window as any).uploadChunk = uploadChunk;
}
