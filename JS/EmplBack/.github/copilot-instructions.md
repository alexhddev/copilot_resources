
# Copilot Instructions for EmplBack

## Architecture Overview
TypeScript/Express REST API for employee management, using a clean layered structure:
- **Entry Point**: `src/index.ts` → `src/Server.ts` (starts server on port 3000)
- **Routing**: `src/routes/EmplRoutes.ts` (all routes under `/empl` prefix)
- **Controllers**: `src/controllers/EmplController.ts` (business logic, error handling)
- **Repository**: `src/repository/EmplRepository.ts` (MySQL data access, async methods)
- **Models**: `src/model/Employee.ts` (TypeScript types, camelCase)

## Key Patterns & Conventions


### Database Field Mapping
- MySQL uses `snake_case` (e.g., `first_name`), TypeScript uses `camelCase` (e.g., `firstName`).
- The `id` field is consistent across both layers.


### Repository Pattern
- `EmplRepository` (MySQL) is the default, but `InMemoryRepository` exists for testing (same interface).
- All repository methods are async and return Promises.


### Error Handling
- Controllers use try/catch with `console.error()`, but do not send error details to the client. On error, respond with status 500 and a generic message.


### Route Structure
All API routes are prefixed with `/empl`:
- `GET /empl/` - get all employees
- `GET /empl/get/:id` - get by ID
- `POST /empl/add` - add employee
- `PUT /empl/position/:id` - update position only
- `DELETE /empl/delete/:id` - delete employee


### CORS
- Wide-open CORS (`origin: '*'`) is configured in `EmplRoutes.ts`.


## Development Workflows

### Running the Application
- Use `npm start` (runs `tsx src/index.ts`)


### Database Setup
- Run `createTable.sql` to create the `employees` table in the `cool_app` database
- Configure credentials in `src/config/dbConfig.ts`
- Test DB connection with `tsx test/dbTest.ts`


### API Testing
- Use `requests.http` with the REST Client extension for endpoint examples


### Adding New Employee Fields
1. Update `Employee` type in `src/model/Employee.ts`
2. Update SQL and mapping in `EmplRepository.ts`
3. Update `createTable.sql` for new installs


## External Dependencies
- Uses `express`, `mysql2/promise`, `cors`, and TypeScript types for dev

---

**Reference this file for project-specific conventions and workflows.**
