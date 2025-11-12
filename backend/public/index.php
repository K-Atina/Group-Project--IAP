<?php
// Router for PHP built-in server

$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$uri = urldecode($uri);

// Debug logging
error_log("===== Router Debug =====");
error_log("Raw URI: " . $_SERVER['REQUEST_URI']);
error_log("Parsed URI: " . $uri);
error_log("Method: " . $_SERVER['REQUEST_METHOD']);
error_log("========================");

// Route API requests to the appropriate file
if (preg_match('/^\/api\/auth/', $uri)) {
    error_log("Matched: /api/auth/");
    require __DIR__ . '/../api/auth.php';
    exit;
}

if (preg_match('/^\/api\/events/', $uri)) {
    error_log("Matched: /api/events/");
    require __DIR__ . '/../api/events.php';
    exit;
}

if (preg_match('/^\/api\/orders/', $uri)) {
    error_log("Matched: /api/orders/");
    require __DIR__ . '/../api/orders.php';
    exit;
}

if (preg_match('/^\/api\/mpesa/', $uri)) {
    error_log("Matched: /api/mpesa/");
    require __DIR__ . '/../api/mpesa.php';
    exit;
}

// For other requests, check if the file exists
$filepath = __DIR__ . $uri;

if ($uri !== '/' && file_exists($filepath)) {
    return false; // serve the requested resource as-is
}

// Default 404
http_response_code(404);
header('Content-Type: application/json');
echo json_encode([
    'success' => false,
    'message' => 'Endpoint not found'
]);
