import { WebSocketServer } from 'ws';
import jwt from 'jsonwebtoken';
import { config } from "@repo/backend-common/secret";
import {prisma} from "@repo/db/clients";


const wss = new WebSocketServer({ port: 8081 });

wss.on('connection', function connection(ws , request) {
  ws.on('error', console.error);

  const url = request.url 
  if (!url) {
    ws.close(1008, 'Invalid URL');
    return;
  }

  const queryParams = new URLSearchParams(url.split('?')[1]);
  const token = queryParams.get('token');
  if (!token) {
    ws.close(1008, 'Invalid token');
    return;
  }
  const decoded = jwt.verify(token, config.jwtSecret);

  if (!decoded || typeof decoded !== 'object' || !('userid' in decoded)) {
    ws.close(1008, 'Invalid token payload');
    return;
  }

  ws.on('message', function message(data) {
   ws.send('pong');
  });
  
});