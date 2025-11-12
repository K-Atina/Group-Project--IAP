<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: http://localhost:3000');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Allow-Credentials: true');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

session_start();

require_once __DIR__ . '/../src/Config/Database.php';
require_once __DIR__ . '/../src/Services/MpesaService.php';

$method = $_SERVER['REQUEST_METHOD'];
$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$pathSegments = explode('/', trim($path, '/'));

$mpesaService = new MpesaService();
$database = new Database();
$db = $database->getConnection();

try {
    // Debug logging
    error_log("M-Pesa Request: Method=" . $method . ", Path=" . $path);
    error_log("Path Segments: " . json_encode($pathSegments));
    
    switch ($method) {
        case 'POST':
            $input = json_decode(file_get_contents('php://input'), true);
            
            // Get the last segment after 'mpesa'
            $mpesaIndex = array_search('mpesa', $pathSegments);
            $action = isset($pathSegments[$mpesaIndex + 1]) ? $pathSegments[$mpesaIndex + 1] : '';
            
            error_log("Action determined: " . $action);
            
            if (empty($action)) {
                throw new Exception('No action specified. Use /api/mpesa/initiate, /api/mpesa/callback, or /api/mpesa/query');
            }
            
            switch ($action) {
                case 'initiate':
                    // POST /api/mpesa/initiate - Initiate STK Push
                    handleInitiatePayment($mpesaService, $db, $input);
                    break;
                    
                case 'callback':
                    // POST /api/mpesa/callback - Handle M-Pesa callback
                    handleCallback($mpesaService, $db, $input);
                    break;
                    
                case 'query':
                    // POST /api/mpesa/query - Query transaction status
                    handleQueryStatus($mpesaService, $input);
                    break;
                    
                default:
                    throw new Exception('Unknown action: ' . $action . '. Use initiate, callback, or query');
            }
            break;
        
        case 'GET':
            // GET /api/mpesa - Show available endpoints
            echo json_encode([
                'success' => true,
                'message' => 'M-Pesa API',
                'endpoints' => [
                    'POST /api/mpesa/initiate' => 'Initiate STK Push payment',
                    'POST /api/mpesa/callback' => 'Handle payment callback (used by Safaricom)',
                    'POST /api/mpesa/query' => 'Query payment status'
                ]
            ]);
            break;
            
        default:
            throw new Exception('Method not allowed');
    }
    
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}

function handleInitiatePayment($mpesaService, $db, $input) {
    // Allow guest checkout for now - use default user ID 1 if not logged in
    $userId = $_SESSION['user_id'] ?? 1;
    
    // Accept both 'phone' and 'phone_number' parameters
    $phoneNumber = $input['phone'] ?? $input['phone_number'] ?? '';
    $amount = $input['amount'] ?? 0;
    $eventId = $input['event_id'] ?? 1;
    $ticketTypeId = $input['ticket_type_id'] ?? 1;
    $quantity = $input['quantity'] ?? 1;
    
    if (empty($phoneNumber) || $amount <= 0) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'message' => 'Phone number and amount are required'
        ]);
        return;
    }
    
    // Create pending order in database
    $orderReference = 'ORD-' . strtoupper(uniqid());
    
    $stmt = $db->prepare(
        "INSERT INTO orders (user_id, event_id, ticket_type_id, quantity, unit_price, total_amount, order_reference, status, payment_status, created_at) 
        VALUES (?, ?, ?, ?, ?, ?, ?, 'pending', 'pending', NOW())"
    );
    
    $unitPrice = $amount / $quantity;
    $stmt->execute([$userId, $eventId, $ticketTypeId, $quantity, $unitPrice, $amount, $orderReference]);
    $orderId = $db->lastInsertId();
    
    // Initiate M-Pesa payment
    $result = $mpesaService->initiateSTKPush(
        $phoneNumber,
        $amount,
        $orderReference,
        'Ticket Payment - MyTikiti'
    );
    
    if ($result['success']) {
        // Store checkout request ID for tracking
        $stmt = $db->prepare(
            "UPDATE orders SET payment_reference = ? WHERE id = ?"
        );
        $stmt->execute([$result['checkout_request_id'], $orderId]);
        
        echo json_encode([
            'success' => true,
            'message' => 'Payment request sent. Please check your phone.',
            'order_id' => $orderId,
            'order_reference' => $orderReference,
            'checkout_request_id' => $result['checkout_request_id']
        ]);
    } else {
        // Delete the pending order if payment initiation failed
        $stmt = $db->prepare("DELETE FROM orders WHERE id = ?");
        $stmt->execute([$orderId]);
        
        echo json_encode($result);
    }
}

function handleCallback($mpesaService, $db, $callbackData) {
    // Process the callback
    $result = $mpesaService->processCallback($callbackData);
    
    if ($result['success']) {
        // Update order status to completed
        $checkoutRequestId = $result['checkout_request_id'];
        $mpesaReceiptNumber = $result['mpesa_receipt_number'];
        
        $stmt = $db->prepare(
            "UPDATE orders 
            SET status = 'confirmed', 
                payment_status = 'completed',
                payment_reference = ?,
                updated_at = NOW()
            WHERE payment_reference = ?"
        );
        $stmt->execute([$mpesaReceiptNumber, $checkoutRequestId]);
        
        // TODO: Generate tickets here
        
        echo json_encode([
            'ResultCode' => 0,
            'ResultDesc' => 'Success'
        ]);
    } else {
        // Update order status to failed
        $checkoutRequestId = $result['checkout_request_id'];
        
        $stmt = $db->prepare(
            "UPDATE orders 
            SET status = 'cancelled', 
                payment_status = 'failed',
                updated_at = NOW()
            WHERE payment_reference = ?"
        );
        $stmt->execute([$checkoutRequestId]);
        
        echo json_encode([
            'ResultCode' => 1,
            'ResultDesc' => 'Failed'
        ]);
    }
}

function handleQueryStatus($mpesaService, $input) {
    $checkoutRequestId = $input['checkout_request_id'] ?? '';
    
    if (empty($checkoutRequestId)) {
        throw new Exception('Checkout request ID is required');
    }
    
    $result = $mpesaService->querySTKPushStatus($checkoutRequestId);
    echo json_encode($result);
}

?>
