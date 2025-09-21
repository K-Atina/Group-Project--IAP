<?php
class Database {
    private $host = "localhost";
    private $user = "root";
    private $pass = "097531";
    private $dbname = "mytikiti";
    private $conn;

    public function connect() {
        if ($this->conn == null) {
            $this->conn = new mysqli($this->host, $this->user, $this->pass, $this->dbname);
            if ($this->conn->connect_error) {
                die("Database Connection Failed: " . $this->conn->connect_error);
            }
        }
        return $this->conn;
    }
}
