<?php
// Create database tables

require_once __DIR__ . '/../src/Config/Database.php';

try {
    $database = new Database();
    $db = $database->getConnection();
    
    echo "Reading schema.sql...\n";
    $sql = file_get_contents(__DIR__ . '/schema.sql');
    
    if ($sql === false) {
        die("Error: Could not read schema.sql file\n");
    }
    
    echo "Executing SQL statements...\n\n";
    
    // Split by semicolons and execute each statement
    $statements = array_filter(
        array_map('trim', explode(';', $sql)),
        function($stmt) {
            return !empty($stmt) && !preg_match('/^--/', $stmt);
        }
    );
    
    foreach ($statements as $statement) {
        if (empty($statement)) continue;
        
        try {
            $db->exec($statement);
            
            // Extract table name from CREATE TABLE statement
            if (preg_match('/CREATE TABLE.*?`?(\w+)`?/i', $statement, $matches)) {
                echo "✓ Created table: {$matches[1]}\n";
            }
        } catch (PDOException $e) {
            // Ignore "table already exists" errors
            if (strpos($e->getMessage(), 'already exists') === false) {
                echo "✗ Error: " . $e->getMessage() . "\n";
            }
        }
    }
    
    echo "\n✅ Database setup completed successfully!\n";
    
    // Verify tables
    echo "\nVerifying tables...\n";
    $stmt = $db->query("SHOW TABLES");
    $tables = $stmt->fetchAll(PDO::FETCH_COLUMN);
    
    echo "Tables in database:\n";
    foreach ($tables as $table) {
        echo "  - $table\n";
    }
    
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
    exit(1);
}
?>
