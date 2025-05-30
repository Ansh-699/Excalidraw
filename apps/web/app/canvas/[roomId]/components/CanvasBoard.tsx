"use client";
import { useEffect, useRef } from "react";
import {
  connectWebSocket,
  sendMessage,
  onMessageType,
  offMessageType,
} from "../utils/socket";
import {
  Shape,
  ShapeType,
  drawAllShapes,
  getExistingShapes,
  postShape,
} from "../utils/shapes";

interface CanvasBoardProps {
  roomId: string;
  currentTool: ShapeType;
}

export default function CanvasBoard({ roomId, currentTool }: CanvasBoardProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const shapesRef = useRef<Shape[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const token = localStorage.getItem("token")!;

    connectWebSocket(token, () => {
      sendMessage({ type: "join_room", roomId });
    });

    getExistingShapes(roomId).then((existing) => {
      shapesRef.current = existing;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawAllShapes(ctx, shapesRef.current);
    });

    const handleIncoming = (data: any) => {
      if (data.roomId !== roomId) return;

      if (data.type === "drawing" && data.shape) {
        shapesRef.current.push(data.shape);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawAllShapes(ctx, shapesRef.current);
      }

      if (data.type === "existing_shapes" && Array.isArray(data.shapes)) {
        shapesRef.current = data.shapes;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawAllShapes(ctx, shapesRef.current);
      }
    };

    onMessageType("drawing", handleIncoming);
    onMessageType("existing_shapes", handleIncoming);

    let drawing = false;
    let startX = 0,
      startY = 0;

    const redrawAll = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawAllShapes(ctx, shapesRef.current);
    };

    const handleMouseDown = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      startX = e.clientX - rect.left;
      startY = e.clientY - rect.top;
      drawing = true;
      if (currentTool === "pencil") {
        shapesRef.current.push({
          type: "pencil",
          points: [{ x: startX, y: startY }],
        } as Shape);
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!drawing) return;
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      redrawAll();
      if (currentTool === "pencil") {
        const last = shapesRef.current.at(-1)! as any;
        last.points.push({ x, y });
        drawAllShapes(ctx, [last]);
      } else {
        drawAllShapes(ctx, [
          {
            type: currentTool,
            x: startX,
            y: startY,
            width: x - startX,
            height: y - startY,
          } as Shape,
        ]);
      }
    };

    const handleMouseUp = (e: MouseEvent) => {
      if (!drawing) return;
      drawing = false;
      const rect = canvas.getBoundingClientRect();
      const endX = e.clientX - rect.left;
      const endY = e.clientY - rect.top;

      let newShape: Shape;
      if (currentTool === "pencil") {
        newShape = shapesRef.current.at(-1)!;
      } else {
        newShape = {
          type: currentTool,
          x: startX,
          y: startY,
          width: endX - startX,
          height: endY - startY,
        } as Shape;
        shapesRef.current.push(newShape);
      }

      sendMessage({ type: "drawing", roomId, shape: newShape });
      postShape(roomId, newShape).catch(console.error);
      redrawAll();
    };

    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseup", handleMouseUp);
    redrawAll();

    return () => {
      canvas.removeEventListener("mousedown", handleMouseDown);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseup", handleMouseUp);
      offMessageType("drawing", handleIncoming);
      offMessageType("existing_shapes", handleIncoming);
    };
  }, [roomId, currentTool]);

  return <canvas ref={canvasRef} style={{ display: "block", cursor: "crosshair" }} />;
}
