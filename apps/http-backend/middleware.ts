import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { config } from "@repo/backend-common/secret";

// Extend Express Request to include `userid`
declare global {
  namespace Express {
    interface Request {
      userid?: string;
    }
  }
}

export function middleware(req: Request, res: Response, next: NextFunction): void {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    res.status(401).send("Unauthorized");
    return;
  }

  try {
    const secretHash = crypto.createHash("sha256").update(config.jwtSecret).digest("hex").slice(0, 8);
    console.log(`[middleware] JWT secret hash: ${secretHash}`);
    const decoded = jwt.verify(token, config.jwtSecret) as { userid: string };
    req.userid = decoded.userid;
    next();
  } catch (error) {
    console.error("JWT verification failed:", error);
    try {
      const secretHash = crypto.createHash("sha256").update(config.jwtSecret).digest("hex").slice(0, 8);
      res.setHeader("X-JWT-Hash", secretHash);
    } catch {}
    res.status(403).send("Forbidden");
    return;
  }
}
