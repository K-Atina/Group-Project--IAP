<?php
session_start();
require_once "classes/User.php";

$user = new User();
$error = "";

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $email = trim($_POST["email"]);
    $password = trim($_POST["password"]);

    $loggedInUser = $user->login($email, $password);

    if ($loggedInUser) {
        // ✅ use full_name (correct DB column)
        $_SESSION["user"] = $loggedInUser["full_name"];

        // ✅ optional: set success message right here
        $_SESSION["success"] = "🎉 Congratulations {$_SESSION['user']} for logging in!";

        // redirect to dashboard.php (which will bounce back to index.php)
        header("Location: dashboard.php");
        exit;
    } else {
        $error = "❌ Invalid login credentials.";
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Login - MyTikiti</title>
    <link rel="stylesheet" href="assets/style.css">
</head>
<body>
    <div class="auth-container">
        <div class="form-section">
            <h2>Login</h2>
            <?php if (!empty($error)) echo "<p style='color:red;'>$error</p>"; ?>
            <form method="post">
                <input type="email" name="email" placeholder="Email Address" required>
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
                Don’t have an account? <a href="signup.php">Sign Up</a>
            </div>
        </div>
        <div class="image-section">
            <img src="https://via.placeholder.com/120" alt="Login Illustration">
        </div>
    </div>
</body>
</html>
