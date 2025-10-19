export async function getScreen() {
  // @ts-ignore
  return await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true });
}
