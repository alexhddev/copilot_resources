# Copilot Instructions — awesome-pizza-jsts

Node.js + Express (TypeScript) reference implementation of the Awesome Pizza API. The `dotnet`, `java`, and `py` sibling projects in this monorepo are ported from this one, so keep behavior (routes, status codes, response shapes) in sync with them when changing the API contract.

## Architecture

- `src/model/Model.ts` — shared `menu_entry` and `order` types.
- `src/api/database.ts` — in-memory "database" (plain arrays) plus helper functions (`findOrderById`, `addOrder`, `updateOrderById`, `generateOrderId`). There is no persistence layer; data resets on restart.
- `src/api/server.ts` — single Express app: middleware, CORS, auth, and all routes live here. There is no router/controller split — keep new endpoints in this file unless the file grows large enough to warrant splitting.
- `docs/openapi.yaml` — source of truth for the API contract. Update it when routes, request/response shapes, or status codes change.

## Build and Run

```bash
npm install
npm start   # runs `tsx src/api/server.ts`, serves on PORT env var or 3000
```

There is no build step, linter, or test suite configured — `tsx` runs the TypeScript directly. There's nothing to run to validate changes beyond starting the server and exercising it manually or via `docs/openapi.yaml`.

## Conventions

- **Response envelope**: every JSON response is `{ success: boolean, data?, message?, error? }`. Match this shape for new endpoints; don't return bare data or arrays.
- **Error handling**: wrap route bodies in `try/catch` and return `500` with `{ success: false, error: 'Internal server error', message: '...' }` on unexpected failures.
- **Validation**: validate request bodies manually (type checks, non-empty strings, array checks) before touching the in-memory store; return `400` with a specific `message` on failure. There is no validation library (e.g. zod/joi) in use.
- **Types**: use the `menu_entry`/`order` types from `src/model/Model.ts`; prefer `Partial<order>`/`Omit<order, 'id'>` for update/create payloads like `database.ts` does.
- **Auth**: this is a deliberately simplified demo — a single hardcoded bearer token (`HARDCODED_TOKEN`) and base64-encoded `{ role }` payloads for admin checks. Don't "fix" this into real auth/hashing/JWT unless explicitly asked; it's intentional for the exercise.
