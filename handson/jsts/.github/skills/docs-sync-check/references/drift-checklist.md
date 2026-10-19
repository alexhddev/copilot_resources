# Drift checklist

Work through each section and note every mismatch.

## Routes (server.ts ↔ openapi.yaml ↔ README.md)

- Every route in code appears in `openapi.yaml` and in the README endpoint list, and vice versa. Compare method and path.
- Path parameters (`:id` vs `{id}`) and operation tags are consistent.
- Every status code returned in a handler has a response in the spec: 200/201, 400, 401, 403, 404 and 500. Also check codes in the spec that no handler returns.
- Auth requirements match: `requireToken` or an admin role check in code corresponds to `security: bearerAuth` in the spec, and the README says which routes need `Authorization: Bearer <token>`.
- Request bodies: required fields in the spec match the validation in code, such as non-empty strings, non-empty arrays and valid enum values.
- Numeric constraints are the same. For example, the spec says `integer, minimum: 1`, so code must reject fractions and zero.
- Enums match, including order status values in `Model.ts`, the `validStatuses` list in `server.ts`, the DB `ENUM` and the spec.
- Response shape: envelope `{ success, data?, message?, error? }`, with documented exceptions such as login returning `{ success, token }`.
- Error `error` and `message` fields exist in the spec's error schema.

## Edge cases that cause undocumented 500s

- Handlers without `try/catch`.
- Missing request body (`req.body` is undefined in Express 5).
- `null` or non-object entries in arrays, and decoded tokens that parse to `null`.
- Handler ordering, such as existence check (404) before body validation (400). Make sure the docs describe the real order.

## Database (database.ts ↔ copilot-instructions.md ↔ README.md)

- Storage technology: instructions and README agree with the code, for example MySQL via `mysql2` rather than in-memory arrays.
- Persistence statements: "data resets on restart" versus actual behavior.
- Exported helper names and signatures, including whether they are async. The instructions list them all (`initDatabase`, `closeDatabase`, `getDailyMenu`, `getOrders`, `findOrderById`, `addOrder`, `updateOrderById`, `deleteOrderById`, `generateOrderId`).
- Schema: tables and columns in `createSchema` match the README description.
- Seeding behavior and when it runs.
- Env vars and defaults: `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `DB_POOL_SIZE` and `PORT` in code, `.env.example` and the README table.
- Startup flow: the server listens only after `initDatabase()` succeeds.

## Run and build instructions (package.json ↔ copilot-instructions.md ↔ README.md)

- The `npm start` command text equals the `package.json` script.
- External prerequisites, such as a running MySQL server, are stated.
- The statement about build, linter and tests matches the scripts that exist.
- The parent monorepo README (`../README.md`) mentions prerequisites for this project.

## Conventions (copilot-instructions.md ↔ code)

- Response envelope, error handling, validation and types rules are followed by every route.
- Types come from `Model.ts` and the model instruction file (`.github/instructions/model.instructions.md`).
- File layout in the Architecture section matches the files that exist.

## Verification pitfalls

- Display masking: `******` in tool output may be only the display. Check bytes before reporting corruption.
- Truncated views: make sure the whole file was read before concluding something is missing.
- Pre-existing data in a shared database isn't yours to delete.
