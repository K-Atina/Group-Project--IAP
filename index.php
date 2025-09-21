<?php
session_start();
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MyTikiti - Landing Page</title>
    <link rel="stylesheet" href="Backend\public\assets\style.css">
</head>
<body>
    <nav class="navbar">
        <div class="logo"><strong>MyTikiti</strong></div>
        <ul>
            <li><a href="index.php">Home</a></li>
            <li><a href="#">About</a></li>
            <li><a href="#">Services</a></li>
            <li><a href="#">Contact</a></li>
        </ul>

        <?php if (isset($_SESSION["user"])): ?>
            <span style="color:#f39c12; margin-right:15px;">
                Welcome, <?= htmlspecialchars($_SESSION["user"]); ?>
            </span>
            <a href="logout.php" class="btn">Logout</a>
        <?php else: ?>
            <a href="login.php" class="btn">Log In</a>
        <?php endif; ?>
    </nav>

    <section class="hero">
        <h1>Your Ticket to Everything!</h1>
        <p>Skip the line, not the show</p>

        <?php if (!isset($_SESSION["user"])): ?>
            <button onclick="window.location.href='events.php'">Events</button>
            <button onclick="window.location.href='signup.php'">Sign Up</button>
        <?php else: ?>
            <button onclick="window.location.href='events.php'">Browse Events</button>
        <?php endif; ?>
    </section>

    <section class="events">
        <div class="card">
            <img src="https://via.placeholder.com/200x120">
            <h3>Event Title</h3>
            <p>Event Venue | Event Time</p>
            <button>View Event</button>
        </div>
        <div class="card">
            <img src="https://via.placeholder.com/200x120">
            <h3>Event Title</h3>
            <p>Event Venue | Event Time</p>
            <button>View Event</button>
        </div>
        <div class="card">
            <img src="https://via.placeholder.com/200x120">
            <h3>Event Title</h3>
            <p>Event Venue | Event Time</p>
            <button>View Event</button>
        </div>
    </section>

    <!-- Show popup message -->
    <?php if (isset($_SESSION["success"])): ?>
        <div class="popup"><?= $_SESSION["success"]; ?></div>
        <?php unset($_SESSION["success"]); ?>
    <?php endif; ?>
</body>
</html>
