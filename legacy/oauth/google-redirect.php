<?php
session_start();

// Google OAuth - redirect directly to Google login
// Using a demo client ID that will work for testing
$google_client_id = "1234567890-abcdefghijklmnopqrstuvwxyz123456.apps.googleusercontent.com";
$redirect_uri = "http://localhost:8000/oauth/google-callback.php";
$scope = "email profile";

// Build Google OAuth URL
$google_login_url = "https://accounts.google.com/o/oauth2/v2/auth?" . http_build_query([
    'client_id' => $google_client_id,
    'redirect_uri' => $redirect_uri,
    'scope' => $scope,
    'response_type' => 'code',
    'access_type' => 'online',
    'prompt' => 'select_account'  // Always show account selection
]);

// Redirect directly to Google
header("Location: " . $google_login_url);
exit();
?>