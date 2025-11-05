<?php

namespace Backend\src\Models;

use Exception;

class Order {
    private $db;
    
    public function __construct($database) {
        $this->db = $database;
    }
    
    // Create new order
    public function create($data) {
        try {
            // Start transaction
            $this->db->autocommit(FALSE);
            
            // Validate ticket availability
            $ticketCheckSql = "SELECT quantity, sold FROM ticket_types WHERE id = ?";
            $ticketCheckStmt = $this->db->prepare($ticketCheckSql);
            $ticketCheckStmt->bind_param("i", $data['ticket_type_id']);
            $ticketCheckStmt->execute();
            $ticketResult = $ticketCheckStmt->get_result();
            
            if ($ticketResult->num_rows === 0) {
                throw new Exception('Ticket type not found');
            }
            
            $ticketType = $ticketResult->fetch_assoc();
            $available = $ticketType['quantity'] - $ticketType['sold'];
            
            if ($available < $data['quantity']) {
                throw new Exception('Not enough tickets available');
            }
            
            // Generate order reference
            $orderReference = 'ORD-' . strtoupper(uniqid());
            
            // Create order
            $orderSql = "INSERT INTO orders (
                user_id, event_id, ticket_type_id, quantity, unit_price, 
                total_amount, order_reference, status, created_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, 'pending', NOW())";
            
            $orderStmt = $this->db->prepare($orderSql);
            $orderStmt->bind_param("iiiidds",
                $data['user_id'],
                $data['event_id'],
                $data['ticket_type_id'],
                $data['quantity'],
                $data['unit_price'],
                $data['total_amount'],
                $orderReference
            );
            
            if (!$orderStmt->execute()) {
                throw new Exception('Failed to create order');
            }
            
            $orderId = $this->db->insert_id;
            
            // Update ticket type sold count
            $updateSoldSql = "UPDATE ticket_types SET sold = sold + ? WHERE id = ?";
            $updateSoldStmt = $this->db->prepare($updateSoldSql);
            $updateSoldStmt->bind_param("ii", $data['quantity'], $data['ticket_type_id']);
            
            if (!$updateSoldStmt->execute()) {
                throw new Exception('Failed to update ticket count');
            }
            
            // Update event available tickets
            $updateEventSql = "UPDATE events SET available_tickets = available_tickets - ? WHERE id = ?";
            $updateEventStmt = $this->db->prepare($updateEventSql);
            $updateEventStmt->bind_param("ii", $data['quantity'], $data['event_id']);
            $updateEventStmt->execute();
            
            // Generate individual tickets
            for ($i = 0; $i < $data['quantity']; $i++) {
                $ticketNumber = 'TKT-' . strtoupper(uniqid());
                $qrCode = 'QR-' . md5($orderId . $i . time());
                
                $ticketSql = "INSERT INTO tickets (
                    order_id, user_id, event_id, ticket_type_id, 
                    ticket_number, qr_code, status, created_at
                ) VALUES (?, ?, ?, ?, ?, ?, 'valid', NOW())";
                
                $ticketStmt = $this->db->prepare($ticketSql);
                $ticketStmt->bind_param("iiiiss",
                    $orderId,
                    $data['user_id'],
                    $data['event_id'],
                    $data['ticket_type_id'],
                    $ticketNumber,
                    $qrCode
                );
                
                if (!$ticketStmt->execute()) {
                    throw new Exception('Failed to generate ticket');
                }
            }
            
            // Commit transaction
            $this->db->commit();
            $this->db->autocommit(TRUE);
            
