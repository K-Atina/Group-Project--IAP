<?php
session_start();

// If user is not logged in, send them back
if (!isset($_SESSION["user"])) {
    header("Location: login.php");
    exit();
}

// Save success message into session (if not already set)
if (!isset($_SESSION["success"])) {
    $_SESSION["success"] = "Congratulations {$_SESSION['user']} for logging in!";
}
  // Redirect back to homepage
header("Location: index.php");
exit();
?>  


<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Dashboard - MyTikiti</title>
    <style>
        .popup {
            background: #d4edda;
            color: #155724;
            padding: 10px;
            margin-bottom: 15px;
            border: 1px solid #c3e6cb;
            border-radius: 4px;
        }
    </style>
</head>
<body>
    <?php 
    if (isset($_SESSION["success"])) {
        echo "<div class='popup'>" . htmlspecialchars($_SESSION["success"]) . "</div>";
        unset($_SESSION["success"]); // clears message after showing once
    }
    ?>
    <h1>Welcome, <?php echo htmlspecialchars($_SESSION["user"]); ?>!</h1>
    <a href="logout.php">Log Out</a>
</body>
</html>
