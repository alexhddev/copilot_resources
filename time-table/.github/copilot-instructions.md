# Coding Instructions for Time-Table Project

This document defines coding standards, patterns, and conventions for the Time-Table project to ensure consistency and quality across all code changes.

## TypeScript & Type Safety

- **Always use explicit type annotations** for function parameters and return types, especially for utility functions.
- **Define interfaces for all data structures**. Use PascalCase for interface names (e.g., `CalendarProps`, `Event`, `EventManagerProps`).
- **Use `import type` for type-only imports** to maintain clean module boundaries and enable tree-shaking.
- **Leverage TypeScript utility types**: `Omit<>`, `Partial<>`, `Record<>` to avoid code duplication and maintain DRY principles.
- **Mark optional properties explicitly** with `?` in interfaces (e.g., `description?: string`).
- **Provide JSDoc comments** on all utility functions with `@param` and `@returns` tags documenting parameter and return types.
- **Enable strict TypeScript mode** - all files should compile without errors in strict mode.

## React Components & Hooks

See [instructions/react.instructions.md](instructions/react.instructions.md) for detailed React component coding standards.

## Naming Conventions

- **Variables & functions**: `camelCase` (`selectedDate`, `handleDateSelect`, `formatDate`)
- **React components**: `PascalCase` (`Calendar`, `EventManager`, `App`)
- **Component files**: `PascalCase` filenames (e.g., `Calendar.tsx`, `EventManager.tsx`)
- **Utility & data files**: `camelCase` filenames (e.g., `dataStore.ts`, `DateUtils.ts`, `MathUtils.ts`)
- **Interfaces & Types**: `PascalCase` (e.g., `Event`, `CalendarDay`)
- **Event handlers**: Prefix with `handle` followed by the trigger name (e.g., `handleDateSelect`, `handleSubmit`)
- **Constants**: `UPPER_SNAKE_CASE` for configuration values
- **Boolean properties/variables**: Prefix with `is`, `has`, `should`, or `can` (e.g., `isVisible`, `hasError`)

## File Organization

- **Components**: Place in `/src/components/` with paired `.css` file (e.g., `Calendar.tsx` + `Calendar.css`)
- **Utilities**: Store in `/src/` root directory (e.g., `DateUtils.ts`, `MathUtils.ts`, `dataStore.ts`)
- **Tests**: Co-locate with source files using `.test.ts` or `.test.tsx` suffix
- **Type definitions**: Define in `types.ts` for shared types, or locally within component files for component-specific types
- **Import order**: 
  1. React and third-party imports
  2. Type imports (`import type ...`)
  3. Local component imports
  4. Utility imports
  5. Style imports

## Data & State Management

- **Date format**: Use `YYYY-MM-DD` string format consistently throughout the application for interoperability.
- **UTC methods**: Use `getUTCHours()`, `getUTCDate()`, etc. instead of local time methods to avoid timezone issues.
- **Immutable updates**: Never mutate state directly; always create new objects/arrays.
- **DataStore pattern**: For simple apps, use a singleton pattern for centralized state (e.g., `dataStore.ts` exported as a single instance).
- **Event IDs**: Generate using timestamp + random suffix pattern for uniqueness without server dependency.

## Testing (Vitest & React Testing Library)

- **Framework**: Use Vitest for unit tests and @testing-library/react for component testing.
- **Test file naming**: `FileName.test.ts` or `FileName.test.tsx` (co-located with source).
- **Test structure**: Use BDD-style with `describe` and `it` blocks.
- **Nested describes**: Group related tests with nested `describe` blocks for logical organization.
- **Custom render**: Export a custom `render` function from `test/test-utils.tsx` that includes providers/setup.
- **Assertions**: Use matchers from `@testing-library/jest-dom` for enhanced DOM assertions.
- **Test naming**: Write descriptive test names that explain expected behavior (e.g., `it('should add event when all fields are valid')`)
- **Avoid implementation details**: Test user behavior and outputs, not internal component state or implementation.

## Code Quality

- **ESLint & TypeScript strict mode**: All code must pass linting and compile without errors.
- **Validation**: Validate user input before processing (e.g., time ordering, required fields).
- **Error handling**: Include error boundaries or try-catch blocks for async operations.
- **Sorting**: Use `localeCompare()` for string comparisons and sorting to handle internationalization correctly.
- **No console logs**: Avoid `console.log()` in production code; use proper logging or debugging tools.

## When Applying These Instructions

These instructions apply to:
- ✅ All TypeScript/TSX files in `/src/`
- ✅ New components and utilities being created
- ✅ Modifications to existing code
- ✅ Test files

These instructions may be relaxed for:
- Configuration files (vite.config.ts, eslint.config.js)
- Auto-generated files
- Temporary debugging code (clearly marked)

---

**Last Updated**: May 25, 2026  
**Project**: Time-Table (React + TypeScript + Vitest)
