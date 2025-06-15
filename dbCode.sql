-- mysql -u root -p < dbCode.sql
-- ./node_modules/jsdoc/jsdoc.js -c jsdoc.conf.json
-- mysql -u root -p
-- codio

-- Products
DROP DATABASE IF EXISTS ShopDB;

-- create database ShopDB
CREATE DATABASE IF NOT EXISTS ShopDB;


USE ShopDB;

CREATE TABLE IF NOT EXISTS products (
    productID INT AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    trackLength DECIMAL(5,2),
    price DECIMAL(5,2) NOT NULL, 
    formats VARCHAR(255) NOT NULL,
    colour VARCHAR(255),
    PRIMARY KEY (productID)
);

-- insert 3 albums
INSERT INTO products (name, trackLength, price, formats, colour) VALUES
    ("Is This It", 35.00, 27.99, "Vinyl, CD, Cassette", "Red"),
    ("The Balcony", 37.00, 39.99, "Vinyl, CD, Cassette", "Ultra Clear"),
    ("Whatever People Say I AM, Thats What I'm Not", 41.00, 27.99, "Vinyl, CD, Cassette", "Black");

-- Users
CREATE TABLE IF NOT EXISTS users (
    userID INT AUTO_INCREMENT,
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(5) NOT NULL DEFAULT 'user',
    PRIMARY KEY (userID)
);

-- insert 3 users
INSERT INTO users (username, email, password, role) VALUES
    ("test1", "test1@gmai.com", "$2b$10$JNrhyh/uqVqU1vaphNhSne9CmUBEzbIIKt.cL25a/nZaS942qe./a", "user"),
    ("test2", "test2@gmail.com", "$2b$10$Uk4HCma7G3sgbVuqlDsDz.AW4Qr3lkxmlcX1K.yFvUe8Uh2rz.bDG", "admin"),
    ("test3", "test3@gmail.com", "$2b$10$Mixlducy9YBmTsjiHzs7.uQEqz/8K7xJ6Gm7t908GDwmHtRiiXMpG", "user");


-- Payments
CREATE TABLE IF NOT EXISTS payments (
    paymentID INT AUTO_INCREMENT,
    orderID INT UNIQUE NOT NULL,
    userID INT NOT NULL,
    cost DECIMAL (5,2) NOT NULL,
    paymentStatus VARCHAR(12) NOT NULL,
    paymentDate DATETIME NOT NULL,
    PRIMARY KEY (paymentID)
);

-- insert 3 payments
INSERT INTO payments (orderID, userID, cost, paymentStatus, paymentDate) VALUES
    ("1", "1", "27.99", "Unsuccessful", "2025-03-25 11:12:13"),
    ("2", "2", "39.99", "Successful", "2025-03-25 10:12:10"),
    ("3", "3", "27.99", "Refunded" ,"2025-03-25 02:35:12");

-- Orders
CREATE TABLE IF NOT EXISTS orders (
    orderID INT AUTO_INCREMENT,
    productID INT NOT NULL,
    userID INT NOT NULL,
    paymentID INT NOT NULL,
    orderStatus VARCHAR(9) NOT NULL,
    orderDate DATETIME NOT NULL,
    postcode VARCHAR(255) NOT NULL,
    quantity INT NOT NULL,
    PRIMARY KEY (orderID)
);

-- insert 3 orders
INSERT INTO orders (productID, userID, paymentID, orderStatus, orderDate, postcode, quantity) VALUES
    ("1", "1", "1", "Pending", "2025-03-25 11:12:13", "CV12 OAP", "2"),
    ("2", "2", "2", "Delivered", "2025-03-22 01:35:48", "CV9 DPD", "1"),
    ("3", "3", "3", "Cancelled", "2025-03-18 03:52:26", "CV7 EAP", "3");

-- Retreive all data from the database
SELECT * FROM products;
SELECT * FROM users;
SELECT * FROM payments;
SELECT * FROM orders;