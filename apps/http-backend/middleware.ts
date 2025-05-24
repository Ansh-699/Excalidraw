import { Request, Response } from "express";

declare global {
    namespace Express {
        interface Request {
            userid?: string;
        }
    }
}
import jwt from "jsonwebtoken";
import { config } from "@repo/backend-common/secret";

export function middleware(req: Request, res: Response, next: Function) {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.status(401).send("Unauthorized");
    }
    
    try {
        const decoded = jwt.verify(token, config.jwtSecret) as { userid: string };
        req.userid = decoded.userid; 
        next();
    } catch (error) {
        return res.status(403).send("Forbidden");
    }
    }