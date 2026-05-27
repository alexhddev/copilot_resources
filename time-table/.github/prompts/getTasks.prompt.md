---
name: getTasks
description: Get a list of tasks from GitHub
model: GPT-5.4 (copilot)
tools: ['github/*', 'edit/createFile']
---

Run and execute the instructions below to create a tasks list and put it inside a .md file named by todays date and tasks. Answer like a scrum master.

1. Use the GitHub MCP server to tell me what pull requests are open and assigned to me.
2. Use the GitHub MCP server to tell me what issues are assigned to me