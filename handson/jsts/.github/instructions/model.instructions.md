---
description: Guidelines for defining types in the model folder
applyTo: "src/model/**"
---

# Model type guidelines

- Use `type` aliases (not `interface` or `class`) to match the existing code in `Model.ts`.
- Model files contain only types: no runtime code, no logic, no imports from `src/api`.
- Name types in `snake_case` singular form, such as `menu_entry` and `order`.
- Use string literal unions instead of `enum` for fixed value sets, such as `'RECEIVED' | 'DELIVERING' | 'DELIVERED' | 'CANCELED'`.
- Use `string` for IDs and URLs; use `number` for quantities.
- Mark optional fields with `?` rather than `| undefined` or `| null`.
- Never use `any`; use `unknown` or a specific type.
- Extract a nested object into its own named type when it is reused or has more than two fields.
- Derive related types from existing ones (`Pick`, `Omit`, `Partial`, indexed access such as `order['status']`) instead of duplicating fields.
