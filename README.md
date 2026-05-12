# Excalidraw

A real-time collaborative drawing board. Create a room, share the link, and sketch together — rectangles, circles, triangles, freehand pencil, eraser, colors, stroke widths, and undo / redo, all synced over WebSockets and persisted to Postgres.

## Stack

- **Frontend** — Next.js 15 (App Router) + TypeScript + Tailwind v4 + shadcn/ui, on a `<canvas>`
- **HTTP backend** — Bun + Express, JWT auth (signup / signin / rooms)
- **WebSocket backend** — Bun + `ws`, handles `join_room`, `drawing`, `erase_shape`
- **Database** — Postgres via Prisma (`User`, `Room`, `Chat` with a `shape: Json?` column)
- **Monorepo** — Turborepo, Bun workspaces

## Layout

```
apps/
  web/                 Next.js frontend
  http-backend/        Express HTTP API (port 3001)
  web-socket-backend/  WebSocket server  (port 8081)
packages/
  db/                  Prisma schema + client
  common/              Shared types (zod) + env config
  backend-common/      Shared JWT secret loader
  ui/ eslint-config/ typescript-config/
docker/
  docker.backend       Railway image for http-backend
  docker.websocket     Railway image for web-socket-backend
```

## Local development

Prereqs: [Bun](https://bun.sh) ≥ 1.2, a Postgres database (a free [Neon](https://neon.tech) project works great).

```bash
# 1. clone + install
git clone https://github.com/Ansh-699/Excalidraw
cd Excalidraw
bun install

# 2. configure env
cp .env.example .env
# edit .env — at minimum fill in DATABASE_URL and JWT_SECRET

# 3. generate prisma client + apply migrations
bun run generate:db
cd packages/db && bunx prisma migrate deploy && cd ../..

# 4. run everything
bun run dev
```

Opens the frontend on <http://localhost:3003>, HTTP backend on 3001, WS on 8081.

Run individual services:

```bash
bun run start:frontend   # only the Next.js app
bun run start:backend    # only the HTTP API
bun run start:ws         # only the WebSocket server
```

## Deployment

Shipped as:

- **Vercel** — `apps/web` (Next.js frontend)
- **Railway** — `apps/http-backend` and `apps/web-socket-backend` (two services, separate Dockerfiles in `docker/`)
- **Neon** — managed Postgres

See the top-level `.env.example` for the full list of environment variables. Set them in Vercel and Railway via each dashboard; never commit a filled-in `.env`.

Rough steps:

1. Create a Neon project, copy the connection string into `DATABASE_URL`.
2. On Railway, create two services from this repo — one pointing at `docker/docker.backend`, one at `docker/docker.websocket`. Set `DATABASE_URL`, `JWT_SECRET`, and `CORS_ORIGINS` on both.
3. On Vercel, import the repo. Root directory stays at `/`; Vercel reads `vercel.json`. Add `NEXT_PUBLIC_BACKEND_URL` and `NEXT_PUBLIC_WEBSOCKET_URL` pointing at your Railway public URLs.
4. Push to `main`. Vercel and Railway redeploy automatically; GitHub Actions runs `check-types` + `build` on PRs.

## Keyboard shortcuts

| Shortcut | Action |
| --- | --- |
| `Ctrl/Cmd + Z` | Undo your last shape (broadcast to room) |
| `Ctrl/Cmd + Shift + Z` / `Ctrl + Y` | Redo |

## License

MIT
