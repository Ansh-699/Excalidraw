import "dotenv/config";
import { WebSocketServer, WebSocket } from "ws";
import jwt from "jsonwebtoken";
import { prisma } from "@repo/db/clients";
import { config } from "@repo/backend-common/secret";

const PORT = process.env.WS_PORT ? parseInt(process.env.WS_PORT) : 8081;
const wss = new WebSocketServer({ port: PORT });

console.log(`WebSocket server listening on port ${PORT}`);
console.log("Database connection:", process.env.DATABASE_URL ? "✓ Found" : "✗ Missing");

interface User {
  ws: WebSocket;
  rooms: string[];
  userId: string;
}

interface ParsedDataBase {
  type: string;
}

interface JoinRoomData extends ParsedDataBase {
  type: "join_room";
  roomId: string;
  slug?: string;
}

interface LeaveRoomData extends ParsedDataBase {
  type: "leave_room";
  roomId: string;
}

interface ChatData extends ParsedDataBase {
  type: "chat";
  roomId: string;
  message: string;
}

interface DrawingData extends ParsedDataBase {
  type: "drawing";
  roomId: string;
  shape: Record<string, any>;
}

interface EraseShapeData extends ParsedDataBase {
  type: "erase_shape";
  roomId: string;
  shapeId: string;
}

type ParsedData =
  | JoinRoomData
  | LeaveRoomData
  | ChatData
  | DrawingData
  | EraseShapeData;

const users: User[] = [];

function checkUser(token: string): string | null {
  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    if (typeof decoded !== "object" || !("userid" in decoded)) {
      return null;
    }
    return decoded.userid as string;
  } catch (error) {
    console.error("Token verification failed:", error);
    return null;
  }
}

function broadcastToRoom(roomId: string, payload: unknown) {
  const data = JSON.stringify(payload);
  users.forEach((u) => {
    if (u.rooms.includes(roomId) && u.ws.readyState === u.ws.OPEN) {
      u.ws.send(data);
    }
  });
}

async function ensureRoom(roomId: string, slug: string, adminId: string) {
  let room = await prisma.room.findUnique({ where: { id: roomId } });
  if (!room) {
    room = await prisma.room.create({
      data: { id: roomId, slug, adminId },
    });
    console.log(`Created new room ${room.id} with admin ${room.adminId}`);
  }
  return room;
}

wss.on("connection", (ws, request) => {
  const url = request.url;
  if (!url) {
    ws.close(1008, "Invalid URL");
    return;
  }

  const queryParams = new URLSearchParams(url.split("?")[1]);
  const token = queryParams.get("token");

  if (!token) {
    ws.close(1008, "Token missing");
    return;
  }

  const userId = checkUser(token);
  if (!userId) {
    ws.close(1008, "Invalid token");
    return;
  }

  const user: User = { userId, rooms: [], ws };
  users.push(user);

  ws.on("message", async (data) => {
    let parsedData: ParsedData;
    try {
      const raw = typeof data === "string" ? data : data.toString();
      parsedData = JSON.parse(raw);
    } catch (err) {
      console.error("Invalid JSON received:", data.toString());
      ws.send(JSON.stringify({ type: "error", message: "Invalid JSON format" }));
      return;
    }

    const currentUser = users.find((x) => x.ws === ws);
    if (!currentUser) return;

    try {
      switch (parsedData.type) {
        case "join_room": {
          const { roomId, slug } = parsedData;
          const room = await ensureRoom(roomId, slug || roomId, currentUser.userId);

          if (!currentUser.rooms.includes(room.id)) {
            currentUser.rooms.push(room.id);
          }

          const existingChats = await prisma.chat.findMany({
            where: { roomId: room.id, shape: { not: { equals: null } } },
            orderBy: { createdAt: "asc" },
          });

          ws.send(
            JSON.stringify({
              type: "existing_shapes",
              roomId: room.id,
              shapes: existingChats.map((chat: { shape: any }) => chat.shape),
            })
          );
          ws.send(JSON.stringify({ type: "joined_room", roomId: room.id }));
          break;
        }

        case "leave_room": {
          currentUser.rooms = currentUser.rooms.filter(
            (x) => x !== parsedData.roomId
          );
          ws.send(
            JSON.stringify({ type: "left_room", roomId: parsedData.roomId })
          );
          break;
        }

        case "chat": {
          const { roomId, message } = parsedData;
          const room = await ensureRoom(roomId, roomId, currentUser.userId);

          await prisma.chat.create({
            data: { roomId: room.id, message, userId: currentUser.userId },
          });

          broadcastToRoom(room.id, {
            type: "chat",
            message,
            roomId: room.id,
            userId: currentUser.userId,
          });
          break;
        }

        case "drawing": {
          const { roomId, shape } = parsedData;
          const room = await ensureRoom(roomId, roomId, currentUser.userId);

          await prisma.chat.create({
            data: {
              roomId: room.id,
              shape,
              userId: currentUser.userId,
              message: "",
            },
          });

          broadcastToRoom(room.id, {
            type: "drawing",
            shape,
            roomId: room.id,
            userId: currentUser.userId,
          });
          break;
        }

        case "erase_shape": {
          const { roomId, shapeId } = parsedData;
          if (!shapeId) break;

          await prisma.chat.deleteMany({
            where: {
              roomId,
              shape: { path: ["id"], equals: shapeId },
            },
          });

          broadcastToRoom(roomId, {
            type: "erase_shape",
            roomId,
            shapeId,
            userId: currentUser.userId,
          });
          break;
        }

        default:
          ws.send(
            JSON.stringify({ type: "error", message: "Unknown message type" })
          );
          break;
      }
    } catch (err) {
      console.error("Error handling message:", err);
      ws.send(
        JSON.stringify({ type: "error", message: "Internal server error" })
      );
    }
  });

  ws.on("close", () => {
    const index = users.findIndex((u) => u.ws === ws);
    if (index !== -1) {
      users.splice(index, 1);
    }
  });
});
