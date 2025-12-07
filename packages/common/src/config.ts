// Environment configuration
export type Environment = 'local' | 'droplet' | 'production';

// Auto-detect environment based on NODE_ENV or use explicit setting
const getEnvironment = (): Environment => {
  if (typeof process !== 'undefined' && process.env.NODE_ENV === 'production') {
    return 'production';
  }
  return 'local';
};

let CURRENT_ENV: Environment = getEnvironment();

// Get configuration from environment variables with fallbacks
const getEnvConfig = () => {
  const domain = process.env.DOMAIN || 'localhost';
  const frontendPort = process.env.FRONTEND_PORT || '3000';
  const httpPort = process.env.HTTP_PORT || '3001';
  const wsPort = process.env.WS_PORT || '8081';
  
  // Check if we're actually in production (not just NODE_ENV=production for Docker)
  // Production means using a real domain, not localhost
  const isRealProduction = domain !== 'localhost' && !domain.includes('127.0.0.1') && !domain.match(/^\d+\.\d+\.\d+\.\d+$/);
  const isProduction = CURRENT_ENV === 'production' && isRealProduction;
  const protocol = isProduction ? 'https' : 'http';
  const wsProtocol = isProduction ? 'wss' : 'ws';
  
  // In browser, NEXT_PUBLIC_* variables are available, on server both are available
  // Prefer NEXT_PUBLIC_* for browser compatibility
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || process.env.BACKEND_URL;
  const websocketUrl = process.env.NEXT_PUBLIC_WEBSOCKET_URL || process.env.WEBSOCKET_URL;
  
  // Default API URL - use full URL unless it's real production with a domain
  const defaultApiUrl = isRealProduction ? '' : `${protocol}://${domain}:${httpPort}`;
  
  return {
    DOMAIN: domain,
    FRONTEND_URL: process.env.FRONTEND_URL || `${protocol}://${domain}${isProduction ? '' : `:${frontendPort}`}`,
    BACKEND_URL: backendUrl || `${protocol}://${domain}${isProduction ? '' : `:${httpPort}`}`,
    WEBSOCKET_URL: websocketUrl || `${wsProtocol}://${domain}${isProduction ? '/ws' : `:${wsPort}`}`,
    WEBSOCKET_URL_SECURE: websocketUrl || `${wsProtocol}://${domain}${isProduction ? '/ws' : `:${wsPort}`}`,
    API_BASE_URL: backendUrl || defaultApiUrl,
  };
};

// Legacy domain configurations for backward compatibility
const DOMAINS = {
  local: 'localhost',
  droplet: '142.93.223.72',
  production: 'excalidraw.anshtyagi.me',
} as const;

// Legacy configuration for backward compatibility
const config = {
  local: {
    DOMAIN: DOMAINS.local,
    FRONTEND_URL: `http://${DOMAINS.local}:3000`,
    BACKEND_URL: `http://${DOMAINS.local}:3001`, 
    WEBSOCKET_URL: `ws://${DOMAINS.local}:8081`,
    WEBSOCKET_URL_SECURE: `ws://${DOMAINS.local}:8081`,
    API_BASE_URL: `http://${DOMAINS.local}:3001`,
  },
  droplet: {
    DOMAIN: DOMAINS.droplet,
    FRONTEND_URL: `http://${DOMAINS.droplet}:3000`,
    BACKEND_URL: `http://${DOMAINS.droplet}:3001`,
    WEBSOCKET_URL: `ws://${DOMAINS.droplet}:8081`,
    WEBSOCKET_URL_SECURE: `ws://${DOMAINS.droplet}:8081`,
    API_BASE_URL: `http://${DOMAINS.droplet}:3001`,
  },
  production: {
    DOMAIN: DOMAINS.production,
    FRONTEND_URL: `https://${DOMAINS.production}`,
    BACKEND_URL: `https://${DOMAINS.production}`,
    WEBSOCKET_URL: `wss://${DOMAINS.production}/ws`,
    WEBSOCKET_URL_SECURE: `wss://${DOMAINS.production}/ws`,
    API_BASE_URL: '', // Empty for relative URLs in production
  },
} as const;

// Export current environment configuration - now uses environment variables
export const getConfig = () => {
  // Prefer environment variables over legacy config
  if (typeof process !== 'undefined' && (process.env.DOMAIN || process.env.FRONTEND_URL)) {
    return getEnvConfig();
  }
  return config[CURRENT_ENV];
};

// Helper function to switch environments
export const setEnvironment = (env: Environment) => {
  CURRENT_ENV = env;
};

// Helper to get current environment
export const getCurrentEnvironment = () => CURRENT_ENV;

// Export domain values for reference
export const DOMAINS_CONFIG = DOMAINS;

// Helper functions
export const isDev = () => CURRENT_ENV === 'local';
export const isProduction = () => CURRENT_ENV === 'production';
export const isDroplet = () => CURRENT_ENV === 'droplet';

// Get config with runtime fallback for browser
const getConfigWithFallback = () => {
  const baseConfig = getConfig();
  
  // In browser, if API_BASE_URL is empty and we're on localhost, use default backend port
  if (typeof window !== 'undefined') {
    const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    if (!baseConfig.API_BASE_URL && isLocalhost) {
      return {
        ...baseConfig,
        API_BASE_URL: 'http://localhost:3001',
        BACKEND_URL: 'http://localhost:3001',
        WEBSOCKET_URL: 'ws://localhost:8081',
        WEBSOCKET_URL_SECURE: 'ws://localhost:8081',
      };
    }
  }
  
  return baseConfig;
};

// Export individual values for convenience - now uses environment variables
export const CONFIG = getConfigWithFallback();
export const {
  DOMAIN,
  FRONTEND_URL,
  BACKEND_URL,
  WEBSOCKET_URL,
  WEBSOCKET_URL_SECURE,
  API_BASE_URL,
} = CONFIG;
