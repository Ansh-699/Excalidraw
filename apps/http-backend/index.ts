import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { config } from "@repo/backend-common/secret";
import { middleware } from "./middleware.js";
import { CreateUserSchema } from "@repo/common/types";
import { prisma } from "@repo/db/clients";
import {SigninSchema} from "@repo/common/types";
import {CreateRoomSchema} from "@repo/common/types";

const app = express();
app.use(express.json()); // Enable JSON body parsing

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

    res.status(200).json({ message: "User signed up successfully"
      , userId: user.id
     });
   
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/signin", async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ error: "Missing email or password" });

    return;
  }
  const data = SigninSchema.safeParse({ username: email, password });
  if (!data.success) {
    res.status(400).json({ error: "Invalid credentials" });
    return;
  }
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(401).json({ error: "Invalid credentials" });
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
  if (!req.userid) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  const data = CreateRoomSchema.safeParse(req.body);
  if (!data.success) {
    res.status(400).json({ error: "Invalid room data" });
    return;
  }

  const userid= req.userid;
  await prisma.room.create({
    data: {
      slug : data.data.name,
      adminId: userid,
    }
  });
  res.status(200).json({ roomId: "12345", userId: req.userid });
});

app.listen(3000, () => {
  console.log("HTTP backend is running on port 3000");
});
