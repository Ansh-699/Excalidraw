# Environment Configuration

This configuration system allows you to easily switch between different environments by changing a single value.

## How to Use

### Quick Environment Switch

To switch environments, simply change the `CURRENT_ENV` value in `/packages/common/src/config.ts`:

```typescript
// For local development
let CURRENT_ENV: Environment = 'local';

// For testing with droplet IP
let CURRENT_ENV: Environment = 'droplet';

// For production with domain
let CURRENT_ENV: Environment = 'production';
```

### Available Environments

1. **local** - Development environment
   - Uses `localhost` with different ports
   - HTTP/WS connections

2. **droplet** - Direct IP access
   - Uses `142.93.223.72` with ports
   - HTTP/WS connections

3. **production** - Domain with SSL
   - Uses `excalidraw.anshtyagi.me`
   - HTTPS/WSS connections
   - API calls use relative URLs for NGINX routing

### Environment Values

All configurations export these values:
- `DOMAIN` - The base domain/IP
- `FRONTEND_URL` - Complete frontend URL
- `BACKEND_URL` - Complete backend URL
- `WEBSOCKET_URL` - WebSocket URL
- `WEBSOCKET_URL_SECURE` - Secure WebSocket URL
- `API_BASE_URL` - Base URL for API calls

### Helper Functions

```typescript
import { isDev, isProduction, isDroplet, setEnvironment } from '@repo/common/config';

// Check current environment
if (isDev()) {
  console.log('Running in development');
}

// Switch environment programmatically
setEnvironment('local');
```

### Usage in Components

```typescript
import { API_BASE_URL, WEBSOCKET_URL_SECURE } from '@repo/common/config';

// API calls
const response = await fetch(`${API_BASE_URL}/signin`, { ... });

// WebSocket connections
const ws = new WebSocket(`${WEBSOCKET_URL_SECURE}?token=${token}`);
```

## Benefits

1. **Single Point of Change** - Change one value to switch all URLs
2. **Environment Consistency** - All files use the same configuration
3. **Easy Development** - Switch between local/staging/production easily
4. **Type Safety** - TypeScript ensures correct environment values
