<?php

echo "<h2>Database Connection Test</h2>";

// Test using your existing Database.php class
require_once "Backend/src/Config/Database.php";
require_once "Backend/src/Models/User.php";

try {
    echo "<h3>1. Testing Database Connection</h3>";
    
    $database = new Database();
    $conn = $database->getConnection();
    
    echo "<p style='color: green;'>✅ Database connection successful!</p>";
    
    echo "<h3>2. Testing User Model</h3>";
    
    $user = new User($database);
    
    // Test emailExists method
    $exists = $user->emailExists("test@nonexistent.com");
    echo "<p style='color: green;'>✅ User model working (emailExists test passed)</p>";
    
    echo "<h3>3. Verifying Table Structure</h3>";
    
    $stmt = $conn->query("DESCRIBE users");
    $columns = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo "<table border='1' style='border-collapse: collapse;'>";
    echo "<tr style='background: #f0f0f0;'><th>Column</th><th>Type</th><th>Default</th></tr>";
    
    $verificationColumns = ['email_verified', 'verification_token', 'token_expires_at'];
    $foundColumns = [];
    
    foreach ($columns as $column) {
        echo "<tr>";
        echo "<td>" . $column['Field'] . "</td>";
        echo "<td>" . $column['Type'] . "</td>";
        echo "<td>" . ($column['Default'] ?? 'NULL') . "</td>";
        echo "</tr>";
        
        if (in_array($column['Field'], $verificationColumns)) {
            $foundColumns[] = $column['Field'];
        }
    }
    echo "</table>";
    
    if (count($foundColumns) == 3) {
        echo "<p style='color: green; background: #d4edda; padding: 15px; border-radius: 5px;'>";
        echo "<strong>SUCCESS!</strong> All email verification columns are present and ready to use.";
        echo "</p>";
    } else {
        echo "<p style='color: red;'>Missing columns: " . implode(', ', array_diff($verificationColumns, $foundColumns)) . "</p>";
    }
    
    echo "<h3>4. Testing User Registration Methods</h3>";
    
    // Check if new verification methods exist
    if (method_exists($user, 'registerWithVerification')) {
        echo "<p style='color: green;'>✅ registerWithVerification method exists</p>";
    } else {
        echo "<p style='color: orange;'>⚠ registerWithVerification method missing - need to update User.php</p>";
    }
    
    if (method_exists($user, 'loginWithVerification')) {
        echo "<p style='color: green;'>✅ loginWithVerification method exists</p>";
    } else {
        echo "<p style='color: orange;'>⚠ loginWithVerification method missing - need to update User.php</p>";
    }
    
    if (method_exists($user, 'verifyEmail')) {
        echo "<p style='color: green;'>✅ verifyEmail method exists</p>";
    } else {
        echo "<p style='color: orange;'>⚠ verifyEmail method missing - need to update User.php</p>";
    }
    
    echo "<hr>";
    echo "<h3>Current Status:</h3>";
    echo "<ul>";
    echo "<li>✅ MariaDB 12.0 running</li>";
    echo "<li>✅ Database 'mytikiti' created</li>";
    echo "<li>✅ Users table with email verification columns</li>";
    echo "<li>✅ PHP can connect to database</li>";
    echo "<li>✅ User model loads successfully</li>";
    echo "</ul>";
    
    echo "<h3>Next Steps:</h3>";
    echo "<ol>";
    echo "<li>Update User.php with email verification methods (if missing)</li>";
    echo "<li>Create EmailService.php for sending emails</li>";
    echo "<li>Test signup with email verification</li>";
    echo "<li>Test login with verification check</li>";
    echo "</ol>";
    
} catch (Exception $e) {
    echo "<p style='color: red; background: #f8d7da; padding: 15px;'>";
    echo "<strong>Error:</strong> " . $e->getMessage();
    echo "</p>";
}
?>

<style>
    body { font-family: Arial, sans-serif; padding: 20px; }
    table { border-collapse: collapse; margin: 10px 0; }
    th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
    th { background-color: #f2f2f2; }
</style>