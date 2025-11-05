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
require_once '../src/Models/Order.php';
require_once '../src/Models/User.php';

use Backend\src\Config\Database;
use Backend\src\Models\Order;
use Backend\src\Models\User;

// Start session
session_start();

$database = new Database();
$db = $database->connect();
$orderModel = new Order($db);
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

// Remove 'api' and 'orders' from path parts
$pathParts = array_slice($pathParts, 2);

try {
    switch ($method) {
        case 'GET':
            if (empty($pathParts[0])) {
                // GET /api/orders - Get user's orders
                $userId = getCurrentUserId();
                if (!$userId) {
                    http_response_code(401);
                    echo json_encode(['success' => false, 'message' => 'Unauthorized']);
                    exit;
                }
                
                $page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
                $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 10;
                
                $result = $orderModel->getByUser($userId, $page, $limit);
                echo json_encode($result);
                
            } elseif ($pathParts[0] === 'statistics') {
                // GET /api/orders/statistics - Get order statistics (admin only)
                if (!hasRole('tsh')) {
                    http_response_code(403);
                    echo json_encode(['success' => false, 'message' => 'Forbidden: Admin access required']);
                    exit;
                }
                
                $startDate = $_GET['start_date'] ?? null;
                $endDate = $_GET['end_date'] ?? null;
                
                $result = $orderModel->getStatistics($startDate, $endDate);
                echo json_encode($result);
                
            } elseif (is_numeric($pathParts[0])) {
                // GET /api/orders/{id} - Get single order
                $orderId = (int)$pathParts[0];
                $userId = getCurrentUserId();
                
                if (!$userId) {
                    http_response_code(401);
                    echo json_encode(['success' => false, 'message' => 'Unauthorized']);
                    exit;
                }
                
                // Admins can view any order, users can only view their own
                $userIdFilter = hasRole('tsh') ? null : $userId;
                
                $result = $orderModel->getById($orderId, $userIdFilter);
                echo json_encode($result);
                
            } else {
                http_response_code(404);
                echo json_encode(['success' => false, 'message' => 'Endpoint not found']);
            }
            break;
            
        case 'POST':
            if (empty($pathParts[0])) {
                // POST /api/orders - Create new order
                $userId = getCurrentUserId();
                if (!$userId) {
                    http_response_code(401);
                    echo json_encode(['success' => false, 'message' => 'Unauthorized']);
                    exit;
                }
                
                // Validate required fields
                $requiredFields = ['event_id', 'ticket_type_id', 'quantity'];
                foreach ($requiredFields as $field) {
                    if (!isset($input[$field]) || empty($input[$field])) {
                        http_response_code(400);
                        echo json_encode(['success' => false, 'message' => "Missing required field: $field"]);
                        exit;
                    }
                }
                
                // Get ticket type details for pricing
                $ticketTypeSql = "SELECT price FROM ticket_types WHERE id = ?";
                $ticketTypeStmt = $db->prepare($ticketTypeSql);
                $ticketTypeStmt->bind_param("i", $input['ticket_type_id']);
                $ticketTypeStmt->execute();
                $ticketTypeResult = $ticketTypeStmt->get_result();
                
                if ($ticketTypeResult->num_rows === 0) {
                    http_response_code(400);
                    echo json_encode(['success' => false, 'message' => 'Invalid ticket type']);
                    exit;
                }
                
                $ticketType = $ticketTypeResult->fetch_assoc();
                $unitPrice = $ticketType['price'];
                $totalAmount = $unitPrice * $input['quantity'];
                
                $orderData = [
                    'user_id' => $userId,
                    'event_id' => $input['event_id'],
                    'ticket_type_id' => $input['ticket_type_id'],
                    'quantity' => $input['quantity'],
                    'unit_price' => $unitPrice,
                    'total_amount' => $totalAmount
                ];
                
                $result = $orderModel->create($orderData);
                
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
                $orderId = (int)$pathParts[0];
                
                if (isset($pathParts[1]) && $pathParts[1] === 'status') {
                    // PUT /api/orders/{id}/status - Update order status
                    $userId = getCurrentUserId();
                    if (!$userId) {
                        http_response_code(401);
                        echo json_encode(['success' => false, 'message' => 'Unauthorized']);
                        exit;
                    }
                    
                    if (!isset($input['status'])) {
                        http_response_code(400);
                        echo json_encode(['success' => false, 'message' => 'Status is required']);
                        exit;
                    }
                    
                    // Only admins can change to certain statuses
                    $adminOnlyStatuses = ['confirmed', 'refunded'];
                    if (in_array($input['status'], $adminOnlyStatuses) && !hasRole('tsh')) {
                        http_response_code(403);
                        echo json_encode(['success' => false, 'message' => 'Forbidden: Admin access required for this status']);
                        exit;
                    }
                    
                    // Users can only update their own orders (unless admin)
                    $userIdFilter = hasRole('tsh') ? null : $userId;
                    
                    $result = $orderModel->updateStatus($orderId, $input['status'], $userIdFilter);
                    echo json_encode($result);
                    
                } elseif (isset($pathParts[1]) && $pathParts[1] === 'cancel') {
                    // PUT /api/orders/{id}/cancel - Cancel order
                    $userId = getCurrentUserId();
                    if (!$userId) {
                        http_response_code(401);
                        echo json_encode(['success' => false, 'message' => 'Unauthorized']);
                        exit;
                    }
                    
                    // Users can only cancel their own orders (unless admin)
                    $userIdFilter = hasRole('tsh') ? null : $userId;
                    
                    $result = $orderModel->cancel($orderId, $userIdFilter);
                    echo json_encode($result);
                    
                } else {
                    http_response_code(404);
                    echo json_encode(['success' => false, 'message' => 'Endpoint not found']);
                }
                
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