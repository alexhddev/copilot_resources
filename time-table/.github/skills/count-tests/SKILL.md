---
name: count-tests
description: Use this skill when the user asks to count tests, summarize the test suite, or wants to know how many tests exist in the project.
---

# Count Tests

1. Run the [script](./scripts/countTests.js) using Node.js to count the number of tests in the project and gather relevant information about the test suite.

2. Parse the JSON output from the script.

3. Respond using the [template](./Template.md), filling in the values from the script output.
