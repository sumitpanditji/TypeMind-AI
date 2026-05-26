# Local Setup

This project is an npm workspace with:

- `apps/web` - Next.js frontend
- `apps/api` - backend API, MongoDB models, Socket.IO
- `packages/shared` - shared types, validation, typing helpers

## 1. Install Requirements

Install the items listed in `requirements.txt`.

Recommended versions:

- Node.js 20 or newer
- npm 10 or newer
- MongoDB 7 if you want a real local database

## 2. Install Dependencies

```powershell
npm install
```

## 3. Create Environment File

```powershell
Copy-Item .env.example apps/api/.env
"NEXT_PUBLIC_API_URL=http://localhost:4000/api/v1" | Set-Content apps/web/.env.local
```

For normal local development, the default values are enough.

`OPENAI_API_KEY` is optional. Without it, the AI coach uses built-in local fallback text.

## 4. Choose Database Mode

### Option A: Easiest Demo Mode

Leave this value in `apps/api/.env`:

```env
DEMO_DB_FALLBACK=true
```

Then start the API and web app:

```powershell
npm run dev
```

If MongoDB is not running, the API automatically starts an in-memory MongoDB database and seeds demo data. This is best for a friend who just wants to run and test the app quickly.

Demo accounts:

- User: `demo@typemind.local` / `Demo@12345`
- Admin: `admin@typemind.local` / `Admin@12345`

In-memory data resets every time the API restarts.

### Option B: Real Local MongoDB

Start MongoDB with Docker:

```powershell
docker run -d --name typemind-mongo -p 27017:27017 mongo:7
```

Seed the database:

```powershell
npm run seed
```

Start the API and web app:

```powershell
npm run dev
```

The seed command refreshes only the demo accounts and their demo typing data.

## 5. Check The App

- API health: `http://localhost:4000/health`
- API base: `http://localhost:4000/api/v1`
- Web app: `http://localhost:3000`
- Quotes endpoint: `http://localhost:4000/api/v1/content/quotes`
- Daily challenge: `http://localhost:4000/api/v1/daily/challenge`

## Useful Scripts

```powershell
npm run dev        # Start API and web in watch mode
npm run dev:api    # Start only the API
npm run dev:web    # Start only the web app
npm run seed       # Seed demo data into real MongoDB
npm run build      # Build shared package, API, and web
npm run typecheck  # Type-check shared package, API, and web
npm test           # Run shared package tests
```

## Troubleshooting

- If port `4000` is busy, change `PORT` in `apps/api/.env`.
- If Docker says the Mongo container already exists, run `docker start typemind-mongo`.
- If you do not want in-memory fallback, set `DEMO_DB_FALLBACK=false`.
- If authentication fails after changing secrets, log in again to get fresh tokens.
