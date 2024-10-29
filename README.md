A Node.js application for managing item combinations with MySQL database integration.

## Prerequisites
- Node.js version 20 or higher
- MySQL server version 8.0 or higher

1. Install dependencies:
```bash
npm install
```

2. Modify the database configuration in `/db/config.js` to match your environment.

## API
The application provides the following API endpoints:

### `POST /combinations`
- **Request Body**: `{ "items":[1,2], "length":2}`
- **Response**: `{"id":1,"combinations":[["A1","B1"],["A1","B2"]]}`
