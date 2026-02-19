# Architecture

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| UI | React 19, Tailwind CSS v4 |
| Database | Supabase (PostgreSQL) |
| AI Matching | Anthropic Claude API (Sonnet 4.6) |
| Validation | Zod |
| Testing | Playwright (e2e + integration) |

## Project Structure

```
src/
├── app/
│   ├── page.tsx                  # Redirect: checks localStorage → routes to /apply, /results, /submit
│   ├── layout.tsx                # Root layout with fonts + metadata
│   ├── globals.css               # Tailwind v4 config + custom theme tokens
│   ├── apply/
│   │   └── page.tsx              # Application form (inline email + all 9 sections on one page)
│   ├── matching/page.tsx         # AI matching animation screen
│   ├── results/page.tsx          # Matched homes + home questions + "answer all" modal
│   ├── submit/page.tsx           # Final submission confirmation
│   ├── admin/
│   │   ├── page.tsx              # Admin login
│   │   ├── dashboard/page.tsx    # Admin dashboard (stats + app list)
│   │   └── homes/page.tsx        # Admin homes management
│   └── api/
│       ├── applications/route.ts # GET/POST/PATCH applications
│       ├── homes/route.ts        # GET/POST/PATCH/DELETE homes
│       ├── match/route.ts        # POST — AI matching via Claude Sonnet 4.6
│       ├── admin/route.ts        # POST/DELETE/GET — admin auth
│       ├── admin/applications/route.ts  # GET all applications (admin)
│       └── admin/stats/route.ts  # GET application stats (admin)
├── components/
│   ├── application/
│   │   ├── question-renderer.tsx # Renders any question type from config
│   │   └── progress-bar.tsx      # Section progress indicator
│   ├── matching/
│   │   ├── letter-modal.tsx      # Modal showing personalized home letter + video
│   │   └── all-questions-modal.tsx # Modal for answering all home questions at once
│   └── ui/                       # Reusable primitives (button, input, textarea, select, modal, etc.)
├── config/
│   └── sections.ts               # All 9 form sections + questions defined here
├── hooks/
│   └── use-application.ts        # Dual auto-save hook (localStorage + Supabase)
└── lib/
    ├── types.ts                  # TypeScript interfaces (Home, Application, Section, Question)
    ├── schemas.ts                # Zod validation schemas
    ├── anthropic.ts              # Anthropic client factory
    └── supabase/
        ├── client.ts             # Browser Supabase client
        ├── server.ts             # Server-side Supabase client
        └── admin.ts              # Service-role Supabase client (for API routes)

supabase/migrations/
├── 001_initial_schema.sql        # Tables, indexes, triggers
├── 002_seed_homes.sql            # 10 residency homes
└── 003_video_urls.sql            # Video URLs for 6 homes

tests/
├── e2e/
│   ├── helpers.ts                # Shared mocks (mockAPIs, mockHomesAPI, setupNewUser, etc.)
│   └── *.spec.ts                 # E2E test files
└── integration/
    └── database.spec.ts          # Real Supabase CRUD tests (requires env vars)
```

## Key Patterns

### Email inline — no separate entry page

`/apply` handles everything: when no `application_id` is in localStorage, an email field appears at the top of the form. Sections are visible but disabled until email is submitted. After email submission:
- New users get an empty form.
- Returning users get their answers pre-filled.
- Frozen/submitted users are redirected to `/results` or `/submit`.

The root `/` page is a simple redirect that checks localStorage and routes accordingly.

### Sections config drives the form

`src/config/sections.ts` defines all 9 application sections and their questions as a static array. The `question-renderer.tsx` component reads this config and renders the correct input type for each question. **To add a new question**, just add an entry to the `SECTIONS` array — no other code changes needed.

Question types supported: `text`, `textarea`, `short_text`, `url`, `select`, `yes_no`, `country`, `multi_checkbox`.

Conditional questions are supported via the `conditional` field (e.g., "What changed since last time?" only shows if "applied_before" is "yes").

### Dual auto-save

`src/hooks/use-application.ts` saves answers in two layers:

1. **localStorage** — debounced at 300ms for instant offline resilience
2. **Supabase** — debounced at 2 seconds for durable server-side storage

On load, it compares timestamps between localStorage and the server, using whichever is newer. A `saveNow()` method flushes both immediately (used on section navigation and blur).

### Application status flow

```
in_progress → frozen → submitted
```

- **in_progress**: Applicant is filling out the form. All answers are editable.
- **frozen**: Triggered when the applicant submits their form answers. Core answers are locked, but `home_*` answer keys remain editable (for responding to home-specific questions after matching).
- **submitted**: Final state after answering home questions. No further edits allowed.

### Home answers in JSONB

All answers live in a single `answers` JSONB column. Regular section answers are keyed by question ID (e.g., `citizenship`, `pitch`). Home-specific answers are keyed as `home_<homeId>` (e.g., `home_abc123`). The PATCH endpoint enforces that only `home_*` keys can be updated once the application is frozen.

### Admin auth

Admin authentication uses a shared secret (`ADMIN_SECRET` env var). On login, the secret is stored as an httpOnly cookie (`admin_token`). Admin API routes check this cookie against the env var. There are no user accounts for admin — it's a single shared password.

## Key Files

| File | Purpose |
|------|---------|
| `src/config/sections.ts` | Defines all 9 form sections and questions — the single source of truth for the application form |
| `src/hooks/use-application.ts` | Dual auto-save hook with localStorage (300ms) + Supabase (2s) debouncing |
| `src/lib/types.ts` | TypeScript interfaces: `Home`, `Application`, `Section`, `Question`, `MatchResult` |
| `src/lib/schemas.ts` | Zod schemas for API validation: email, answers, match request, home, admin login |
| `src/components/application/question-renderer.tsx` | Renders any question type from the sections config |
| `src/components/matching/all-questions-modal.tsx` | Modal for answering all home questions at once |
| `src/app/globals.css` | Tailwind v4 setup with `@theme {}` block for custom colors and design tokens |
| `src/app/api/match/route.ts` | AI matching endpoint — sends applicant answers + home prompts to Claude Sonnet 4.6 |
| `tests/e2e/helpers.ts` | Shared test helpers — API mocking, special email addresses, setup functions |
