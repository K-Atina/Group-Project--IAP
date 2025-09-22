<?php session_start(); ?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MyTikiti - Landing Page</title>
    <!-- FIXED: Use forward slashes for web URLs -->
    <link rel="stylesheet" href="Backend/public/assets/style.css">
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

    <!-- FIXED: Use proper CSS classes and add image placeholders -->
    <div class="event-container">
        <div class="event-card">
            <div class="event-image-placeholder music">🎵 Concert</div>
            <div class="event-card-content">
                <h3>Summer Music Festival 2025</h3>
                <p>Nairobi Sports Club | March 15, 2025 - 7:00 PM</p>
                <p style="color: #e67e22; font-weight: bold;">KSH 2,500</p>
                <button class="btn">View Event</button>
            </div>
        </div>
        
        <div class="event-card">
            <div class="event-image-placeholder theater">🎭 Theater</div>
            <div class="event-card-content">
                <h3>Shakespeare in the Park</h3>
                <p>Uhuru Gardens | March 22, 2025 - 6:00 PM</p>
                <p style="color: #e67e22; font-weight: bold;">KSH 1,800</p>
                <button class="btn">View Event</button>
            </div>
        </div>
        
        <div class="event-card">
            <div class="event-image-placeholder sports">🏃‍♂️ Sports</div>
            <div class="event-card-content">
                <h3>Nairobi Marathon 2025</h3>
                <p>City Center | April 5, 2025 - 6:00 AM</p>
                <p style="color: #e67e22; font-weight: bold;">KSH 500</p>
                <button class="btn">View Event</button>
            </div>
        </div>
    </div>

    <!-- Show popup message -->
    <?php if (isset($_SESSION["success"])): ?>
        <div class="popup"><?= $_SESSION["success"]; ?></div>
        <?php unset($_SESSION["success"]); ?>
    <?php endif; ?>
</body>
</html>
