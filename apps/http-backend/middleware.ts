import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
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
    const decoded = jwt.verify(token, config.jwtSecret) as { userid: string };
    req.userid = decoded.userid;
    next();
  } catch (error) {
    res.status(403).send("Forbidden");
    return;
  }
}
