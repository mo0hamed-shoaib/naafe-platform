# Naafe' Backend API

A RESTful API for the Naafe' job-market platform built with Node.js, Express, and MongoDB.

## Features

- User authentication with JWT tokens
- Role-based access control (Seeker, Provider, Admin)
- Clean architecture with separation of concerns
- Input validation and error handling
- MongoDB with Mongoose ODM

## Prerequisites

- Node.js (v16 or higher)
- MongoDB (v5 or higher)
- npm or yarn

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with the following variables:
   ```env
   # Server Configuration
   PORT=3000
   NODE_ENV=development

   # MongoDB Configuration
   MONGODB_URI=mongodb://localhost:27017/naafe_db

   # JWT Configuration
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   JWT_REFRESH_SECRET=your-super-secret-refresh-jwt-key-change-this-in-production

   # CORS Configuration
   CORS_ORIGIN=http://localhost:3000
   ```

4. Start the development server:
   ```bash
   npm start
   ```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `POST /api/auth/refresh` - Refresh access token
- `GET /api/auth/me` - Get current user profile

### User Profiles

- `GET /api/users/me` - Get current user profile (authenticated)
- `PATCH /api/users/me` - Update current user profile (authenticated)
- `GET /api/users/:id` - Get public user profile by ID (public)
- `GET /api/users/:id/stats` - Get user statistics (public)

### Categories

- `GET /api/categories` - Get all categories (public)
- `GET /api/categories/dropdown` - Get categories for dropdown (public)
- `GET /api/categories/:id` - Get category by ID (public)
- `GET /api/categories/:id/hierarchy` - Get category hierarchy (public)
- `POST /api/categories` - Create a new category (admin only)
- `PUT /api/categories/:id` - Update category (admin only)
- `DELETE /api/categories/:id` - Delete category (admin only)

### Health Check

- `GET /api/health` - Server health check

## Project Structure

```
backend/
├── config/
│   └── db.js              # Database configuration
├── controllers/
│   └── authController.js   # Authentication controllers
├── middlewares/
│   └── auth.middleware.js  # Authentication middleware
├── models/
│   ├── User.js            # User model
│   ├── Seeker.js          # Seeker model
│   ├── Provider.js        # Provider model
│   └── Admin.js           # Admin model
├── routes/
│   └── authRoutes.js      # Authentication routes
├── services/
│   └── authService.js     # Authentication business logic
├── validation/
│   └── authValidation.js  # Input validation schemas
├── app.js                 # Express app configuration
├── server.js              # Server entry point
└── package.json
```

## Architecture

This project follows a clean architecture pattern:

1. **Routes** - Define HTTP endpoints and connect to controllers
2. **Controllers** - Handle HTTP requests/responses and call services
3. **Services** - Contain business logic and data operations
4. **Models** - Define data structure and database schemas
5. **Middlewares** - Handle cross-cutting concerns (auth, validation)
6. **Validation** - Input validation and sanitization

## Error Handling

The API returns consistent error responses:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Error description"
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## Success Response Format

```json
{
  "success": true,
  "data": {
    // Response data
  },
  "message": "Success message",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## Development

To run in development mode with auto-restart:

```bash
npm run dev
```

## Testing

```bash
npm test
```

## License

ISC 