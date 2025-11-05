# MyTikiti - Laravel Ticketing Platform

A modern Laravel-based ticketing platform for events with comprehensive features.

## Project Structure

This project has been migrated to Laravel from the original PHP structure. The legacy files are preserved in the `legacy/` directory.

```
Group-Project--IAP/
├── app/                      # Laravel Application
│   ├── Http/Controllers/    # Controllers
│   ├── Models/             # Eloquent Models
│   └── Providers/          # Service Providers
├── config/                  # Laravel Configuration
├── database/               # Migrations & Seeders
│   ├── migrations/         # Database migrations
│   └── seeders/           # Database seeders
├── resources/              # Views & Assets
│   ├── views/             # Blade templates
│   ├── css/               # Stylesheets
│   └── js/                # JavaScript
├── routes/                 # Route definitions
├── public/                 # Web server document root
├── legacy/                 # Original PHP files (preserved)
│   ├── Backend/           # Legacy backend structure
│   ├── oauth/             # OAuth implementations
│   └── *.php              # Legacy PHP pages
└── storage/               # Laravel storage
```

## Setup Instructions

### Prerequisites
- PHP 8.1 or higher
- Composer
- MySQL/MariaDB
- Node.js & NPM (for asset compilation)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Group-Project--IAP
   ```

2. **Install PHP Dependencies**
   ```bash
   composer install
   ```

3. **Install Node Dependencies**
   ```bash
   npm install
   ```

4. **Environment Configuration**
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```

5. **Configure Database**
   Edit `.env` file with your database credentials:
   ```env
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=ticketing_platform
   DB_USERNAME=your_username
   DB_PASSWORD=your_password
   ```

6. **Run Migrations**
   ```bash
   php artisan migrate
   ```

7. **Seed Database (Optional)**
   ```bash
   php artisan db:seed
   ```

8. **Compile Assets**
   ```bash
   npm run dev
   # or for production
   npm run build
   ```

### Running the Application

#### Development Server
```bash
php artisan serve
```
The application will be available at `http://localhost:8000`

#### Asset Compilation (Watch Mode)
```bash
npm run dev
```

## Features

### Current Features
- Laravel-based architecture
- User authentication system
- Database migrations for users and sessions
- Modern asset pipeline with Vite
- Blade templating system

### Planned Features
- Event management system
- Ticket booking and purchasing
- User dashboards (Buyers, Creators, Admins)
- Payment integration
- Email notifications
- Advanced search and filtering

## Laravel Migration

This project has been successfully migrated from a vanilla PHP structure to Laravel. Key improvements:

- **Modern Framework**: Laravel 11.x with all modern features
- **Database Migrations**: Proper schema management
- **Asset Pipeline**: Vite for modern asset compilation
- **Authentication**: Laravel's built-in authentication system
- **Testing**: PHPUnit integration
- **Artisan Commands**: Powerful CLI tools

### Legacy Compatibility
All original files have been preserved in the `legacy/` directory for reference and potential data migration needs.

## Development

### Artisan Commands
```bash
# Generate controllers
php artisan make:controller EventController

# Generate models
php artisan make:model Event -m

# Generate migrations
php artisan make:migration create_events_table

# Clear caches
php artisan cache:clear
php artisan config:clear
php artisan view:clear
```

### Testing
```bash
php artisan test
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests
5. Submit a pull request
- Next.js proxy for seamless frontend/backend communication
- Proper CORS configuration for security
=======
<p align="center"><a href="https://laravel.com" target="_blank"><img src="https://raw.githubusercontent.com/laravel/art/master/logo-lockup/5%20SVG/2%20CMYK/1%20Full%20Color/laravel-logolockup-cmyk-red.svg" width="400" alt="Laravel Logo"></a></p>

<p align="center">
<a href="https://github.com/laravel/framework/actions"><img src="https://github.com/laravel/framework/workflows/tests/badge.svg" alt="Build Status"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/dt/laravel/framework" alt="Total Downloads"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/v/laravel/framework" alt="Latest Stable Version"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/l/laravel/framework" alt="License"></a>
</p>

## About Laravel

Laravel is a web application framework with expressive, elegant syntax. We believe development must be an enjoyable and creative experience to be truly fulfilling. Laravel takes the pain out of development by easing common tasks used in many web projects, such as:

- [Simple, fast routing engine](https://laravel.com/docs/routing).
- [Powerful dependency injection container](https://laravel.com/docs/container).
- Multiple back-ends for [session](https://laravel.com/docs/session) and [cache](https://laravel.com/docs/cache) storage.
- Expressive, intuitive [database ORM](https://laravel.com/docs/eloquent).
- Database agnostic [schema migrations](https://laravel.com/docs/migrations).
- [Robust background job processing](https://laravel.com/docs/queues).
- [Real-time event broadcasting](https://laravel.com/docs/broadcasting).

Laravel is accessible, powerful, and provides tools required for large, robust applications.

## Learning Laravel

Laravel has the most extensive and thorough [documentation](https://laravel.com/docs) and video tutorial library of all modern web application frameworks, making it a breeze to get started with the framework. You can also check out [Laravel Learn](https://laravel.com/learn), where you will be guided through building a modern Laravel application.

If you don't feel like reading, [Laracasts](https://laracasts.com) can help. Laracasts contains thousands of video tutorials on a range of topics including Laravel, modern PHP, unit testing, and JavaScript. Boost your skills by digging into our comprehensive video library.

## Laravel Sponsors

We would like to extend our thanks to the following sponsors for funding Laravel development. If you are interested in becoming a sponsor, please visit the [Laravel Partners program](https://partners.laravel.com).

### Premium Partners

- **[Vehikl](https://vehikl.com)**
- **[Tighten Co.](https://tighten.co)**
- **[Kirschbaum Development Group](https://kirschbaumdevelopment.com)**
- **[64 Robots](https://64robots.com)**
- **[Curotec](https://www.curotec.com/services/technologies/laravel)**
- **[DevSquad](https://devsquad.com/hire-laravel-developers)**
- **[Redberry](https://redberry.international/laravel-development)**
- **[Active Logic](https://activelogic.com)**

## Contributing

Thank you for considering contributing to the Laravel framework! The contribution guide can be found in the [Laravel documentation](https://laravel.com/docs/contributions).

## Code of Conduct

In order to ensure that the Laravel community is welcoming to all, please review and abide by the [Code of Conduct](https://laravel.com/docs/contributions#code-of-conduct).

## Security Vulnerabilities

If you discover a security vulnerability within Laravel, please send an e-mail to Taylor Otwell via [taylor@laravel.com](mailto:taylor@laravel.com). All security vulnerabilities will be promptly addressed.

## License

The Laravel framework is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).
>>>>>>> origin/feature/laravel-migration
