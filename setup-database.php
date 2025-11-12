<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

echo "Testing database setup...\n\n";

$hostname = "127.0.0.1";
$user = "root";
$password = "2004";
$database = "mytikiti";

try {
    // Connect without database first
    echo "1. Connecting to MySQL...\n";
    $conn = new PDO("mysql:host=$hostname;charset=utf8mb4", $user, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    echo "   ✓ Connected to MySQL successfully!\n\n";
    
    // Create database
    echo "2. Creating database '$database'...\n";
    $conn->exec("CREATE DATABASE IF NOT EXISTS $database CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
    echo "   ✓ Database '$database' is ready!\n\n";
    
    // Connect to the database
    echo "3. Connecting to database...\n";
    $conn = new PDO("mysql:host=$hostname;dbname=$database;charset=utf8mb4", $user, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    echo "   ✓ Connected to database '$database'!\n\n";
    
    // Create users table
    echo "4. Creating users table...\n";
    $sql = "CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        full_name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        user_type ENUM('buyer', 'creator') DEFAULT 'buyer',
        email_verified BOOLEAN DEFAULT FALSE,
        verification_token VARCHAR(255) NULL,
        token_expires_at DATETIME NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_email (email),
        INDEX idx_user_type (user_type)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci";
    
    $conn->exec($sql);
    echo "   ✓ Users table is ready!\n\n";
    
    // Check for existing users
    $count = $conn->query("SELECT COUNT(*) FROM users")->fetchColumn();
    echo "5. Current users in database: $count\n\n";
    
    echo "✓✓✓ Database setup complete! ✓✓✓\n";
    echo "You can now use the application.\n";
    
} catch (PDOException $e) {
    echo "\n✗ ERROR: " . $e->getMessage() . "\n";
    exit(1);
}
?>
