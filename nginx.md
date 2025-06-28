# ----------------------------
# Upstream definitions with keepalive
# ----------------------------
upstream backend_api {
    server 127.0.0.1:3001;
    keepalive 32;
}
upstream frontend_app {
    server 127.0.0.1:3000;
    keepalive 32;
}
upstream websocket {
    server 127.0.0.1:8081;
    keepalive 16;
}

# ----------------------------
# Map for WebSocket upgrades
# ----------------------------
map $http_upgrade $connection_upgrade {
    default   upgrade;
    ''        close;
}

# ----------------------------
# HTTP → HTTPS redirect
# ----------------------------
server {
    listen 80;
    server_name excalidraw.anshtyagi.me;
    return 301 https://$host$request_uri;
}

# ----------------------------
# HTTPS server
# ----------------------------
server {
    listen 443 ssl;
    http2 on;
    server_name excalidraw.anshtyagi.me;

    # SSL (Certbot-managed)
    ssl_certificate     /etc/letsencrypt/live/excalidraw.anshtyagi.me/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/excalidraw.anshtyagi.me/privkey.pem;
    include             /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam         /etc/letsencrypt/ssl-dhparams.pem;

    # ------------------------
    # Custom log_format to see timings
    # ------------------------
    log_format timed_combined  '$remote_addr - $remote_user [$time_local] '
        '"$request" $status $body_bytes_sent '
        '"$http_referer" "$http_user_agent" '
        'rt=$request_time '           # total time
        'uct=$upstream_connect_time ' # time to connect to upstream
        'uht=$upstream_header_time '  # time to receive first byte from upstream
        'urt=$upstream_response_time';# time to receive full response

    access_log /var/log/nginx/access.log timed_combined;
    error_log  /var/log/nginx/error.log warn;

    # ------------------------
    # 1) /signin
    # ------------------------
    location = /signin {
        proxy_http_version 1.1;
        proxy_set_header Host              $host;
        proxy_set_header X-Real-IP         $remote_addr;
        proxy_set_header X-Forwarded-For   $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header Connection        "";

        limit_except POST {
            proxy_pass http://frontend_app;
        }
        proxy_pass http://backend_api;
    }

    # ------------------------
    # 2) /signup
    # ------------------------
    location = /signup {
        proxy_http_version 1.1;
        proxy_set_header Host              $host;
        proxy_set_header X-Real-IP         $remote_addr;
        proxy_set_header X-Forwarded-For   $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header Connection        "";

        limit_except POST {
            proxy_pass http://frontend_app;
        }
        proxy_pass http://backend_api;
    }

    # ------------------------
    # 3) Other API routes
    # ------------------------
    location = /room-id {
        proxy_http_version 1.1;
        proxy_set_header Host              $host;
        proxy_set_header X-Real-IP         $remote_addr;
        proxy_set_header X-Forwarded-For   $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header Connection        "";
        proxy_pass http://backend_api;
    }
    location ~ ^/(room|shapes)/[^/]+/?$ {
        proxy_http_version 1.1;
        proxy_set_header Host              $host;
        proxy_set_header X-Real-IP         $remote_addr;
        proxy_set_header X-Forwarded-For   $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header Connection        "";
        proxy_pass http://backend_api;
    }

    # ------------------------
    # 4) WebSockets
    # ------------------------
    location /ws {
        proxy_pass http://websocket;
        proxy_http_version 1.1;
        proxy_set_header Upgrade    $http_upgrade;
        proxy_set_header Connection $connection_upgrade;
        proxy_set_header Host       $host;
        proxy_cache_bypass          $http_upgrade;
    }

    # ------------------------
    # 5) Frontend fallback
    # ------------------------
    location / {
        proxy_http_version 1.1;
        proxy_set_header Host              $host;
        proxy_set_header X-Real-IP         $remote_addr;
        proxy_set_header X-Forwarded-For   $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header Connection        "";

        proxy_pass http://frontend_app;
        proxy_set_header Upgrade    $http_upgrade;
        proxy_set_header Connection $connection_upgrade;

        # buffering & timeouts
        proxy_buffering       on;
        proxy_buffers         16 4k;
        proxy_connect_timeout 60s;
        proxy_read_timeout    60s;
    }
}
