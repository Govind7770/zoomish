export default function TimerSyncIndicator({ skewMs }: { skewMs: number }) {
  return <div>Clock skew: {Math.round(skewMs)} ms</div>;
}
