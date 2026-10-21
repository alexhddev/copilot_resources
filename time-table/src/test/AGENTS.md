# Test guidance

## Framework and setup

- Write tests with Vitest and React Testing Library.
- Vitest uses the `jsdom` environment, global test APIs, and `src/test/setup.ts`.
- Use `src/test/test-utils.tsx` to render React components; it re-exports Testing Library.

## Organization and style

- Co-locate tests with source files and name them `FileName.test.ts` or `FileName.test.tsx`.
- Group related cases with `describe` and write descriptive `it` cases that state the expected behavior.
- Add explicit types to test helpers and data structures where needed.

## Test behavior

- Prefer assertions about user-visible output and interactions over implementation details.
- For components, query elements as a user would and exercise interactions with Testing Library.
- Keep tests independent; do not rely on execution order or shared mutable state.
- Cover relevant valid input, invalid input, and edge cases when changing behavior.

## Run tests

- Run the suite with `npm run test:run`.
- Run one test file with `npx vitest run src/path/to/FileName.test.ts`.
