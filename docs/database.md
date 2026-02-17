# Database

The app uses Supabase (PostgreSQL) with 2 tables. Migrations are in `supabase/migrations/`.

## `homes` table

Stores residency home definitions. 10 homes are seeded via migration.

| Column | Type | Notes |
|--------|------|-------|
| `id` | `UUID` | Primary key, auto-generated |
| `name` | `TEXT NOT NULL` | Home name (e.g., "Homebrew", "Arcadia") |
| `color` | `TEXT NOT NULL` | Brand color hex (e.g., "#6B4C8C") |
| `logo_url` | `TEXT` | Optional logo image URL |
| `location` | `TEXT NOT NULL` | City/region (e.g., "Brooklyn, NY") |
| `description_template` | `TEXT NOT NULL` | Personalized letter template. Uses `{{name}}` placeholder for applicant's name |
| `matching_prompt` | `TEXT NOT NULL` | System prompt sent to Claude for AI matching — describes what the home looks for |
| `question` | `TEXT` | Optional home-specific question shown to matched applicants (null = no question) |
| `video_url` | `TEXT` | Optional video URL |
| `active` | `BOOLEAN NOT NULL` | Default `true`. Inactive homes are hidden from applicants but visible to admin |
| `display_order` | `INTEGER NOT NULL` | Sort order for listing homes |
| `created_at` | `TIMESTAMPTZ` | Auto-set on insert |
| `updated_at` | `TIMESTAMPTZ` | Auto-updated via trigger |

## `applications` table

Stores applicant data. One row per email address.

| Column | Type | Notes |
|--------|------|-------|
| `id` | `UUID` | Primary key, auto-generated |
| `email` | `TEXT NOT NULL UNIQUE` | Applicant email — used as the login identifier |
| `answers` | `JSONB NOT NULL` | All form answers (default `{}`) — see structure below |
| `status` | `TEXT NOT NULL` | One of: `in_progress`, `frozen`, `submitted`. Enforced by CHECK constraint |
| `current_section` | `TEXT` | Last visited section ID (e.g., "the-project") |
| `matched_home_ids` | `UUID[]` | Array of 3 home UUIDs after AI matching, ordered by fit (best first) |
| `frozen_at` | `TIMESTAMPTZ` | When the application was frozen (answers locked) |
| `submitted_at` | `TIMESTAMPTZ` | When the application was finally submitted |
| `created_at` | `TIMESTAMPTZ` | Auto-set on insert |
| `updated_at` | `TIMESTAMPTZ` | Auto-updated via trigger |

### Indexes

- `idx_applications_email` — on `email`
- `idx_applications_status` — on `status`
- `idx_homes_active` — on `active`
- `idx_homes_display_order` — on `display_order`

## JSONB `answers` structure

All answers are stored in a single flat JSONB object on the `applications` row.

**Section answers** are keyed by `<questionId>`:

```json
{
  "citizenship": "United States",
  "locations": "homebrew,arcadia,sf2",
  "accomplishments": "Built a startup...",
  "pitch": "AI-powered legal review",
  "details": "We use NLP to...",
  "project_link": "https://example.com",
  "why_this": "I care about...",
  "how_know_needed": "Customer interviews...",
  "how_far": "MVP launched...",
  "duration": "6 months, 3 full-time",
  "has_users": "yes",
  "has_revenue": "no",
  "competitors": "LegalZoom...",
  "unique_insight": "We understand...",
  "world_impact": "Democratize access...",
  "what_need": "Mentorship...",
  "how_helps": "Connections to...",
  "looking_cofounder": "yes",
  "has_investment": "no",
  "focus_area": "building",
  "accelerators": "N/A",
  "had_roommates": "yes",
  "applied_before": "no",
  "what_convinced": "A friend told me...",
  "how_heard": "word_of_mouth"
}
```

**Home-specific answers** are keyed by `home_<homeUUID>`:

```json
{
  "home_abc-123-...": "I'm inspired by Viennese coffee house culture...",
  "home_def-456-...": "The thing keeping me up at night is..."
}
```

The `multi_checkbox` type (like `locations`) stores selected values as a comma-separated string.

## Seeded Homes

The 10 homes seeded by `002_seed_homes.sql`:

| # | Name | Location | Has Question? |
|---|------|----------|---------------|
| 1 | Vienna | Vienna, Austria | Yes |
| 2 | Homebrew | Brooklyn, NY | No |
| 3 | The Inventors Residency | San Francisco, CA | Yes |
| 4 | Actioners | San Francisco, CA | Yes |
| 5 | Bangalore | Bangalore, India | No |
| 6 | Aurea | Austin, TX | Yes |
| 7 | Arcadia | Berkeley, CA | Yes |
| 8 | SF2 | San Francisco, CA | No |
| 9 | Biopunk | Boston, MA | Yes |
| 10 | London | London, UK | No |

## Migration Files

- `supabase/migrations/001_initial_schema.sql` — Creates tables, indexes, `update_updated_at_column()` trigger function, and triggers
- `supabase/migrations/002_seed_homes.sql` — Inserts 10 homes with full description templates and matching prompts
