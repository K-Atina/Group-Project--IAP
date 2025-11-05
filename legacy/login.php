<?php
session_start();
require_once "Backend/src/Config/Database.php";
require_once "Backend/src/Models/User.php";

$database = new Database();
$user = new User($database);
$error = "";
$needsVerification = false;
$userEmail = "";

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $email = trim($_POST["email"]);
    $password = trim($_POST["password"]);
    $userEmail = $email; // Store for verification link

    // Try the new verification-aware login first
    $result = $user->loginWithVerification($email, $password);

    if ($result['success']) {
        // Successful login with verified email
        $_SESSION["user"] = $result["user"]["full_name"];
        $_SESSION["user_id"] = $result["user"]["id"];
        $_SESSION["success"] = " Congratulations {$result['user']['full_name']} for logging in!";

        // Clean output buffer before redirect
        if (ob_get_level()) {
            ob_end_clean();
        }

        // redirect to dashboard.php (which will bounce back to index.php)
        header("Location: dashboard.php");
        exit();
    } else {
        // Check if it's a verification issue
        if (isset($result['needs_verification']) && $result['needs_verification']) {
            $error = $result['message'];
            $needsVerification = true;
        } else {
            // Fallback to original login method for backward compatibility
            $loggedInUser = $user->login($email, $password);

            if ($loggedInUser) {
                $_SESSION["user"] = $loggedInUser["full_name"];
                $_SESSION["user_id"] = $loggedInUser["id"];
                $_SESSION["success"] = " Congratulations {$loggedInUser['full_name']} for logging in!";

                // Clean output buffer before redirect
                if (ob_get_level()) {
                    ob_end_clean();
                }

                // redirect to dashboard.php (which will bounce back to index.php)
                header("Location: dashboard.php");
                exit();
            } else {
                $error = " Invalid login credentials.";
            }
        }
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Login - MyTikiti</title>
    <!-- FIXED: Use forward slashes for web URLs -->
    <link rel="stylesheet" href="Backend/public/assets/style.css">
    <style>
        .verification-notice {
            color: #f39c12;
            background: #fef5e7;
            padding: 15px;
            border-radius: 8px;
            margin: 10px 0;
            border: 1px solid #f7dc6f;
            line-height: 1.5;
        }
        .verification-notice a {
            color: #e67e22;
            font-weight: bold;
            text-decoration: none;
        }
        .verification-notice a:hover {
            text-decoration: underline;
        }
        .error-message {
            color: #e74c3c;
            background: #fdf2f2;
            padding: 12px;
            border-radius: 5px;
            margin: 10px 0;
            border: 1px solid #f5b7b1;
        }
        .verification-actions {
            margin-top: 15px;
            padding: 10px;
            background: #e8f4f8;
            border-radius: 6px;
            text-align: center;
        }
        .verification-actions a {
            display: inline-block;
            margin: 0 10px;
            color: #2980b9;
            font-weight: 500;
        }
    </style>
</head>
<body>
    <div class="auth-container">
        <div class="form-section">
            <h2>Login</h2>
            
            <?php if (!empty($error)): ?>
                <?php if ($needsVerification): ?>
                    <div class="verification-notice">
                        <strong>Email Verification Required</strong><br>
                        <?php echo htmlspecialchars($error); ?>
                        <div class="verification-actions">
                            <a href="resend-verification.php<?php echo !empty($userEmail) ? '?email=' . urlencode($userEmail) : ''; ?>">
                                Resend Verification Email
                            </a>
                            <span style="color: #bdc3c7;">|</span>
                            <a href="signup.php">Create New Account</a>
                        </div>
                    </div>
                <?php else: ?>
                    <div class="error-message">
                        <?php echo htmlspecialchars($error); ?>
                    </div>
                <?php endif; ?>
            <?php else: ?>
                <?php if (!empty($error)) echo "<p style='color:red;'>$error</p>"; ?>
            <?php endif; ?>
            
            <form method="post">
                <input type="email" name="email" placeholder="Email Address" value="<?php echo htmlspecialchars($userEmail); ?>" required>
                <div class="password-input-wrapper">
                    <input type="password" id="login-password" name="password" placeholder="Password" required>
                    <span class="password-toggle-btn" onclick="togglePasswordVisibility('login-password', this)" title="Show password">�</span>
                </div>
                <a href="forgot-password.php">Forgot password?</a>
                <button type="submit" class="btn">Log In</button>
            </form>
            <p style="text-align:center; margin: 15px 0; color: #7f8c8d; font-weight: 500;">OR</p>
            
            <button class="btn btn-google" onclick="loginWithGoogle()">
                <svg width="18" height="18" viewBox="0 0 24 24" style="margin-right: 8px;">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
            </button>
            
            <button class="btn btn-microsoft" onclick="loginWithMicrosoft()">
                <svg width="18" height="18" viewBox="0 0 24 24" style="margin-right: 8px;">
                    <path fill="#F25022" d="M1 1h10.5v10.5H1z"/>
                    <path fill="#00A4EF" d="M12.5 1H23v10.5H12.5z"/>
                    <path fill="#7FBA00" d="M1 12.5h10.5V23H1z"/>
                    <path fill="#FFB900" d="M12.5 12.5H23V23H12.5z"/>
                </svg>
                Continue with Microsoft
            </button>
            <div class="signup">
                Don't have an account? <a href="signup.php">Sign Up</a>
                <br><br>
                <small style="color: #7f8c8d;">
                    Need to verify your email? <a href="resend-verification.php" style="color: #3498db;">Resend verification</a>
                </small>
            </div>
        </div>
    </div>

    <script>
        function loginWithGoogle() {
            // Redirect directly to Google login
            window.location.href = 'oauth/google-redirect.php';
        }
        
        function loginWithMicrosoft() {
            // Simple Microsoft signup
            alert('🏢 Microsoft Login Coming Soon!\n\nFor now, try Google signup which is ready to use.');
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
