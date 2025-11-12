# Backend Setup Instructions

## Database Setup

1. **Create the database and tables:**
   ```bash
   # Login to MySQL
   mysql -u root -p

   # Run the initialization script
   source backend/database/init.sql
   ```

   Or import via phpMyAdmin or MySQL Workbench:
   - Import file: `backend/database/init.sql`

2. **Update database credentials:**
   Edit `backend/src/Config/Database.php` and update the following:
   ```php
   private $password = "";  // Change to your MySQL password
   ```

## Starting the Backend Server

```powershell
# Navigate to backend/public directory
cd backend/public

# Start PHP server on port 8080
php -S localhost:8080 index.php
```

The backend API will be available at: http://localhost:8080

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user (buyer or creator)
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth` - Get current user

### Request Examples

**Signup:**
```json
POST /api/auth/signup
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "userType": "buyer"  // or "creator"
}
```

**Login:**
```json
POST /api/auth/login
{
  "email": "john@example.com",
  "password": "password123"
}
```

## Frontend Integration

The Next.js frontend automatically proxies `/api/*` requests to the backend server at `http://localhost:8080`.

Make sure both servers are running:
- Frontend: http://localhost:3000
- Backend: http://localhost:8080
