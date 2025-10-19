export type PeerApi = {
  pc: RTCPeerConnection;
  handleOffer: (sdp: RTCSessionDescriptionInit) => Promise<void>;
  handleAnswer: (sdp: RTCSessionDescriptionInit) => Promise<void>;
  handleIce: (candidate: RTCIceCandidateInit) => Promise<void>;
};

export async function createPeer(
  isInitiator: boolean,
  remoteId: string,
  localStream: MediaStream,
  onRemoteStream: (s: MediaStream) => void,
  onSignal: (msg: any) => void
): Promise<PeerApi> {
  const pc = new RTCPeerConnection({
    iceServers: [{ urls: ["stun:stun.l.google.com:19302"] }]
  });

  // Attach local media
  localStream.getTracks().forEach(t => pc.addTrack(t, localStream));

  // Receive remote media
  pc.ontrack = (e) => {
    const [remoteStream] = e.streams;
    if (remoteStream) onRemoteStream(remoteStream);
  };

  // Send ICE to remote via signaling
  pc.onicecandidate = (e) => {
    if (e.candidate) onSignal({ type: "ice", to: remoteId, candidate: e.candidate });
  };

  // Create offer if initiator
  if (isInitiator) {
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    onSignal({ type: "offer", to: remoteId, sdp: offer });
  }

  return {
    pc,
    async handleOffer(sdp) {
      await pc.setRemoteDescription(new RTCSessionDescription(sdp));
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      onSignal({ type: "answer", to: remoteId, sdp: answer });
    },
    async handleAnswer(sdp) {
      await pc.setRemoteDescription(new RTCSessionDescription(sdp));
    },
    async handleIce(candidate) {
      await pc.addIceCandidate(new RTCIceCandidate(candidate));
    }
  };
}
