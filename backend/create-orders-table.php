<?php
// Create orders table directly

require_once __DIR__ . '/src/Config/Database.php';

try {
    $database = new Database();
    $db = $database->getConnection();
    
    echo "Creating database tables...\n\n";
    
    // Create ticket_types table first (required by orders)
    $sql = "CREATE TABLE IF NOT EXISTS ticket_types (
        id INT AUTO_INCREMENT PRIMARY KEY,
        event_id INT NOT NULL,
        name VARCHAR(100) NOT NULL,
        price DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
        quantity INT NOT NULL,
        sold INT DEFAULT 0,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_event (event_id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci";
    
    $db->exec($sql);
    echo "✓ Created table: ticket_types\n";
    
    // Create events table
    $sql = "CREATE TABLE IF NOT EXISTS events (
        id INT AUTO_INCREMENT PRIMARY KEY,
        creator_id INT NOT NULL,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        date DATE NOT NULL,
        time TIME NOT NULL,
        venue VARCHAR(255) NOT NULL,
        category VARCHAR(100) NOT NULL,
        total_capacity INT DEFAULT 0,
        available_tickets INT DEFAULT 0,
        status ENUM('draft', 'published', 'sold-out', 'ended', 'pending', 'approved', 'rejected') DEFAULT 'draft',
        image_url VARCHAR(500),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_category (category),
        INDEX idx_date (date),
        INDEX idx_status (status),
        INDEX idx_creator (creator_id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci";
    
    $db->exec($sql);
    echo "✓ Created table: events\n";
    
    // Create orders table
    $sql = "CREATE TABLE IF NOT EXISTS orders (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        event_id INT NOT NULL,
        ticket_type_id INT NOT NULL,
        quantity INT NOT NULL,
        unit_price DECIMAL(10, 2) NOT NULL,
        total_amount DECIMAL(10, 2) NOT NULL,
        status ENUM('pending', 'confirmed', 'cancelled', 'refunded') DEFAULT 'pending',
        order_reference VARCHAR(50) UNIQUE,
        payment_status ENUM('pending', 'completed', 'failed') DEFAULT 'pending',
        payment_reference VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_user (user_id),
        INDEX idx_event (event_id),
        INDEX idx_status (status),
        INDEX idx_order_ref (order_reference)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci";
    
    $db->exec($sql);
    echo "✓ Created table: orders\n";
    
    echo "\n✅ All tables created successfully!\n";
    
    // Verify
    echo "\nTables in database:\n";
    $stmt = $db->query("SHOW TABLES");
    $tables = $stmt->fetchAll(PDO::FETCH_COLUMN);
    foreach ($tables as $table) {
        echo "  - $table\n";
    }
    
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
    exit(1);
}
?>
