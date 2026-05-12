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
  createShapeId,
} from "../utils/shapes";

interface CanvasBoardProps {
  roomId: string;
  currentTool: ShapeType;
  strokeColor: string;
  strokeWidth: number;
}

function isPointInShape(x: number, y: number, shape: DrawingShape): boolean {
  if (shape.type === "pencil") {
    for (const p of shape.points || []) {
      const dx = p.x - x;
      const dy = p.y - y;
      if (Math.sqrt(dx * dx + dy * dy) < 8) return true;
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

function getEventCoords(
  e: MouseEvent | TouchEvent,
  canvas: HTMLCanvasElement
) {
  const rect = canvas.getBoundingClientRect();
  let clientX: number;
  let clientY: number;

  if ("touches" in e) {
    if (e.touches.length > 0) {
      clientX = e.touches[0]!.clientX;
      clientY = e.touches[0]!.clientY;
    } else if (e.changedTouches.length > 0) {
      clientX = e.changedTouches[0]!.clientX;
      clientY = e.changedTouches[0]!.clientY;
    } else {
      return { x: 0, y: 0 };
    }
  } else {
    clientX = e.clientX;
    clientY = e.clientY;
  }

  return { x: clientX - rect.left, y: clientY - rect.top };
}

export default function CanvasBoard({
  roomId,
  currentTool,
  strokeColor,
  strokeWidth,
}: CanvasBoardProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const shapesRef = useRef<DrawingShape[]>([]);
  const currentToolRef = useRef<ShapeType>(currentTool);
  const strokeColorRef = useRef<string>(strokeColor);
  const strokeWidthRef = useRef<number>(strokeWidth);

  // Undo/redo stacks hold shapes the local user drew (or erased) so
  // Ctrl+Z and Ctrl+Shift+Z can walk backward/forward.
  const undoStackRef = useRef<DrawingShape[]>([]);
  const redoStackRef = useRef<DrawingShape[]>([]);

  // Keep refs in sync with the latest props so the mouse handlers
  // installed inside the main effect always see current values.
  useEffect(() => {
    currentToolRef.current = currentTool;
  }, [currentTool]);
  useEffect(() => {
    strokeColorRef.current = strokeColor;
  }, [strokeColor]);
  useEffect(() => {
    strokeWidthRef.current = strokeWidth;
  }, [strokeWidth]);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;

    const redrawAll = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawAllShapes(ctx, shapesRef.current);
    };

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      redrawAll();
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    canvas.style.touchAction = "none";

    // Join WebSocket room.
    const token = localStorage.getItem("token") || "";
    connectWebSocket(token, () => {
      sendMessage({ type: "join_room", roomId });
    });

    // Seed from HTTP as a fallback; WS existing_shapes will overwrite if the
    // socket connects quickly.
    getExistingShapes(roomId)
      .then((existing) => {
        shapesRef.current = existing;
        redrawAll();
      })
      .catch(() => {
        /* non-fatal: ws will fill in */
      });

    const handleIncoming = (data: any) => {
      if (data.roomId !== roomId) return;
      if (data.type === "drawing" && data.shape) {
        // Skip our own echo if we already have it locally (avoid duplicates).
        const exists = shapesRef.current.some((s) => s.id === data.shape.id);
        if (!exists) shapesRef.current.push(data.shape);
      }
      if (data.type === "existing_shapes" && Array.isArray(data.shapes)) {
        shapesRef.current = data.shapes;
      }
      if (data.type === "erase_shape" && data.shapeId) {
        shapesRef.current = shapesRef.current.filter(
          (s) => s.id !== data.shapeId
        );
      }
      redrawAll();
    };
    onMessageType("drawing", handleIncoming);
    onMessageType("existing_shapes", handleIncoming);
    onMessageType("erase_shape", handleIncoming);

    let drawing = false;
    let startX = 0;
    let startY = 0;

    const handleStart = (e: MouseEvent | TouchEvent) => {
      e.preventDefault();
      const { x, y } = getEventCoords(e, canvas);
      startX = x;
      startY = y;

      const tool = currentToolRef.current;
      if (tool === "eraser") {
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
        shapesRef.current.push({
          id: createShapeId(),
          type: "pencil",
          points: [{ x, y }],
          strokeColor: strokeColorRef.current,
          strokeWidth: strokeWidthRef.current,
        });
      }
    };

    const handleMove = (e: MouseEvent | TouchEvent) => {
      if (!drawing) return;
      e.preventDefault();

      const { x, y } = getEventCoords(e, canvas);
      const tool = currentToolRef.current;

      redrawAll();

      if (tool === "pencil") {
        const last = shapesRef.current.at(-1);
        if (last && last.type === "pencil" && last.points) {
          last.points.push({ x, y });
          drawAllShapes(ctx, [last]);
        }
      } else if (tool !== "eraser") {
        const base = {
          id: createShapeId(),
          strokeColor: strokeColorRef.current,
          strokeWidth: strokeWidthRef.current,
        };
        let tempShape: DrawingShape;
        switch (tool) {
          case "rectangle":
            tempShape = {
              ...base,
              type: "rectangle",
              x: startX,
              y: startY,
              width: x - startX,
              height: y - startY,
            };
            break;
          case "circle": {
            const radius = Math.sqrt(
              (x - startX) ** 2 + (y - startY) ** 2
            );
            tempShape = {
              ...base,
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
              ...base,
              type: "triangle",
              x: startX,
              y: startY,
              width: x - startX,
              height: y - startY,
            };
            break;
          default:
            tempShape = {
              ...base,
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

    const handleEnd = (e: MouseEvent | TouchEvent) => {
      if (!drawing) return;
      e.preventDefault();
      drawing = false;
      const tool = currentToolRef.current;
      if (tool === "eraser") return;

      const { x: endX, y: endY } = getEventCoords(e, canvas);

      let newShape: DrawingShape;
      if (tool === "pencil") {
        // Already added on start; keep the last one.
        newShape = shapesRef.current.at(-1)!;
      } else {
        const base = {
          id: createShapeId(),
          strokeColor: strokeColorRef.current,
          strokeWidth: strokeWidthRef.current,
        };
        switch (tool) {
          case "rectangle":
            newShape = {
              ...base,
              type: "rectangle",
              x: startX,
              y: startY,
              width: endX - startX,
              height: endY - startY,
            };
            break;
          case "circle": {
            const radius = Math.sqrt(
              (endX - startX) ** 2 + (endY - startY) ** 2
            );
            newShape = {
              ...base,
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
              ...base,
              type: "triangle",
              x: startX,
              y: startY,
              width: endX - startX,
              height: endY - startY,
            };
            break;
          default:
            newShape = {
              ...base,
              type: "rectangle",
              x: startX,
              y: startY,
              width: endX - startX,
              height: endY - startY,
            };
        }
        shapesRef.current.push(newShape);
      }

      // Broadcast to peers; the WS backend is the single source of truth for
      // persistence (no extra HTTP call here to avoid duplicate DB rows).
      sendMessage({ type: "drawing", roomId, shape: newShape });

      // Track for undo and invalidate any pending redo.
      undoStackRef.current.push(newShape);
      redoStackRef.current = [];

      redrawAll();
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      const metaOrCtrl = e.metaKey || e.ctrlKey;
      if (!metaOrCtrl) return;

      const key = e.key.toLowerCase();
      const isUndo = key === "z" && !e.shiftKey;
      const isRedo = (key === "z" && e.shiftKey) || key === "y";

      if (isUndo) {
        e.preventDefault();
        const last = undoStackRef.current.pop();
        if (!last) return;
        redoStackRef.current.push(last);
        shapesRef.current = shapesRef.current.filter((s) => s.id !== last.id);
        sendMessage({ type: "erase_shape", roomId, shapeId: last.id });
        redrawAll();
      } else if (isRedo) {
        e.preventDefault();
        const last = redoStackRef.current.pop();
        if (!last) return;
        undoStackRef.current.push(last);
        shapesRef.current.push(last);
        sendMessage({ type: "drawing", roomId, shape: last });
        redrawAll();
      }
    };

    canvas.addEventListener("mousedown", handleStart);
    canvas.addEventListener("mousemove", handleMove);
    canvas.addEventListener("mouseup", handleEnd);
    canvas.addEventListener("touchstart", handleStart);
    canvas.addEventListener("touchmove", handleMove);
    canvas.addEventListener("touchend", handleEnd);
    window.addEventListener("keydown", handleKeyDown);

    redrawAll();

    return () => {
      canvas.removeEventListener("mousedown", handleStart);
      canvas.removeEventListener("mousemove", handleMove);
      canvas.removeEventListener("mouseup", handleEnd);
      canvas.removeEventListener("touchstart", handleStart);
      canvas.removeEventListener("touchmove", handleMove);
      canvas.removeEventListener("touchend", handleEnd);
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("keydown", handleKeyDown);

      offMessageType("drawing", handleIncoming);
      offMessageType("existing_shapes", handleIncoming);
      offMessageType("erase_shape", handleIncoming);
    };
  }, [roomId]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        display: "block",
        cursor: "crosshair",
        touchAction: "none",
      }}
    />
  );
}
