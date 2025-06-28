// Environment configuration
export type Environment = 'local' | 'droplet' | 'production';

// Change this value to switch environments
// Set to 'local' for development, 'droplet' for direct IP access, 'production' for domain
let CURRENT_ENV: Environment = 'production';

// Domain/IP configurations
const DOMAINS = {
  local: 'localhost',
  droplet: '142.93.223.72',
  production: 'excalidraw.anshtyagi.me',
} as const;

// Configuration for different environments
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

// Export current environment configuration
export const CONFIG = config[CURRENT_ENV];

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

// Export individual values for convenience
export const {
  DOMAIN,
  FRONTEND_URL,
  BACKEND_URL,
  WEBSOCKET_URL,
  WEBSOCKET_URL_SECURE,
  API_BASE_URL,
} = CONFIG;
