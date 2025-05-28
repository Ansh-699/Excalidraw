import { WebSocketServer, WebSocket } from "ws";
import jwt from "jsonwebtoken";
import { prisma } from "@repo/db/clients";
import { config } from "@repo/backend-common/secret";

const wss = new WebSocketServer({ port: 8081 });
console.log("WebSocket server running on ws://localhost:8081");

interface User {
  ws: WebSocket;
  rooms: string[];
  userId: string;
}

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
    let parsedData: any;
    try {
      const raw = typeof data === "string" ? data : data.toString();
      parsedData = JSON.parse(raw);
    } catch (err) {
      console.error("Invalid JSON received:", data.toString());
      ws.send(JSON.stringify({ type: "error", message: "Invalid JSON format" }));
      return;
    }

    const user = users.find(x => x.ws === ws);
    if (!user) return;

    switch (parsedData.type) {
      case "join_room": {
        // Try to find the room, if not exist create one with default admin as userId
        let room = await prisma.room.findUnique({ where: { id: parsedData.roomId } });
        if (!room) {
          room = await prisma.room.create({
            data: {
              id: parsedData.roomId,
              slug: parsedData.slug || parsedData.roomId, // fallback slug
              adminId: user.userId,
            }
          });
          console.log(`Created new room ${room.id} with admin ${room.adminId}`);
        }
        if (!user.rooms.includes(room.id)) {
          user.rooms.push(room.id);
        }
        ws.send(JSON.stringify({ type: "joined_room", roomId: room.id }));
        break;
      }

      case "leave_room":
        user.rooms = user.rooms.filter(x => x !== parsedData.roomId);
        ws.send(JSON.stringify({ type: "left_room", roomId: parsedData.roomId }));
        break;

      case "chat": {
        const { roomId, message } = parsedData;

        // Check room exists or create if not
        let room = await prisma.room.findUnique({ where: { id: roomId } });
        if (!room) {
          room = await prisma.room.create({
            data: {
              id: roomId,
              slug: roomId,  // fallback slug as roomId
              adminId: user.userId,
            }
          });
          console.log(`Created new room ${room.id} for chat with admin ${room.adminId}`);
        }

        // Create chat message
        await prisma.chat.create({
          data: {
            roomId: room.id,
            message,
            userId: user.userId,
          },
        });

        // Broadcast chat message to users in room
        users.forEach(u => {
          if (u.rooms.includes(room.id)) {
            u.ws.send(JSON.stringify({
              type: "chat",
              message,
              roomId: room.id,
              userId: user.userId,
            }));
          }
        });
        break;
      }
    }
  });
});
;
