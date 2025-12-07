-- Create database and users table for Joobseeker
CREATE DATABASE IF NOT EXISTS joobseeker CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE joobseeker;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  fullname VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  is_admin TINYINT(1) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Sample data (change password values to hashed in production)
INSERT INTO users (fullname, email, password, phone, is_admin) VALUES
('User Test', 'nguyenhoangson10092006@gmail.com', 'password123', '0900000000', 0),
('Admin', 'admin@jobseeker.com', 'admin123', '0900000000', 1)
ON DUPLICATE KEY UPDATE email = email;
