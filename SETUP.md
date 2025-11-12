# MyTikiti Platform - Setup Guide

## Project Structure

The project has been separated into two independent folders:

```
Group-Project--IAP/
├── frontend/           # Next.js application (Port 3000)
│   ├── app/
│   ├── components/
│   ├── lib/
│   └── package.json
│
└── backend/            # PHP API (Port 8080)
    ├── api/           # API endpoints
    │   ├── auth.php   # Authentication
    │   ├── events.php # Events management
    │   └── orders.php # Orders management
    ├── database/
    │   └── init.sql   # Database schema
    ├── public/
    │   └── index.php  # Router script
    └── src/
        ├── Config/
        │   └── Database.php
        ├── Models/
        │   └── User.php
        └── Services/
            └── EmailService.php
```

## Setup Instructions

### 1. Database Setup

**Option A: Using MySQL Command Line**
```bash
mysql -u root -p
```
Then paste the contents of `backend/database/init.sql`

**Option B: Using phpMyAdmin**
1. Open phpMyAdmin
2. Click "Import"
3. Select `backend/database/init.sql`
4. Click "Go"

**Option C: Manual SQL**
```sql
CREATE DATABASE IF NOT EXISTS mytikiti CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE mytikiti;

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    user_type ENUM('buyer', 'creator') DEFAULT 'buyer',
    email_verified BOOLEAN DEFAULT FALSE,
    verification_token VARCHAR(255) NULL,
    token_expires_at DATETIME NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### 2. Configure Database Connection

Edit `backend/src/Config/Database.php`:
```php
private $hostname = "127.0.0.1";   
private $database = "mytikiti";    
private $user = "root";        
private $password = "";  // <-- UPDATE THIS WITH YOUR MySQL PASSWORD
```

### 3. Start Backend Server

Open **PowerShell** and run:
```powershell
cd "C:\Users\Administrator\Desktop\Ticketing platform\Group-Project--IAP\backend\public"
php -S localhost:8080 index.php
```

You should see:
```
PHP 8.4.11 Development Server (http://localhost:8080) started
```

### 4. Start Frontend Server

Open **another PowerShell terminal** and run:
```powershell
cd "C:\Users\Administrator\Desktop\Ticketing platform\Group-Project--IAP\frontend"
npm run dev
```

You should see:
```
Next.js 16.0.0 (Turbopack)
- Local:        http://localhost:3000
```

## Testing Authentication

### Test Signup (Buyer)
1. Go to http://localhost:3000
2. Click "Sign Up" → "Buyer"
3. Fill in:
   - Name: Test Buyer
   - Email: buyer@test.com
   - Password: password123
4. Click "Create Account"

### Test Signup (Creator)
1. Go to http://localhost:3000
2. Click "Sign Up" → "Creator"
3. Fill in:
   - Name: Test Creator
   - Email: creator@test.com
   - Password: password123
4. Click "Create Account"

### Test Login
1. Go to http://localhost:3000
2. Click "Login"
3. Enter credentials from signup
4. Click "Login"

## API Endpoints

### Authentication
- **POST** `/api/auth/signup` - Register new user
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "userType": "buyer"  // or "creator"
  }
  ```

- **POST** `/api/auth/login` - Login user
  ```json
  {
    "email": "john@example.com",
    "password": "password123"
  }
  ```

- **GET** `/api/auth` - Get current logged-in user

- **POST** `/api/auth/logout` - Logout user

## Troubleshooting

### "Unexpected token 'I', "Internal S"... is not valid JSON"
- This means the backend is returning an HTML error page instead of JSON
- Check if the backend server is running on port 8080
- Check backend terminal for error messages

### Database Connection Failed
- Verify MySQL is running
- Check database credentials in `backend/src/Config/Database.php`
- Run `backend/test-db.php` to test connection

### Port Already in Use
- Backend (8080): Stop any other PHP servers
- Frontend (3000): Stop any other Next.js servers

## User Types

### Buyer
- Can browse and purchase tickets
- View purchase history
- Manage profile

### Creator
- Can create and manage events
- View sales analytics
- Manage created events

## Next Steps

1. ✅ Database is set up with users table
2. ✅ Backend API is running independently (port 8080)
3. ✅ Frontend is running independently (port 3000)
4. ✅ Authentication works for both buyer and creator types
5. ✅ Session management is implemented
6. ⏳ Test the full authentication flow

## Support

If you encounter any issues:
1. Check both terminal outputs for error messages
2. Verify database connection using `backend/test-db.php`
3. Check browser console for frontend errors
4. Check backend terminal for PHP errors
