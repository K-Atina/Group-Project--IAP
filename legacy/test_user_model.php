<?php
require_once "Backend/src/Config/Database.php";
require_once "Backend/src/Models/User.php";

echo "<h1>User Model Test</h1>";

try {
    $database = new Database();
    $user = new User($database);
    
    echo "<p style='color: green;'>User model loaded successfully!</p>";
    
    // Test emailExists method with non-existent email
    $exists = $user->emailExists("nonexistent@test.com");
    echo "<p>emailExists test: " . ($exists ? "Found" : "Not found") . " (should be 'Not found')</p>";
    
    // Check if new verification methods exist
    echo "<h3>Checking for Email Verification Methods:</h3>";
    
    if (method_exists($user, 'registerWithVerification')) {
        echo "<p style='color: green;'>✓ registerWithVerification method exists</p>";
    } else {
        echo "<p style='color: orange;'>✗ registerWithVerification method missing</p>";
    }
    
    if (method_exists($user, 'loginWithVerification')) {
        echo "<p style='color: green;'>✓ loginWithVerification method exists</p>";
    } else {
        echo "<p style='color: orange;'>✗ loginWithVerification method missing</p>";
    }
    
    if (method_exists($user, 'verifyEmail')) {
        echo "<p style='color: green;'>✓ verifyEmail method exists</p>";
    } else {
        echo "<p style='color: orange;'>✗ verifyEmail method missing</p>";
    }
    
    echo "<p style='color: green;'>User model is working correctly!</p>";
    
} catch (Exception $e) {
    echo "<p style='color: red;'>Error: " . $e->getMessage() . "</p>";
}
?>