# API Routes

All routes are Next.js App Router API routes in `src/app/api/`. They use the Supabase service-role client (`createAdminClient`) to bypass RLS.

---

## Public Routes

### `GET /api/applications`

Look up an application by ID or email.

- **Query params**: `?id=<uuid>` or `?email=<string>`
- **Response**: `200` with application object, or `404`
- **Auth**: None

### `POST /api/applications`

Create a new application or return existing one for the same email.

- **Body**: `{ "email": "user@example.com" }`
- **Response**: `201` (new) or `200` (existing) with application object
- **Auth**: None
- **Validation**: Zod email schema

### `PATCH /api/applications`

Update an application's answers, status, or other fields.

- **Body**: `{ "id": "<uuid>", "answers": {...}, "current_section": "...", "status": "...", ... }`
- **Response**: `200` with updated application
- **Auth**: None
- **Notes**:
  - If status is `frozen`: only `home_*` answer keys can be updated (core answers are locked)
  - If status is `submitted`: returns `400` — no further edits allowed

### `POST /api/match`

Trigger AI matching for a frozen application. Sends applicant answers and home matching prompts to Claude, which returns the top 3 best-fit homes.

- **Body**: `{ "applicationId": "<uuid>" }`
- **Response**: `200` with `{ "matched_home_ids": ["uuid1", "uuid2", "uuid3"] }`
- **Auth**: None
- **Notes**:
  - Application must have `status: "frozen"` — returns `400` otherwise
  - If already matched (`matched_home_ids` is set), returns cached result without calling Claude
  - Uses Claude Sonnet via the Anthropic SDK
  - On AI failure, falls back to random 3 homes

### `GET /api/homes`

List homes. Public users see active homes only; admin sees all.

- **Query params**: Optional `?id=<uuid>` to get a single home
- **Response**: `200` with array of homes (or single home if `id` provided)
- **Auth**: Optional — admin cookie unlocks inactive homes

### `POST /api/homes` (admin only)

Create a new home.

- **Body**: `{ "name": "...", "color": "...", "location": "...", "description_template": "...", "matching_prompt": "...", ... }`
- **Response**: `201` with created home
- **Auth**: Admin cookie required

### `PATCH /api/homes` (admin only)

Update a home.

- **Body**: `{ "id": "<uuid>", ...fields to update }`
- **Response**: `200` with updated home
- **Auth**: Admin cookie required

### `DELETE /api/homes?id=<uuid>` (admin only)

Delete a home.

- **Response**: `200` with `{ "success": true }`
- **Auth**: Admin cookie required

---

## Admin Routes

All admin routes require the `admin_token` cookie to match the `ADMIN_SECRET` environment variable.

### `POST /api/admin`

Admin login — sets the auth cookie.

- **Body**: `{ "secret": "your-admin-secret" }`
- **Response**: `200` with `{ "success": true }` and sets `admin_token` httpOnly cookie (7-day expiry)
- **Error**: `401` if secret doesn't match

### `GET /api/admin`

Check if current session is authenticated as admin.

- **Response**: `200` with `{ "authenticated": true }` or `401` with `{ "authenticated": false }`

### `DELETE /api/admin`

Admin logout — deletes the auth cookie.

- **Response**: `200` with `{ "success": true }`

### `GET /api/admin/applications`

List all applications, newest first.

- **Response**: `200` with array of all application objects
- **Auth**: Admin cookie required

### `GET /api/admin/stats`

Get application counts by status.

- **Response**: `200` with `{ "total": N, "inProgress": N, "frozen": N, "submitted": N }`
- **Auth**: Admin cookie required

---

## Auth Summary

| Route | Auth |
|-------|------|
| `/api/applications` (GET/POST/PATCH) | None (public) |
| `/api/match` (POST) | None (public) |
| `/api/homes` (GET) | None for active homes; admin cookie for all homes |
| `/api/homes` (POST/PATCH/DELETE) | Admin cookie |
| `/api/admin` | Secret in body (POST) or admin cookie (GET/DELETE) |
| `/api/admin/applications` | Admin cookie |
| `/api/admin/stats` | Admin cookie |

All API routes use the **service-role key** (`SUPABASE_SERVICE_ROLE_KEY`) via `createAdminClient()` to bypass Supabase Row Level Security. The **anon key** (`NEXT_PUBLIC_SUPABASE_ANON_KEY`) is available on the client side but is not used by API routes.
