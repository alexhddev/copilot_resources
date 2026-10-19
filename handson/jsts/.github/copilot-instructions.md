# Copilot Instructions — awesome-pizza-jsts

Node.js + Express (TypeScript) reference implementation of the Awesome Pizza API. The `dotnet`, `java`, and `py` sibling projects in this monorepo are ported from this one, so keep behavior (routes, status codes, response shapes) in sync with them when changing the API contract.

## Architecture

- `src/model/Model.ts` — shared `menu_entry` and `order` types.
- `src/api/database.ts` — MySQL data layer (`mysql2` connection pool). `initDatabase()` creates the database, the `menu_entries`/`orders`/`order_items` tables and seeds sample data when empty; `closeDatabase()` ends the pool. All helpers are `async`: `getDailyMenu`, `getOrders`, `findOrderById`, `addOrder`, `updateOrderById`, `deleteOrderById` (plus `generateOrderId`). Multi-statement writes run inside the internal `withTransaction` helper. Data persists across restarts.
- `src/api/server.ts` — single Express app: middleware, CORS, auth, and all routes live here. There is no router/controller split — keep new endpoints in this file unless the file grows large enough to warrant splitting. The server only starts listening after `initDatabase()` succeeds.
- `docs/openapi.yaml` — source of truth for the API contract. Update it when routes, request/response shapes, or status codes change.

## Build and Run

Requires a running MySQL server. Connection settings come from environment variables (`DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `DB_POOL_SIZE`); copy `.env.example` to `.env`, which `npm start` loads automatically.

```bash
npm install
npm start   # runs `tsx --env-file-if-exists=.env src/api/server.ts`, serves on PORT env var or 3000
```

There is no build step, linter, or test suite configured — `tsx` runs the TypeScript directly. Validate changes by starting the server against MySQL and exercising it manually or via `docs/openapi.yaml`.

## Conventions

- **Response envelope**: every JSON response is `{ success: boolean, data?, message?, error? }`. Match this shape for new endpoints; don't return bare data or arrays. The one documented exception is `POST /api/login`, which returns `{ success, token }`.
- **Error handling**: wrap route bodies in `try/catch` and return `500` with `{ success: false, error: 'Internal server error', message: '...' }` on unexpected failures. Remember that database helpers are async, so `await` them inside the `try`.
- **Validation**: validate request bodies manually (type checks, non-empty strings, array checks; order item quantities must be positive integers — see `validateOrderItems`) before writing to the database; return `400` with a specific `message` on failure. `PUT /api/orders/:id` checks that the order exists first (404) and then validates the body (400). There is no validation library (e.g. zod/joi) in use.
- **Types**: use the `menu_entry`/`order` types from `src/model/Model.ts`; prefer `Partial<order>`/`Omit<order, 'id'>` for update/create payloads like `database.ts` does.
- **Auth**: this is a deliberately simplified demo — a single hardcoded bearer token (`HARDCODED_TOKEN`) and base64-encoded `{ role }` payloads for admin checks. Don't "fix" this into real auth/hashing/JWT unless explicitly asked; it's intentional for the exercise.
