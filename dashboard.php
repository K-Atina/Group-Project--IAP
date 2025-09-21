<?php
session_start();

// If user is not logged in, send them back
if (!isset($_SESSION["user"])) {
    header("Location: login.php");
    exit;
}

// Save success message into session
$_SESSION["success"] = "🎉 Congratulations {$_SESSION['user']} for logging in!";

// Redirect back to homepage
header("Location: index.php");
exit;
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Dashboard - MyTikiti</title>
</head>
<body>
    
    <?php
if (isset($_SESSION["success"])) {
    echo "<div class='popup'>" . $_SESSION["success"] . "</div>";
    unset($_SESSION["success"]); // clear message after showing once
}
?>
    <h1>Welcome, <?php echo htmlspecialchars($_SESSION["user"]); ?>!</h1>
    <a href="logout.php">Log Out</a>
</body>
</html>
