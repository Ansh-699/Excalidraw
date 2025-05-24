import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { config } from "@repo/backend-common/secret";
import { middleware } from "./middleware.js";
import {CreateUserSchema} from "@repo/common/types";

const Express = require("express");
const app = Express();

app.post("/signup", (req: Request, res: Response) => {


    const data= CreateUserSchema.safeParse(req.body);
    if(!data.success) {
       
        return res.status(400).send("Invalid user data");
    }
  console.log("User signed up");
  res.status(200).send("User signed up successfully");
});

app.post("/signin", (req: Request, res: Response) => {
  const userid = 1;
  const token = jwt.sign({ userid }, config.jwtSecret, { expiresIn: "1h" });
});

app.post("/room-id", middleware,  (req: Request, res: Response) => {
  //db call


  res.status(200).send({ roomId: "12345" });
  
});

app.listen(3000, () => {
  console.log("HTTP backend is running on port 3000");
});
