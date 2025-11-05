<?php

class User {
    private $conn; // Renamed to conn for consistency

    public function __construct(Database $database) {
        $this->conn = $database->getConnection();
        $this->initializeTable();
    }

    private function initializeTable() {
        // Create table if it doesn't exist
        $sql = "
        CREATE TABLE IF NOT EXISTS users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            full_name VARCHAR(100) NOT NULL,
            email VARCHAR(150) NOT NULL UNIQUE,
            password VARCHAR(255) NOT NULL,
            email_verified TINYINT(1) DEFAULT 0,
            verification_token VARCHAR(255) DEFAULT NULL,
            token_expires_at DATETIME DEFAULT NULL,
            reset_token VARCHAR(255) DEFAULT NULL,
            reset_token_expires_at DATETIME DEFAULT NULL,
            reset_otp VARCHAR(6) DEFAULT NULL,
            reset_otp_expires_at DATETIME DEFAULT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB;
        ";
        $this->conn->exec($sql);
        // Optional: ensure missing columns exist (for people who already had a basic users table)
        $this->ensureColumn("email_verified", "ALTER TABLE users ADD COLUMN email_verified TINYINT(1) DEFAULT 0");
        $this->ensureColumn("verification_token", "ALTER TABLE users ADD COLUMN verification_token VARCHAR(255) DEFAULT NULL");
        $this->ensureColumn("token_expires_at", "ALTER TABLE users ADD COLUMN token_expires_at DATETIME DEFAULT NULL");
        $this->ensureColumn("reset_token", "ALTER TABLE users ADD COLUMN reset_token VARCHAR(255) DEFAULT NULL");
        $this->ensureColumn("reset_token_expires_at", "ALTER TABLE users ADD COLUMN reset_token_expires_at DATETIME DEFAULT NULL");
        $this->ensureColumn("reset_otp", "ALTER TABLE users ADD COLUMN reset_otp VARCHAR(6) DEFAULT NULL");
        $this->ensureColumn("reset_otp_expires_at", "ALTER TABLE users ADD COLUMN reset_otp_expires_at DATETIME DEFAULT NULL");
    }

    private function ensureColumn($column, $alterSQL) {
        $result = $this->conn->query("SHOW COLUMNS FROM users LIKE '$column'");
        if ($result->rowCount() === 0) {
            $this->conn->exec($alterSQL);
        }
    }

    // Register user
    public function register($fullname, $email, $password) {
        $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
        
        $stmt = $this->conn->prepare("INSERT INTO users (full_name, email, password) VALUES (?, ?, ?)");
        
        return $stmt->execute([$fullname, $email, $hashedPassword]);
    }

    // Login user
    public function login($email, $password) {
        $stmt = $this->conn->prepare("SELECT id, full_name, email, password FROM users WHERE email = ?");
        $stmt->execute([$email]);
        
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($user && password_verify($password, $user['password'])) {
            // Remove password from returned data for security
            unset($user['password']);
            return $user;
        }
        
        return false;
    }

    // Check if email already exists
    public function emailExists($email) {
        $stmt = $this->conn->prepare("SELECT id FROM users WHERE email = ?");
        $stmt->execute([$email]);
        
        return $stmt->rowCount() > 0;
    }

    // Generate verification token
    public function generateVerificationToken($userId) {
        $token = bin2hex(random_bytes(32));
        $expiresAt = date('Y-m-d H:i:s', strtotime('+24 hours'));
        
        $stmt = $this->conn->prepare("UPDATE users SET verification_token = ?, token_expires_at = ? WHERE id = ?");
        $stmt->execute([$token, $expiresAt, $userId]);
        
        return $token;
    }
    
