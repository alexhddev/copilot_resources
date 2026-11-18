# Awesome Pizza API tests

API tests (Node.js + [Vitest](https://vitest.dev)) for the API described in `../jsts/docs/openapi.yaml`.

## Run

1. Start the API (from `../jsts`): `npm start` (listens on port 3000).
2. In this folder:

```
npm install
npm test
```

Set `API_BASE_URL` to target a different server (default `http://localhost:3000`).
Tests create orders in the server's in-memory store, so restart the API for a clean state.
