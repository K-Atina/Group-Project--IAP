<?php
$host = "localhost";
$user = "root";   // your DB username
$pass = "097531";       // your DB password
$db   = "mytikiti";

$conn = new mysqli($host, $user, $pass, $db);

if ($conn->connect_error) {
    die("Database connection failed: " . $conn->connect_error);
}
?>
