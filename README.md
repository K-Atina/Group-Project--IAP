# Smart Ticketing Platform - Full Stack Integration

This project combines a PHP backend with a Next.js React frontend to create a comprehensive ticketing platform.

## Project Structure

```
Group-Project--IAP/
├── Backend/                    # PHP Backend
│   ├── api/                   # REST API endpoints
│   │   ├── auth.php          # Authentication API
│   │   └── events.php        # Events API
│   ├── src/                  # Core backend classes
│   │   ├── Config/          # Database configuration
│   │   ├── Models/          # Data models (User, etc.)
│   │   └── Services/        # Email service, etc.
│   ├── oauth/               # OAuth implementations
│   ├── *.php                # Legacy PHP pages
│   ├── composer.json        # PHP dependencies
│   └── .env                 # Environment variables
├── frontend/                 # Next.js Frontend
│   ├── app/                 # Next.js app directory
│   ├── components/          # React components
│   ├── lib/                 # Utility libraries
│   │   ├── api.ts          # API client for backend
│   │   └── auth-context.tsx # Authentication context
│   ├── package.json        # Node.js dependencies
│   └── next.config.mjs     # Next.js configuration
└── README.md               # This file
```

## Setup Instructions

### Backend Setup (PHP)

1. **Start PHP Development Server**
   ```bash
   cd "C:\Users\Administrator\Desktop\Ticketing platform\Group-Project--IAP"
   php -S localhost:8080
   ```

2. **Environment Variables**
   - Copy `.env.example` to `.env` in the Backend folder
   - Configure database and email settings

### Frontend Setup (Next.js)

1. **Install Dependencies**
   ```bash
   cd frontend
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm run dev
   ```
   The frontend will be available at `http://localhost:3000`

## API Integration

### Backend APIs Created

1. **Authentication API** (`/Backend/api/auth.php`)
   - `POST /api/auth/login` - User login
   - `POST /api/auth/signup` - User registration
   - `POST /api/auth/logout` - User logout
   - `GET /api/auth` - Get current user
   - `POST /api/auth/verify` - Email verification
   - `POST /api/auth/resend-verification` - Resend verification

2. **Events API** (`/Backend/api/events.php`)
   - `GET /api/events` - Get events list (with filtering)
   - `POST /api/events` - Create new event

### Frontend Integration

- **API Client** (`frontend/lib/api.ts`) - Handles all backend communication
- **Auth Context** (`frontend/lib/auth-context.tsx`) - Manages user authentication state
- **Next.js Proxy** - Routes `/api/*` requests to `http://localhost:8080/Backend/api/*`

## Features

### Authentication System
- User registration with email verification
- Login/logout functionality
- Session management
- Role-based access (buyer/creator)

### Events Management
- Browse events with filtering
- Create new events (for authenticated users)
- Category-based organization
- Search functionality

### CORS Configuration
- Proper CORS headers for cross-origin requests
- Credentials support for session management
- Secure API communication

## Running Both Servers

### Terminal 1 - Backend (PHP)
```bash
cd "C:\Users\Administrator\Desktop\Ticketing platform\Group-Project--IAP"
php -S localhost:8080
```

### Terminal 2 - Frontend (Next.js)
```bash
cd "C:\Users\Administrator\Desktop\Ticketing platform\Group-Project--IAP\frontend"
npm run dev
```

## Testing the Integration

1. Open `http://localhost:3000` in your browser
2. Try registering a new account
3. Login with your credentials
4. Browse events
5. Create a new event (if logged in as creator)

## Next Steps

1. **Database Integration** - Ensure MySQL database is properly configured
2. **Email Service** - Configure email service for verification emails
3. **Error Handling** - Add comprehensive error handling
4. **Security** - Implement proper security measures
5. **Testing** - Add unit and integration tests

## Troubleshooting

### Common Issues

1. **CORS Errors** - Make sure both servers are running on correct ports
2. **Database Connection** - Check `.env` file configuration
3. **Session Issues** - Verify PHP session configuration
4. **Node Dependencies** - Run `npm install` in frontend directory

### Port Configuration

- Backend PHP: `localhost:8080`
- Frontend Next.js: `localhost:3000`
- API Proxy: Routes `/api/*` from frontend to backend

## Development Notes

The integration uses:
- PHP sessions for authentication state
- JSON APIs for data exchange
- Next.js proxy for seamless frontend/backend communication
- Proper CORS configuration for security