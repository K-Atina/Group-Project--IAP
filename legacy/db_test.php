<?php
require_once "Backend/src/Config/Database.php";
echo "<h1>Database Test</h1>";
try {
    $database = new Database();
    echo "<p>Database connection works!</p>";
} catch (Exception $e) {
    echo "<p>Error: " . $e->getMessage() . "</p>";
}
?>