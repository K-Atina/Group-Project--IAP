<?php
// Add user_type column to existing users table

$hostname = "127.0.0.1";
$user = "root";
$password = "2004";
$database = "mytikiti";

try {
    $conn = new PDO("mysql:host=$hostname;dbname=$database;charset=utf8mb4", $user, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    echo "Updating users table...\n";
    
    // Check if user_type column exists
    $result = $conn->query("SHOW COLUMNS FROM users LIKE 'user_type'");
    
    if ($result->rowCount() == 0) {
        echo "Adding user_type column...\n";
        $conn->exec("ALTER TABLE users ADD COLUMN user_type ENUM('buyer', 'creator') DEFAULT 'buyer' AFTER password");
        echo "✓ user_type column added successfully!\n";
    } else {
        echo "✓ user_type column already exists!\n";
    }
    
    // Check if email_verified column exists
    $result = $conn->query("SHOW COLUMNS FROM users LIKE 'email_verified'");
    
    if ($result->rowCount() == 0) {
        echo "Adding email_verified column...\n";
        $conn->exec("ALTER TABLE users ADD COLUMN email_verified BOOLEAN DEFAULT FALSE AFTER user_type");
        echo "✓ email_verified column added successfully!\n";
    } else {
        echo "✓ email_verified column already exists!\n";
    }
    
    // Update existing users to have user_type if null
    $conn->exec("UPDATE users SET user_type = 'buyer' WHERE user_type IS NULL");
    
    echo "\n✓✓✓ Database schema updated successfully! ✓✓✓\n";
    
} catch (PDOException $e) {
    echo "✗ Error: " . $e->getMessage() . "\n";
    exit(1);
}
?>
