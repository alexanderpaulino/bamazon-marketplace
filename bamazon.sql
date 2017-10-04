-- Drops the animals_db if it exists currently --
DROP DATABASE IF EXISTS bamazon;
-- Creates the "animals_db" database --
CREATE DATABASE bamazon;

-- Makes it so all of the following code will affect the bamazon database --
USE bamazon;

-- Creates the table "products" within the bamazon database --
CREATE TABLE products (
  -- Creates a numeric column called "item_id" which will automatically increment its default value as we create new rows --
  item_id INT(10) AUTO_INCREMENT NOT NULL,
  -- Makes a string column called "product_name" which cannot contain null --
  product_name VARCHAR(40) NOT NULL,
  -- Makes a string column called "deartment_name" which cannot contain null --
  department_name VARCHAR(40) NOT NULL,
  -- Makes a decimal column called "price" which allows for two decimal places --
  price DECIMAL(10,2) NOT NULL,
  -- Makes a numeric column called "stock_quantity" --
  stock_quantity INT(10) NOT NULL,
  -- Sets item_id as this table's primary key which means all data contained within it will be unique --
  PRIMARY KEY (item_id)
);

-- Creates new rows containing data in all named columns --
INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Office chair", "Office Supplies", 125.00, 96);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Cooking utensil set", "Kitchen", 75.00, 82);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Computer monitor", "Electronics", 250.00, 110);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Computer game", "Electronics", 60.00, 87);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Keyboard", "Electronics", 45.00, 67);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Bed linens", "Bedroom", 150.00, 98);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Copy paper", "Office Supplies", 45.00, 200);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Pot and pan set", "Kitchen", 180.00, 84);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Matching pillow set", "Bedroom", 170.00, 105);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Printer Ink", "Office Supplies", 70.00, 108);

-- Checking the table to see that all products and data were correctly inserted
SELECT * FROM products