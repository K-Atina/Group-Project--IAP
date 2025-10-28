<?php
echo "<h1>MyTikiti Setup Test</h1>";
echo "<style>
    .success { color: green; background: #d4edda; padding: 10px; margin: 5px 0; border-radius: 5px; }
    .error { color: red; background: #f8d7da; padding: 10px; margin: 5px 0; border-radius: 5px; }
    .info { color: blue; background: #d1ecf1; padding: 10px; margin: 5px 0; border-radius: 5px; }
</style>";

$allGood = true;

// Test 1: PHPMailer
echo "<h2>Test 1: PHPMailer Installation</h2>";
if (file_exists('../vendor/autoload.php')) {
    require_once '../vendor/autoload.php';
    if (class_exists('PHPMailer\PHPMailer\PHPMailer')) {
        echo "<div class='success'>✓ PHPMailer is installed and working</div>";
    } else {
        echo "<div class='error'>✗ PHPMailer class not found</div>";
        $allGood = false;
    }
} else {
    echo "<div class='error'>✗ Vendor folder not found</div>";
    $allGood = false;
}

// Test 2: EmailService
echo "<h2>Test 2: EmailService File</h2>";
if (file_exists('Backend/src/Services/EmailService.php')) {
    echo "<div class='success'>✓ EmailService.php exists</div>";
    
    try {
        require_once 'Backend/src/Services/EmailService.php';
        $emailService = new EmailService();
        echo "<div class='success'>✓ EmailService class loads successfully</div>";
    } catch (Exception $e) {
        echo "<div class='error'>✗ EmailService error: " . $e->getMessage() . "</div>";
        $allGood = false;
    }
} else {
    echo "<div class='error'>✗ EmailService.php not found</div>";
    $allGood = false;
}

// Test 3: Database Connection
echo "<h2>Test 3: Database Connection</h2>";
try {
    require_once "Backend/src/Config/Database.php";
    require_once "Backend/src/Models/User.php";
    
    $database = new Database();
    $user = new User($database);
    echo "<div class='success'>✓ Database connection successful</div>";
    echo "<div class='success'>✓ User model loads successfully</div>";
    
    // Check if verification methods exist
    if (method_exists($user, 'registerWithVerification')) {
        echo "<div class='success'>✓ Email verification methods available</div>";
    } else {
        echo "<div class='error'>✗ Email verification methods missing from User.php</div>";
        $allGood = false;
    }
    
} catch (Exception $e) {
    echo "<div class='error'>✗ Database error: " . $e->getMessage() . "</div>";
    $allGood = false;
}

// Test 4: Gmail Connection (if EmailService loaded)
if (isset($emailService)) {
    echo "<h2>Test 4: Gmail SMTP Connection</h2>";
    try {
        if ($emailService->testConnection()) {
            echo "<div class='success'>✓ Gmail SMTP connection successful</div>";
        } else {
            echo "<div class='error'>✗ Gmail SMTP connection failed - check credentials</div>";
            $allGood = false;
        }
    } catch (Exception $e) {
        echo "<div class='error'>✗ Gmail connection error: " . $e->getMessage() . "</div>";
        $allGood = false;
    }
}

// Final Status
echo "<h2>Overall Status</h2>";
if ($allGood) {
    echo "<div class='success'>";
    echo "<h3>🎉 ALL TESTS PASSED!</h3>";
    echo "<p>Your email verification system is ready to test.</p>";
    echo "<p><strong>Next steps:</strong></p>";
    echo "<ul>";
    echo "<li>Test signup: <a href='signup.php'>signup.php</a></li>";
    echo "<li>Test login: <a href='login.php'>login.php</a></li>";
    echo "<li>Create verification pages</li>";
    echo "</ul>";
    echo "</div>";
} else {
    echo "<div class='error'>";
    echo "<h3>❌ SOME TESTS FAILED</h3>";
    echo "<p>Fix the red error messages above before proceeding.</p>";
    echo "</div>";
}

echo "<h3>Current File Structure:</h3>";
echo "<div class='info'>";
$files = [
    'Backend/src/Config/Database.php',
    'Backend/src/Models/User.php', 
    'Backend/src/Services/EmailService.php',
    'signup.php',
    'login.php',
    '../vendor/autoload.php'
];

foreach ($files as $file) {
    if (file_exists($file)) {
        echo "✓ $file<br>";
    } else {
        echo "✗ $file (missing)<br>";
    }
}
echo "</div>";
?>