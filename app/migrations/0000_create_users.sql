CREATE TABLE IF NOT EXISTS users (
  id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  firstName VARCHAR(255),
  lastName VARCHAR(255),
  email VARCHAR(255) UNIQUE NOT NULL,
  userType ENUM('admin', 'editor'),
  password CHAR(60) NOT NULL,
  passwordResetToken CHAR(64),
  passwordResetDate CHAR(64)
);