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

require_once '../src/Config/Database.php';
require_once '../src/Models/Event.php';
require_once '../src/Models/User.php';

use Backend\src\Config\Database;
use Backend\src\Models\Event;
use Backend\src\Models\User;

// Start session
session_start();

$database = new Database();
$db = $database->connect();
$eventModel = new Event($db);
$userModel = new User($db);

$method = $_SERVER['REQUEST_METHOD'];
$input = json_decode(file_get_contents('php://input'), true);

// Function to check if user is logged in and get user ID
function getCurrentUserId() {
    return isset($_SESSION['user_id']) ? $_SESSION['user_id'] : null;
}

// Function to check if user has role
function hasRole($requiredRole) {
    return isset($_SESSION['user_type']) && $_SESSION['user_type'] === $requiredRole;
}

// Route handling
$requestUri = $_SERVER['REQUEST_URI'];
$path = parse_url($requestUri, PHP_URL_PATH);
$pathParts = explode('/', trim($path, '/'));

// Remove 'api' and 'events' from path parts
$pathParts = array_slice($pathParts, 2);

try {
    switch ($method) {
        case 'GET':
            if (empty($pathParts[0])) {
                // GET /api/events - Get all events
                $page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
                $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 10;
                
                $filters = [];
                if (isset($_GET['category'])) $filters['category'] = $_GET['category'];
                if (isset($_GET['status'])) $filters['status'] = $_GET['status'];
                if (isset($_GET['search'])) $filters['search'] = $_GET['search'];
                if (isset($_GET['creator_id'])) $filters['creator_id'] = $_GET['creator_id'];
                
                $result = $eventModel->getAll($page, $limit, $filters);
                echo json_encode($result);
                
            } elseif ($pathParts[0] === 'my-events') {
                // GET /api/events/my-events - Get current user's events
                $userId = getCurrentUserId();
                if (!$userId) {
                    http_response_code(401);
                    echo json_encode(['success' => false, 'message' => 'Unauthorized']);
                    exit;
                }
                
                $page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
                $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 10;
                
                $result = $eventModel->getByCreator($userId, $page, $limit);
                echo json_encode($result);
                
            } elseif (is_numeric($pathParts[0])) {
                // GET /api/events/{id} - Get single event
                $eventId = (int)$pathParts[0];
                $result = $eventModel->getById($eventId);
                echo json_encode($result);
                
            } else {
                http_response_code(404);
                echo json_encode(['success' => false, 'message' => 'Endpoint not found']);
            }
            break;
            
        case 'POST':
            if (empty($pathParts[0])) {
                // POST /api/events - Create new event
                $userId = getCurrentUserId();
                if (!$userId || !hasRole('creator')) {
                    http_response_code(401);
                    echo json_encode(['success' => false, 'message' => 'Unauthorized: Only event creators can create events']);
                    exit;
                }
                
                // Validate required fields
                $requiredFields = ['title', 'description', 'date', 'time', 'venue', 'category'];
                foreach ($requiredFields as $field) {
                    if (!isset($input[$field]) || empty($input[$field])) {
                        http_response_code(400);
                        echo json_encode(['success' => false, 'message' => "Missing required field: $field"]);
                        exit;
                    }
                }
                
                // Calculate total capacity from ticket types
                $totalCapacity = 0;
                if (isset($input['ticket_types']) && is_array($input['ticket_types'])) {
                    foreach ($input['ticket_types'] as $ticketType) {
                        $totalCapacity += $ticketType['quantity'] ?? 0;
                    }
                }
                
                $eventData = [
                    'creator_id' => $userId,
                    'title' => $input['title'],
                    'description' => $input['description'],
                    'date' => $input['date'],
                    'time' => $input['time'],
                    'venue' => $input['venue'],
                    'category' => $input['category'],
                    'total_capacity' => $totalCapacity,
                    'available_tickets' => $totalCapacity,
                    'status' => $input['status'] ?? 'draft',
                    'ticket_types' => $input['ticket_types'] ?? []
                ];
                
                $result = $eventModel->create($eventData);
                
                if ($result['success']) {
                    http_response_code(201);
                } else {
                    http_response_code(400);
                }
                
                echo json_encode($result);
                
            } else {
                http_response_code(404);
                echo json_encode(['success' => false, 'message' => 'Endpoint not found']);
            }
            break;
            
        case 'PUT':
            if (is_numeric($pathParts[0])) {
                $eventId = (int)$pathParts[0];
                
                if (isset($pathParts[1]) && $pathParts[1] === 'status') {
                    // PUT /api/events/{id}/status - Update event status (admin only)
                    if (!hasRole('tsh')) {
                        http_response_code(403);
                        echo json_encode(['success' => false, 'message' => 'Forbidden: Admin access required']);
                        exit;
                    }
                    
                    if (!isset($input['status'])) {
                        http_response_code(400);
                        echo json_encode(['success' => false, 'message' => 'Status is required']);
                        exit;
                    }
                    
                    $result = $eventModel->updateStatus($eventId, $input['status']);
                    echo json_encode($result);
                    
                } else {
                    // PUT /api/events/{id} - Update event
                    $userId = getCurrentUserId();
                    if (!$userId) {
                        http_response_code(401);
                        echo json_encode(['success' => false, 'message' => 'Unauthorized']);
                        exit;
                    }
                    
                    // For non-admin users, they can only update their own events
                    $userIdToCheck = hasRole('tsh') ? null : $userId;
                    
                    $result = $eventModel->update($eventId, $input, $userIdToCheck);
                    echo json_encode($result);
                }
                
            } else {
                http_response_code(404);
                echo json_encode(['success' => false, 'message' => 'Endpoint not found']);
            }
            break;
            
        case 'DELETE':
            if (is_numeric($pathParts[0])) {
                // DELETE /api/events/{id} - Delete event
                $eventId = (int)$pathParts[0];
                $userId = getCurrentUserId();
                
                if (!$userId) {
                    http_response_code(401);
                    echo json_encode(['success' => false, 'message' => 'Unauthorized']);
                    exit;
                }
                
                // For non-admin users, they can only delete their own events
                $userIdToCheck = hasRole('tsh') ? null : $userId;
                
                $result = $eventModel->delete($eventId, $userIdToCheck);
                echo json_encode($result);
                
            } else {
                http_response_code(404);
                echo json_encode(['success' => false, 'message' => 'Endpoint not found']);
            }
            break;
            
        default:
            http_response_code(405);
            echo json_encode(['success' => false, 'message' => 'Method not allowed']);
            break;
    }
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Server error: ' . $e->getMessage()
    ]);
}
?>