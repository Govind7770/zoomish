import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { connectSignaling } from "../rtc/signaling";

type Point = { x: number; y: number };
type Stroke = {
  id: string;
  points: Point[];
  color: string;
  size: number;
  mode: "pen" | "highlighter" | "eraser";
  user?: string;
};

export default function Whiteboard() {
  const { roomId: routeRoomId } = useParams();
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const socketRef = useRef<any>(null);
  const [roomId, setRoomId] = useState(routeRoomId || "");
  const [mode, setMode] = useState<Stroke["mode"]>("pen");
  const [color, setColor] = useState("#0b5cff");
  const [size, setSize] = useState(4);
  const [isDrawing, setIsDrawing] = useState(false);
  const strokesRef = useRef<Stroke[]>([]);
  const undoneRef = useRef<Stroke[]>([]);
  const currentRef = useRef<Stroke | null>(null);
  const userName = (typeof window !== "undefined" && sessionStorage.getItem("name")) || "Guest";

  useEffect(() => {
    if (!roomId) {
      const fromPrompt = prompt("Enter room ID for whiteboard", routeRoomId || "");
      if (!fromPrompt) {
        navigate("/home");
        return;
      }
      setRoomId(fromPrompt.trim());
      return;
    }
  }, [roomId]);

  useEffect(() => {
    if (!roomId) return;

    const name = userName;
    const socket = connectSignaling(import.meta.env.VITE_SIGNALING_URL, roomId, name);
    socketRef.current = socket;

    socket.on("joined", () => {
      // could request history from server if you store it there
    });

    socket.on("whiteboard", (payload: any) => {
      if (!payload) return;
      if (payload.type === "stroke") {
        strokesRef.current.push(payload.stroke as Stroke);
        renderAll();
      } else if (payload.type === "clear") {
        strokesRef.current = [];
        undoneRef.current = [];
        renderAll();
      } else if (payload.type === "undo") {
        const popped = strokesRef.current.pop();
        if (popped) undoneRef.current.push(popped);
        renderAll();
      } else if (payload.type === "redo") {
        const popped = undoneRef.current.pop();
        if (popped) strokesRef.current.push(popped);
        renderAll();
      }
    });

    const onResize = () => fitCanvas();
    window.addEventListener("resize", onResize);
    fitCanvas();

    return () => {
      window.removeEventListener("resize", onResize);
      socket.close?.();
    };
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
    // preserve content by redrawing all after resize
    const tmp = document.createElement("canvas");
    tmp.width = rect.width;
    tmp.height = rect.height;
    canvas.width = rect.width;
    canvas.height = rect.height;
    renderAll();
  }

  function canvasPos(e: MouseEvent | TouchEvent): Point {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    let cx = 0, cy = 0;
    if (e instanceof TouchEvent) {
      const t = e.touches[0] || e.changedTouches[0];
      cx = t.clientX - rect.left;
      cy = t.clientY - rect.top;
    } else {
      cx = (e as MouseEvent).clientX - rect.left;
      cy = (e as MouseEvent).clientY - rect.top;
    }
    return { x: cx, y: cy };
  }

  function down(e: any) {
    e.preventDefault();
    if (!canvasRef.current) return;
    setIsDrawing(true);
    undoneRef.current = [];

    const stroke: Stroke = {
      id: crypto.randomUUID(),
      points: [canvasPos(e)],
      color,
      size,
      mode,
      user: userName
    };
    currentRef.current = stroke;
    strokesRef.current.push(stroke);
    drawStroke(stroke, true);
  }

  function move(e: any) {
    if (!isDrawing || !currentRef.current) return;
    const p = canvasPos(e);
    const stroke = currentRef.current;
    stroke.points.push(p);
    drawStrokeSegment(stroke, stroke.points[stroke.points.length - 2], p);
  }

  function up(e: any) {
    if (!isDrawing) return;
    setIsDrawing(false);
    const stroke = currentRef.current;
    currentRef.current = null;
    if (stroke && socketRef.current) {
      socketRef.current.emit("whiteboard", { type: "stroke", stroke, roomId });
    }
  }

  function drawStroke(stroke: Stroke, fresh = false) {
    const ctx = ctxRef.current!;
    if (!ctx) return;
    ctx.save();
    const alpha = stroke.mode === "highlighter" ? 0.35 : 1.0;
    ctx.globalAlpha = alpha;
    if (stroke.mode === "eraser") {
      ctx.globalCompositeOperation = "destination-out";
      ctx.strokeStyle = "rgba(0,0,0,1)";
    } else {
      ctx.globalCompositeOperation = "source-over";
      ctx.strokeStyle = stroke.color;
    }
    ctx.lineWidth = stroke.size;
    ctx.lineJoin = "round";
    ctx.lineCap = "round";

    const pts = stroke.points;
    if (pts.length < 2) {
      ctx.beginPath();
      ctx.arc(pts[0].x, pts[0].y, stroke.size / 2, 0, Math.PI * 2);
      ctx.fillStyle = stroke.mode === "eraser" ? "rgba(0,0,0,1)" : stroke.color;
      if (stroke.mode === "eraser") {
        ctx.globalCompositeOperation = "destination-out";
      }
      ctx.fill();
      ctx.restore();
      return;
    }
    ctx.beginPath();
    ctx.moveTo(pts[0].x, pts[0].y);
    for (let i = 1; i < pts.length; i++) {
      ctx.lineTo(pts[i].x, pts[i].y);
    }
    ctx.stroke();
    ctx.restore();
  }

  function drawStrokeSegment(stroke: Stroke, from: Point, to: Point) {
    const ctx = ctxRef.current!;
    if (!ctx) return;
    ctx.save();
    ctx.lineWidth = stroke.size;
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    const alpha = stroke.mode === "highlighter" ? 0.35 : 1.0;
    ctx.globalAlpha = alpha;
    if (stroke.mode === "eraser") {
      ctx.globalCompositeOperation = "destination-out";
      ctx.strokeStyle = "rgba(0,0,0,1)";
    } else {
      ctx.globalCompositeOperation = "source-over";
      ctx.strokeStyle = stroke.color;
    }
    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x, to.y);
    ctx.stroke();
    ctx.restore();
  }

  function renderAll() {
    const canvas = canvasRef.current;
    if (!canvas || !ctxRef.current) return;
    const ctx = ctxRef.current;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (const s of strokesRef.current) drawStroke(s);
  }

  function undo() {
    const popped = strokesRef.current.pop();
    if (popped) undoneRef.current.push(popped);
    renderAll();
    socketRef.current?.emit("whiteboard", { type: "undo", roomId });
  }
  function redo() {
    const popped = undoneRef.current.pop();
    if (popped) strokesRef.current.push(popped);
    renderAll();
    socketRef.current?.emit("whiteboard", { type: "redo", roomId });
  }
  function clearAll() {
    strokesRef.current = [];
    undoneRef.current = [];
    renderAll();
    socketRef.current?.emit("whiteboard", { type: "clear", roomId });
  }
  function exportPNG() {
    const data = canvasRef.current?.toDataURL("image/png");
    if (!data) return;
    const a = document.createElement("a");
    a.href = data;
    a.download = `whiteboard-${roomId}.png`;
    a.click();
  }

  // Attach pointer listeners on overlay to avoid canvas text selection
  useEffect(() => {
    const overlay = overlayRef.current;
    if (!overlay) return;
    const onDown = (e: any) => down(e);
    const onMove = (e: any) => move(e);
    const onUp = (e: any) => up(e);
    overlay.addEventListener("mousedown", onDown);
    overlay.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    overlay.addEventListener("touchstart", onDown, { passive: false });
    overlay.addEventListener("touchmove", onMove, { passive: false });
    window.addEventListener("touchend", onUp);

    return () => {
      overlay.removeEventListener("mousedown", onDown);
      overlay.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      overlay.removeEventListener("touchstart", onDown as any);
      overlay.removeEventListener("touchmove", onMove as any);
      window.removeEventListener("touchend", onUp as any);
    };
  }, [roomId, color, size, mode]);

  return (
    <div style={{ minHeight: "100dvh", background: "#0b1020" }}>
      <div style={{
        height: 56, display: "flex", alignItems: "center", gap: 10,
        padding: "0 12px", color: "#e6eaf2", borderBottom: "1px solid rgba(255,255,255,.08)"
      }}>
        <span style={{ fontWeight: 800, color: "#6aa8ff" }}>zoomish</span>
        <span style={{ opacity: .8 }}>Whiteboard</span>
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8 }}>
          <label style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontSize: 12, opacity: .8 }}>Room</span>
            <input value={roomId} onChange={e => setRoomId(e.target.value)} style={{ height: 30, borderRadius: 8, border: "1px solid #274067", background: "#0f1831", color: "#e6eaf2", padding: "0 8px" }} />
          </label>
          <button onClick={() => navigate(`/whiteboard/${roomId}`)} className="btn primary" style={{ padding: "6px 10px", borderRadius: 8, border: "1px solid #274067", background: "#2c7cff", color: "#fff" }}>
            Go
          </button>
          <div style={{ width: 10 }} />
          <Tool label="Pen" active={mode === "pen"} onClick={() => setMode("pen")} />
          <Tool label="Highlighter" active={mode === "highlighter"} onClick={() => setMode("highlighter")} />
          <Tool label="Eraser" active={mode === "eraser"} onClick={() => setMode("eraser")} />
          <input type="color" value={color} onChange={e => setColor(e.target.value)} title="Color" />
          <input type="range" min={1} max={32} value={size} onChange={e => setSize(parseInt(e.target.value))} />
          <button onClick={undo} className="btn" style={{ padding: "6px 10px" }}>Undo</button>
          <button onClick={redo} className="btn" style={{ padding: "6px 10px" }}>Redo</button>
          <button onClick={clearAll} className="btn danger" style={{ padding: "6px 10px" }}>Clear</button>
          <button onClick={exportPNG} className="btn" style={{ padding: "6px 10px" }}>Export PNG</button>
          <button onClick={() => navigate("/home")} className="btn" style={{ padding: "6px 10px" }}>Home</button>
        </div>
      </div>

      <div style={{ position: "relative", width: "min(1200px, 96vw)", height: "70vh", margin: "22px auto", borderRadius: 14, border: "1px solid #1f2a44", overflow: "hidden", background: "#0f1831" }}>
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

