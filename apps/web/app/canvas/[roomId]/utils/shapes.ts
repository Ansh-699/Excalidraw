// utils/shapes.ts
import axios from "axios";
import { v4 as uuidv4 } from "uuid";

// Lazy load config to avoid bundle delays
const getApiUrl = () => {
  const isProduction = typeof window !== 'undefined' && window.location.hostname !== 'localhost';
  return isProduction ? '' : 'http://localhost:3001';
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

export function createShapeId() {
  return uuidv4();
}

export function drawShape(ctx: CanvasRenderingContext2D, shape: DrawingShape) {
  ctx.beginPath();
  switch (shape.type) {
    case "rectangle":
      ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
      break;
    case "circle": {
      const cx = shape.x + shape.width / 2;
      const cy = shape.y + shape.height / 2;
      const r = Math.sqrt(shape.width ** 2 + shape.height ** 2) / 2;
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
      if (!pts || pts.length < 2 || !pts[0]) break;
      ctx.moveTo(pts[0].x, pts[0].y);
      for (let i = 1; i < pts.length; i++) {
        const point = pts[i];
        if (point) {
          ctx.lineTo(point.x, point.y);
        }
      }
      ctx.stroke();
      break;
    }
  }
  ctx.closePath();
}

export function drawAllShapes(ctx: CanvasRenderingContext2D, shapes: DrawingShape[]) {
  shapes.forEach((s) => drawShape(ctx, s));
}

export async function getExistingShapes(roomId: string): Promise<DrawingShape[]> {
  const token = localStorage.getItem("token");
  const apiUrl = getApiUrl();

  const res = await axios.get<{ messages: Array<{ shape?: DrawingShape }> }>(
    `${apiUrl}/chats/${roomId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data.messages
    .map((msg) => msg.shape)
    .filter((s): s is DrawingShape => !!s);
}

export async function postShape(roomId: string, shape: DrawingShape) {
  const token = localStorage.getItem("token");
  const apiUrl = getApiUrl();

  await axios.post(
    `${apiUrl}/chats/${roomId}`,
    { shape },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
}
