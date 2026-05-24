# TypeMind AI — Project Structure

```
Sumit-Typing Test/
├── apps/
│   ├── api/                         # Backend (Express + MongoDB)
│   │   └── src/
│   │       ├── config/              # env, database
│   │       ├── middleware/          # auth, errors
│   │       ├── models/              # Mongoose schemas
│   │       ├── routes/              # REST API endpoints
│   │       ├── services/            # business logic (AI coach, analytics)
│   │       ├── socket/              # Socket.IO (multiplayer)
│   │       ├── data/                # static data (code snippets)
│   │       └── index.ts             # server entry
│   │
│   └── web/                         # Frontend (Next.js)
│       ├── app/                     # Routes only (pages & layouts)
│       │   ├── layout.tsx           # Root layout (fonts, providers)
│       │   ├── globals.css          # Design tokens & base styles
│       │   ├── (marketing)/         # Public landing
│       │   ├── (auth)/              # Login & signup
│       │   └── (app)/               # Logged-in / app features
│       ├── components/              # React UI components
│       │   ├── ui/                  # Buttons, inputs, panels
│       │   ├── layout/              # Navbar, footer, shell
│       │   ├── landing/             # Hero, features
│       │   ├── typing/              # Typing test UI
│       │   ├── dashboard/           # Charts & stats
│       │   ├── settings/            # Settings form
│       │   ├── race/                # Multiplayer UI
│       │   └── providers/           # React context providers
│       ├── hooks/                   # Custom React hooks
│       ├── contexts/                # Auth context
│       └── lib/                     # API client, utilities
│
└── packages/
    └── shared/                      # Shared types, validation, word lists
        └── src/
```

## Route map (web)

| URL | Folder | Description |
|-----|--------|-------------|
| `/` | `(marketing)/` | Landing page |
| `/login` | `(auth)/login/` | Sign in |
| `/signup` | `(auth)/signup/` | Register |
| `/test` | `(app)/test/` | Typing test |
| `/dashboard` | `(app)/dashboard/` | Analytics |
| `/profile` | `(app)/profile/` | User profile |
| `/settings` | `(app)/settings/` | Preferences |
| `/daily` | `(app)/daily/` | Daily challenge |
| `/leaderboard` | `(app)/leaderboard/` | Top WPM & accuracy rankings |
| `/race` | `(app)/race/` | Multiplayer |
| `/admin` | `(app)/admin/` | Admin panel |

## API map

Base: `http://localhost:4000/api/v1`

| Prefix | File | Purpose |
|--------|------|---------|
| `/auth` | `auth.routes.ts` | Register, login, me |
| `/sessions` | `sessions.routes.ts` | Typing sessions |
| `/ai` | `ai.routes.ts` | Coach & adaptive text |
| `/analytics` | `analytics.routes.ts` | Dashboard stats |
| `/content` | `content.routes.ts` | Quotes & code |
| `/profile` | `profile.routes.ts` | User settings |
| `/daily` | `daily.routes.ts` | Daily challenge |
| `/leaderboard` | `leaderboard.routes.ts` | Rankings by mode or content |
| `/admin` | `admin.routes.ts` | Admin users |
