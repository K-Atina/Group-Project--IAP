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
}

?>