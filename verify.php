<?php
session_start();
require_once "Backend/src/Config/Database.php";
require_once "Backend/src/Models/User.php";

$database = new Database();
$user = new User($database);
$message = "";
$success = false;

if (isset($_GET['token'])) {
    $token = $_GET['token'];
    $result = $user->verifyEmail($token);
    
    if ($result['success']) {
        $message = $result['message'];
        $success = true;
        // Auto-login the user after verification
        $_SESSION["user"] = $result['user']['full_name'];
        $_SESSION["user_id"] = $result['user']['id'];
    } else {
        $message = $result['message'];
    }
} else {
    $message = "Invalid verification link.";
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Email Verification - MyTikiti</title>
    <link rel="stylesheet" href="Backend/public/assets/style.css">
    <style>
        .verification-container {
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 80vh;
            padding: 20px;
        }
        .verification-box {
            background: #fff;
            padding: 40px;
            border-radius: 12px;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
            text-align: center;
            max-width: 500px;
        }
        .success { color: #27ae60; background: #d5f4e6; padding: 15px; border-radius: 8px; margin: 20px 0; }
        .error { color: #e74c3c; background: #fdf2f2; padding: 15px; border-radius: 8px; margin: 20px 0; }
        .btn { display: inline-block; padding: 12px 24px; margin: 10px; background: #e67e22; color: white; text-decoration: none; border-radius: 6px; }
    </style>
</head>
<body>
    <nav class="navbar">
        <div class="logo"><strong>MyTikiti</strong></div>
        <ul>
            <li><a href="index.php">Home</a></li>
        </ul>
        <a href="login.php" class="btn">Log In</a>
    </nav>

    <div class="verification-container">
        <div class="verification-box">
            <?php if ($success): ?>
                <h2>✓ Email Verified Successfully!</h2>
                <div class="success"><?php echo htmlspecialchars($message); ?></div>
                <p>Your account has been activated. You are now logged in.</p>
                <a href="index.php" class="btn">Go to Homepage</a>
            <?php else: ?>
                <h2>✗ Verification Failed</h2>
                <div class="error"><?php echo htmlspecialchars($message); ?></div>
                <p>Your verification link may have expired or is invalid.</p>
                <a href="resend-verification.php" class="btn">Resend Verification Email</a>
                <a href="login.php" class="btn">Back to Login</a>
            <?php endif; ?>
        </div>
    </div>
</body>
</html>