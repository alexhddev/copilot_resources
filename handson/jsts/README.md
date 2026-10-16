# awesome-pizza-jsts

Node.js + Express (TypeScript) implementation of the Awesome Pizza API. It is the reference implementation that the `dotnet`, `java`, and `py` versions are ported from.

## Run

```bash
npm install
npm start
```

The server starts on port `3000` (override with the `PORT` environment variable) and exposes the same endpoints as `dotnet`/`java`/`py`:

- `GET /api/daily-menu`
- `GET /api/orders`
- `GET /api/orders/{id}`
- `POST /api/orders`
- `PUT /api/orders/{id}`
- `DELETE /api/orders/{id}`
- `POST /api/login`
- `GET /api/protected` (requires `Authorization: Bearer <token>`)
- `GET /api/admin` (requires `Authorization: Bearer <token>` with an admin role)

See [docs/openapi.yaml](docs/openapi.yaml) for the full API contract.
