import { WebSocketServer, WebSocket } from "ws";
import jwt from "jsonwebtoken";
import { prisma } from "@repo/db/clients";
import { config } from "@repo/backend-common/secret";

const wss = new WebSocketServer({ port: 8081 });

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
  shape: Record<string, any>; // Replace with specific shape type if available
}

type ParsedData = JoinRoomData | LeaveRoomData | ChatData | DrawingData;

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

  const user: User = {
    userId,
    rooms: [],
    ws,
  };
  users.push(user);

  ws.on("message", async (data) => {
    let parsedData: ParsedData;
    try {
      const raw = typeof data === "string" ? data : data.toString();
      parsedData = JSON.parse(raw);
    } catch (err) {
      console.error("Invalid JSON received:", data.toString());
      ws.send(
        JSON.stringify({ type: "error", message: "Invalid JSON format" })
      );
      return;
    }

    const user = users.find((x) => x.ws === ws);
    if (!user) return;

    switch (parsedData.type) {
      case "join_room": {
        const { roomId, slug } = parsedData;

        let room = await prisma.room.findUnique({ where: { id: roomId } });
        if (!room) {
          room = await prisma.room.create({
            data: {
              id: roomId,
              slug: slug || roomId,
              adminId: user.userId,
            },
          });
          console.log(`Created new room ${room.id} with admin ${room.adminId}`);
        }

        if (!user.rooms.includes(room.id)) {
          user.rooms.push(room.id);
        }

        const existingShapes = await prisma.chat.findMany({
          where: {
            roomId: room.id,
            shape: {
              not: {
                equals: null,
              },
            },
          },
          orderBy: { createdAt: "asc" },
        });

        ws.send(
          JSON.stringify({
            type: "existing_shapes",
            roomId: room.id,
            shapes: existingShapes.map((chat: { shape: any }) => chat.shape),
          })
        );

        ws.send(JSON.stringify({ type: "joined_room", roomId: room.id }));
        break;
      }

      case "leave_room": {
        user.rooms = user.rooms.filter((x) => x !== parsedData.roomId);
        ws.send(
          JSON.stringify({ type: "left_room", roomId: parsedData.roomId })
        );
        break;
      }

      case "chat": {
        const { roomId, message } = parsedData;

        let room = await prisma.room.findUnique({ where: { id: roomId } });
        if (!room) {
          room = await prisma.room.create({
            data: {
              id: roomId,
              slug: roomId,
              adminId: user.userId,
            },
          });
        }

        await prisma.chat.create({
          data: {
            roomId: room.id,
            message,
            userId: user.userId,
          },
        });

        users.forEach((u) => {
          if (u.rooms.includes(room.id)) {
            u.ws.send(
              JSON.stringify({
                type: "chat",
                message,
                roomId: room.id,
                userId: user.userId,
              })
            );
          }
        });
        break;
      }

      case "drawing": {
        const { roomId, shape } = parsedData;

        let room = await prisma.room.findUnique({ where: { id: roomId } });
        if (!room) {
          room = await prisma.room.create({
            data: {
              id: roomId,
              slug: roomId,
              adminId: user.userId,
            },
          });
        }

        await prisma.chat.create({
          data: {
            roomId: room.id,
            shape,
            userId: user.userId,
            message: "",
          },
        });

        users.forEach((u) => {
          if (u.rooms.includes(room.id)) {
            u.ws.send(
              JSON.stringify({
                type: "drawing",
                shape,
                roomId: room.id,
                userId: user.userId,
              })
            );
          }
        });
        break;
      }

      default:
        ws.send(
          JSON.stringify({ type: "error", message: "Unknown message type" })
        );
        break;
    }
  });

  ws.on("close", () => {
    const index = users.findIndex((u) => u.ws === ws);
    if (index !== -1) {
      users.splice(index, 1);
    }
  });
});