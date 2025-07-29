# Employee Backend API

This project is a simple Node.js backend API for managing employee data. It uses TypeScript and follows a modular architecture with controllers, repositories, and models. The project is designed for learning and demonstration purposes.

## Features
- RESTful API for employee management
- In-memory and database repository support
- Modular code structure (controllers, models, repositories, routes)
- TypeScript for type safety

## Project Structure
```
createTable.sql           # SQL script for creating the employee table
package.json              # Project dependencies and scripts
tsconfig.json             # TypeScript configuration
src/
  index.ts                # Entry point
  Server.ts               # Server setup
  config/dbConfig.ts      # Database configuration
  controllers/EmplController.ts  # Employee controller
  model/Employee.ts       # Employee model
  repository/EmplRepository.ts   # Database repository
  repository/InMemoryRepository.ts # In-memory repository
  routes/EmplRoutes.ts    # API routes
test/dbTest.ts            # Database test script
```

## Getting Started

### Prerequisites
- Node.js (v16 or higher recommended)
- npm
- (Optional) A running SQL database if using the DB repository

### Installation
1. Clone the repository:
   ```bash
   git clone <repo-url>
   cd EmplBack
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

### Running the Server
To start the server:
```bash
npm start
```
Or, for development with auto-reload:
```bash
npm run dev
```

### API Endpoints
- `GET /employees` - List all employees
- `GET /employees/:id` - Get employee by ID
- `POST /employees` - Create a new employee
- `PUT /employees/:id` - Update an employee
- `DELETE /employees/:id` - Delete an employee

### Testing
Test scripts are located in the `test/` directory. You can run tests with:
```bash
npm test
```

## License
This project is for educational purposes.
