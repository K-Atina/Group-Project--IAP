<?php
session_start();
require_once "classes/User.php";

$user = new User();
$message = "";

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $fullname = trim($_POST["fullname"]);
    $email = trim($_POST["email"]);
    $password = trim($_POST["password"]);
    $confirm = trim($_POST["confirm_password"]);

    if ($password !== $confirm) {
        $message = "❌ Passwords do not match!";
    } elseif ($user->emailExists($email)) {
        $message = "⚠️ Email already registered!";
    } else {
        if ($user->register($fullname, $email, $password)) {
            $_SESSION["user"] = $fullname;
            header("Location: dashboard.php");
            exit;
        } else {
            $message = "⚠️ Registration failed.";
        }
    }
}
?>
<!-- The same HTML form from before -->

?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Sign Up - MyTikiti</title>
    <link rel="stylesheet" href="assets/style.css">
</head>
<body>
    <div class="auth-container">
        <div class="form-section">
            <h2>Sign Up</h2>
            <?php if (!empty($message)) echo "<p style='color:red;'>$message</p>"; ?>
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
            <div class="signup">
                Already have an account? <a href="login.php">Log In</a>
            </div>
        </div>
        <div class="image-section">
            <img src="https://via.placeholder.com/120" alt="Sign Up Illustration">
        </div>
    </div>
</body>
</html>
