# awesome-pizza-dotnet

Minimal ASP.NET Core (.NET 8) port of the `jsts` Awesome Pizza API, providing feature parity for the daily menu, order management, and authentication endpoints.

## Run

```
dotnet run
```

The server starts on port `3000` (override with the `PORT` environment variable) and exposes the same endpoints as `jsts`/`java`/`py`:

- `GET /api/daily-menu`
- `GET /api/orders/{id}`
- `POST /api/orders`
- `PUT /api/orders/{id}`
- `POST /api/login`
- `GET /api/protected` (requires `Authorization: Bearer <token>`)
- `GET /api/admin` (requires `Authorization: Bearer <token>` with an admin role)

See [docs/openapi.yaml](docs/openapi.yaml) for the full API contract.
