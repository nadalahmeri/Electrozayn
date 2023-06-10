-- DROP DATABASE IF EXISTS electrozayn_db;
-- CREATE DATABASE IF NOT EXISTS electrozayn_db;
USE electrozayn_db;

CREATE TABLE IF NOT EXISTS products (
  id INT NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(),
  Origin_price VARCHAR(150) NOT NULL,
  quantity VARCHAR(150) NOT NULL,
  Promo_price VARCHAR(255) NOT NULL,
  reference VARCHAR(255) NOT NULL,
  product_image VARCHAR(255) NOT NULL,
  availability VARCHAR(255) NOT NULL,
  category VARCHAR(255) NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS product_images (
  id INT NOT NULL AUTO_INCREMENT,
  product_image VARCHAR(255) NOT NULL,
  product_id INT NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (product_id) REFERENCES products(id)
);

CREATE TABLE IF NOT EXISTS user (
  id INT NOT NULL AUTO_INCREMENT,
  FirstName VARCHAR(200),
  LastName VARCHAR(200),
  Email VARCHAR(200),
  Address VARCHAR(255),
  PhoneNumber VARCHAR(255),
  Password VARCHAR(200),
  image VARCHAR(255),
  country VARCHAR(200),
  Zip VARCHAR(250),
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(),
  role VARCHAR(200),
  PRIMARY KEY (id)
);

INSERT INTO user (Email, Password, role) VALUES ("lahmeri.nada@yahoo.fr", "8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918", "admin");

CREATE TABLE IF NOT EXISTS sessions (
  id INT NOT NULL AUTO_INCREMENT,
  user_id INT NOT NULL,
  session VARCHAR(250) NOT NULL,
  date VARCHAR(250) NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (user_id) REFERENCES user(id)
);

CREATE TABLE IF NOT EXISTS adminnotification (
  id INT NOT NULL AUTO_INCREMENT,
  user_id INT NOT NULL,
  message VARCHAR(250) NOT NULL,
  date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(),
  new BOOLEAN NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (user_id) REFERENCES user(id)
);

CREATE TABLE IF NOT EXISTS newsletter (
  id INT NOT NULL AUTO_INCREMENT,
  email VARCHAR(250) NOT NULL,
  date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(),
  PRIMARY KEY (id)
);


CREATE TABLE IF NOT EXISTS shopcard (
  id INT NOT NULL AUTO_INCREMENT,
  check_add_or_not BOOLEAN NOT NULL,
  user_id INT NOT NULL,
  products_id INT NOT NULL,
  date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(),
  PRIMARY KEY (id, products_id, check_add_or_not),
  FOREIGN KEY (products_id) REFERENCES products(id),
  FOREIGN KEY (user_id) REFERENCES user(id)
);

CREATE TABLE IF NOT EXISTS order (
  id INT NOT NULL AUTO_INCREMENT,
  validate_add_or_not BOOLEAN NOT NULL,
  FirstName VARCHAR(200) NOT NULL,
  Email VARCHAR(200) NOT NULL,
  PhoneNumber VARCHAR(255) NOT NULL,
  country VARCHAR(200) NOT NULL,
  Zip VARCHAR(250) NOT NULL,
  user_id INT NOT NULL,
  total_price DECIMAL(10, 2) NOT NULL,
  product_name VARCHAR(200) NOT NULL,
  product_quantity INT NOT NULL,
  date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(),
  PRIMARY KEY (id, validate_add_or_not, user_id),
  FOREIGN KEY (user_id) REFERENCES user(id)
);

