export async function getMedia(prefs?: { audio?: string; video?: string }) {
  const constraints: MediaStreamConstraints = {
    audio: prefs?.audio ? { deviceId: { exact: prefs.audio } } : true,
    video: prefs?.video ? { deviceId: { exact: prefs.video }, width: 1280, height: 720 } : { width: 1280, height: 720 }
  };
  return await navigator.mediaDevices.getUserMedia(constraints);
}
