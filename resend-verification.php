<?php
session_start();
require_once "Backend/src/Config/Database.php";
require_once "Backend/src/Models/User.php";
require_once "Backend/src/Services/EmailService.php";

$database = new Database();
$user = new User($database);
$emailService = new EmailService();
$message = "";
$success = false;

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $email = trim($_POST["email"]);
    
    $result = $user->resendVerification($email);
    
    if ($result['success']) {
        $emailSent = $emailService->sendVerificationEmail(
            $email, 
            $result['user_name'], 
            $result['token']
        );
        
        if ($emailSent) {
            $message = "Verification email sent successfully! Please check your inbox.";
            $success = true;
        } else {
            $message = "Failed to send verification email. Please try again.";
        }
    } else {
        $message = $result['message'];
    }
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Resend Verification - MyTikiti</title>
    <link rel="stylesheet" href="Backend/public/assets/style.css">
    <style>
        .success { color: #27ae60; background: #d5f4e6; padding: 15px; border-radius: 5px; margin: 15px 0; }
        .error { color: #e74c3c; background: #fdf2f2; padding: 15px; border-radius: 5px; margin: 15px 0; }
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

    <div class="auth-container">
        <div class="form-section">
            <h2>Resend Verification Email</h2>
            
            <?php if (!empty($message)): ?>
                <div class="<?php echo $success ? 'success' : 'error'; ?>">
                    <?php echo htmlspecialchars($message); ?>
                </div>
            <?php endif; ?>
            
            <form method="post">
                <input type="email" name="email" placeholder="Enter your email address" required>
                <button type="submit" class="btn">Resend Verification Email</button>
            </form>
            
            <div class="signup" style="margin-top: 20px;">
                <a href="login.php">← Back to Login</a> | 
                <a href="signup.php">Create New Account</a>
            </div>
        </div>
        <div class="image-section">
            <img src="https://via.placeholder.com/250x200/e67e22/ffffff?text=Email+Verification" alt="Email Verification">
        </div>
    </div>
</body>
</html>