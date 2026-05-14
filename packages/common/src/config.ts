// Environment configuration
//
// IMPORTANT: Next.js performs *literal* compile-time replacement of
// `process.env.NEXT_PUBLIC_*`. Any dynamic lookup (e.g. process.env[key])
// is NOT replaced and will be undefined in the browser bundle. Always
// reference each var by its full literal name below.

const getBackendUrl = (): string => {
  return process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";
};

const getWebSocketUrl = (): string => {
  return process.env.NEXT_PUBLIC_WEBSOCKET_URL || "ws://localhost:8081";
};

export const getConfig = () => ({
  BACKEND_URL: getBackendUrl(),
  WEBSOCKET_URL: getWebSocketUrl(),
  WEBSOCKET_URL_SECURE: getWebSocketUrl(),
  API_BASE_URL: getBackendUrl(),
});

export const API_BASE_URL = getBackendUrl();
export const WEBSOCKET_URL = getWebSocketUrl();
export const WEBSOCKET_URL_SECURE = getWebSocketUrl();
