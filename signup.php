<?php
session_start();
require_once "Backend/src/Config/Database.php";
require_once "Backend/src/Models/User.php";
require_once "Backend/src/Services/EmailService.php";

$database = new Database();

$user = new User($database);
$emailService = new EmailService();
$message = "";
$messageType = "";

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $fullname = trim($_POST["fullname"]);
    $email = trim($_POST["email"]);
    $password = trim($_POST["password"]);
    $confirm = trim($_POST["confirm_password"]);

    if ($password !== $confirm) {
        $message = " Passwords do not match!";
        $messageType = "error";
    } elseif ($user->emailExists($email)) {
        $message = " Email already registered!";
        $messageType = "error";
    } else {
        // Try the new email verification registration first
        $result = $user->registerWithVerification($fullname, $email, $password);
        
        if ($result['success']) {
            // Send verification email
            $emailSent = $emailService->sendVerificationEmail($email, $fullname, $result['token']);
            
            if ($emailSent) {
                $message = " Registration successful! Please check your email to verify your account before logging in.";
                $messageType = "success";
                // Don't auto-login, require email verification first
            } else {
                $message = " Registration successful but verification email failed to send. You can resend it from the login page.";
                $messageType = "warning";
            }
        } else {
            // Fallback to original registration method if email verification fails
            if ($user->register($fullname, $email, $password)) {
                $_SESSION["user"] = $fullname;
                header("Location: login.php");
                exit();
            } else {
                $message = " Registration failed.";
                $messageType = "error";
            }
        }
    }
}
?>


?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Sign Up - MyTikiti</title>
    <link rel="stylesheet" href="Backend\public\assets\style.css">
    <style>
        .success-message {
            color: #27ae60;
            background: #d5f4e6;
            padding: 12px;
            border-radius: 5px;
            margin: 10px 0;
            border: 1px solid #a8e6cf;
        }
        .warning-message {
            color: #f39c12;
            background: #fef5e7;
            padding: 12px;
            border-radius: 5px;
            margin: 10px 0;
            border: 1px solid #f7dc6f;
        }
        .error-message {
            color: #e74c3c;
            background: #fdf2f2;
            padding: 12px;
            border-radius: 5px;
            margin: 10px 0;
            border: 1px solid #f5b7b1;
        }
        .verification-info {
            background: #e8f4f8;
            color: #2c3e50;
            padding: 15px;
            border-radius: 8px;
            margin: 15px 0;
            border-left: 4px solid #3498db;
            font-size: 14px;
            line-height: 1.5;
        }
        .verification-info strong {
            color: #2980b9;
        }
    </style>
</head>
<body>
    <div class="auth-container">
        <div class="form-section">
            <h2>Sign Up</h2>
            
            <?php if (!empty($message)): ?>
                <?php if ($messageType == "success"): ?>
                    <div class="success-message">
                        <?php echo htmlspecialchars($message); ?>
                    </div>
                    <div class="verification-info">
                        <strong>📧 What's Next?</strong><br>
                        • Check your email inbox (and spam folder)<br>
                        • Click the verification link in the email<br>
                        • Return to login once verified<br>
                        • The verification link expires in 24 hours
                    </div>
                <?php elseif ($messageType == "warning"): ?>
                    <div class="warning-message">
                        <?php echo htmlspecialchars($message); ?>
                    </div>
                <?php else: ?>
                    <div class="error-message">
                        <?php echo htmlspecialchars($message); ?>
                    </div>
                <?php endif; ?>
            <?php else: ?>
                <?php if (!empty($message)) echo "<p style='color:red;'>$message</p>"; ?>
            <?php endif; ?>
            
            <?php if ($messageType !== "success"): ?>
            <form method="post">
                <input type="text" name="fullname" placeholder="Full Name" required>
                <input type="email" name="email" placeholder="Email Address" required>
                <input type="password" name="password" placeholder="Password" required>
                <input type="password" name="confirm_password" placeholder="Confirm Password" required>
                <button type="submit" class="btn">Sign Up</button>
            </form>
            <p style="text-align:center; margin: 10px 0;">OR</p>
            <button class="btn btn-google">
                <img src="https://upload.wikimedia.org/wikipedia/commons/4/4a/Logo_2013_Google.png" width="18">
                Continue With Google
            </button>
            <?php endif; ?>
            
            <div class="signup">
                <?php if ($messageType == "success"): ?>
                    <a href="login.php">← Go to Login</a> | 
                    <a href="resend-verification.php">Resend Email</a>
                <?php else: ?>
                    Already have an account? <a href="login.php">Log In</a>
                <?php endif; ?>
            </div>
        </div>
        <div class="image-section">
            <img src="https://via.placeholder.com/120" alt="Sign Up Illustration">
        </div>
    </div>
</body>
</html>