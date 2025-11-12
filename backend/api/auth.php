<?php
// Backend/api/auth.php - Authentication API endpoint

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: http://localhost:3000');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Allow-Credentials: true');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Start session
session_start();

require_once __DIR__ . '/../src/Config/Database.php';
require_once __DIR__ . '/../src/Models/User.php';
require_once __DIR__ . '/../src/Services/EmailService.php';

try {
    $database = new Database();
    $user = new User($database);
    $emailService = new EmailService();

    $method = $_SERVER['REQUEST_METHOD'];
    $path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
    $pathSegments = explode('/', trim($path, '/'));

    switch ($method) {
        case 'POST':
            $input = json_decode(file_get_contents('php://input'), true);
            
            if (!$input) {
                throw new Exception('Invalid JSON input');
            }

            // Handle different authentication actions
            $action = $pathSegments[count($pathSegments) - 1] ?? '';

            switch ($action) {
                case 'login':
                    handleLogin($user, $input);
                    break;
                
                case 'signup':
                    handleSignup($user, $emailService, $input);
                    break;
                
                case 'logout':
                    handleLogout();
                    break;
                
                case 'verify':
                    handleVerify($user, $input);
                    break;
                
                case 'resend-verification':
                    handleResendVerification($user, $emailService, $input);
                    break;
                
                case 'forgot-password':
                    handleForgotPassword($user, $emailService, $input);
                    break;
                
                case 'verify-otp':
                    handleVerifyOTP($user, $input);
                    break;
                
                case 'reset-password':
                    handleResetPassword($user, $input);
                    break;
                
                default:
                    throw new Exception('Unknown action: ' . $action);
            }
            break;
        
        case 'GET':
            // Get current user info
            handleGetUser($user);
            break;
        
        default:
            throw new Exception('Method not allowed');
    }

} catch (Exception $e) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}

function handleLogin($user, $input) {
    $email = $input['email'] ?? '';
    $password = $input['password'] ?? '';
    
    if (empty($email) || empty($password)) {
        throw new Exception('Email and password are required');
    }
    
    $result = $user->login($email, $password);
    
    if ($result['success']) {
        $_SESSION['user_id'] = $result['user']['id'];
        $_SESSION['user_name'] = $result['user']['name'];
        $_SESSION['user_email'] = $result['user']['email'];
        $_SESSION['user_type'] = $result['user']['type'];
        
        echo json_encode([
            'success' => true,
            'user' => $result['user'],
            'message' => 'Login successful'
        ]);
    } else {
        http_response_code(401);
        throw new Exception($result['message']);
    }
}

function handleSignup($user, $emailService, $input) {
    $name = $input['name'] ?? '';
    $email = $input['email'] ?? '';
    $password = $input['password'] ?? '';
    $userType = $input['userType'] ?? 'buyer';
    
    if (empty($name) || empty($email) || empty($password)) {
        throw new Exception('Name, email and password are required');
    }
    
    if (strlen($password) < 8) {
        throw new Exception('Password must be at least 8 characters long');
    }
    
    // Validate email format
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        throw new Exception('Invalid email format');
    }
    
    // Use registration with verification
    $result = $user->registerWithVerification($name, $email, $password, $userType);
    
    if ($result['success']) {
        // Send verification email
        $emailSent = $emailService->sendVerificationEmail(
            $email,
            $result['verification_token'],
            $name
        );
        
        // Auto-login after successful registration (even if not verified yet)
        $_SESSION['user_id'] = $result['user']['id'];
        $_SESSION['user_name'] = $result['user']['name'];
        $_SESSION['user_email'] = $result['user']['email'];
        $_SESSION['user_type'] = $result['user']['type'];
        
        echo json_encode([
            'success' => true,
            'user' => $result['user'],
            'message' => 'Registration successful! Please check your email to verify your account.',
            'email_sent' => $emailSent
        ]);
    } else {
        http_response_code(400);
        throw new Exception($result['message']);
    }
}

function handleLogout() {
    session_start();
    session_destroy();
    
    echo json_encode([
        'success' => true,
        'message' => 'Logged out successfully'
    ]);
}

function handleVerify($user, $input) {
    $token = $input['token'] ?? '';
    
    if (empty($token)) {
        throw new Exception('Verification token is required');
    }
    
    $result = $user->verifyEmail($token);
    
    if ($result['success']) {
        echo json_encode([
            'success' => true,
            'message' => 'Email verified successfully!'
        ]);
    } else {
        throw new Exception($result['message']);
    }
}

function handleResendVerification($user, $emailService, $input) {
    $email = $input['email'] ?? '';
    
    if (empty($email)) {
        throw new Exception('Email is required');
    }
    
    $result = $user->resendVerification($email);
    
    if ($result['success']) {
        $emailSent = $emailService->sendVerificationEmail(
            $email, 
            $result['user_name'], 
            $result['token']
        );
        
        echo json_encode([
            'success' => true,
            'message' => 'Verification email sent successfully!',
            'emailSent' => $emailSent
        ]);
    } else {
        throw new Exception($result['message']);
    }
}

function handleGetUser($user) {
    if (!isset($_SESSION['user_id'])) {
        http_response_code(401);
        echo json_encode([
            'success' => false,
            'message' => 'Not authenticated'
        ]);
        return;
    }
    
    $result = $user->getUserById($_SESSION['user_id']);
    
    if ($result['success']) {
        echo json_encode([
            'success' => true,
            'user' => $result['user']
        ]);
    } else {
        http_response_code(404);
        echo json_encode([
            'success' => false,
            'message' => 'User not found'
        ]);
    }
}

function handleForgotPassword($user, $emailService, $input) {
    $email = $input['email'] ?? '';
    
    if (empty($email)) {
        throw new Exception('Email is required');
    }
    
    $result = $user->generatePasswordResetOTP($email);
    
    if ($result['success']) {
        // Send OTP email
        $emailSent = $emailService->sendPasswordResetOTP(
            $email,
            $result['user_name'],
            $result['otp']
        );
        
        echo json_encode([
            'success' => true,
            'message' => 'Password reset OTP sent to your email!',
            'emailSent' => $emailSent
        ]);
    } else {
        throw new Exception($result['message']);
    }
}

function handleVerifyOTP($user, $input) {
    $email = $input['email'] ?? '';
    $otp = $input['otp'] ?? '';
    
    if (empty($email) || empty($otp)) {
        throw new Exception('Email and OTP are required');
    }
    
    $result = $user->verifyPasswordResetOTP($email, $otp);
    
    if ($result['success']) {
        echo json_encode([
            'success' => true,
            'reset_token' => $result['reset_token'],
            'message' => $result['message']
        ]);
    } else {
        throw new Exception($result['message']);
    }
}

function handleResetPassword($user, $input) {
    $token = $input['token'] ?? '';
    $password = $input['password'] ?? '';
    
    if (empty($token) || empty($password)) {
        throw new Exception('Reset token and new password are required');
    }
    
    if (strlen($password) < 8) {
        throw new Exception('Password must be at least 8 characters long');
    }
    
    $result = $user->resetPassword($token, $password);
    
    if ($result['success']) {
        echo json_encode([
            'success' => true,
            'message' => $result['message']
        ]);
    } else {
        throw new Exception($result['message']);
    }
}
?>