# TypeMind AI

Premium AI-powered typing practice platform. Adaptive exercises, real-time analytics, and a polished dark UI inspired by Monkeytype and modern SaaS design.

## Stack

- **Frontend:** Next.js 16, React 19, Tailwind CSS v4, Framer Motion, TanStack Query, Recharts
- **Backend:** Express.js, MongoDB, Socket.IO, JWT auth, OpenAI API
- **Shared:** TypeScript types, validation, typing helpers
- **Monorepo:** npm workspaces (`apps/web`, `apps/api`, `packages/shared`)

## Prerequisites

- Node.js 20+
- MongoDB local/Docker, or the built-in dev demo database fallback

See [requirements.txt](./requirements.txt) for the full local requirements.

## Quick Start

```powershell
# Install dependencies
npm install

# Copy API environment file
Copy-Item .env.example apps/api/.env

# Create web environment file
"NEXT_PUBLIC_API_URL=http://localhost:4000/api/v1" | Set-Content apps/web/.env.local

# Start API + Web
npm run dev
```

- **Web:** http://localhost:3000
- **API:** http://localhost:4000
- **Health:** http://localhost:4000/health

If MongoDB is not running and `DEMO_DB_FALLBACK=true`, the API starts an in-memory MongoDB database with demo users:

- `demo@typemind.local` / `Demo@12345`
- `admin@typemind.local` / `Admin@12345`

For full handoff steps, including Docker MongoDB and the seed command, see [SETUP.md](./SETUP.md).

## Environment Variables

| Variable | Location | Description |
|----------|----------|-------------|
| `MONGODB_URI` | `apps/api/.env` | MongoDB connection string |
| `DEMO_DB_FALLBACK` | `apps/api/.env` | Starts seeded in-memory MongoDB when local Mongo is unavailable |
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

See [STRUCTURE.md](./STRUCTURE.md) for the folder map and route reference.

```
apps/web/app/      Next.js routes and UI
apps/api/src/      Express API
packages/shared/   Shared types & validation
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start API and web concurrently |
| `npm run dev:api` | API only |
| `npm run dev:web` | Web only |
| `npm run seed` | Seed demo users and sessions into real MongoDB |
| `npm run build` | Build all packages |
| `npm run typecheck` | TypeScript check all packages |

## Keyboard Shortcuts (Typing Test)

- `Tab` / `Esc` — Restart test
- `Ctrl+Shift+P` — Toggle focus mode

## License

MIT
