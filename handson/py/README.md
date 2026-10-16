# Awesome Pizza API (Python)

FastAPI replica of the `jsts` API.

## Setup

Create a virtual environment:

```
python -m venv .venv
```

Activate it:

Windows (PowerShell):
```
.\.venv\Scripts\activate
```

Linux/macOS:
```
source .venv/bin/activate
```

Install the dependencies:

```
pip install -r requirements.txt
```

## Run

```
uvicorn app.main:app --reload --port 3000
```

The API will be available at http://127.0.0.1:3000.

See [docs/openapi.yaml](docs/openapi.yaml) for the full API contract.