            return [
                'success' => true,
                'order_id' => $orderId,
                'order_reference' => $orderReference,
                'message' => 'Order created successfully'
            ];
            
        } catch (Exception $e) {
            // Rollback transaction
            $this->db->rollback();
            $this->db->autocommit(TRUE);
            
            return [
                'success' => false,
                'message' => $e->getMessage()
            ];
        }
    }
    
    // Get orders by user
    public function getByUser($userId, $page = 1, $limit = 10) {
        try {
            $offset = ($page - 1) * $limit;
            
            // Get total count
            $countSql = "SELECT COUNT(*) as total FROM orders WHERE user_id = ?";
            $countStmt = $this->db->prepare($countSql);
            $countStmt->bind_param("i", $userId);
            $countStmt->execute();
            $totalResult = $countStmt->get_result();
            $total = $totalResult->fetch_assoc()['total'];
            
            // Get orders with event and ticket type details
            $sql = "SELECT 
                        o.*, 
                        e.title as event_title,
                        e.date as event_date,
                        e.time as event_time,
                        e.venue as event_venue,
                        tt.name as ticket_type_name
                    FROM orders o
                    JOIN events e ON o.event_id = e.id
                    JOIN ticket_types tt ON o.ticket_type_id = tt.id
                    WHERE o.user_id = ?
                    ORDER BY o.created_at DESC
                    LIMIT ? OFFSET ?";
            
            $stmt = $this->db->prepare($sql);
            $stmt->bind_param("iii", $userId, $limit, $offset);
            $stmt->execute();
            $result = $stmt->get_result();
            
            $orders = [];
            while ($row = $result->fetch_assoc()) {
                // Get tickets for this order
                $row['tickets'] = $this->getOrderTickets($row['id']);
                $orders[] = $row;
            }
            
            return [
                'success' => true,
                'orders' => $orders,
                'pagination' => [
                    'page' => $page,
                    'limit' => $limit,
                    'total' => $total,
                    'pages' => ceil($total / $limit)
                ]
            ];
            
        } catch (Exception $e) {
            return [
                'success' => false,
                'message' => 'Error fetching orders: ' . $e->getMessage()
            ];
        }
    }
    
    // Get single order by ID
    public function getById($orderId, $userId = null) {
        try {
            $sql = "SELECT 
                        o.*, 
                        e.title as event_title,
                        e.date as event_date,
                        e.time as event_time,
                        e.venue as event_venue,
                        tt.name as ticket_type_name,
                        u.name as user_name,
                        u.email as user_email
                    FROM orders o
                    JOIN events e ON o.event_id = e.id
                    JOIN ticket_types tt ON o.ticket_type_id = tt.id
                    JOIN users u ON o.user_id = u.id
                    WHERE o.id = ?";
            
            $params = [$orderId];
            
            if ($userId !== null) {
                $sql .= " AND o.user_id = ?";
                $params[] = $userId;
            }
            
            $stmt = $this->db->prepare($sql);
            $stmt->bind_param(str_repeat("i", count($params)), ...$params);
            $stmt->execute();
            $result = $stmt->get_result();
            
            if ($result->num_rows === 0) {
                return [
                    'success' => false,
                    'message' => 'Order not found'
                ];
            }
            
            $order = $result->fetch_assoc();
            $order['tickets'] = $this->getOrderTickets($orderId);
            
            return [
                'success' => true,
                'order' => $order
            ];
            
        } catch (Exception $e) {
            return [
                'success' => false,
                'message' => 'Error fetching order: ' . $e->getMessage()
            ];
        }
    }
    
    // Get tickets for an order
    private function getOrderTickets($orderId) {
        $sql = "SELECT * FROM tickets WHERE order_id = ? ORDER BY created_at ASC";
        $stmt = $this->db->prepare($sql);
        $stmt->bind_param("i", $orderId);
        $stmt->execute();
        $result = $stmt->get_result();
        
        $tickets = [];
        while ($row = $result->fetch_assoc()) {
            $tickets[] = $row;
        }
        
        return $tickets;
    }
    
    // Update order status
    public function updateStatus($orderId, $status, $userId = null) {
        try {
            $sql = "UPDATE orders SET status = ?, updated_at = NOW() WHERE id = ?";
            $params = [$status, $orderId];
            
            if ($userId !== null) {
                $sql .= " AND user_id = ?";
                $params[] = $userId;
            }
            
            $stmt = $this->db->prepare($sql);
            $stmt->bind_param(str_repeat("s", count($params) - 1) . "i", ...$params);
            
            if ($stmt->execute() && $stmt->affected_rows > 0) {
                return [
                    'success' => true,
                    'message' => 'Order status updated successfully'
                ];
            } else {
                return [
                    'success' => false,
                    'message' => 'Order not found or no changes made'
                ];
            }
            
        } catch (Exception $e) {
            return [
                'success' => false,
                'message' => 'Error updating order status: ' . $e->getMessage()
            ];
        }
    }
    
    // Cancel order
    public function cancel($orderId, $userId = null) {
        try {
            // Start transaction
            $this->db->autocommit(FALSE);
            
            // Get order details
            $orderSql = "SELECT * FROM orders WHERE id = ?";
            if ($userId !== null) {
                $orderSql .= " AND user_id = ?";
            }
            
            $orderStmt = $this->db->prepare($orderSql);
            if ($userId !== null) {
                $orderStmt->bind_param("ii", $orderId, $userId);
            } else {
                $orderStmt->bind_param("i", $orderId);
            }
            $orderStmt->execute();
            $orderResult = $orderStmt->get_result();
            
            if ($orderResult->num_rows === 0) {
                throw new Exception('Order not found');
            }
            
            $order = $orderResult->fetch_assoc();
            
            if ($order['status'] !== 'pending' && $order['status'] !== 'confirmed') {
                throw new Exception('Order cannot be cancelled');
            }
            
            // Update order status
            $updateOrderSql = "UPDATE orders SET status = 'cancelled', updated_at = NOW() WHERE id = ?";
            $updateOrderStmt = $this->db->prepare($updateOrderSql);
            $updateOrderStmt->bind_param("i", $orderId);
            
            if (!$updateOrderStmt->execute()) {
                throw new Exception('Failed to cancel order');
            }
            
            // Restore ticket availability
            $restoreTicketsSql = "UPDATE ticket_types SET sold = sold - ? WHERE id = ?";
            $restoreTicketsStmt = $this->db->prepare($restoreTicketsSql);
            $restoreTicketsStmt->bind_param("ii", $order['quantity'], $order['ticket_type_id']);
            $restoreTicketsStmt->execute();
            
            // Restore event available tickets
            $restoreEventSql = "UPDATE events SET available_tickets = available_tickets + ? WHERE id = ?";
            $restoreEventStmt = $this->db->prepare($restoreEventSql);
            $restoreEventStmt->bind_param("ii", $order['quantity'], $order['event_id']);
            $restoreEventStmt->execute();
            
            // Cancel tickets
            $cancelTicketsSql = "UPDATE tickets SET status = 'cancelled' WHERE order_id = ?";
            $cancelTicketsStmt = $this->db->prepare($cancelTicketsSql);
            $cancelTicketsStmt->bind_param("i", $orderId);
            $cancelTicketsStmt->execute();
            
            // Commit transaction
            $this->db->commit();
            $this->db->autocommit(TRUE);
            
            return [
                'success' => true,
                'message' => 'Order cancelled successfully'
            ];
            
        } catch (Exception $e) {
            // Rollback transaction
            $this->db->rollback();
            $this->db->autocommit(TRUE);
            
            return [
                'success' => false,
                'message' => $e->getMessage()
            ];
        }
    }
    
    // Get order statistics for admin
    public function getStatistics($startDate = null, $endDate = null) {
        try {
            $whereClause = "WHERE 1=1";
            $params = [];
            
            if ($startDate) {
                $whereClause .= " AND DATE(created_at) >= ?";
                $params[] = $startDate;
            }
            
            if ($endDate) {
                $whereClause .= " AND DATE(created_at) <= ?";
                $params[] = $endDate;
            }
            
            // Total orders
            $totalOrdersSql = "SELECT COUNT(*) as total FROM orders " . $whereClause;
            $totalOrdersStmt = $this->db->prepare($totalOrdersSql);
            if (!empty($params)) {
                $totalOrdersStmt->bind_param(str_repeat("s", count($params)), ...$params);
            }
            $totalOrdersStmt->execute();
            $totalOrders = $totalOrdersStmt->get_result()->fetch_assoc()['total'];
            
            // Total revenue
            $totalRevenueSql = "SELECT SUM(total_amount) as revenue FROM orders " . $whereClause . " AND status IN ('confirmed', 'pending')";
            $totalRevenueStmt = $this->db->prepare($totalRevenueSql);
            if (!empty($params)) {
                $totalRevenueStmt->bind_param(str_repeat("s", count($params)), ...$params);
            }
            $totalRevenueStmt->execute();
            $totalRevenue = $totalRevenueStmt->get_result()->fetch_assoc()['revenue'] ?? 0;
            
            // Orders by status
            $statusSql = "SELECT status, COUNT(*) as count FROM orders " . $whereClause . " GROUP BY status";
            $statusStmt = $this->db->prepare($statusSql);
            if (!empty($params)) {
                $statusStmt->bind_param(str_repeat("s", count($params)), ...$params);
            }
            $statusStmt->execute();
            $statusResult = $statusStmt->get_result();
            
            $ordersByStatus = [];
            while ($row = $statusResult->fetch_assoc()) {
                $ordersByStatus[$row['status']] = $row['count'];
            }
            
            return [
                'success' => true,
                'statistics' => [
                    'total_orders' => $totalOrders,
                    'total_revenue' => $totalRevenue,
                    'orders_by_status' => $ordersByStatus
                ]
            ];
            
        } catch (Exception $e) {
            return [
                'success' => false,
                'message' => 'Error fetching statistics: ' . $e->getMessage()
            ];
        }
    }
}