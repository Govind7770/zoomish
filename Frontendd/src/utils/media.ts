export function setTrackEnabled(stream: MediaStream | null, kind: "audio" | "video", enabled: boolean) {
  if (!stream) return;
  stream.getTracks().forEach(t => {
    if (t.kind === kind) t.enabled = enabled;
  });
}
