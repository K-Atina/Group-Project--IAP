-- Database initialization for MyTikiti platform
-- Create database
CREATE DATABASE IF NOT EXISTS mytikiti CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE mytikiti;

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    user_type ENUM('buyer', 'creator') DEFAULT 'buyer',
    email_verified BOOLEAN DEFAULT FALSE,
    verification_token VARCHAR(255) NULL,
    token_expires_at DATETIME NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_email (email),
    INDEX idx_user_type (user_type),
    INDEX idx_verification_token (verification_token)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Events table
CREATE TABLE IF NOT EXISTS events (
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
    
    FOREIGN KEY (creator_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_category (category),
    INDEX idx_date (date),
    INDEX idx_status (status),
    INDEX idx_creator (creator_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Ticket types table
CREATE TABLE IF NOT EXISTS ticket_types (
    id INT AUTO_INCREMENT PRIMARY KEY,
    event_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    price DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    quantity INT NOT NULL,
    sold INT DEFAULT 0,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
    INDEX idx_event (event_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
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
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
    FOREIGN KEY (ticket_type_id) REFERENCES ticket_types(id) ON DELETE CASCADE,
    INDEX idx_user (user_id),
    INDEX idx_event (event_id),
    INDEX idx_status (status),
    INDEX idx_order_ref (order_reference)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tickets table
CREATE TABLE IF NOT EXISTS tickets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    user_id INT NOT NULL,
    event_id INT NOT NULL,
    ticket_type_id INT NOT NULL,
    ticket_number VARCHAR(50) UNIQUE NOT NULL,
    qr_code VARCHAR(255),
    status ENUM('valid', 'used', 'cancelled') DEFAULT 'valid',
    used_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
    FOREIGN KEY (ticket_type_id) REFERENCES ticket_types(id) ON DELETE CASCADE,
    INDEX idx_ticket_number (ticket_number),
    INDEX idx_user (user_id),
    INDEX idx_event (event_id),
    INDEX idx_order (order_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert sample categories
INSERT IGNORE INTO categories (name, description) VALUES
('Technology', 'Technology conferences, workshops, and seminars'),
('Music', 'Concerts, festivals, and music events'),
('Sports', 'Sports events, tournaments, and games'),
('Business', 'Business conferences, networking events'),
('Entertainment', 'Comedy shows, theater, and entertainment events'),
('Education', 'Educational workshops, seminars, and courses'),
('Food', 'Food festivals, cooking classes, and culinary events'),
('Art', 'Art exhibitions, galleries, and cultural events'),
('Other', 'Other types of events');
