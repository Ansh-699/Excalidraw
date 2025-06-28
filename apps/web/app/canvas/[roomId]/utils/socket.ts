// utils/socket.ts

// Lazy load config to avoid bundle delays
const getWebSocketUrl = () => {
  const isProduction = typeof window !== 'undefined' && window.location.hostname !== 'localhost';
  return isProduction ? 'wss://excalidraw.anshtyagi.me/ws' : 'ws://localhost:8081';
};

let socket: WebSocket | null = null;
const messageHandlers: { [type: string]: ((data: any) => void)[] } = {};

export function connectWebSocket(
  token: string,
  onOpenCallback?: () => void
) {
  if (socket && socket.readyState <= 1) return;

  const wsUrl = getWebSocketUrl();
  socket = new WebSocket(`${wsUrl}?token=${token}`);
  
  socket.onopen = () => {
    console.log("WebSocket connected");
    if (onOpenCallback) onOpenCallback();
  };

  socket.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      console.log("WebSocket message received:", data);
      const handlers = messageHandlers[data.type];
      if (handlers) handlers.forEach((h) => h(data));
    } catch {
      console.error("Invalid WS message:", event.data);
    }
  };

  socket.onerror = (err) => console.error("WebSocket error:", err);
  socket.onclose = () => console.log("WebSocket disconnected");
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
