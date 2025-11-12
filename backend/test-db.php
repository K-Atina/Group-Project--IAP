<?php
// Test database connection and setup

error_reporting(E_ALL);
ini_set('display_errors', 1);

echo "Testing database setup...\n\n";

// Database configuration
$hostname = "127.0.0.1";
$user = "root";
$password = ""; // Update with your MySQL password
$database = "mytikiti";

try {
    // First, connect without database to create it if needed
    $conn = new PDO("mysql:host=$hostname;charset=utf8mb4", $user, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    echo "✓ Connected to MySQL server\n";
    
    // Create database if it doesn't exist
    $conn->exec("CREATE DATABASE IF NOT EXISTS $database CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
    echo "✓ Database '$database' ready\n";
    
    // Now connect to the database
    $conn = new PDO("mysql:host=$hostname;dbname=$database;charset=utf8mb4", $user, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    echo "✓ Connected to database '$database'\n";
    
    // Check if users table exists
    $result = $conn->query("SHOW TABLES LIKE 'users'");
    if ($result->rowCount() > 0) {
        echo "✓ Users table exists\n";
        
        // Count users
        $count = $conn->query("SELECT COUNT(*) FROM users")->fetchColumn();
        echo "  → $count user(s) in database\n";
    } else {
        echo "⚠ Users table does not exist\n";
        echo "  → Run: mysql -u root -p < backend/database/init.sql\n";
    }
    
    echo "\n✓ Database setup complete!\n";
    
} catch (PDOException $e) {
    echo "✗ Error: " . $e->getMessage() . "\n";
    exit(1);
}
?>
