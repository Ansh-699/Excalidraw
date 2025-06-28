// src/server.ts (or index.ts)

import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import cors from "cors";

import { middleware } from "./middleware.js";
import { CreateUserSchema, SigninSchema, CreateRoomSchema } from "@repo/common/types";
import { prisma } from "@repo/db/clients";

const app = express();
app.use(express.json());
app.use(cors());

// Initialize database connection on startup
async function initializeDatabase() {
  try {
    await prisma.$connect();
    console.log("✅ Database connected successfully");
    // Test the connection with a simple query
    await prisma.$queryRaw`SELECT 1`;
    console.log("✅ Database query test successful");
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    process.exit(1);
  }
}

// Health check endpoint
app.get("/health", async (req: Request, res: Response): Promise<void> => {
  try {
    // Test database connection
    await prisma.$queryRaw`SELECT 1`;
    res.status(200).json({ 
      status: "healthy", 
      timestamp: new Date().toISOString(),
      database: "connected"
    });
  } catch (error) {
    console.error("Health check failed:", error);
    res.status(503).json({ 
      status: "unhealthy", 
      timestamp: new Date().toISOString(),
      database: "disconnected",
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * POST /signup
 * Creates a new user (username, email, password hashed via bcrypt).
 */
app.post("/signup", async (req: Request, res: Response): Promise<void> => {
  const data = CreateUserSchema.safeParse(req.body);
  if (!data.success) {
    res.status(400).json({ error: "Invalid user data" });
    return;
  }

  const { username, email, password } = data.data;
  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      res.status(400).json({ error: "User already exists" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        name: username,
        email,
        password: hashedPassword,
      },
    });

    res.status(200).json({ message: "User signed up successfully", userId: user.id });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * POST /signin
 * Validates email/password, returns a JWT on success.
 */
app.post("/signin", async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    if (typeof email !== "string" || typeof password !== "string") {
      res.status(400).json({ error: "Email and password must be strings" });
      return;
    }
    if (!email.trim() || !password.trim()) {
      res.status(400).json({ error: "Missing email or password" });
      return;
    }

    const data = SigninSchema.safeParse({ email, password });
    if (!data.success) {
      console.error("SigninSchema error:", data.error);
      res.status(400).json({ error: "Invalid credentials format" });
      return;
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.password) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    // Hardcoded JWT secret; consider moving to env var
    const token = jwt.sign({ userid: user.id }, "anshtyagi", { expiresIn: "1h" });
    res.status(200).json({ message: "Sign in successful", token });
  } catch (err) {
    console.error("Signin error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * POST /room-id
 * Creates a new room. Requires valid JWT (middleware should populate req.userid).
 */
app.post("/room-id", middleware, async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.userid) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const data = CreateRoomSchema.safeParse(req.body);
    if (!data.success) {
      res.status(400).json({ error: "Invalid room data", details: data.error.errors });
      return;
    }

    const userid = req.userid;
    const room = await prisma.room.create({
      data: {
        slug: data.data.name,
        adminId: userid,
      },
    });
    res.status(200).json({ roomId: room.id, userId: req.userid });
  } catch (err) {
    console.error("Error creating room:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * GET /chats/:roomId
 * Fetches the last 1000 chat entries (including shape objects) for a room, ordered descending by id.
 */
app.get("/chats/:roomId", async (req: Request, res: Response): Promise<void> => {
  try {
    const roomId = req.params.roomId;
    const messages = await prisma.chat.findMany({
      where: { roomId },
      orderBy: { id: "desc" },
      take: 1000,
    });
    res.json({ messages });
  } catch (e) {
    console.error(e);
    res.json({ messages: [] });
  }
});

/**
 * POST /chats/:roomId
 * Saves a new drawing (shape) into the chat table. Requires valid JWT (middleware).
 */
app.post(
  "/chats/:roomId",
  middleware,
  async (req: Request, res: Response): Promise<void> => {
    try {
      if (!req.userid) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }

      const roomId = req.params.roomId;
      const { shape } = req.body as { shape: unknown };
      if (!shape) {
        res.status(400).json({ error: "Shape payload missing" });
        return;
      }

      // Ensure room exists (or create if missing)
      let room = await prisma.room.findUnique({ where: { id: roomId } });
      if (!room) {
        room = await prisma.room.create({
          data: {
            id: roomId,
            slug: roomId || `room-${Date.now()}`,
            adminId: req.userid,
          },
        });
      }

      // Save the shape in chat table
      const chatEntry = await prisma.chat.create({
        data: {
          roomId: room.id,
          shape,
          userId: req.userid,
          message: "", // No text message here
        },
      });

      // Respond with the newly created entry
      res.status(201).json({ id: chatEntry.id, shape: chatEntry.shape });
    } catch (e) {
      console.error("Error saving shape to chat:", e);
      res.status(500).json({ error: "Failed to save shape" });
    }
  }
);

/**
 * GET /room/:slug
 * Retrieves room info by slug.
 */
app.get("/room/:slug", async (req: Request, res: Response): Promise<void> => {
  try {
    const slug = req.params.slug;
    const room = await prisma.room.findFirst({ where: { slug } });
    res.json({ room });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * GET /shapes/:roomId
 * Retrieves all saved shapes for a room (filtering out chat entries without a shape).
 */
app.get("/shapes/:roomId", async (req: Request, res: Response): Promise<void> => {
  try {
    const roomId = req.params.roomId;
    const shapes = await prisma.chat.findMany({
      where: {
        roomId,
        shape: { not: { equals: null } },
      },
      select: {
        id: true,
        shape: true,
        createdAt: true,
        userId: true,
      },
      orderBy: { createdAt: "asc" },
    });

    res.status(200).json(shapes);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to fetch shapes" });
  }
});

/**
 * Start Express server on port 3001, listening on all interfaces.
 */
async function startServer() {
  // Initialize database connection first
  await initializeDatabase();
  
  app.listen(3001, "0.0.0.0", () => {
    console.log("🚀 Backend listening on port 3001");
  });
}

// Start the server
startServer().catch((error) => {
  console.error("❌ Failed to start server:", error);
  process.exit(1);
});
