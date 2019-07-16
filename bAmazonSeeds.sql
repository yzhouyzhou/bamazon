DROP DATABASE IF EXISTS bamazonDB;
CREATE DATABASE bamazonDB;

USE bamazonDB;

CREATE TABLE products(
  item_id INT NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(100) NULL,
  department_name VARCHAR(100) NULL,
  price DECIMAL(10,2) NULL,
  stock_quantity INT default 0,
  product_sales DECIMAL(10,2) default 0,
  PRIMARY KEY (item_id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES 
("microwave","kitchen", 59.99, 5), 
("ricecooker","kitchen", 259.99, 5), 
("blender","kitchen", 49.88, 5),
("coffeemaker","kitchen", 24.99, 5),  
("breadmaker","kitchen", 97.99, 5), 
("darkchocolate","food", 5.99, 50), 
("almonds","food", 10.79, 20), 
("pistachios","food", 10.79, 20), 
("wholecashews","food", 10.79, 20), 
("mixednuts","food", 10.79, 20); 


