<?php

namespace Backend\src\Models;

use Exception;

class Event {
    private $db;
    
    public function __construct($database) {
        $this->db = $database;
    }
    
    // Create event
    public function create($data) {
        try {
            $sql = "INSERT INTO events (
                creator_id, title, description, date, time, venue, category, 
                total_capacity, available_tickets, status, created_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())";
            
            $stmt = $this->db->prepare($sql);
            $stmt->bind_param("issssssiis", 
                $data['creator_id'],
                $data['title'],
                $data['description'],
                $data['date'],
                $data['time'],
                $data['venue'],
                $data['category'],
                $data['total_capacity'],
                $data['available_tickets'],
                $data['status']
            );
            
            if ($stmt->execute()) {
                $eventId = $this->db->insert_id;
                
                // Insert ticket types
                if (isset($data['ticket_types']) && is_array($data['ticket_types'])) {
                    foreach ($data['ticket_types'] as $ticketType) {
                        $this->createTicketType($eventId, $ticketType);
                    }
                }
                
                return [
                    'success' => true,
                    'event_id' => $eventId,
                    'message' => 'Event created successfully'
                ];
            } else {
                return [
                    'success' => false,
                    'message' => 'Failed to create event: ' . $stmt->error
                ];
            }
        } catch (Exception $e) {
            return [
                'success' => false,
                'message' => 'Error creating event: ' . $e->getMessage()
            ];
        }
    }
    
    // Create ticket type for event
    private function createTicketType($eventId, $ticketData) {
        $sql = "INSERT INTO ticket_types (
            event_id, name, price, quantity, sold, description, created_at
        ) VALUES (?, ?, ?, ?, 0, ?, NOW())";
        
        $stmt = $this->db->prepare($sql);
        $stmt->bind_param("isdis", 
            $eventId,
            $ticketData['name'],
            $ticketData['price'],
            $ticketData['quantity'],
            $ticketData['description']
        );
        
        return $stmt->execute();
    }
    
    // Get all events with pagination
    public function getAll($page = 1, $limit = 10, $filters = []) {
        try {
            $offset = ($page - 1) * $limit;
            
            $whereClause = "WHERE 1=1";
            $params = [];
            $types = "";
            
            // Add filters
            if (isset($filters['category']) && !empty($filters['category'])) {
                $whereClause .= " AND category = ?";
                $params[] = $filters['category'];
                $types .= "s";
            }
            
            if (isset($filters['status']) && !empty($filters['status'])) {
                $whereClause .= " AND status = ?";
                $params[] = $filters['status'];
                $types .= "s";
            }
            
            if (isset($filters['creator_id']) && !empty($filters['creator_id'])) {
                $whereClause .= " AND creator_id = ?";
                $params[] = $filters['creator_id'];
                $types .= "i";
            }
            
            if (isset($filters['search']) && !empty($filters['search'])) {
                $whereClause .= " AND (title LIKE ? OR description LIKE ?)";
                $searchTerm = "%" . $filters['search'] . "%";
                $params[] = $searchTerm;
                $params[] = $searchTerm;
                $types .= "ss";
            }
            
            // Get total count
            $countSql = "SELECT COUNT(*) as total FROM events " . $whereClause;
            $countStmt = $this->db->prepare($countSql);
            if (!empty($params)) {
                $countStmt->bind_param($types, ...$params);
            }
            $countStmt->execute();
            $totalResult = $countStmt->get_result();
            $total = $totalResult->fetch_assoc()['total'];
            
            // Get events
            $sql = "SELECT e.*, u.name as creator_name 
                   FROM events e 
                   LEFT JOIN users u ON e.creator_id = u.id 
                   " . $whereClause . "
                   ORDER BY e.created_at DESC 
                   LIMIT ? OFFSET ?";
            
            $params[] = $limit;
            $params[] = $offset;
            $types .= "ii";
            
            $stmt = $this->db->prepare($sql);
            $stmt->bind_param($types, ...$params);
            $stmt->execute();
            $result = $stmt->get_result();
            
            $events = [];
            while ($row = $result->fetch_assoc()) {
                $eventId = $row['id'];
                $row['ticket_types'] = $this->getTicketTypes($eventId);
                $events[] = $row;
            }
            
            return [
                'success' => true,
                'events' => $events,
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
                'message' => 'Error fetching events: ' . $e->getMessage()
            ];
        }
    }
    
    // Get single event by ID
    public function getById($id) {
        try {
            $sql = "SELECT e.*, u.name as creator_name, u.email as creator_email 
                   FROM events e 
                   LEFT JOIN users u ON e.creator_id = u.id 
                   WHERE e.id = ?";
                   
            $stmt = $this->db->prepare($sql);
            $stmt->bind_param("i", $id);
            $stmt->execute();
            $result = $stmt->get_result();
            
            if ($result->num_rows === 0) {
                return [
                    'success' => false,
                    'message' => 'Event not found'
                ];
            }
            
            $event = $result->fetch_assoc();
            $event['ticket_types'] = $this->getTicketTypes($id);
            
            return [
                'success' => true,
                'event' => $event
            ];
            
        } catch (Exception $e) {
            return [
                'success' => false,
                'message' => 'Error fetching event: ' . $e->getMessage()
            ];
        }
    }
    
    // Get ticket types for event
    private function getTicketTypes($eventId) {
        $sql = "SELECT * FROM ticket_types WHERE event_id = ? ORDER BY price ASC";
        $stmt = $this->db->prepare($sql);
        $stmt->bind_param("i", $eventId);
        $stmt->execute();
        $result = $stmt->get_result();
        
        $ticketTypes = [];
        while ($row = $result->fetch_assoc()) {
            $ticketTypes[] = $row;
        }
        
        return $ticketTypes;
    }
    
    // Update event
    public function update($id, $data, $userId = null) {
        try {
            // Check if user owns this event (if userId provided)
            if ($userId !== null) {
                $checkSql = "SELECT creator_id FROM events WHERE id = ?";
                $checkStmt = $this->db->prepare($checkSql);
                $checkStmt->bind_param("i", $id);
                $checkStmt->execute();
                $checkResult = $checkStmt->get_result();
                
                if ($checkResult->num_rows === 0) {
                    return [
                        'success' => false,
                        'message' => 'Event not found'
                    ];
                }
                
                $event = $checkResult->fetch_assoc();
                if ($event['creator_id'] != $userId) {
                    return [
                        'success' => false,
                        'message' => 'Unauthorized: You can only update your own events'
                    ];
                }
            }
            
            $sql = "UPDATE events SET 
                   title = ?, description = ?, date = ?, time = ?, 
                   venue = ?, category = ?, status = ?, updated_at = NOW()
                   WHERE id = ?";
                   
            $stmt = $this->db->prepare($sql);
            $stmt->bind_param("sssssssi",
                $data['title'],
                $data['description'],
                $data['date'],
                $data['time'],
                $data['venue'],
                $data['category'],
                $data['status'],
                $id
            );
            
            if ($stmt->execute()) {
                // Update ticket types if provided
                if (isset($data['ticket_types']) && is_array($data['ticket_types'])) {
                    $this->updateTicketTypes($id, $data['ticket_types']);
                }
                
                return [
                    'success' => true,
                    'message' => 'Event updated successfully'
                ];
            } else {
                return [
                    'success' => false,
                    'message' => 'Failed to update event: ' . $stmt->error
                ];
            }
            
        } catch (Exception $e) {
            return [
                'success' => false,
                'message' => 'Error updating event: ' . $e->getMessage()
            ];
        }
    }
    
    // Update ticket types for event
    private function updateTicketTypes($eventId, $ticketTypes) {
        // Delete existing ticket types
        $deleteSql = "DELETE FROM ticket_types WHERE event_id = ?";
        $deleteStmt = $this->db->prepare($deleteSql);
        $deleteStmt->bind_param("i", $eventId);
        $deleteStmt->execute();
        
        // Insert new ticket types
        foreach ($ticketTypes as $ticketType) {
            $this->createTicketType($eventId, $ticketType);
        }
    }
    
    // Delete event
    public function delete($id, $userId = null) {
        try {
            // Check if user owns this event (if userId provided)
            if ($userId !== null) {
                $checkSql = "SELECT creator_id FROM events WHERE id = ?";
                $checkStmt = $this->db->prepare($checkSql);
                $checkStmt->bind_param("i", $id);
                $checkStmt->execute();
                $checkResult = $checkStmt->get_result();
                
                if ($checkResult->num_rows === 0) {
                    return [
                        'success' => false,
                        'message' => 'Event not found'
                    ];
                }
                
                $event = $checkResult->fetch_assoc();
                if ($event['creator_id'] != $userId) {
                    return [
                        'success' => false,
                        'message' => 'Unauthorized: You can only delete your own events'
                    ];
                }
            }
            
            // Delete related ticket types first
            $deleteTicketTypesSql = "DELETE FROM ticket_types WHERE event_id = ?";
            $deleteTicketTypesStmt = $this->db->prepare($deleteTicketTypesSql);
            $deleteTicketTypesStmt->bind_param("i", $id);
            $deleteTicketTypesStmt->execute();
            
            // Delete the event
            $sql = "DELETE FROM events WHERE id = ?";
            $stmt = $this->db->prepare($sql);
            $stmt->bind_param("i", $id);
            
            if ($stmt->execute()) {
                return [
                    'success' => true,
                    'message' => 'Event deleted successfully'
                ];
            } else {
                return [
                    'success' => false,
                    'message' => 'Failed to delete event: ' . $stmt->error
                ];
            }
            
        } catch (Exception $e) {
            return [
                'success' => false,
                'message' => 'Error deleting event: ' . $e->getMessage()
            ];
        }
    }
    
    // Get events by creator
    public function getByCreator($creatorId, $page = 1, $limit = 10) {
        return $this->getAll($page, $limit, ['creator_id' => $creatorId]);
    }
    
    // Update event status (for admin approval)
    public function updateStatus($id, $status) {
        try {
            $sql = "UPDATE events SET status = ?, updated_at = NOW() WHERE id = ?";
            $stmt = $this->db->prepare($sql);
            $stmt->bind_param("si", $status, $id);
            
            if ($stmt->execute()) {
                return [
                    'success' => true,
                    'message' => 'Event status updated successfully'
                ];
            } else {
                return [
                    'success' => false,
                    'message' => 'Failed to update event status: ' . $stmt->error
                ];
            }
        } catch (Exception $e) {
            return [
                'success' => false,
                'message' => 'Error updating event status: ' . $e->getMessage()
            ];
        }
    }
}