<?php
session_start();
require_once "../Backend/src/Config/Database.php";
require_once "../Backend/src/Models/User.php";

// Google OAuth Configuration
// You need to get these from Google Cloud Console
$google_client_id = $_ENV['GOOGLE_CLIENT_ID'] ?? 'your_google_client_id_here';
$google_client_secret = $_ENV['GOOGLE_CLIENT_SECRET'] ?? 'your_google_client_secret_here';
$redirect_uri = 'http://localhost:8000/oauth/google-callback.php';

// Check if we have the authorization code
if (!isset($_GET['code'])) {
    // Redirect to Google OAuth
    $google_oauth_url = 'https://accounts.google.com/o/oauth2/auth?' . http_build_query([
        'client_id' => $google_client_id,
        'redirect_uri' => $redirect_uri,
        'scope' => 'email profile',
        'response_type' => 'code',
        'access_type' => 'online'
    ]);
    
    header('Location: ' . $google_oauth_url);
    exit();
}

// Exchange authorization code for access token
$token_url = 'https://oauth2.googleapis.com/token';
$token_data = [
    'client_id' => $google_client_id,
    'client_secret' => $google_client_secret,
    'redirect_uri' => $redirect_uri,
    'grant_type' => 'authorization_code',
    'code' => $_GET['code']
];

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $token_url);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($token_data));
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/x-www-form-urlencoded'
]);

$token_response = curl_exec($ch);
$http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($http_code !== 200) {
    die('Error getting access token from Google');
}

$token_data = json_decode($token_response, true);
$access_token = $token_data['access_token'];

// Get user info from Google
$user_info_url = 'https://www.googleapis.com/oauth2/v2/userinfo?access_token=' . $access_token;
$user_info_response = file_get_contents($user_info_url);
$user_info = json_decode($user_info_response, true);

if (!$user_info) {
    die('Error getting user info from Google');
}

// Process the user login/registration
$database = new Database();
$user = new User($database);

// Check if user exists
$existingUser = $user->findByEmail($user_info['email']);

if ($existingUser) {
    // User exists, log them in
    $_SESSION["user"] = $existingUser["full_name"];
    $_SESSION["user_id"] = $existingUser["id"];
    $_SESSION["success"] = "Welcome back, {$existingUser['full_name']}! Logged in via Google.";
} else {
    // Create new user
    $full_name = $user_info['name'];
    $email = $user_info['email'];
    
    // Register the user as verified (since Google verified the email)
    $result = $user->registerOAuth($full_name, $email);
    
    if ($result['success']) {
        $_SESSION["user"] = $full_name;
        $_SESSION["user_id"] = $result["user_id"];
        $_SESSION["success"] = "Welcome {$full_name}! Account created via Google.";
    } else {
        $_SESSION["error"] = "Error creating account: " . $result['message'];
        header("Location: ../login.php");
        exit();
    }
}

// Redirect to dashboard
header("Location: ../dashboard.php");
exit();
?>