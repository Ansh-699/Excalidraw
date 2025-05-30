import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { config } from "@repo/backend-common/secret";
import { middleware } from "./middleware.js";
import { CreateUserSchema } from "@repo/common/types";
import { prisma } from "@repo/db/clients";
import { SigninSchema } from "@repo/common/types";
import { CreateRoomSchema } from "@repo/common/types";

import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());



app.post("/signin", async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    console.log("Signin attempt:", { email, passwordExists: !!password });
    if (typeof email !== "string" || typeof password !== "string") {
      res.status(400).json({ error: "Email and password must be strings" });
      return;
    }
    if (!email.trim() || !password.trim()) {
      res.status(400).json({ error: "Missing email or password" });
      return;
    }

    const data = SigninSchema.safeParse({ username: email, password });
    if (!data.success) {
      console.error("SigninSchema error:", data.error);
      res.status(400).json({ error: "Invalid credentials format" });
      return;
    }

    const user = await prisma.user.findUnique({ where: { email } });
    console.log("User found:", user ? user.email : "No user");

    if (!user || !user.password) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    console.log("Password match:", isMatch);

    if (!isMatch) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    if (!config.jwtSecret) {
      console.error("JWT secret is not set");
      res.status(500).json({ error: "Internal server error" });
      return;
    }

    const token = jwt.sign({ userid: user.id }, config.jwtSecret, {
      expiresIn: "1h",
    });

    res.status(200).json({ message: "Sign in successful", token });
  } catch (err) {
    console.error("Signin error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});


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

    // If your SigninSchema expects 'username', but you use email, consider changing schema or here:
    const data = SigninSchema.safeParse({ username: email, password });
    if (!data.success) {
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

    if (!config.jwtSecret) {
      console.error("JWT secret is not set");
      res.status(500).json({ error: "Internal server error" });
      return;
    }

    const token = jwt.sign({ userid: user.id }, config.jwtSecret, {
      expiresIn: "1h",
    });

    res.status(200).json({ message: "Sign in successful", token });
  } catch (err) {
    console.error("Signin error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

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

// app.get("/chats/:roomId", async (req, res) => {
//   try {
//     const roomId = req.params.roomId;
//     const messages = await prisma.chat.findMany({
//       where: {
//         roomId,
//       },
//       orderBy: {
//         id: "desc",
//       },
//       take: 1000,
//     });

//     res.json({ messages });
//   } catch (e) {
//     console.error(e);
//     res.json({ messages: [] });
//   }
// });

// app.get("/room/:slug", async (req, res) => {
//   try {
//     const slug = req.params.slug;
//     const room = await prisma.room.findFirst({
//       where: {
//         slug,
//       },
//     });

//     res.json({ room });
//   } catch (e) {
//     console.error(e);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });

// NEW endpoint to fetch all shapes for a room, ordered oldest to newest
// app.get("/shapes/:roomId", async (req, res) => {
//   try {
//     const roomId = req.params.roomId;

//     const shapes = await prisma.chat.findMany({
//       where: {
//         roomId,
//         shape: {
//           not: {
//             equals: null,
//           },
//         },
//       },
//       select: {
//         id: true,
//         shape: true,
//         createdAt: true,
//         userId: true,
//       },
//       orderBy: {
//         createdAt: "asc",
//       },
//     });

//     res.status(200).json(shapes);
//   } catch (e) {
//     console.error(e);
//     res.status(500).json({ error: "Failed to fetch shapes" });
//   }
// });

app.listen(3001, "0.0.0.0", () => {
  console.log("Backend listening on port 3001");
});
