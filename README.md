# TypeMind AI

Premium AI-powered typing practice platform. Adaptive exercises, real-time analytics, and a polished dark UI inspired by Monkeytype and modern SaaS design.

## Stack

- **Frontend:** Next.js 16, React 19, Tailwind CSS v4, Framer Motion, TanStack Query, Recharts
- **Backend:** Express.js, MongoDB, Socket.IO, JWT auth, OpenAI API
- **Monorepo:** npm workspaces (`apps/web`, `apps/api`, `packages/shared`)

## Prerequisites

- Node.js 20+
- MongoDB (local or Docker)

## Quick Start

```bash
# Install dependencies
npm install

# Copy environment files
cp .env.example apps/api/.env
# apps/web/.env.local is pre-configured for local API

# Start MongoDB (Docker)
docker run -d -p 27017:27017 --name typemind-mongo mongo:7

# Build shared package
npm run build -w @typemind/shared

# Run API + Web (two terminals or one)
npm run dev
```

- **Web:** http://localhost:3000
- **API:** http://localhost:4000
- **Health:** http://localhost:4000/health

## Environment Variables

| Variable | Location | Description |
|----------|----------|-------------|
| `MONGODB_URI` | `apps/api/.env` | MongoDB connection string |
| `JWT_ACCESS_SECRET` | `apps/api/.env` | Access token secret (32+ chars) |
| `JWT_REFRESH_SECRET` | `apps/api/.env` | Refresh token secret |
| `OPENAI_API_KEY` | `apps/api/.env` | Optional — enables AI coach & adaptive text |
| `NEXT_PUBLIC_API_URL` | `apps/web/.env.local` | API base URL |

Without `OPENAI_API_KEY`, the AI coach uses rule-based fallbacks.

## MVP Features

- Premium dark landing page with animated keyboard
- Full typing test (timers, modes, focus mode, shortcuts)
- JWT authentication (register / login)
- Session persistence and analytics summary
- AI typing coach (analyze + adaptive text generation)
- Dashboard with WPM chart (logged-in users)
- Settings, daily challenge, race lobby, admin panel

## Project Structure

See [STRUCTURE.md](./STRUCTURE.md) for the full folder map and route reference.

```
apps/web/app/
  (marketing)/     Landing page
  (auth)/          Login & signup
  (app)/           Test, dashboard, settings, race, daily, admin
apps/api/src/      Express API
packages/shared/   Shared types & validation
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start API and web concurrently |
| `npm run dev:api` | API only |
| `npm run dev:web` | Web only |
| `npm run build` | Build all packages |
| `npm run typecheck` | TypeScript check all packages |

## Keyboard Shortcuts (Typing Test)

- `Tab` / `Esc` — Restart test
- `Ctrl+Shift+P` — Toggle focus mode

## License

MIT
