<?php
session_start();
require_once "Backend/src/Config/Database.php";
require_once "Backend/src/Models/User.php";

$database = new Database();
$user = new User($database);
$error = "";

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $email = trim($_POST["email"]);
    $password = trim($_POST["password"]);

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
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Login - MyTikiti</title>
    <link rel="stylesheet" href="Backend\public\assets\style.css">
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
