// utils/shapes.ts
import axios from "axios";
import { BACKEND_URL } from "./config";
export type ShapeType = "rectangle" | "circle" | "triangle" | "pencil";

export interface BaseShape {
  type: ShapeType;
}

export interface RectShape extends BaseShape {
  type: "rectangle";
  x: number; y: number; width: number; height: number;
}

export interface CircleShape extends BaseShape {
  type: "circle";
  x: number; y: number; width: number; height: number;
}

export interface TriangleShape extends BaseShape {
  type: "triangle";
  x: number; y: number; width: number; height: number;
}

export interface PencilShape extends BaseShape {
  type: "pencil";
  points: { x: number; y: number }[];
}

export type Shape = RectShape | CircleShape | TriangleShape | PencilShape;

export function drawShape(ctx: CanvasRenderingContext2D, shape: Shape) {
  ctx.beginPath();
  switch (shape.type) {
    case "rectangle":
      ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
      break;
    case "circle": {
      const cx = shape.x + shape.width / 2;
      const cy = shape.y + shape.height / 2;
      const r = Math.sqrt((shape.width ** 2 + shape.height ** 2)) / 2;
      ctx.arc(cx, cy, r, 0, 2 * Math.PI);
      ctx.stroke();
      break;
    }
    case "triangle":
      // draw an isosceles triangle
      ctx.moveTo(shape.x, shape.y + shape.height);
      ctx.lineTo(shape.x + shape.width / 2, shape.y);
      ctx.lineTo(shape.x + shape.width, shape.y + shape.height);
      ctx.closePath();
      ctx.stroke();
      break;
    case "pencil":
      const pts = shape.points;
      if (pts.length < 2) break;
      ctx.moveTo(pts[0]!.x, pts[0]!.y);
      for (let i = 1; i < pts.length; i++) {
        ctx.lineTo(pts[i]!.x, pts[i]!.y);
      }
      ctx.stroke();
      break;
  }
  ctx.closePath();
}

export function drawAllShapes(ctx: CanvasRenderingContext2D, shapes: Shape[]) {
  shapes.forEach((s) => drawShape(ctx, s));
}

export async function getExistingShapes(roomId: string): Promise<Shape[]> {
  const res = await axios.get<{ messages: Array<{ shape?: Shape }> }>(
    `${BACKEND_URL}/chats/${roomId}`
  );
  return res.data.messages
    .map((msg) => msg.shape)
    .filter((s): s is Shape => !!s);
}

export async function postShape(roomId: string, shape: Shape) {
  await axios.post(`${BACKEND_URL}/chats/${roomId}`, { shape });
}
 