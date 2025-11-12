<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: http://localhost:3000');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Allow-Credentials: true');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

session_start();

require_once __DIR__ . '/../src/Config/Database.php';
require_once __DIR__ . '/../src/Models/User.php';

// Simple events data structure since we don't have a Ticket model
// This will serve as a mock API until we can create proper models

try {
    session_start();
    
    $database = new Database();
    $conn = $database->getConnection();
    
    $method = $_SERVER['REQUEST_METHOD'];
    
    switch ($method) {
        case 'GET':
            handleGetEvents($conn);
            break;
        
        case 'POST':
            handleCreateEvent($conn);
            break;
        
        default:
            throw new Exception('Method not allowed');
    }

} catch (Exception $e) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}

function handleGetEvents($conn) {
    // Create events table if it doesn't exist
    $createTable = "
    CREATE TABLE IF NOT EXISTS events (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        category VARCHAR(100),
        date DATETIME,
        location VARCHAR(255),
        price DECIMAL(10, 2),
        image_url VARCHAR(500),
        created_by INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (created_by) REFERENCES users(id)
    ) ENGINE=InnoDB;
    ";
    $conn->exec($createTable);
    
    // Get query parameters
    $category = $_GET['category'] ?? '';
    $search = $_GET['search'] ?? '';
    $limit = (int)($_GET['limit'] ?? 12);
    $offset = (int)($_GET['offset'] ?? 0);
    
    // Build query
    $whereConditions = [];
    $params = [];
    
    if (!empty($category) && $category !== 'all') {
        $whereConditions[] = "category = ?";
        $params[] = $category;
    }
    
    if (!empty($search)) {
        $whereConditions[] = "(title LIKE ? OR description LIKE ? OR location LIKE ?)";
        $searchTerm = "%$search%";
        $params[] = $searchTerm;
        $params[] = $searchTerm;
        $params[] = $searchTerm;
    }
    
    $whereClause = empty($whereConditions) ? '' : 'WHERE ' . implode(' AND ', $whereConditions);
    
    // Get total count
    $countQuery = "SELECT COUNT(*) as total FROM events $whereClause";
    $countStmt = $conn->prepare($countQuery);
    $countStmt->execute($params);
    $total = $countStmt->fetch(PDO::FETCH_ASSOC)['total'];
    
    // Get events
    $query = "SELECT * FROM events $whereClause ORDER BY date ASC LIMIT ? OFFSET ?";
    $params[] = $limit;
    $params[] = $offset;
    
    $stmt = $conn->prepare($query);
    $stmt->execute($params);
    $events = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // If no events exist, create some sample events
    if (empty($events) && empty($whereConditions)) {
        createSampleEvents($conn);
        
        // Refetch events
        $stmt = $conn->prepare("SELECT * FROM events ORDER BY date ASC LIMIT ? OFFSET ?");
        $stmt->execute([$limit, $offset]);
        $events = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        $countStmt = $conn->prepare("SELECT COUNT(*) as total FROM events");
        $countStmt->execute();
        $total = $countStmt->fetch(PDO::FETCH_ASSOC)['total'];
    }
    
    echo json_encode([
        'success' => true,
        'events' => $events,
        'pagination' => [
            'total' => (int)$total,
            'limit' => $limit,
            'offset' => $offset,
            'hasMore' => ($offset + $limit) < $total
        ]
    ]);
}

function handleCreateEvent($conn) {
    if (!isset($_SESSION['user_id'])) {
        throw new Exception('Authentication required');
    }
    
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!$input) {
        throw new Exception('Invalid JSON input');
    }
    
    $title = $input['title'] ?? '';
    $description = $input['description'] ?? '';
    $category = $input['category'] ?? 'other';
    $date = $input['date'] ?? '';
    $location = $input['location'] ?? '';
    $price = $input['price'] ?? 0;
    $imageUrl = $input['imageUrl'] ?? '';
    
    if (empty($title) || empty($date) || empty($location)) {
        throw new Exception('Title, date and location are required');
    }
    
    $stmt = $conn->prepare("
        INSERT INTO events (title, description, category, date, location, price, image_url, created_by) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    ");
    
    $result = $stmt->execute([
        $title, $description, $category, $date, $location, $price, $imageUrl, $_SESSION['user_id']
    ]);
    
    if ($result) {
        $eventId = $conn->lastInsertId();
        echo json_encode([
            'success' => true,
            'message' => 'Event created successfully',
            'eventId' => $eventId
        ]);
    } else {
        throw new Exception('Failed to create event');
    }
}

function createSampleEvents($conn) {
    $sampleEvents = [
        [
            'title' => 'Tech Conference 2025',
            'description' => 'The biggest tech conference of the year featuring industry leaders and cutting-edge technology.',
            'category' => 'Technology',
            'date' => '2025-12-15 09:00:00',
            'location' => 'San Francisco Convention Center',
            'price' => 299.99,
            'image_url' => 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=500'
        ],
        [
            'title' => 'Rock Music Festival',
            'description' => 'Three days of non-stop rock music with top bands from around the world.',
            'category' => 'Music',
            'date' => '2025-11-20 18:00:00',
            'location' => 'Central Park, New York',
            'price' => 159.99,
            'image_url' => 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500'
        ],
        [
            'title' => 'Food & Wine Expo',
            'description' => 'Taste the finest cuisines and wines from around the globe.',
            'category' => 'Food',
            'date' => '2025-11-25 12:00:00',
            'location' => 'Los Angeles Convention Center',
            'price' => 89.99,
            'image_url' => 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=500'
        ],
        [
            'title' => 'Basketball Championship',
            'description' => 'Watch the most exciting basketball games of the season.',
            'category' => 'Sports',
            'date' => '2025-12-01 19:30:00',
            'location' => 'Madison Square Garden',
            'price' => 199.99,
            'image_url' => 'https://images.unsplash.com/photo-1546519638-68e109498573?w=500'
        ],
        [
            'title' => 'Art Gallery Exhibition',
            'description' => 'Contemporary art exhibition featuring emerging and established artists.',
            'category' => 'Art',
            'date' => '2025-11-30 14:00:00',
            'location' => 'Museum of Modern Art',
            'price' => 25.99,
            'image_url' => 'https://images.unsplash.com/photo-1544967882-6abaa22a4588?w=500'
        ],
        [
            'title' => 'Comedy Night Live',
            'description' => 'Hilarious stand-up comedy with the best comedians in the business.',
            'category' => 'Entertainment',
            'date' => '2025-11-18 20:00:00',
            'location' => 'The Comedy Store, Hollywood',
            'price' => 45.99,
            'image_url' => 'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=500'
        ]
    ];
    
    foreach ($sampleEvents as $event) {
        $stmt = $conn->prepare("
            INSERT INTO events (title, description, category, date, location, price, image_url, created_by) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ");
        $stmt->execute([
            $event['title'],
            $event['description'],
            $event['category'],
            $event['date'],
            $event['location'],
            $event['price'],
            $event['image_url'],
            1 // Default user ID
        ]);
    }
}
?>