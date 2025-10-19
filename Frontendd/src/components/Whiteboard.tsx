import React, { useRef, useEffect, useState } from "react";
import { Socket } from "socket.io-client";

interface WhiteboardProps {
  socket: Socket;
  roomId: string;
}

const Whiteboard: React.FC<WhiteboardProps> = ({ socket, roomId }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [drawing, setDrawing] = useState(false);
  const [color, setColor] = useState("#ffffff");
  const [size, setSize] = useState(2);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    socket.on("whiteboard", ({ x0, y0, x1, y1, color, size }) => {
      ctx.strokeStyle = color;
      ctx.lineWidth = size;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(x0 * canvas.width, y0 * canvas.height);
      ctx.lineTo(x1 * canvas.width, y1 * canvas.height);
      ctx.stroke();
    });

    return () => {
      window.removeEventListener("resize", resize);
      socket.off("whiteboard");
    };
  }, [socket]);

  const drawLine = (x0: number, y0: number, x1: number, y1: number, emit: boolean) => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    ctx.strokeStyle = color;
    ctx.lineWidth = size;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(x0 * canvas.width, y0 * canvas.height);
    ctx.lineTo(x1 * canvas.width, y1 * canvas.height);
    ctx.stroke();

    if (emit) socket.emit("whiteboard", { roomId, x0, y0, x1, y1, color, size });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setDrawing(true);
    const canvas = canvasRef.current!;
    const { offsetX, offsetY } = e.nativeEvent;
    (canvas as any).lastX = offsetX / canvas.width;
    (canvas as any).lastY = offsetY / canvas.height;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!drawing) return;
    const canvas = canvasRef.current!;
    const { offsetX, offsetY } = e.nativeEvent;
    const x = offsetX / canvas.width;
    const y = offsetY / canvas.height;
    drawLine((canvas as any).lastX, (canvas as any).lastY, x, y, true);
    (canvas as any).lastX = x;
    (canvas as any).lastY = y;
  };

  const handleMouseUp = () => setDrawing(false);

  const clearCanvas = () => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  return (
    <div className="relative w-full h-[400px] bg-gray-800 rounded-xl overflow-hidden shadow-lg mt-4">
      <div className="absolute top-2 left-2 z-10 flex gap-2">
        <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="w-8 h-8" />
        <input type="range" min={1} max={10} value={size} onChange={(e) => setSize(parseInt(e.target.value))} />
        <button onClick={clearCanvas} className="px-3 py-1 bg-red-500 rounded text-white text-sm hover:bg-red-600">
          Clear
        </button>
      </div>
      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className="w-full h-full cursor-crosshair"
      />
    </div>
  );
};

export default Whiteboard;
