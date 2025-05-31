"use client";
import { useEffect, useRef } from "react";
import {
  connectWebSocket,
  sendMessage,
  onMessageType,
  offMessageType,
} from "../utils/socket";
import {
  ShapeType,
  DrawingShape,
  drawAllShapes,
  getExistingShapes,
  postShape,
  createShapeId,
} from "../utils/shapes";

interface CanvasBoardProps {
  roomId: string;
  currentTool: ShapeType | "eraser";
}

function isPointInShape(x: number, y: number, shape: DrawingShape): boolean {
  if (shape.type === "pencil") {
    for (const p of shape.points || []) {
      const dx = p.x - x;
      const dy = p.y - y;
      if (Math.sqrt(dx * dx + dy * dy) < 5) return true;
    }
    return false;
  } else {
    const x1 = shape.x ?? 0;
    const y1 = shape.y ?? 0;
    const x2 = (shape.x ?? 0) + (shape.width ?? 0);
    const y2 = (shape.y ?? 0) + (shape.height ?? 0);
    return (
      x >= Math.min(x1, x2) &&
      x <= Math.max(x1, x2) &&
      y >= Math.min(y1, y2) &&
      y <= Math.max(y1, y2)
    );
  }
}

export default function CanvasBoard({ roomId, currentTool }: CanvasBoardProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const shapesRef = useRef<DrawingShape[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const token = localStorage.getItem("token") || "";

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
      }
      if (data.type === "existing_shapes" && Array.isArray(data.shapes)) {
        shapesRef.current = data.shapes;
      }
      if (data.type === "erase_shape" && data.shapeId) {
        shapesRef.current = shapesRef.current.filter((s) => s.id !== data.shapeId);
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawAllShapes(ctx, shapesRef.current);
    };

    onMessageType("drawing", handleIncoming);
    onMessageType("existing_shapes", handleIncoming);
    onMessageType("erase_shape", handleIncoming);

    let drawing = false;
    let startX = 0;
    let startY = 0;

    const redrawAll = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawAllShapes(ctx, shapesRef.current);
    };

    const handleMouseDown = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      startX = x;
      startY = y;

      if (currentTool === "eraser") {
        const erasedShapes = shapesRef.current.filter((shape) =>
          isPointInShape(x, y, shape)
        );
        if (erasedShapes.length === 0) return;

        const erasedShapeIds = erasedShapes.map((shape) => shape.id);

        // Remove all erased shapes at once
        shapesRef.current = shapesRef.current.filter(
          (shape) => !erasedShapeIds.includes(shape.id)
        );

        // Broadcast erase message for each erased shape
        erasedShapeIds.forEach((shapeId) => {
          sendMessage({ type: "erase_shape", roomId, shapeId });
        });

        redrawAll();
        return;
      }

      drawing = true;
      if (currentTool === "pencil") {
        shapesRef.current.push({
          id: createShapeId(),
          type: "pencil",
          points: [{ x, y }],
        });
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!drawing) return;
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      redrawAll();

      if (currentTool === "pencil") {
        const last = shapesRef.current.at(-1);
        if (last && last.type === "pencil" && last.points) {
          last.points.push({ x, y });
          drawAllShapes(ctx, [last]);
        }
      } else {
        const tempShape = {
          id: createShapeId(),
          type: currentTool as Exclude<ShapeType | "eraser", "eraser">,
          x: startX,
          y: startY,
          width: x - startX,
          height: y - startY,
        };
        drawAllShapes(ctx, [tempShape as DrawingShape]);
      }
    };

    const handleMouseUp = (e: MouseEvent) => {
      if (!drawing) return;
      drawing = false;
      if (currentTool === "eraser") return;

      const rect = canvas.getBoundingClientRect();
      const endX = e.clientX - rect.left;
      const endY = e.clientY - rect.top;

      let newShape: DrawingShape;
      if (currentTool === "pencil") {
        newShape = shapesRef.current.at(-1)!;
      } else {
        newShape = {
          id: createShapeId(),
          type: currentTool,
          x: startX,
          y: startY,
          width: endX - startX,
          height: endY - startY,
        };
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
      offMessageType("erase_shape", handleIncoming);
    };
  }, [roomId, currentTool]);

  return <canvas ref={canvasRef} style={{ display: "block", cursor: "crosshair" }} />;
}