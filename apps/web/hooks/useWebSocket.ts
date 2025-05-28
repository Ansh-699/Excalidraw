"use client";
import {WEBHOOKS_CONFIG} from "./config";
import { useEffect, useRef, useState } from "react";

export function useWebSocket(url: string, token: string) {
  const ws = useRef<WebSocket | null>(null);
  const [messages, setMessages] = useState<unknown[]>([]);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    ws.current = new WebSocket(`${WEBHOOKS_CONFIG}?token=${token}`);

    ws.current.onopen = () => setConnected(true);
    ws.current.onclose = () => setConnected(false);

    ws.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setMessages(prev => [...prev, data]);
      } catch {
        console.error("Invalid JSON from WS");
      }
    };

    return () => {
      ws.current?.close();
    };
  }, [url, token]);

  function sendMessage(msg: unknown) {
    if (ws.current && connected) {
      ws.current.send(JSON.stringify(msg));
    }
  }

  return { connected, messages, sendMessage };
}
