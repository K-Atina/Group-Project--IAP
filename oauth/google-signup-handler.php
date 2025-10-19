<?php
session_start();
require_once "../Backend/src/Config/Database.php";
require_once "../Backend/src/Models/User.php";

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit();
}

$input = json_decode(file_get_contents('php://input'), true);

if (!$input || !isset($input['email']) || !isset($input['name'])) {
    echo json_encode(['success' => false, 'message' => 'Invalid data']);
    exit();
}

try {
    $database = new Database();
    $user = new User($database);

    $name = $input['name'];
    $email = $input['email'];
    $google_id = $input['google_id'] ?? '';

    // Check if user already exists
    $existingUser = $user->findByEmail($email);

    if ($existingUser) {
        // User exists, log them in
        $_SESSION["user"] = $existingUser["full_name"];
        $_SESSION["user_id"] = $existingUser["id"];
        $_SESSION["success"] = "Welcome back, {$existingUser['full_name']}!";
        
        echo json_encode([
            'success' => true,
            'message' => 'Logged in successfully',
            'user' => $existingUser['full_name']
        ]);
    } else {
        // Create new user
        $result = $user->registerOAuth($name, $email);
        
        if ($result['success']) {
            $_SESSION["user"] = $name;
            $_SESSION["user_id"] = $result["user_id"];
            $_SESSION["success"] = "Welcome {$name}! Account created successfully.";
            
            echo json_encode([
                'success' => true,
                'message' => 'Account created successfully',
                'user' => $name
            ]);
        } else {
            echo json_encode([
                'success' => false,
                'message' => 'Failed to create account'
            ]);
        }
    }

} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Server error: ' . $e->getMessage()
    ]);
}
?>