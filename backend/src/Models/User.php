<?php

class User {
    private $conn;

    public function __construct(Database $database) {
        $this->conn = $database->getConnection();
    }

    // Register user with email verification
    public function registerWithVerification($fullName, $email, $password, $userType = 'buyer') {
        // Check if user already exists
        if ($this->emailExists($email)) {
            return ['success' => false, 'message' => 'Email already exists'];
        }

        $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
        $verificationToken = bin2hex(random_bytes(32));
        $tokenExpiresAt = date('Y-m-d H:i:s', strtotime('+24 hours'));
        
        try {
            $stmt = $this->conn->prepare(
                "INSERT INTO users (full_name, email, password, user_type, email_verified, verification_token, token_expires_at) 
                VALUES (?, ?, ?, ?, 0, ?, ?)"
            );
            
            if ($stmt->execute([$fullName, $email, $hashedPassword, $userType, $verificationToken, $tokenExpiresAt])) {
                $userId = $this->conn->lastInsertId();
                return [
                    'success' => true,
                    'message' => 'Registration successful',
                    'user_id' => $userId,
                    'user' => [
                        'id' => $userId,
                        'name' => $fullName,
                        'email' => $email,
                        'type' => $userType,
                        'verified' => false
                    ],
                    'verification_token' => $verificationToken
                ];
            }
        } catch (PDOException $e) {
            error_log("Registration error: " . $e->getMessage());
            return ['success' => false, 'message' => 'Registration failed'];
        }
        
        return ['success' => false, 'message' => 'Registration failed'];
    }

    // Register user (auto-verified - for quick testing)
    public function register($fullName, $email, $password, $userType = 'buyer') {
        // Check if user already exists
        if ($this->emailExists($email)) {
            return ['success' => false, 'message' => 'Email already exists'];
        }

        $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
        
        try {
            $stmt = $this->conn->prepare(
                "INSERT INTO users (full_name, email, password, user_type, email_verified) 
                VALUES (?, ?, ?, ?, 1)"
            );
            
            if ($stmt->execute([$fullName, $email, $hashedPassword, $userType])) {
                $userId = $this->conn->lastInsertId();
                return [
                    'success' => true,
                    'message' => 'Registration successful',
                    'user' => [
                        'id' => $userId,
                        'name' => $fullName,
                        'email' => $email,
                        'type' => $userType,
                        'verified' => true
                    ]
                ];
            }
        } catch (PDOException $e) {
            error_log("Registration error: " . $e->getMessage());
            return ['success' => false, 'message' => 'Registration failed'];
        }
        
        return ['success' => false, 'message' => 'Registration failed'];
    }
    
    // Verify email with token
    public function verifyEmail($token) {
        try {
            $stmt = $this->conn->prepare(
                "SELECT id, full_name, email FROM users 
                WHERE verification_token = ? AND token_expires_at > NOW() AND email_verified = 0"
            );
            $stmt->execute([$token]);
            $user = $stmt->fetch();
            
            if ($user) {
                $updateStmt = $this->conn->prepare(
                    "UPDATE users SET email_verified = 1, verification_token = NULL, token_expires_at = NULL 
                    WHERE id = ?"
                );
                $updateStmt->execute([$user['id']]);
                
                return [
                    'success' => true,
                    'message' => 'Email verified successfully',
                    'user' => $user
                ];
            }
            
            return ['success' => false, 'message' => 'Invalid or expired verification token'];
        } catch (PDOException $e) {
            error_log("Verification error: " . $e->getMessage());
            return ['success' => false, 'message' => 'Verification failed'];
        }
    }

    // Login user
    public function login($email, $password) {
        try {
            $stmt = $this->conn->prepare(
                "SELECT id, full_name, email, password, user_type, email_verified 
                FROM users WHERE email = ?"
            );
            $stmt->execute([$email]);
            
            $user = $stmt->fetch(PDO::FETCH_ASSOC);
            
            if ($user && password_verify($password, $user['password'])) {
                // Remove password from returned data
                return [
                    'success' => true,
                    'message' => 'Login successful',
                    'user' => [
                        'id' => $user['id'],
                        'name' => $user['full_name'],
                        'email' => $user['email'],
                        'type' => $user['user_type'],
                        'verified' => (bool)$user['email_verified']
                    ]
                ];
            }
            
            return ['success' => false, 'message' => 'Invalid email or password'];
        } catch (PDOException $e) {
            error_log("Login error: " . $e->getMessage());
            return ['success' => false, 'message' => 'Login failed'];
        }
    }

    // Check if email already exists
    public function emailExists($email) {
        $stmt = $this->conn->prepare("SELECT id FROM users WHERE email = ?");
        $stmt->execute([$email]);
        return $stmt->rowCount() > 0;
    }

    // Get user by ID
    public function getUserById($userId) {
        try {
            $stmt = $this->conn->prepare(
                "SELECT id, full_name, email, user_type, email_verified, created_at 
                FROM users WHERE id = ?"
            );
            $stmt->execute([$userId]);
            
            $user = $stmt->fetch(PDO::FETCH_ASSOC);
            
            if ($user) {
                return [
                    'success' => true,
                    'user' => [
                        'id' => $user['id'],
                        'name' => $user['full_name'],
                        'email' => $user['email'],
                        'type' => $user['user_type'],
                        'verified' => (bool)$user['email_verified']
                    ]
                ];
            }
            
            return ['success' => false, 'message' => 'User not found'];
        } catch (PDOException $e) {
            error_log("Get user error: " . $e->getMessage());
            return ['success' => false, 'message' => 'Failed to fetch user'];
        }
    }

    // Update user
    public function updateUser($userId, $data) {
        try {
            $fields = [];
            $values = [];
            
            if (isset($data['full_name'])) {
                $fields[] = "full_name = ?";
                $values[] = $data['full_name'];
            }
            
            if (isset($data['email'])) {
                if ($this->emailExists($data['email'])) {
                    return ['success' => false, 'message' => 'Email already exists'];
                }
                $fields[] = "email = ?";
                $values[] = $data['email'];
            }
            
            if (count($fields) === 0) {
                return ['success' => false, 'message' => 'No fields to update'];
            }
            
            $values[] = $userId;
            $sql = "UPDATE users SET " . implode(", ", $fields) . " WHERE id = ?";
            
            $stmt = $this->conn->prepare($sql);
            if ($stmt->execute($values)) {
                return ['success' => true, 'message' => 'User updated successfully'];
            }
            
            return ['success' => false, 'message' => 'Update failed'];
        } catch (PDOException $e) {
            error_log("Update user error: " . $e->getMessage());
            return ['success' => false, 'message' => 'Update failed'];
        }
    }
}

?>
