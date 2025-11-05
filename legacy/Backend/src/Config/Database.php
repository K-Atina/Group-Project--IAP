<?php

class Database{
    private $hostname="127.0.0.1";   
    private $database="mytikiti";    
    private $user="root";        
    private $password="2004";  
    private $conn;
    
    public function __construct(){
        $this->connect();
    }

    private function connect(){
        try{
            $dsn = "mysql:host={$this->hostname};dbname={$this->database};charset=utf8";
            $options = [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES => false
            ];
            
            $this->conn = new PDO($dsn, $this->user, $this->password, $options);
            echo "Connected successfully to database: {$this->database}";
        }catch(PDOException $e){
            die("Connection failed: ".$e->getMessage());
        }
    }

    public function getConnection(){
        return $this->conn;
    }
    
}

?>