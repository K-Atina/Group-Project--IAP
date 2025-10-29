<?php
session_start();
require_once "../Backend/src/Config/Database.php";
require_once "../Backend/src/Models/User.php";

// Load environment variables
$envFile = __DIR__ . '/../.env';
if (file_exists($envFile)) {
    $lines = file($envFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        if (strpos($line, '#') === 0) continue;
        if (!strpos($line, '=')) continue;
        list($key, $value) = explode('=', $line, 2);
        $_ENV[trim($key)] = trim($value);
    }
}

$google_client_id = $_ENV['GOOGLE_CLIENT_ID'] ?? '';
$google_client_secret = $_ENV['GOOGLE_CLIENT_SECRET'] ?? '';
$redirect_uri = "http://localhost:8000/oauth/google-callback-new.php";

// STEP 1: Check if we got authorization code from Google
if (!isset($_GET['code'])) {
    $_SESSION['error'] = "❌ Google login failed - no authorization code received";
    header("Location: ../login.php");
    exit();
}

$code = $_GET['code'];

// STEP 2: Exchange code for access token
$token_url = "https://oauth2.googleapis.com/token";
$token_data = [
    'client_id' => $google_client_id,
    'client_secret' => $google_client_secret,
    'code' => $code,
    'grant_type' => 'authorization_code',
    'redirect_uri' => $redirect_uri,
];

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $token_url);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($token_data));
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/x-www-form-urlencoded']);
$response = curl_exec($ch);
curl_close($ch);

$token_info = json_decode($response, true);

if (!isset($token_info['access_token'])) {
    $_SESSION['error'] = "❌ Failed to get access token from Google";
    header("Location: ../login.php");
    exit();
}

// STEP 3: Get user info from Google
$user_url = "https://www.googleapis.com/oauth2/v2/userinfo?access_token=" . $token_info['access_token'];
$user_response = file_get_contents($user_url);
$user_info = json_decode($user_response, true);

if (!$user_info || !isset($user_info['email'])) {
    $_SESSION['error'] = "❌ Failed to get user info from Google";
    header("Location: ../login.php");
    exit();
}

// STEP 4: Create/login user - SIMPLIFIED
try {
    $database = new Database();
    $user = new User($database);
    
    $name = $user_info['name'] ?? $user_info['email'];
    $email = $user_info['email'];
    
    // Check if user exists
    if ($user->emailExists($email)) {
        // Existing user - just log them in
        $existing_user = $user->findByEmail($email);
        if ($existing_user) {
            $_SESSION["user"] = $existing_user["full_name"];
            $_SESSION["user_id"] = $existing_user["id"];
            $_SESSION["success"] = "🎉 Welcome back, {$existing_user['full_name']}! Logged in with Google.";
        }
    } else {
        // New user - create account with simple method
        $password = 'google_oauth_' . uniqid(); // Random password since they login with Google
        if ($user->register($name, $email, $password)) {
            $new_user = $user->findByEmail($email);
            if ($new_user) {
                $_SESSION["user"] = $new_user["full_name"];
                $_SESSION["user_id"] = $new_user["id"];
                $_SESSION["success"] = "🎉 Welcome {$name}! Your Google account has been linked successfully.";
            }
        }
    }
    
    // Verify session was set
    if (!isset($_SESSION["user"])) {
        throw new Exception("Session was not properly created");
    }
    
    // SUCCESS - redirect to dashboard
    header("Location: ../dashboard.php");
    exit();
    
} catch (Exception $e) {
    $_SESSION['error'] = "❌ Error during login process: " . $e->getMessage();
    header("Location: ../login.php");
    exit();
}
?>