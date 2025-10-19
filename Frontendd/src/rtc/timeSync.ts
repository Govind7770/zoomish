export function startPingSync(socket: any, onSkew: (ms: number) => void) {
  let offset = 0;
  socket.on("pong-time", (serverTime: number, t0: number) => {
    const t3 = Date.now();
    const rtt = t3 - t0;
    const oneWay = rtt / 2;
    offset = serverTime + oneWay - t3;
    onSkew(offset);
  });
  const interval = setInterval(() => {
    const t0 = Date.now();
    socket.emit("ping-time", t0);
  }, 5000);
  return () => clearInterval(interval);
}
