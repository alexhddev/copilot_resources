# Awesome Pizza – Hands-on

This folder contains several equivalent implementations of the same "Awesome Pizza" backend API, plus a frontend that consumes it.

## Prerequisites

Install only the tools for the parts you want to run:

| Part     | Requires                                                  |
| -------- | --------------------------------------------------------- |
| `dotnet` | [.NET 10 SDK](https://dotnet.microsoft.com/download)      |
| `java`   | Java 17+ and [Maven](https://maven.apache.org/)           |
| `jsts`   | [Node.js](https://nodejs.org/)                            |
| `py`     | [Python 3](https://www.python.org/)                       |
| `ui`     | [Node.js](https://nodejs.org/)                            |

## Backends (`dotnet`, `java`, `jsts`, `py`)

The `dotnet`, `java`, `jsts`, and `py` folders each implement the **same backend API** in a different language/stack. Only run one of them at a time, since they all listen on **http://localhost:3000** by default.

### dotnet

```bash
cd dotnet
dotnet run
```

### java

```bash
cd java
mvn spring-boot:run
```

### jsts

```bash
cd jsts
npm install
npm start
```

### py

```bash
cd py
python -m venv .venv
```

Activate the virtual environment:

```powershell
# Windows (PowerShell)
.\.venv\Scripts\activate
```

```bash
# Linux/macOS
source .venv/bin/activate
```

Then install the dependencies and start the server:

```bash
pip install -r requirements.txt
uvicorn app.main:app --reload --port 3000
```

See each backend's README and its `docs/openapi.yaml` for more details on the endpoints exposed.

## Frontend (`ui`)

The `ui` folder starts the frontend at **http://localhost:3001**. It calls the API at `http://localhost:3000/api`, so start one of the backends first.

```bash
cd ui
npm install
npm start
```
