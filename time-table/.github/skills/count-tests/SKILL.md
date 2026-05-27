---
name: count-tests
description: Use this skill when the user asks to count tests, summarize the test suite, or wants to know how many tests exist in the project.
---

# Count Tests

1. Run the [script](./scripts/count-tests.js) using Node.js, passing the project root directory as an argument:
   `node .github/skills/count-tests/scripts/count-tests.js .`

2. Parse the JSON output from the script.

3. Respond using the [template](./TEMPLATE.md), filling in the values from the script output.
