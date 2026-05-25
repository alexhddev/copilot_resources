---
applyTo: "src/components/**/*.tsx"
description: "React component coding standards and best practices"
---

## React Components & Hooks

- **Use functional components only** with `React.FC<Props>` pattern (no class components).
- **Define props interfaces locally** within component files and suffix them with `PropZ` (e.g., `CalendarPropZ`).
- **Use React Hooks** (`useState`, `useEffect`, etc.) - avoid legacy lifecycle methods.
- **Implement immutable state updates** using the spread operator: `[...prev, newItem]` or `{ ...prev, field: newValue }`.
- **Keep components focused**: each component should have a single responsibility.
- **Lift shared state** to parent components when multiple children need the same data; avoid prop drilling when possible.
- **Use confirmation dialogs or warnings** for destructive operations (delete, clear).