    // Register user with email verification
    public function registerWithVerification($fullname, $email, $password) {
        $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
        
        try {
            $this->conn->beginTransaction();
            
            // Insert user with email_verified = 0
            $stmt = $this->conn->prepare("INSERT INTO users (full_name, email, password, email_verified) VALUES (?, ?, ?, 0)");
            $stmt->execute([$fullname, $email, $hashedPassword]);
            
            $userId = $this->conn->lastInsertId();
            
            // Generate verification token
            $token = $this->generateVerificationToken($userId);
            
            $this->conn->commit();
            
            return [
                'success' => true,
                'user_id' => $userId,
                'token' => $token
            ];
            
        } catch (Exception $e) {
            $this->conn->rollBack();
            return ['success' => false, 'error' => $e->getMessage()];
        }
    }
    
    // Verify email with token
    public function verifyEmail($token) {
        $stmt = $this->conn->prepare("
            SELECT id, full_name, email, token_expires_at 
            FROM users 
            WHERE verification_token = ? AND email_verified = 0
        ");
        $stmt->execute([$token]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if (!$user) {
            return ['success' => false, 'message' => 'Invalid verification token.'];
        }
        
        // Check if token has expired
        if (strtotime($user['token_expires_at']) < time()) {
            return ['success' => false, 'message' => 'Verification token has expired.'];
        }
        
        // Verify the user
        $stmt = $this->conn->prepare("
            UPDATE users 
            SET email_verified = 1, verification_token = NULL, token_expires_at = NULL 
            WHERE id = ?
        ");
        $stmt->execute([$user['id']]);
        
        return [
            'success' => true, 
            'message' => 'Email verified successfully!',
            'user' => $user
        ];
    }
    
    // Update login to check email verification
    public function loginWithVerification($email, $password) {
        $stmt = $this->conn->prepare("SELECT id, full_name, email, password, email_verified FROM users WHERE email = ?");
        $stmt->execute([$email]);
        
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($user && password_verify($password, $user['password'])) {
            // Check if email is verified
            if ($user['email_verified'] == 0) {
                return [
                    'success' => false,
                    'message' => 'Please verify your email before logging in.',
                    'needs_verification' => true
                ];
            }
            
            // Remove password from returned data for security
            unset($user['password']);
            return [
                'success' => true,
                'user' => $user
            ];
        }
        
        return [
            'success' => false,
            'message' => 'Invalid login credentials.'
        ];
    }
    
    // Resend verification email
    public function resendVerification($email) {
        $stmt = $this->conn->prepare("SELECT id, full_name FROM users WHERE email = ? AND email_verified = 0");
        $stmt->execute([$email]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if (!$user) {
            return ['success' => false, 'message' => 'Email not found or already verified.'];
        }
        
        $token = $this->generateVerificationToken($user['id']);
        
        return [
            'success' => true,
            'token' => $token,
            'user_name' => $user['full_name']
        ];
    }

    // Check if user is verified
    public function isEmailVerified($userId) {
        $stmt = $this->conn->prepare("SELECT email_verified FROM users WHERE id = ?");
        $stmt->execute([$userId]);
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        
        return $result ? (bool)$result['email_verified'] : false;
    }

    // Get user by ID (useful for dashboard)
    public function getUserById($userId) {
        $stmt = $this->conn->prepare("SELECT id, full_name, email, email_verified FROM users WHERE id = ?");
        $stmt->execute([$userId]);
        
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    // Find user by email (useful for OAuth)
    public function findByEmail($email) {
        $stmt = $this->conn->prepare("SELECT id, full_name, email, email_verified FROM users WHERE email = ?");
        $stmt->execute([$email]);
        
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    // Register user with OAuth (already verified)
    public function registerOAuth($fullname, $email) {
        $password = bin2hex(random_bytes(16)); // Generate random password for OAuth users
        $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
        
        $stmt = $this->conn->prepare("INSERT INTO users (full_name, email, password, email_verified) VALUES (?, ?, ?, 1)");
        $result = $stmt->execute([$fullname, $email, $hashedPassword]);
        
        if ($result) {
            return [
                'success' => true,
                'user_id' => $this->conn->lastInsertId()
            ];
        }
        
        return ['success' => false, 'message' => 'Failed to create OAuth user'];
    }

    // Generate OTP for password reset
    public function generatePasswordResetOTP($email) {
        $stmt = $this->conn->prepare("SELECT id, full_name FROM users WHERE email = ?");
        $stmt->execute([$email]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if (!$user) {
            return ['success' => false, 'message' => 'Email address not found.'];
        }
        
        // Generate 6-digit OTP
        $otp = str_pad(rand(0, 999999), 6, '0', STR_PAD_LEFT);
        $expiresAt = date('Y-m-d H:i:s', strtotime('+15 minutes')); // OTP expires in 15 minutes
        
        // Update user with OTP
        $stmt = $this->conn->prepare("UPDATE users SET reset_otp = ?, reset_otp_expires_at = ? WHERE id = ?");
        $stmt->execute([$otp, $expiresAt, $user['id']]);
        
        return [
            'success' => true,
            'otp' => $otp,
            'user_id' => $user['id'],
            'user_name' => $user['full_name'],
            'email' => $email
        ];
    }
    
    // Verify OTP for password reset
    public function verifyPasswordResetOTP($email, $otp) {
        $stmt = $this->conn->prepare("
            SELECT id, full_name, reset_otp, reset_otp_expires_at 
            FROM users 
            WHERE email = ? AND reset_otp = ?
        ");
        $stmt->execute([$email, $otp]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if (!$user) {
            return ['success' => false, 'message' => 'Invalid OTP.'];
        }
        
        // Check if OTP has expired
        if (strtotime($user['reset_otp_expires_at']) < time()) {
            return ['success' => false, 'message' => 'OTP has expired. Please request a new one.'];
        }
        
        // Generate reset token for password change
        $resetToken = bin2hex(random_bytes(32));
        $tokenExpiresAt = date('Y-m-d H:i:s', strtotime('+1 hour')); // Token expires in 1 hour
        
        $stmt = $this->conn->prepare("
            UPDATE users 
            SET reset_token = ?, reset_token_expires_at = ?, reset_otp = NULL, reset_otp_expires_at = NULL 
            WHERE id = ?
        ");
        $stmt->execute([$resetToken, $tokenExpiresAt, $user['id']]);
        
        return [
            'success' => true,
            'reset_token' => $resetToken,
            'message' => 'OTP verified successfully!'
        ];
    }
    
    // Reset password with token
    public function resetPassword($token, $newPassword) {
        $stmt = $this->conn->prepare("
            SELECT id, reset_token_expires_at 
            FROM users 
            WHERE reset_token = ?
        ");
        $stmt->execute([$token]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if (!$user) {
            return ['success' => false, 'message' => 'Invalid reset token.'];
        }
        
        // Check if token has expired
        if (strtotime($user['reset_token_expires_at']) < time()) {
            return ['success' => false, 'message' => 'Reset token has expired. Please start the process again.'];
        }
        
        // Update password and clear reset token
        $hashedPassword = password_hash($newPassword, PASSWORD_DEFAULT);
        $stmt = $this->conn->prepare("
            UPDATE users 
            SET password = ?, reset_token = NULL, reset_token_expires_at = NULL 
            WHERE id = ?
        ");
        $stmt->execute([$hashedPassword, $user['id']]);
        
        return ['success' => true, 'message' => 'Password reset successfully!'];
    }
    
    // Clean up expired tokens (utility method)
    public function cleanupExpiredTokens() {
        $now = date('Y-m-d H:i:s');
        
        // Clean expired verification tokens
        $stmt = $this->conn->prepare("
            UPDATE users 
            SET verification_token = NULL, token_expires_at = NULL 
            WHERE token_expires_at < ?
        ");
        $stmt->execute([$now]);
        
        // Clean expired reset tokens
        $stmt = $this->conn->prepare("
            UPDATE users 
            SET reset_token = NULL, reset_token_expires_at = NULL, reset_otp = NULL, reset_otp_expires_at = NULL 
            WHERE reset_token_expires_at < ? OR reset_otp_expires_at < ?
        ");
        $stmt->execute([$now, $now]);
    }
}

?>