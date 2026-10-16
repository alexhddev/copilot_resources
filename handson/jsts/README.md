# awesome-pizza-jsts

Node.js + Express (TypeScript) implementation of the Awesome Pizza API. It is the reference implementation that the `dotnet`, `java`, and `py` versions are ported from.

## Database

Data is stored in MySQL (via `mysql2`). On startup the server creates the database, the `menu_entries`, `orders` and `order_items` tables if they don't exist, and seeds the sample menu and orders when the tables are empty. The MySQL user needs permission to create the database (or create it beforehand).

Configure the connection with environment variables, or copy [.env.example](.env.example) to `.env` (loaded automatically by `npm start`):

| Variable | Default |
| --- | --- |
| `DB_HOST` | `localhost` |
| `DB_PORT` | `3306` |
| `DB_USER` | `root` |
| `DB_PASSWORD` | _(empty)_ |
| `DB_NAME` | `awesome_pizza` |
| `DB_POOL_SIZE` | `10` |

## Run

Requires a running MySQL server.

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
