# Testing

All tests are Playwright end-to-end tests in `tests/e2e/`. They run against a local dev server and mock all API routes, so no Supabase or Anthropic credentials are needed.

## Running Tests

```bash
# Install browsers (first time only)
npx playwright install

# Run all tests headless
npx playwright test

# Run with interactive UI
npx playwright test --ui

# Run a single test file
npx playwright test tests/e2e/email-entry.spec.ts

# Run in headed mode (see the browser)
npx playwright test --headed
```

The Playwright config (`playwright.config.ts`) automatically starts the dev server on port 3000 before running tests.

## Test File Inventory

| File | Description |
|------|-------------|
| `email-entry.spec.ts` | Email input validation, form submission, and application creation |
| `application-form.spec.ts` | Multi-section form navigation, rendering all question types |
| `auto-save.spec.ts` | localStorage and server auto-save debouncing behavior |
| `resume-application.spec.ts` | Returning user resumes from where they left off |
| `conditional-questions.spec.ts` | Questions that show/hide based on other answers |
| `frozen-state.spec.ts` | Frozen application state — core answers locked, home answers editable |
| `matching-flow.spec.ts` | AI matching trigger, loading animation, and results display |
| `home-questions.spec.ts` | Home-specific questions shown after matching |
| `letter-modal.spec.ts` | Personalized home letter modal with name substitution |
| `submit-flow.spec.ts` | Final submission flow and confirmation page |
| `admin-applications.spec.ts` | Admin dashboard — application list and filtering |
| `admin-homes.spec.ts` | Admin homes management page |
| `admin-export.spec.ts` | Admin application data export functionality |

## How API Mocking Works

Tests use Playwright's `page.route()` to intercept all API calls at the network level. The shared helpers in `tests/e2e/helpers.ts` provide:

### `mockAPIs(page)`
Intercepts all `/api/applications` calls (GET, POST, PATCH). Returns different mock data based on **special email addresses**:

| Email | Behavior |
|-------|----------|
| `frozen@example.com` | Returns a frozen application with matched homes |
| `submitted@example.com` | Returns a submitted application |
| `returning@example.com` | Returns an in-progress application with some answers filled |
| Any other email | Creates/returns a fresh in-progress application |

### `mockHomesAPI(page)`
Intercepts `/api/homes*` and returns 3 mock homes (Homebrew, The Inventors Residency, Arcadia).

### `mockMatchAPI(page)`
Intercepts `/api/match` and returns a fixed set of 3 matched home IDs.

### `mockAdminAPI(page)`
Intercepts all admin routes (`/api/admin`, `/api/admin/stats`, `/api/admin/applications`) with mock data.

### `setupNewUser(page)`
Convenience function that calls `mockAPIs` + `mockHomesAPI`, navigates to `/`, enters a test email, and submits — landing on the first form section.

## Writing a New Test

1. Create a new file in `tests/e2e/` named `your-feature.spec.ts`
2. Import helpers:
   ```ts
   import { test, expect } from "@playwright/test";
   import { mockAPIs, mockHomesAPI, setupNewUser } from "./helpers";
   ```
3. Mock the APIs you need:
   ```ts
   test("my feature works", async ({ page }) => {
     await mockAPIs(page);
     await mockHomesAPI(page);
     await page.goto("/");
     // ... your test
   });
   ```
4. To override a specific route for one test, add another `page.route()` call with `route.fallback()`:
   ```ts
   await page.route(
     (url) => url.pathname === "/api/applications",
     async (route) => {
       if (someCondition) {
         return route.fulfill({ status: 200, body: JSON.stringify(myData) });
       }
       return route.fallback(); // falls through to the helper mock
     }
   );
   ```

## Key Gotchas

### localStorage before navigation
You must navigate to a page (`page.goto("/")`) **before** calling `page.evaluate(() => localStorage.setItem(...))`. Attempting to access localStorage before navigation throws a `SecurityError`.

### Route matching with query params
Playwright's string pattern `"**/api/foo"` does **not** match `/api/foo?id=123`. Use a URL predicate instead:
```ts
await page.route(
  (url) => url.pathname === "/api/foo",
  async (route) => { /* ... */ }
);
```

### Layered route mocks with `route.fallback()`
When overriding a route that's already mocked by a helper, use `route.fallback()` (not `route.continue()`). `fallback()` passes the request to the next matching handler (the helper mock), while `continue()` sends it to the actual server.

### Browser email validation
`<input type="email">` triggers the browser's native validation before your JavaScript handler runs. If your test needs to submit an invalid email, add the `novalidate` attribute to the form, or use a valid email format in tests.
