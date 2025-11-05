<?php
session_start();
require_once "Backend/src/Config/Database.php";
require_once "Backend/src/Models/User.php";
require_once "Backend/src/Services/EmailService.php";

$database = new Database();
$user = new User($database);
$emailService = new EmailService();

$message = "";
$error = "";
$step = "email"; // email, otp, or reset

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    if (isset($_POST['action'])) {
        switch ($_POST['action']) {
            case 'send_otp':
                $email = trim($_POST["email"]);
                
                if (empty($email)) {
                    $error = "Please enter your email address.";
                } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
                    $error = "Please enter a valid email address.";
                } else {
                    $result = $user->generatePasswordResetOTP($email);
                    
                    if ($result['success']) {
                        // Send OTP email
                        $emailSent = $emailService->sendPasswordResetOTP(
                            $result['email'], 
                            $result['user_name'], 
                            $result['otp']
                        );
                        
                        if ($emailSent) {
                            $_SESSION['reset_email'] = $email;
                            $step = "otp";
                            $message = "OTP has been sent to your email address. Please check your inbox.";
                        } else {
                            $error = "Failed to send OTP email. Please try again.";
                        }
                    } else {
                        $error = $result['message'];
                    }
                }
                break;
                
            case 'verify_otp':
                $email = $_SESSION['reset_email'] ?? '';
                $otp = trim($_POST["otp"]);
                
                if (empty($otp)) {
                    $error = "Please enter the OTP.";
                    $step = "otp";
                } else {
                    $result = $user->verifyPasswordResetOTP($email, $otp);
                    
                    if ($result['success']) {
                        $_SESSION['reset_token'] = $result['reset_token'];
                        $step = "reset";
                        $message = $result['message'];
                    } else {
                        $error = $result['message'];
                        $step = "otp";
                    }
                }
                break;
                
            case 'reset_password':
                $token = $_SESSION['reset_token'] ?? '';
                $newPassword = trim($_POST["new_password"]);
                $confirmPassword = trim($_POST["confirm_password"]);
                
                if (empty($newPassword) || empty($confirmPassword)) {
                    $error = "Please fill in both password fields.";
                    $step = "reset";
                } elseif (strlen($newPassword) < 6) {
                    $error = "Password must be at least 6 characters long.";
                    $step = "reset";
                } elseif ($newPassword !== $confirmPassword) {
                    $error = "Passwords do not match.";
                    $step = "reset";
                } else {
                    $result = $user->resetPassword($token, $newPassword);
                    
                    if ($result['success']) {
                        // Clear session data
                        unset($_SESSION['reset_email'], $_SESSION['reset_token']);
                        $_SESSION['success'] = "Password reset successfully! You can now log in with your new password.";
                        header("Location: login.php");
                        exit();
                    } else {
                        $error = $result['message'];
                        $step = "reset";
                    }
                }
                break;
        }
    }
}

