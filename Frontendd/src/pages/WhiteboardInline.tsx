import { useEffect, useRef, useState } from "react";
import { connectSignaling } from "../rtc/signaling";

type Point = { x: number; y: number };
type Stroke = { id: string; points: Point[]; color: string; size: number; mode: "pen" | "highlighter" | "eraser"; user?: string; };

export default function WhiteboardInline({ roomId }: { roomId: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const socketRef = useRef<any>(null);
  const [mode, setMode] = useState<Stroke["mode"]>("pen");
  const [color, setColor] = useState("#0b5cff");
  const [size, setSize] = useState(4);
  const [isDrawing, setIsDrawing] = useState(false);
  const strokesRef = useRef<Stroke[]>([]);
  const undoneRef = useRef<Stroke[]>([]);
  const currentRef = useRef<Stroke | null>(null);
  const userName = (typeof window !== "undefined" && sessionStorage.getItem("name")) || "Guest";

  useEffect(() => {
    const socket = connectSignaling(import.meta.env.VITE_SIGNALING_URL, roomId, userName || "Guest");
    socketRef.current = socket;
    socket.on("whiteboard", (payload: any) => {
      if (payload?.type === "stroke") { strokesRef.current.push(payload.stroke as Stroke); renderAll(); }
      else if (payload?.type === "clear") { strokesRef.current = []; undoneRef.current = []; renderAll(); }
      else if (payload?.type === "undo") { const p = strokesRef.current.pop(); if (p) undoneRef.current.push(p); renderAll(); }
      else if (payload?.type === "redo") { const p = undoneRef.current.pop(); if (p) strokesRef.current.push(p); renderAll(); }
    });
    const onResize = () => fitCanvas();
    window.addEventListener("resize", onResize);
    fitCanvas();
    return () => { window.removeEventListener("resize", onResize); socket.close?.(); };
  }, [roomId]);

  useEffect(() => {
    if (!canvasRef.current) return;
    ctxRef.current = canvasRef.current.getContext("2d");
    renderAll();
  }, [canvasRef.current]);

  function fitCanvas() {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const parent = canvas.parentElement!;
    const rect = parent.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height - 56; // toolbar height
    renderAll();
  }

  function canvasPos(e: MouseEvent | TouchEvent): Point {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    if (e instanceof TouchEvent) {
      const t = e.touches[0] || e.changedTouches[0];
      return { x: t.clientX - rect.left, y: t.clientY - rect.top };
    }
    const m = e as MouseEvent;
    return { x: m.clientX - rect.left, y: m.clientY - rect.top };
  }

  function down(e: any) {
    e.preventDefault();
    setIsDrawing(true);
    undoneRef.current = [];
    const stroke: Stroke = { id: crypto.randomUUID(), points: [canvasPos(e)], color, size, mode, user: userName || "Guest" };
    currentRef.current = stroke;
    strokesRef.current.push(stroke);
    drawStroke(stroke);
  }
  function move(e: any) {
    if (!isDrawing || !currentRef.current) return;
    const p = canvasPos(e);
    const stroke = currentRef.current;
    const prev = stroke.points[stroke.points.length - 1];
    stroke.points.push(p);
    drawStrokeSegment(stroke, prev, p);
  }
  function up() {
    if (!isDrawing) return;
    setIsDrawing(false);
    const stroke = currentRef.current;
    currentRef.current = null;
    if (stroke) socketRef.current?.emit("whiteboard", { type: "stroke", stroke, roomId });
  }

  function drawStroke(stroke: Stroke) {
    const ctx = ctxRef.current!; if (!ctx) return;
    ctx.save();
    ctx.lineJoin = "round"; ctx.lineCap = "round";
    ctx.lineWidth = stroke.size;
    ctx.globalAlpha = stroke.mode === "highlighter" ? 0.35 : 1.0;
    if (stroke.mode === "eraser") { ctx.globalCompositeOperation = "destination-out"; ctx.strokeStyle = "rgba(0,0,0,1)"; }
    else { ctx.globalCompositeOperation = "source-over"; ctx.strokeStyle = stroke.color; }
    const pts = stroke.points;
    if (pts.length < 2) { ctx.beginPath(); ctx.arc(pts[0].x, pts[0].y, stroke.size/2, 0, Math.PI*2); if (stroke.mode === "eraser") ctx.globalCompositeOperation="destination-out"; ctx.fillStyle = stroke.color; ctx.fill(); ctx.restore(); return; }
    ctx.beginPath(); ctx.moveTo(pts[0].x, pts[0].y); for (let i=1;i<pts.length;i++) ctx.lineTo(pts[i].x, pts[i].y); ctx.stroke(); ctx.restore();
  }
  function drawStrokeSegment(stroke: Stroke, from: Point, to: Point) {
    const ctx = ctxRef.current!; if (!ctx) return; ctx.save();
    ctx.lineJoin="round"; ctx.lineCap="round"; ctx.lineWidth = stroke.size;
    ctx.globalAlpha = stroke.mode === "highlighter" ? 0.35 : 1.0;
    if (stroke.mode === "eraser") { ctx.globalCompositeOperation="destination-out"; ctx.strokeStyle="rgba(0,0,0,1)"; }
    else { ctx.globalCompositeOperation="source-over"; ctx.strokeStyle = stroke.color; }
    ctx.beginPath(); ctx.moveTo(from.x, from.y); ctx.lineTo(to.x, to.y); ctx.stroke(); ctx.restore();
  }
  function renderAll() {
    const c = canvasRef.current; const ctx = ctxRef.current; if (!c || !ctx) return;
    ctx.clearRect(0,0,c.width,c.height);
    for (const s of strokesRef.current) drawStroke(s);
  }

  function undo(){ const p = strokesRef.current.pop(); if (p) undoneRef.current.push(p); renderAll(); socketRef.current?.emit("whiteboard",{type:"undo",roomId}); }
  function redo(){ const p = undoneRef.current.pop(); if (p) strokesRef.current.push(p); renderAll(); socketRef.current?.emit("whiteboard",{type:"redo",roomId}); }
  function clearAll(){ strokesRef.current=[]; undoneRef.current=[]; renderAll(); socketRef.current?.emit("whiteboard",{type:"clear",roomId}); }

  useEffect(() => {
    const o = overlayRef.current; if (!o) return;
    const d=(e:any)=>down(e), m=(e:any)=>move(e), u=(e:any)=>up();
    o.addEventListener("mousedown", d); o.addEventListener("mousemove", m); window.addEventListener("mouseup", u);
    o.addEventListener("touchstart", d, { passive:false }); o.addEventListener("touchmove", m, { passive:false }); window.addEventListener("touchend", u);
    return () => { o.removeEventListener("mousedown", d); o.removeEventListener("mousemove", m); window.removeEventListener("mouseup", u);
      o.removeEventListener("touchstart", d as any); o.removeEventListener("touchmove", m as any); window.removeEventListener("touchend", u as any); };
  }, [roomId, color, size, mode]);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={{
        height: 56, display: "flex", alignItems: "center", gap: 8, padding: "0 10px",
        color: "#e6eaf2", borderBottom: "1px solid rgba(255,255,255,.08)"
      }}>
        <Tool label="Pen" active={mode === "pen"} onClick={() => setMode("pen")} />
        <Tool label="Highlighter" active={mode === "highlighter"} onClick={() => setMode("highlighter")} />
        <Tool label="Eraser" active={mode === "eraser"} onClick={() => setMode("eraser")} />
        <input type="color" value={color} onChange={e => setColor(e.target.value)} title="Color" />
        <input type="range" min={1} max={32} value={size} onChange={e => setSize(parseInt(e.target.value))} />
        <button onClick={undo} className="btn" style={{ padding: "6px 10px" }}>Undo</button>
        <button onClick={redo} className="btn" style={{ padding: "6px 10px" }}>Redo</button>
        <button onClick={clearAll} className="btn danger" style={{ padding: "6px 10px" }}>Clear</button>
      </div>
      <div style={{ position: "relative", flex: 1, minHeight: 0 }}>
        <canvas ref={canvasRef} style={{ width: "100%", height: "100%" }} />
        <div ref={overlayRef} style={{ position: "absolute", inset: 0, touchAction: "none", cursor: mode === "eraser" ? "cell" : "crosshair" }} />
      </div>
    </div>
  );
}

function Tool({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="btn"
      style={{
        padding: "6px 10px",
        border: active ? "1px solid #6aa8ff" : "1px solid rgba(255,255,255,.18)",
        background: active ? "rgba(42,95,220,.25)" : "transparent",
        color: "#e6eaf2",
        borderRadius: 8
      }}
    >
      {label}
    </button>
  );
}
