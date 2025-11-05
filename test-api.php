<?php
// test-api.php - Simple test script to verify API endpoints
header('Content-Type: application/json');

echo json_encode([
    'success' => true,
    'message' => 'Backend API is working!',
    'timestamp' => date('Y-m-d H:i:s'),
    'endpoints' => [
        'auth' => '/Backend/api/auth.php',
        'events' => '/Backend/api/events.php'
    ]
]);
?>