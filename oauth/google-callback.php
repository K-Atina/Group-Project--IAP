<?php
session_start();
require_once "../Backend/src/Config/Database.php";
require_once "../Backend/src/Models/User.php";

// Google OAuth Configuration  
$google_client_id = "1234567890-abcdefghijklmnopqrstuvwxyz123456.apps.googleusercontent.com";
$google_client_secret = "GOCSPX-your_client_secret_here";
$redirect_uri = "http://localhost:8000/oauth/google-callback.php";

// Check if we got the code from Google
if (!isset($_GET['code'])) {
    // Show that we redirected to Google successfully
    ?>
    <!DOCTYPE html>
    <html>
    <head>
        <title>Google Login - MyTikiti</title>
        <style>
            body { font-family: Arial, sans-serif; text-align: center; padding: 50px; background: #f5f5f5; }
            .container { background: white; padding: 40px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); max-width: 500px; margin: 0 auto; }
            .success { color: #28a745; font-size: 24px; margin: 20px 0; }
            .info { background: #e8f4fd; padding: 15px; border-radius: 6px; margin: 20px 0; }
            .btn { background: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="success">✅ Google Redirect Working!</div>
            <h2>You successfully reached Google's login page</h2>
            <div class="info">
                <strong>What happened:</strong>
                <ol style="text-align: left;">
                    <li>You clicked "Continue with Google"</li>
                    <li>Browser redirected to Google login</li>
                    <li>Google would show account selection</li>
                    <li>After login, Google sends you back here</li>
                </ol>
            </div>
            <p>To complete the setup, add your real Google Client ID and Secret.</p>
            <a href="../login.php" class="btn">← Back to Login</a>
            <a href="setup-guide.php" class="btn">Setup Guide</a>
        </div>
    </body>
    </html>
    <?php
    exit();
}

$code = $_GET['code'];

// Exchange code for access token
$token_url = "https://oauth2.googleapis.com/token";
$token_data = [
    'client_id' => $google_client_id,
    'client_secret' => $google_client_secret,
    'code' => $code,
    'grant_type' => 'authorization_code',
    'redirect_uri' => $redirect_uri,
];

// Make request to Google
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $token_url);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($token_data));
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$response = curl_exec($ch);
curl_close($ch);

$token_info = json_decode($response, true);

if (!isset($token_info['access_token'])) {
    $_SESSION['error'] = "Failed to get access token from Google";
    header("Location: ../login.php");
    exit();
}

// Get user info from Google
$user_url = "https://www.googleapis.com/oauth2/v2/userinfo?access_token=" . $token_info['access_token'];
$user_response = file_get_contents($user_url);
$user_info = json_decode($user_response, true);

if (!$user_info || !isset($user_info['email'])) {
    $_SESSION['error'] = "Failed to get user info from Google";
    header("Location: ../login.php");
    exit();
}

// Create or login user
try {
    $database = new Database();
    $user = new User($database);
    
    $name = $user_info['name'];
    $email = $user_info['email'];
    
    // Check if user exists
    $existing_user = $user->findByEmail($email);
    
    if ($existing_user) {
        // Login existing user
        $_SESSION["user"] = $existing_user["full_name"];
        $_SESSION["user_id"] = $existing_user["id"];
        $_SESSION["success"] = "Welcome back, {$existing_user['full_name']}!";
    } else {
        // Create new user
        $result = $user->registerOAuth($name, $email);
        
        if ($result['success']) {
            $_SESSION["user"] = $name;
            $_SESSION["user_id"] = $result["user_id"];
            $_SESSION["success"] = "Welcome {$name}! Account created with Google.";
        } else {
            $_SESSION['error'] = "Failed to create account";
            header("Location: ../login.php");
            exit();
        }
    }
    
    // Redirect to dashboard
    header("Location: ../dashboard.php");
    exit();
    
} catch (Exception $e) {
    $_SESSION['error'] = "Error: " . $e->getMessage();
    header("Location: ../login.php");
    exit();
}
?>