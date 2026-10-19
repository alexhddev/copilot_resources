---
name: docs-sync-check
description: "Check whether code files (API routes, database layer, models) are in sync with documentation files (copilot-instructions.md, openapi.yaml, README.md). Use when: auditing docs drift, verifying docs match code, checking the OpenAPI contract against Express routes, checking instructions after a refactor or database change, finding outdated README or instructions, syncing docs with code."
argument-hint: "Optional scope, e.g. 'endpoints only' or 'database only'"
---

# Docs ↔ Code Sync Check

Compares the implementation in `src/` with the three documentation sources and reports every mismatch. Report first; only edit after the user confirms.

## Sources

| Kind | Files |
|------|-------|
| Code | `src/api/server.ts` (routes, validation, auth, status codes), `src/api/database.ts` (data layer), `src/model/Model.ts` (types) |
| Docs | `.github/copilot-instructions.md` (architecture, run, conventions), `docs/openapi.yaml` (API contract), `README.md` (setup, env vars, endpoint list) |
| Config | `package.json` (scripts, dependencies), `.env.example` (env vars) |

Read each file fully. Large files are truncated at 20KB, so use `view_range` to read the rest.

## Procedure

1. **Inventory the code.** From `server.ts` list every route: method, path, auth requirement, request validation, each status code returned, and response shape. From `database.ts` list the storage technology, exported helpers (and whether they are async), schema, seeding and env vars. From `Model.ts` list the types and their fields.
2. **Inventory each doc** the same way, then compare using [the drift checklist](./references/drift-checklist.md).
3. **Check the git history** (`git log --oneline -- .`) when a doc looks stale. A commit that changed the code without touching the docs is the usual cause.
4. **Verify suspicious text at the byte level** before reporting it. Tool output can mask tokens such as `Authorization: Bearer ...` as `******`, which looks like file corruption but isn't. Confirm with `grep -n ... | cat -A` or `xxd` first.
5. **Optionally confirm behavior at runtime** for contract claims such as status codes and validation messages. Start the server on a spare port (`PORT=3055 npm start`), exercise the endpoints with `curl`, then stop it by its specific PID. Delete any data you created and leave existing data alone. Skip this step if the required services, such as MySQL, are unavailable, and say so.
6. **Report** using the format below.
7. **Ask before fixing.** If the user agrees, fix the docs to match the code. Change code only for real bugs that the audit exposed, and only when the user asks. Then re-run the checks.

## Rules when fixing

- `docs/openapi.yaml` is the source of truth for the API contract. When code and spec disagree on intended behavior, ask the user which one is right.
- Other language ports (`dotnet`, `java`, `py`) follow this project's contract. Don't change status codes, routes or response shapes without flagging the cross-port impact.
- Don't "fix" the intentional demo auth (hardcoded token, base64 role payload).
- Keep edits surgical and update directly related docs in the same change.

## Report format

Start with a one-line verdict per doc: in sync, minor gaps, or out of date. Then one table per doc:

| Doc says | Code actually does | Suggested fix |
|---|---|---|

Close with edge cases that the docs don't describe (inputs that cause unhandled 500s, missing try/catch) and out-of-scope observations. Keep both short.
