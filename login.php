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
    <link rel="stylesheet" href="Backend\public\assets\style.css">
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
                        <strong>📧 Email Verification Required</strong><br>
                        <?php echo htmlspecialchars($error); ?>
                        <div class="verification-actions">
                            <a href="resend-verification.php<?php echo !empty($userEmail) ? '?email=' . urlencode($userEmail) : ''; ?>">
                                📨 Resend Verification Email
                            </a>
                            <span style="color: #bdc3c7;">|</span>
                            <a href="signup.php">🔄 Create New Account</a>
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
                <input type="password" name="password" placeholder="Password" required>
                <a href="#">Forgot password?</a>
                <button type="submit" class="btn">Log In</button>
            </form>
            <p style="text-align:center; margin: 10px 0;">OR</p>
            <button class="btn btn-google">
                <img src="https://upload.wikimedia.org/wikipedia/commons/4/4a/Logo_2013_Google.png" width="18">
                Continue With Google
            </button>
            <div class="signup">
                Don't have an account? <a href="signup.php">Sign Up</a>
                <br><br>
                <small style="color: #7f8c8d;">
                    Need to verify your email? <a href="resend-verification.php" style="color: #3498db;">Resend verification</a>
                </small>
            </div>
        </div>
        <div class="image-section">
            <img src="https://via.placeholder.com/120" alt="Login Illustration">
        </div>
    </div>
</body>
</html>