# Copilot Resources

Sample projects for learning and practicing **GitHub Copilot**: a multi-language hands-on API project, and a React app that shows how to customize Copilot with instructions, skills, agents and hooks.

## Repository layout

```
copilot_resources/
├── handson/        # "Awesome Pizza": one API in four stacks, plus a web frontend
│   ├── dotnet/     # ASP.NET Core (.NET 8)
│   ├── java/       # Spring Boot (Maven)
│   ├── jsts/       # Node.js + Express (TypeScript)
│   ├── py/         # FastAPI (Python)
│   └── ui/         # Static frontend served by Node.js
└── time-table/     # React + TypeScript calendar app with Copilot customizations
```

## Hands-on: Awesome Pizza (`handson/`)

The `dotnet`, `java`, `jsts` and `py` folders each implement the **same backend API** in a different stack. They all use an in-memory database and follow the same OpenAPI contract (`docs/openapi.yaml` in each folder):

| Method | Endpoint             | Description                        |
| ------ | -------------------- | ---------------------------------- |
| GET    | `/api/daily-menu`    | Get today's pizza menu             |
| GET    | `/api/orders/{id}`   | Get an order                       |
| POST   | `/api/orders`        | Create an order                    |
| PUT    | `/api/orders/{id}`   | Update an order                    |
| POST   | `/api/login`         | Log in and receive a token         |
| GET    | `/api/protected`     | Requires `Authorization: Bearer <token>` |
| GET    | `/api/admin`         | Requires a bearer token with the admin role |

Every backend listens on **http://localhost:3000**, so run only one at a time. You can change the port with the `PORT` environment variable.

| Stack  | Run                                                                 |
| ------ | ------------------------------------------------------------------- |
| .NET   | `cd handson/dotnet && dotnet run`                                   |
| Java   | `cd handson/java && mvn spring-boot:run`                            |
| TS     | `cd handson/jsts && npm install && npm start`                       |
| Python | `cd handson/py`, create a virtual environment, `pip install -r requirements.txt`, then `uvicorn app.main:app --reload --port 3000` |

The frontend runs on **http://localhost:3001** and calls whichever backend is running:

```bash
cd handson/ui
npm install
npm start
```

Setup details are in [handson/README.md](handson/README.md) and each backend's own README.

## Time Table (`time-table/`)

A calendar app built with React 19, TypeScript, Vite and Vitest. You can browse months, select dates and manage events, which are saved in local storage.

```bash
cd time-table
npm install
npm run dev        # http://localhost:5173
npm run test:run   # run the test suite once
npm run lint
```

### Copilot customization examples

The `time-table` folder also shows the main ways to customize GitHub Copilot:

| Feature                | Location                                                  | What it shows |
| ---------------------- | --------------------------------------------------------- | ------------- |
| Repository instructions | [.github/copilot-instructions.md](time-table/.github/copilot-instructions.md) | Project-wide coding standards (TypeScript, naming, testing) |
| Path-specific instructions | [.github/instructions/react.instructions.md](time-table/.github/instructions/react.instructions.md) | Rules that only apply to `src/components/**/*.tsx` |
| Skills                 | [.github/skills/](time-table/.github/skills/)              | `hello`, `helloname` (runs a script), `count-tests` (script + response template), and the user-invoked `gettasks` and `review` |
| Custom agent           | [.github/agents/PlaywrightDocs.agent.md](time-table/.github/agents/PlaywrightDocs.agent.md) | An agent that answers Playwright questions using the web tool |
| Hooks                  | [.github/hooks/](time-table/.github/hooks/)                | A `userPromptSubmitted` hook, and a `sessionStart` hook that adds the Node.js version to the context |
| Workspace settings     | [.vscode/settings.json](time-table/.vscode/settings.json)  | Custom instructions for commit message generation |

See [time-table/README.md](time-table/README.md) for more about the app.

## Prerequisites

Install only the tools for the parts you want to run:

- [Node.js](https://nodejs.org/) (for `jsts`, `ui` and `time-table`)
- [.NET 8 SDK](https://dotnet.microsoft.com/download) (for `dotnet`)
- Java with [Maven](https://maven.apache.org/) (for `java`)
- [Python 3](https://www.python.org/) (for `py`)
- [VS Code](https://code.visualstudio.com/) with GitHub Copilot (for the customization examples)
