// utils/socket.ts

const getWebSocketUrl = () => {
  if (process.env.NEXT_PUBLIC_WEBSOCKET_URL) {
    return process.env.NEXT_PUBLIC_WEBSOCKET_URL;
  }
  if (typeof window !== "undefined" && window.location.hostname === "localhost") {
    return "ws://localhost:8081";
  }
  // In production NEXT_PUBLIC_WEBSOCKET_URL must be set.
  return "";
};

let socket: WebSocket | null = null;
const messageHandlers: { [type: string]: ((data: any) => void)[] } = {};

export function connectWebSocket(token: string, onOpenCallback?: () => void) {
  if (socket && socket.readyState <= 1) return;

  const wsUrl = getWebSocketUrl();
  if (!wsUrl) {
    console.error(
      "WebSocket URL not configured. Set NEXT_PUBLIC_WEBSOCKET_URL."
    );
    return;
  }

  socket = new WebSocket(`${wsUrl}?token=${token}`);

  socket.onopen = () => {
    if (onOpenCallback) onOpenCallback();
  };

  socket.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      const handlers = messageHandlers[data.type];
      if (handlers) handlers.forEach((h) => h(data));
    } catch {
      console.error("Invalid WS message:", event.data);
    }
  };

  socket.onerror = (err) => console.error("WebSocket error:", err);
  socket.onclose = () => {};
}

export function sendMessage(data: any) {
  if (socket?.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify(data));
  } else {
    console.warn("WebSocket not open:", data);
  }
}

export function onMessageType(type: string, callback: (data: any) => void) {
  if (!messageHandlers[type]) messageHandlers[type] = [];
  messageHandlers[type].push(callback);
}

export function offMessageType(type: string, callback: (data: any) => void) {
  if (!messageHandlers[type]) return;
  messageHandlers[type] = messageHandlers[type].filter((cb) => cb !== callback);
}
