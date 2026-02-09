// Environment configuration

const getEnvVar = (key: string): string | undefined => {
  if (typeof process !== 'undefined' && process.env) {
    return process.env[key];
  }
  return undefined;
};

const getBackendUrl = () => {
  return getEnvVar('NEXT_PUBLIC_BACKEND_URL') || getEnvVar('BACKEND_URL') || 'http://localhost:3001';
};

const getWebSocketUrl = () => {
  return getEnvVar('NEXT_PUBLIC_WEBSOCKET_URL') || getEnvVar('WEBSOCKET_URL') || 'ws://localhost:8081';
};

export const getConfig = () => ({
  BACKEND_URL: getBackendUrl(),
  WEBSOCKET_URL: getWebSocketUrl(),
  WEBSOCKET_URL_SECURE: getWebSocketUrl(),
  API_BASE_URL: getBackendUrl(),
});

// Named exports for direct imports
export const API_BASE_URL = getBackendUrl();
export const WEBSOCKET_URL = getWebSocketUrl();
export const WEBSOCKET_URL_SECURE = getWebSocketUrl();
