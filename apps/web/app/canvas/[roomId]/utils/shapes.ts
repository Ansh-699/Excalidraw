// utils/shapes.ts
import axios from "axios";
import { v4 as uuidv4 } from "uuid";

// Lazy load config to avoid bundle delays
const getApiUrl = () => {
  return (
    process.env.NEXT_PUBLIC_BACKEND_URL ||
    (typeof window !== "undefined" && window.location.hostname === "localhost"
      ? "http://localhost:3001"
      : "")
  );
};

export type ShapeType =
  | "rectangle"
  | "circle"
  | "triangle"
  | "pencil"
  | "eraser";

export interface BaseShape {
  id: string; // unique shape id for identification & erasing
  type: ShapeType;
  strokeColor?: string;
  strokeWidth?: number;
}

export interface RectShape extends BaseShape {
  type: "rectangle";
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface CircleShape extends BaseShape {
  type: "circle";
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface TriangleShape extends BaseShape {
  type: "triangle";
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface PencilShape extends BaseShape {
  type: "pencil";
  points: { x: number; y: number }[];
}

export type DrawingShape = RectShape | CircleShape | TriangleShape | PencilShape;

export const STROKE_COLORS = [
  "#111827", // slate-900
  "#ef4444", // red-500
  "#f59e0b", // amber-500
  "#10b981", // emerald-500
  "#3b82f6", // blue-500
  "#8b5cf6", // violet-500
] as const;

export const STROKE_WIDTHS = [2, 4, 8] as const;

export const DEFAULT_STROKE_COLOR: string = STROKE_COLORS[0];
export const DEFAULT_STROKE_WIDTH: number = STROKE_WIDTHS[0];

export function createShapeId() {
  return uuidv4();
}

export function drawShape(ctx: CanvasRenderingContext2D, shape: DrawingShape) {
  const prevStroke = ctx.strokeStyle;
  const prevWidth = ctx.lineWidth;
  const prevCap = ctx.lineCap;
  const prevJoin = ctx.lineJoin;

  ctx.strokeStyle = shape.strokeColor ?? DEFAULT_STROKE_COLOR;
  ctx.lineWidth = shape.strokeWidth ?? DEFAULT_STROKE_WIDTH;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  ctx.beginPath();
  switch (shape.type) {
    case "rectangle":
      ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
      break;
    case "circle": {
      const cx = shape.x + shape.width / 2;
      const cy = shape.y + shape.height / 2;
      const r = Math.max(Math.abs(shape.width), Math.abs(shape.height)) / 2;
      ctx.arc(cx, cy, r, 0, 2 * Math.PI);
      ctx.stroke();
      break;
    }
    case "triangle":
      ctx.moveTo(shape.x, shape.y + shape.height);
      ctx.lineTo(shape.x + shape.width / 2, shape.y);
      ctx.lineTo(shape.x + shape.width, shape.y + shape.height);
      ctx.closePath();
      ctx.stroke();
      break;
    case "pencil": {
      const pts = shape.points;
      if (!pts || pts.length < 1 || !pts[0]) break;
      ctx.moveTo(pts[0].x, pts[0].y);
      for (let i = 1; i < pts.length; i++) {
        const point = pts[i];
        if (point) ctx.lineTo(point.x, point.y);
      }
      ctx.stroke();
      break;
    }
  }
  ctx.closePath();

  ctx.strokeStyle = prevStroke;
  ctx.lineWidth = prevWidth;
  ctx.lineCap = prevCap;
  ctx.lineJoin = prevJoin;
}

export function drawAllShapes(
  ctx: CanvasRenderingContext2D,
  shapes: DrawingShape[]
) {
  shapes.forEach((s) => drawShape(ctx, s));
}

export async function getExistingShapes(
  roomId: string
): Promise<DrawingShape[]> {
  const token = localStorage.getItem("token");
  const apiUrl = getApiUrl();

  const res = await axios.get<{ messages: Array<{ shape?: DrawingShape }> }>(
    `${apiUrl}/chats/${roomId}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );

  return res.data.messages
    .map((msg) => msg.shape)
    .filter((s): s is DrawingShape => !!s);
}
