<?php
session_start();
require_once "../Backend/src/Config/Database.php";
require_once "../Backend/src/Models/User.php";

// Microsoft OAuth Configuration
// You need to get these from Azure AD App Registration
$microsoft_client_id = $_ENV['MICROSOFT_CLIENT_ID'] ?? 'your_microsoft_client_id_here';
$microsoft_client_secret = $_ENV['MICROSOFT_CLIENT_SECRET'] ?? 'your_microsoft_client_secret_here';
$redirect_uri = 'http://localhost:8000/oauth/microsoft-callback.php';
$tenant = 'common'; // Use 'common' for personal and work accounts

// Check if we have the authorization code
if (!isset($_GET['code'])) {
    // Redirect to Microsoft OAuth
    $microsoft_oauth_url = "https://login.microsoftonline.com/{$tenant}/oauth2/v2.0/authorize?" . http_build_query([
        'client_id' => $microsoft_client_id,
        'response_type' => 'code',
        'redirect_uri' => $redirect_uri,
        'response_mode' => 'query',
        'scope' => 'openid profile email User.Read',
        'state' => bin2hex(random_bytes(16))
    ]);
    
    header('Location: ' . $microsoft_oauth_url);
    exit();
}

// Exchange authorization code for access token
$token_url = "https://login.microsoftonline.com/{$tenant}/oauth2/v2.0/token";
$token_data = [
    'client_id' => $microsoft_client_id,
    'scope' => 'openid profile email User.Read',
    'code' => $_GET['code'],
    'redirect_uri' => $redirect_uri,
    'grant_type' => 'authorization_code',
    'client_secret' => $microsoft_client_secret
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
    die('Error getting access token from Microsoft: ' . $token_response);
}

$token_data = json_decode($token_response, true);
$access_token = $token_data['access_token'];

// Get user info from Microsoft Graph
$user_info_url = 'https://graph.microsoft.com/v1.0/me';
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $user_info_url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Authorization: Bearer ' . $access_token,
    'Content-Type: application/json'
]);

$user_info_response = curl_exec($ch);
$http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($http_code !== 200) {
    die('Error getting user info from Microsoft Graph: ' . $user_info_response);
}

$user_info = json_decode($user_info_response, true);

if (!$user_info) {
    die('Error parsing user info from Microsoft');
}

// Process the user login/registration
$database = new Database();
$user = new User($database);

// Check if user exists
$existingUser = $user->findByEmail($user_info['mail'] ?? $user_info['userPrincipalName']);

if ($existingUser) {
    // User exists, log them in
    $_SESSION["user"] = $existingUser["full_name"];
    $_SESSION["user_id"] = $existingUser["id"];
    $_SESSION["success"] = "Welcome back, {$existingUser['full_name']}! Logged in via Microsoft.";
} else {
    // Create new user
    $full_name = $user_info['displayName'];
    $email = $user_info['mail'] ?? $user_info['userPrincipalName'];
    
    // Register the user as verified (since Microsoft verified the email)
    $result = $user->registerOAuth($full_name, $email);
    
    if ($result['success']) {
        $_SESSION["user"] = $full_name;
        $_SESSION["user_id"] = $result["user_id"];
        $_SESSION["success"] = "Welcome {$full_name}! Account created via Microsoft.";
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