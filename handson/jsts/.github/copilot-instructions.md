# Awesome Pizza API

Express 5 + TypeScript REST API for a pizza ordering app. Run with `npm start` (uses `tsx`, no build step).

## Structure
- `src/api/server.ts` - Express app, routes, middleware.
- `src/api/database.ts` - in-memory data and data-access functions.
- `src/model/Model.ts` - shared types.
- `docs/openapi.yaml` - API contract.

## Conventions
- TypeScript only; 4-space indentation, single quotes, semicolons.
- Prefer exported standalone functions over classes.
- Keep route handlers thin; put data logic in `database.ts`.
- JSON responses use the shape `{ success, data?, message?, error? }` with correct HTTP status codes.
- Import shared types from `src/model/Model.ts`; do not redefine them elsewhere.
- Any change to endpoints, request bodies or response shapes must also update `docs/openapi.yaml`.
- Do not hardcode secrets in new code; read them from environment variables.
- Do not add dependencies unless necessary.
