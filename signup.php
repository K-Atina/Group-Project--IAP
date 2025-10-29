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

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Sign Up - MyTikiti</title>
    <!-- FIXED: Use forward slashes for web URLs -->
    <link rel="stylesheet" href="Backend/public/assets/style.css">
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
                        <strong>What's Next?</strong><br>
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
                <div class="password-input-wrapper">
                    <input type="password" id="signup-password" name="password" placeholder="Password" required>
                    <span class="password-toggle-btn" onclick="togglePasswordVisibility('signup-password', this)" title="Show password">�</span>
                </div>
                <div class="password-input-wrapper">
                    <input type="password" id="confirm-password" name="confirm_password" placeholder="Confirm Password" required>
                    <span class="password-toggle-btn" onclick="togglePasswordVisibility('confirm-password', this)" title="Show password">�</span>
                </div>
                <button type="submit" class="btn">Sign Up</button>
            </form>
            <p style="text-align:center; margin: 15px 0; color: #7f8c8d; font-weight: 500;">OR</p>
            
            <button class="btn btn-google" onclick="signupWithGoogle()">
                <svg width="18" height="18" viewBox="0 0 24 24" style="margin-right: 8px;">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
            </button>
            
            <button class="btn btn-microsoft" onclick="signupWithMicrosoft()">
                <svg width="18" height="18" viewBox="0 0 24 24" style="margin-right: 8px;">
                    <path fill="#F25022" d="M1 1h10.5v10.5H1z"/>
                    <path fill="#00A4EF" d="M12.5 1H23v10.5H12.5z"/>
                    <path fill="#7FBA00" d="M1 12.5h10.5V23H1z"/>
                    <path fill="#FFB900" d="M12.5 12.5H23V23H12.5z"/>
                </svg>
                Continue with Microsoft
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
    </div>

    <script>
        function signupWithGoogle() {
            // Redirect directly to Google login  
            window.location.href = 'oauth/google-redirect.php';
        }
        
        function signupWithMicrosoft() {
            // Simple Microsoft signup
            alert('🏢 Microsoft Signup Coming Soon!\n\nFor now, try Google signup which is ready to use.');
        }
        
        // Password visibility toggle
        function togglePasswordVisibility(inputId, toggleElement) {
            const passwordInput = document.getElementById(inputId);
            const isPassword = passwordInput.type === 'password';
            
            // Toggle input type
            passwordInput.type = isPassword ? 'text' : 'password';
            
            // Toggle icon and tooltip
            if (isPassword) {
                toggleElement.textContent = '🙈';
                toggleElement.classList.add('active');
                toggleElement.title = 'Hide password';
            } else {
                toggleElement.textContent = '�';
                toggleElement.classList.remove('active');
                toggleElement.title = 'Show password';
            }
        }
    </script>
</body>
</html>
