---
description: Guidelines for defining types in the model folder
applyTo: "src/model/**"
---

# Model type guidelines

- Define all shared domain types in `src/model/Model.ts`. Don't declare domain types inline in `src/api/server.ts` or `src/api/database.ts`; import them from the model instead.
- Use `export type` aliases (not `interface` or `class`). Model files contain only types — no runtime code, logic, or imports from `src/api/`.
- Follow the existing naming style: lowercase snake_case type names (e.g. `menu_entry`, `order`) and camelCase property names (e.g. `imageUrl`).
- Use 4-space indentation and match the formatting of the existing types (one property per line, inline object types for nested shapes).
- Model fixed sets of values as string literal unions (e.g. `'RECEIVED' | 'DELIVERING' | 'DELIVERED' | 'CANCELED'`), not `enum`s.
- Keep properties required and non-nullable unless absence is a real part of the contract. For create/update payloads, derive types with `Omit<order, 'id'>` or `Partial<order>` rather than declaring duplicate types.