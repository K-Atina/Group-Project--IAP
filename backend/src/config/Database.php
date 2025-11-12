<?php

class Database {
    private $hostname = "127.0.0.1";   
    private $database = "mytikiti";    
    private $user = "root";        
    private $password = "2004";  // Update this to your MySQL password
    private $conn;
    
    public function __construct() {
        $this->connect();
    }

    private function connect() {
        try {
            $dsn = "mysql:host={$this->hostname};dbname={$this->database};charset=utf8mb4";
            $options = [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES => false
            ];
            
            $this->conn = new PDO($dsn, $this->user, $this->password, $options);
        } catch(PDOException $e) {
            // Log error instead of echoing in production
            error_log("Database connection failed: " . $e->getMessage());
            throw new Exception("Database connection failed");
        }
    }

    public function getConnection() {
        return $this->conn;
    }
}

?>
