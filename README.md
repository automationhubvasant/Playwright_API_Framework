# API Framework

Playwright-based API test framework for [restful-booker](https://restful-booker.herokuapp.com/apidoc/index.html). Built around the **Service Object Pattern** (the API equivalent of Page Object Model), with JSON Schema response validation, env-driven configuration, and CI-ready reporting.

---

## Prerequisites

- **Node.js 18+** (LTS recommended)
- **npm** (ships with Node.js)

Check your versions:

```bash
node --version
npm --version
```

---

## Setup

```bash
# 1. Clone and enter the repo
git clone <repo-url>
cd api-framework

# 2. Install dependencies
npm install

# 3. Create your local env file
cp .env.example .env
```

Edit `.env` if you want to point at a different environment. Defaults work against the public restful-booker demo:

```env
BASE_URL=https://restful-booker.herokuapp.com
ADMIN_USERNAME=admin
ADMIN_PASSWORD=password123
```

> `.env` is gitignored. Only `.env.example` is committed.

---

## Running tests

| Command | What it does |
| --- | --- |
| `npm test` | Run all tests (list + HTML reporters) |
| `npm run test:list` | Force list reporter only |
| `npm run test:debug` | Open the Playwright Inspector for step-through debugging |
| `npm run report` | Open the last HTML report in a browser |

Run a single test file or test by name:

```bash
npx playwright test tests/booking.spec.js
npx playwright test -g "creates booking"
```

Run against a different environment without changing code:

```bash
BASE_URL=https://staging.example.com npm test
```

---

## Project structure

```
api-framework/
├── src/
│   ├── api/                     Service Objects (one class per resource)
│   │   ├── auth.api.js          AuthApi    - /auth
│   │   ├── booking.api.js       BookingApi - /booking
│   │   └── endpoints.js         All URL paths in one place
│   ├── assertions/
│   │   └── schema.js            assertMatchesSchema() helper (Ajv)
│   ├── config/
│   │   └── env.js               Env reader with fail-fast validation
│   ├── data/
│   │   └── booking.data.js      buildBookingPayload() factory
│   ├── fixtures/
│   │   └── api.fixtures.js      Playwright fixtures that inject services
│   └── schemas/
│       ├── auth.schema.js       JSON Schema for /auth response
│       └── booking.schema.js    JSON Schemas for /booking responses
├── tests/
│   └── booking.spec.js          POST → PUT → DELETE flow
├── .github/workflows/
│   └── playwright.yml           CI pipeline
├── .env.example                 Env template (committed)
├── .env                         Local env values (gitignored)
├── playwright.config.js         Playwright config (baseURL, reporters, etc.)
└── package.json
```

### What each layer does

- **`src/api/`** — Service Objects. One class per resource (`BookingApi`, `AuthApi`). Encapsulates HTTP plumbing so tests describe *what* to assert, not *how* to call the API.
- **`src/data/`** — Payload factories. Tests describe only the fields that differ from default.
- **`src/schemas/`** — JSON Schemas for response shape validation. Catches API contract drift (missing fields, new fields, wrong types).
- **`src/assertions/`** — Generic assertion helpers. `assertMatchesSchema(data, schema)` throws a readable error listing every violation.
- **`src/config/`** — `env` object exposing validated env vars. Tests/services never touch `process.env` directly.
- **`src/fixtures/`** — Playwright fixtures that auto-inject service instances. Tests just destructure `{ bookingApi, authApi }` — no manual setup.

---

## Example test

```js
import { test, expect } from '../src/fixtures/api.fixtures.js';
import { buildBookingPayload } from '../src/data/booking.data.js';
import { assertMatchesSchema } from '../src/assertions/schema.js';
import { createBookingResponseSchema } from '../src/schemas/booking.schema.js';

test('POST /booking - creates a booking', async ({ bookingApi }) => {
  const payload = buildBookingPayload();

  const response = await bookingApi.createBooking(payload);

  expect(response.status()).toBe(200);
  const body = await response.json();
  assertMatchesSchema(body, createBookingResponseSchema);
  expect(body.booking).toEqual(payload);
});
```

`tests/booking.spec.js` shows a full **POST → PUT → DELETE** flow wrapped in `test.describe.serial(...)`, with the auth token fetched once in `beforeAll` and reused across the three tests.

---

## Adding a new endpoint

1. **Endpoint path** — add to [`src/api/endpoints.js`](src/api/endpoints.js).
2. **Service method** — add a method to the relevant `*.api.js` class (or create a new one).
3. **Fixture** — if it's a new service class, register it in [`src/fixtures/api.fixtures.js`](src/fixtures/api.fixtures.js).
4. **Response schema** — add a JSON Schema in `src/schemas/` describing the expected response.
5. **Test** — write your `*.spec.js` under `tests/`, using the fixture and schema.

---

## Reports

After running tests:

```bash
npm run report
```

opens the **HTML report** in your browser. The report includes request/response details, error traces, and (on retry) Playwright traces.

On CI, the run additionally produces:

- `test-results/junit.xml` — JUnit XML for dashboards (Jenkins, GitLab, etc.)
- GitHub Actions annotations on PRs

---

## CI

[`.github/workflows/playwright.yml`](.github/workflows/playwright.yml) runs on every push and PR to `main`/`master`. To run against a private environment, set GitHub repo secrets:

- `BASE_URL`
- `ADMIN_USERNAME`
- `ADMIN_PASSWORD`

If unset, the workflow falls back to the public restful-booker demo defaults.

Artifacts uploaded on every run:

- `playwright-report` — interactive HTML report
- `junit-results` — JUnit XML

---

## Tech stack

| Tool | Why |
| --- | --- |
| [@playwright/test](https://playwright.dev/docs/api-testing) | Test runner with first-class API request support |
| [ajv](https://ajv.js.org/) + [ajv-formats](https://github.com/ajv-validator/ajv-formats) | JSON Schema validation (same dialect OpenAPI uses) |
| [dotenv](https://github.com/motdotla/dotenv) | Load environment variables from `.env` |

---

## Troubleshooting

**`Missing required env var: BASE_URL`**
You haven't created `.env`. Run `cp .env.example .env`.

**Test times out / network errors**
Confirm `BASE_URL` is reachable: `curl $BASE_URL/ping`.

**Schema validation fails after API change**
The API contract changed. Update the corresponding schema in `src/schemas/`.

**Want to see the request/response in detail**
Run `npm run test:debug` and step through, or check the HTML report (`npm run report`).