// Determine which step to show based on session data
if (isset($_SESSION['reset_token'])) {
    $step = "reset";
} elseif (isset($_SESSION['reset_email'])) {
    $step = "otp";
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Forgot Password - MyTikiti</title>
    <link rel="stylesheet" href="Backend\public\assets\style.css">
    <style>
        /* Override hero background for this page */
        .hero {
            background: #f8f9fa !important;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 40px 20px;
        }
        
        /* Professional form container */
        .forgot-password-container {
            background: white;
            padding: 40px;
            border-radius: 12px;
            box-shadow: 0 8px 25px rgba(0,0,0,0.1);
            width: 100%;
            max-width: 500px;
            margin: 0 auto;
        }
        
        .forgot-password-container h2 {
            text-align: center;
            color: #2c3e50;
            font-size: 28px;
            margin-bottom: 10px;
            font-weight: 600;
        }
        
        .forgot-password-subtitle {
            text-align: center;
            color: #7f8c8d;
            margin-bottom: 35px;
            font-size: 16px;
        }
        
        /* Step indicator styling */
        .step-indicator {
            display: flex;
            justify-content: center;
            margin-bottom: 35px;
        }
        
        .step {
            padding: 12px 20px;
            margin: 0 8px;
            border-radius: 25px;
            background: #ecf0f1;
            color: #7f8c8d;
            font-size: 14px;
            font-weight: 500;
            min-width: 120px;
            text-align: center;
            position: relative;
        }
        
        .step.active {
            background: #e67e22;
            color: white;
            box-shadow: 0 4px 15px rgba(230, 126, 34, 0.3);
        }
        
        .step.completed {
            background: #27ae60;
            color: white;
        }
        
        /* Form styling */
        .form-group {
            margin-bottom: 25px;
        }
        
        .form-group label {
            display: block;
            margin-bottom: 8px;
            color: #2c3e50;
            font-weight: 600;
            font-size: 16px;
        }
        
        .form-group input {
            width: 100%;
            padding: 15px 20px;
            border: 2px solid #e1e8ed;
            border-radius: 8px;
            font-size: 16px;
            transition: all 0.3s ease;
            background: #f8f9fa;
            box-sizing: border-box;
        }
        
        .form-group input:focus {
            outline: none;
            border-color: #e67e22;
            background: white;
            box-shadow: 0 0 0 3px rgba(230, 126, 34, 0.1);
        }
        
        /* Special OTP input styling */
        .otp-input {
            font-size: 28px !important;
            text-align: center;
            letter-spacing: 8px;
            padding: 20px !important;
            font-weight: bold;
            background: #f8f9fa !important;
            border: 3px solid #e1e8ed !important;
        }
        
        .otp-input:focus {
            border-color: #e67e22 !important;
            background: white !important;
        }
        
        /* Button styling */
        .btn {
            width: 100%;
            padding: 15px;
            background: #e67e22;
            color: white;
            border: none;
            border-radius: 8px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            margin-top: 10px;
        }
        
        .btn:hover {
            background: #d35400;
            transform: translateY(-2px);
            box-shadow: 0 8px 20px rgba(230, 126, 34, 0.3);
        }
        
        .btn:active {
            transform: translateY(0);
        }
        
        /* Alert styling */
        .alert {
            padding: 15px 20px;
            border-radius: 8px;
            margin-bottom: 25px;
            font-size: 15px;
            font-weight: 500;
        }
        
        .alert-error {
            background: #fee;
            color: #c53030;
            border: 1px solid #feb2b2;
        }
        
        .alert-success {
            background: #f0fff4;
            color: #38a169;
            border: 1px solid #9ae6b4;
        }
        
        /* Form links */
        .form-links {
            text-align: center;
            margin-top: 25px;
        }
        
        .form-links a {
            color: #e67e22;
            text-decoration: none;
            font-weight: 500;
        }
        
        .form-links a:hover {
            text-decoration: underline;
        }
        
        /* Back link styling */
        .back-link {
            text-align: center;
            margin-top: 20px;
        }
        
        .back-link a {
            color: #7f8c8d;
            text-decoration: none;
            font-size: 14px;
        }
        
        /* Email display styling */
        .email-display {
            background: #f8f9fa;
            padding: 15px;
            border-radius: 8px;
            text-align: center;
            margin-bottom: 20px;
            border: 1px solid #e1e8ed;
        }
        
        .email-display strong {
            color: #e67e22;
        }
        
        /* Navbar button styling */
        .navbar-btn {
            background: #e67e22;
            color: white;
            padding: 10px 20px;
            border-radius: 6px;
            text-decoration: none;
            font-size: 14px;
            font-weight: 500;
            transition: all 0.3s ease;
            border: none;
            cursor: pointer;
        }
        
        .navbar-btn:hover {
            background: #d35400;
            text-decoration: none;
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(230, 126, 34, 0.3);
        }
        
        .navbar-btn:active {
            transform: translateY(0);
        }
        
        /* Password input with eye toggle */
        .password-input-container {
            position: relative;
        }
        
        .password-toggle {
            position: absolute;
            right: 15px;
            top: 50%;
            transform: translateY(-50%);
            cursor: pointer;
            color: #7f8c8d;
            font-size: 18px;
            user-select: none;
            transition: color 0.3s ease;
        }
        
        .password-toggle:hover {
            color: #e67e22;
        }
        
        .password-toggle.active {
            color: #e67e22;
        }
        
        /* Adjust padding for password inputs with toggle */
        .password-input-container input[type="password"],
        .password-input-container input[type="text"] {
            padding-right: 50px !important;
        }
        
        /* Password strength indicator */
        .password-strength {
            margin-top: 8px;
            font-size: 14px;
        }
        
        .strength-bar {
            width: 100%;
            height: 4px;
            background: #e1e8ed;
            border-radius: 2px;
            margin-top: 5px;
            overflow: hidden;
        }
        
        .strength-fill {
            height: 100%;
            width: 0%;
            transition: all 0.3s ease;
            border-radius: 2px;
        }
        
        .strength-weak { background: #e74c3c; width: 25%; }
        .strength-fair { background: #f39c12; width: 50%; }
        .strength-good { background: #f1c40f; width: 75%; }
        .strength-strong { background: #27ae60; width: 100%; }
        
        .password-requirements {
            font-size: 12px;
            color: #7f8c8d;
            margin-top: 8px;
            line-height: 1.4;
        }
        
        .requirement {
            display: block;
        }
        
        .requirement.met {
            color: #27ae60;
        }
        
        /* Responsive design */
        @media (max-width: 768px) {
            .forgot-password-container {
                margin: 20px;
                padding: 30px 25px;
            }
            
            .step-indicator {
                flex-direction: column;
                align-items: center;
            }
            
            .step {
                margin: 4px 0;
                min-width: 200px;
            }
            
            .otp-input {
                font-size: 24px !important;
                letter-spacing: 6px;
            }
            
            .navbar-btn {
                padding: 8px 16px;
                font-size: 13px;
            }
        }
    </style>
</head>
<body>
    <nav class="navbar">
        <div class="logo"><strong>MyTikiti</strong></div>
        <ul>
            <li><a href="index.php">Home</a></li>
            <li><a href="#">About</a></li>
            <li><a href="#">Services</a></li>
            <li><a href="#">Contact</a></li>
        </ul>
        <a href="login.php" class="navbar-btn">Back to Login</a>
    </nav>

    <section class="hero">
        <div class="forgot-password-container">
            <h2>Reset Your Password</h2>
            <p class="forgot-password-subtitle">Follow the steps below to securely reset your password</p>
            
            <!-- Step Indicator -->
            <div class="step-indicator">
                <div class="step <?= ($step == 'email') ? 'active' : (in_array($step, ['otp', 'reset']) ? 'completed' : '') ?>">
                    1. Enter Email
                </div>
                <div class="step <?= ($step == 'otp') ? 'active' : ($step == 'reset' ? 'completed' : '') ?>">
                    2. Verify OTP
                </div>
                <div class="step <?= ($step == 'reset') ? 'active' : '' ?>">
                    3. New Password
                </div>
            </div>

            <?php if (!empty($error)): ?>
                <div class="alert alert-error">
                    <?= htmlspecialchars($error) ?>
                </div>
            <?php endif; ?>

            <?php if (!empty($message)): ?>
                <div class="alert alert-success">
                    <?= htmlspecialchars($message) ?>
                </div>
            <?php endif; ?>

            <?php if ($step == 'email'): ?>
                <!-- Step 1: Enter Email -->
                <form method="POST">
                    <input type="hidden" name="action" value="send_otp">
                    
                    <div class="form-group">
                        <label for="email">Email Address:</label>
                        <input type="email" id="email" name="email" required 
                               placeholder="Enter your registered email address"
                               value="<?= htmlspecialchars($_POST['email'] ?? '') ?>">
                    </div>
                    
                    <button type="submit" class="btn">Send OTP</button>
                </form>
                
            <?php elseif ($step == 'otp'): ?>
                <!-- Step 2: Enter OTP -->
                <form method="POST">
                    <input type="hidden" name="action" value="verify_otp">
                    
                    <div class="email-display">
                        We've sent a 6-digit OTP to<br>
                        <strong><?= htmlspecialchars($_SESSION['reset_email']) ?></strong>
                    </div>
                    
                    <div class="form-group">
                        <label for="otp">Enter 6-Digit OTP Code:</label>
                        <input type="text" id="otp" name="otp" class="otp-input" 
                               maxlength="6" pattern="[0-9]{6}" required 
                               placeholder="000000">
                    </div>
                    
                    <button type="submit" class="btn">Verify OTP</button>
                    
                    <div class="back-link">
                        <a href="forgot-password.php">← Back to enter email</a></div>
                        </a>
                    </div>
                </form>
                
            <?php elseif ($step == 'reset'): ?>
                <!-- Step 3: Reset Password -->
                <form method="POST">
                    <input type="hidden" name="action" value="reset_password">
                    
                    <div class="form-group">
                        <label for="new_password">New Password:</label>
                        <div class="password-input-container">
                            <input type="password" id="new_password" name="new_password" required 
                                   minlength="6" placeholder="Enter your new password"
                                   oninput="checkPasswordStrength(this.value)">
                            <span class="password-toggle" onclick="togglePassword('new_password', this)">�</span>
                        </div>
                        <div class="password-strength" id="password-strength" style="display: none;">
                            <div class="strength-bar">
                                <div class="strength-fill" id="strength-fill"></div>
                            </div>
                            <div class="password-requirements">
                                <span class="requirement" id="req-length">• At least 6 characters</span>
                                <span class="requirement" id="req-number">• Contains a number</span>
                                <span class="requirement" id="req-special">• Contains a special character</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label for="confirm_password">Confirm New Password:</label>
                        <div class="password-input-container">
                            <input type="password" id="confirm_password" name="confirm_password" required 
                                   minlength="6" placeholder="Confirm your new password">
                            <span class="password-toggle" onclick="togglePassword('confirm_password', this)">�</span>
                        </div>
                    </div>
                    
                    <button type="submit" class="btn">Reset Password</button>
                </form>
            <?php endif; ?>
            
            <div class="form-links">
                <a href="login.php">Back to Login</a>
            </div>
        </div>
    </section>

    <script>
        // Auto-format OTP input
        document.addEventListener('DOMContentLoaded', function() {
            const otpInput = document.getElementById('otp');
            if (otpInput) {
                otpInput.addEventListener('input', function(e) {
                    // Only allow numbers
                    this.value = this.value.replace(/[^0-9]/g, '');
                });
            }
        });
        
        // Password visibility toggle function
        function togglePassword(inputId, toggleElement) {
            const passwordInput = document.getElementById(inputId);
            const isPassword = passwordInput.type === 'password';
            
            // Toggle input type
            passwordInput.type = isPassword ? 'text' : 'password';
            
            // Toggle icon and active state
            if (isPassword) {
                toggleElement.textContent = '🙈'; // Hide password icon
                toggleElement.classList.add('active');
                toggleElement.title = 'Hide password';
            } else {
                toggleElement.textContent = '�'; // Show password icon
                toggleElement.classList.remove('active');
                toggleElement.title = 'Show password';
            }
        }
        
        // Password strength checker
        function checkPasswordStrength(password) {
            const strengthIndicator = document.getElementById('password-strength');
            const strengthFill = document.getElementById('strength-fill');
            const reqLength = document.getElementById('req-length');
            const reqNumber = document.getElementById('req-number');
            const reqSpecial = document.getElementById('req-special');
            
            if (!strengthIndicator) return;
            
            // Show strength indicator when user starts typing
            if (password.length > 0) {
                strengthIndicator.style.display = 'block';
            } else {
                strengthIndicator.style.display = 'none';
                return;
            }
            
            let score = 0;
            let strength = 'weak';
            
            // Check requirements
            const hasLength = password.length >= 6;
            const hasNumber = /\d/.test(password);
            const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
            
            // Update requirement indicators
            reqLength.classList.toggle('met', hasLength);
            reqNumber.classList.toggle('met', hasNumber);
            reqSpecial.classList.toggle('met', hasSpecial);
            
            // Calculate score
            if (hasLength) score++;
            if (hasNumber) score++;
            if (hasSpecial) score++;
            if (password.length >= 8) score++;
            
            // Determine strength
            strengthFill.className = 'strength-fill';
            if (score <= 1) {
                strength = 'weak';
                strengthFill.classList.add('strength-weak');
            } else if (score === 2) {
                strength = 'fair';
                strengthFill.classList.add('strength-fair');
            } else if (score === 3) {
                strength = 'good';
                strengthFill.classList.add('strength-good');
            } else if (score >= 4) {
                strength = 'strong';
                strengthFill.classList.add('strength-strong');
            }
        }
        
        // Initialize password toggle tooltips
        document.addEventListener('DOMContentLoaded', function() {
            const toggles = document.querySelectorAll('.password-toggle');
            toggles.forEach(toggle => {
                toggle.title = 'Show password';
            });
        });
    </script>
</body>
</html>