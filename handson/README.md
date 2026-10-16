# SampleProjectPr

This repository contains multiple equivalent implementations of the same "Awesome Pizza" backend API, plus a frontend that consumes it.

## Backends (`dotnet`, `java`, `jsts`, `py`)

The `dotnet`, `java`, `jsts`, and `py` folders each implement the **same backend API** in a different language/stack. Only run one of them at a time, since they all listen on **http://localhost:3000** by default.

### dotnet

```
cd dotnet
dotnet run
```

### java

```
cd java
mvn spring-boot:run
```

### jsts

```
cd jsts
npm install
npm start
```

### py

```
cd py
python -m venv .venv
.\.venv\Scripts\activate   # Windows PowerShell; use `source .venv/bin/activate` on Linux/macOS
pip install -r requirements.txt
uvicorn app.main:app --reload --port 3000
```

See each folder's own README for more details on the endpoints exposed.

## Frontend (`ui`)

The `ui` folder starts the frontend at **http://localhost:3001**. It requires [Node.js](https://nodejs.org/) to be installed.

```
cd ui
npm install
npm start
```