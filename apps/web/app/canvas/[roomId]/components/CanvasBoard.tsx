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
    const x2 = x1 + (shape.width ?? 0);
    const y2 = y1 + (shape.height ?? 0);
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
  const currentToolRef = useRef<ShapeType | "eraser">(currentTool);

  // Keep the ref updated whenever currentTool changes
  useEffect(() => {
    currentToolRef.current = currentTool;
  }, [currentTool]);

  // Initialize canvas, WebSocket, and mouse handlers when roomId changes
  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // 1) Connect WebSocket and join room
    const token = localStorage.getItem("token") || "";
    connectWebSocket(token, () => {
      sendMessage({ type: "join_room", roomId });
    });

    // 2) Fetch existing shapes once, then draw them
    getExistingShapes(roomId).then((existing) => {
      shapesRef.current = existing;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawAllShapes(ctx, shapesRef.current);
    });

    // 3) When a message arrives over WS, update shapesRef and redraw
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

    // 4) MOUSE DOWN: start drawing or erase
    const handleMouseDown = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      startX = x;
      startY = y;

      const tool = currentToolRef.current;
      if (tool === "eraser") {
        // Erase any shape under the cursor
        const erased = shapesRef.current.filter((shape) =>
          isPointInShape(x, y, shape)
        );
        if (!erased.length) return;

        const erasedIds = erased.map((s) => s.id);
        shapesRef.current = shapesRef.current.filter(
          (s) => !erasedIds.includes(s.id)
        );
        erasedIds.forEach((shapeId) => {
          sendMessage({ type: "erase_shape", roomId, shapeId });
        });
        redrawAll();
        return;
      }

      drawing = true;
      if (tool === "pencil") {
        // Start a new pencil stroke
        shapesRef.current.push({
          id: createShapeId(),
          type: "pencil",
          points: [{ x, y }],
        });
      }
    };

    // 5) MOUSE MOVE: draw preview shape or extend pencil
    const handleMouseMove = (e: MouseEvent) => {
      if (!drawing) return;
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const tool = currentToolRef.current;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawAllShapes(ctx, shapesRef.current);

      if (tool === "pencil") {
        const last = shapesRef.current.at(-1);
        if (last && last.type === "pencil" && last.points) {
          last.points.push({ x, y });
          drawAllShapes(ctx, [last]);
        }
      } else if (tool !== "eraser") {
        let tempShape: DrawingShape;

        switch (tool) {
          case "rectangle":
            tempShape = {
              id: createShapeId(),
              type: "rectangle",
              x: startX,
              y: startY,
              width: x - startX,
              height: y - startY,
            };
            break;

          case "circle": {
            const radius = Math.sqrt((x - startX) ** 2 + (y - startY) ** 2);
            tempShape = {
              id: createShapeId(),
              type: "circle",
              x: startX - radius,
              y: startY - radius,
              width: radius * 2,
              height: radius * 2,
            };
            break;
          }

          case "triangle":
            tempShape = {
              id: createShapeId(),
              type: "triangle",
              x: startX,
              y: startY,
              width: x - startX,
              height: y - startY,
            };
            break;

          default:
            // Should never happen if your tool is one of the four
            tempShape = {
              id: createShapeId(),
              type: "rectangle",
              x: startX,
              y: startY,
              width: x - startX,
              height: y - startY,
            };
        }

        drawAllShapes(ctx, [tempShape]);
      }
    };

    // 6) MOUSE UP: commit the final shape
    const handleMouseUp = (e: MouseEvent) => {
      if (!drawing) return;
      drawing = false;
      const tool = currentToolRef.current;
      if (tool === "eraser") return;

      const rect = canvas.getBoundingClientRect();
      const endX = e.clientX - rect.left;
      const endY = e.clientY - rect.top;

      let newShape: DrawingShape;
      if (tool === "pencil") {
        // Last pencil stroke is already in shapesRef
        newShape = shapesRef.current.at(-1)!;
      } else {
        switch (tool) {
          case "rectangle":
            newShape = {
              id: createShapeId(),
              type: "rectangle",
              x: startX,
              y: startY,
              width: endX - startX,
              height: endY - startY,
            };
            break;

          case "circle": {
            const radius = Math.sqrt((endX - startX) ** 2 + (endY - startY) ** 2);
            newShape = {
              id: createShapeId(),
              type: "circle",
              x: startX - radius,
              y: startY - radius,
              width: radius * 2,
              height: radius * 2,
            };
            break;
          }

          case "triangle":
            newShape = {
              id: createShapeId(),
              type: "triangle",
              x: startX,
              y: startY,
              width: endX - startX,
              height: endY - startY,
            };
            break;

          default:
            // Fallback to rectangle if somehow tool is invalid
            newShape = {
              id: createShapeId(),
              type: "rectangle",
              x: startX,
              y: startY,
              width: endX - startX,
              height: endY - startY,
            };
        }
        shapesRef.current.push(newShape);
      }

      sendMessage({ type: "drawing", roomId, shape: newShape });
      postShape(roomId, newShape).catch(console.error);

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawAllShapes(ctx, shapesRef.current);
    };

    // Attach listeners
    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseup", handleMouseUp);

    // Initial draw
    redrawAll();

    return () => {
      // Cleanup
      canvas.removeEventListener("mousedown", handleMouseDown);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseup", handleMouseUp);
      offMessageType("drawing", handleIncoming);
      offMessageType("existing_shapes", handleIncoming);
      offMessageType("erase_shape", handleIncoming);
    };
  }, [roomId]); // No currentTool here—handlers read from currentToolRef

  // Separate effect: just update cursor when currentTool changes
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (currentTool === "eraser") {
      canvas.style.cursor = "crosshair"; // change to an eraser-style cursor if you like
    } else {
      canvas.style.cursor = "crosshair"; // default for drawing
    }
  }, [currentTool]);

  return (
    <canvas
      ref={canvasRef}
      style={{ display: "block", cursor: "crosshair" }}
    />
  );
}
