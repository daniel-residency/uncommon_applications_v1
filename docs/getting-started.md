# Getting Started

## Prerequisites

- **Node.js** 18+ and npm
- **Supabase** account ([supabase.com](https://supabase.com))
- **Anthropic API key** ([console.anthropic.com](https://console.anthropic.com)) — used for AI matching

## Clone & Install

```bash
git clone <repo-url>
cd application
npm install
```

## Environment Variables

Create a `.env.local` file in the project root:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
ANTHROPIC_API_KEY=your_anthropic_api_key
ADMIN_SECRET=your_admin_secret
```

| Variable | Where to get it | Notes |
|----------|----------------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase dashboard → Settings → API | Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase dashboard → Settings → API | `anon` / `public` key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase dashboard → Settings → API | `service_role` key — **keep secret** |
| `ANTHROPIC_API_KEY` | Anthropic Console → API Keys | Used by the `/api/match` route for AI matching |
| `ADMIN_SECRET` | You choose this | Any string; used as the admin login password and stored as an httpOnly cookie |

## Supabase Setup

1. Create a new Supabase project
2. Go to the **SQL Editor** and run the two migration files in order:
   - `supabase/migrations/001_initial_schema.sql` — creates the `homes` and `applications` tables, indexes, and update triggers
   - `supabase/migrations/002_seed_homes.sql` — seeds 10 residency homes with descriptions, matching prompts, and optional questions
3. Copy your project URL and keys into `.env.local`

The database has 2 tables: `homes` (10 seeded rows) and `applications` (created at runtime). See [database.md](./database.md) for the full schema.

## Run Dev Server

```bash
npm run dev
```

The app runs at [http://localhost:3000](http://localhost:3000).

## Run Tests

```bash
npx playwright install   # first time only — installs browser binaries
npx playwright test      # run all tests headless
npx playwright test --ui # interactive UI mode
```

Tests mock all API routes so they don't need a running Supabase instance. See [testing.md](./testing.md) for details.

## Deploy to Vercel

1. Push this repo to GitHub
2. Import the repo in [Vercel](https://vercel.com)
3. Set all 5 environment variables in the Vercel project settings
4. Deploy — Vercel auto-detects Next.js and handles the build
