<?php

class User {
    private $conn; // Renamed to conn for consistency

    public function __construct(Database $database) {
        $this->conn = $database->getConnection();
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

    // =============================================
    // EMAIL VERIFICATION METHODS (NEWLY ADDED)
    // =============================================

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
}

?>