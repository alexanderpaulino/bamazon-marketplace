--Drops the bamazon if it exists currently --
DROP DATABASE IF EXISTS bamazon;
--Creates the "bamazon" database --
CREATE DATABASE bamazon;

-- Makes it so all of the following code will affect bamazon --
USE bamazon;

-- Creates the table "products" within the bamazon database --
CREATE TABLE products (
  -- Creates a numeric column called "item_id" --
  item_id INT(10) NOT NULL,
  -- Makes a string column called "product_name" which cannot contain null --
  product_name VARCHAR(40) NOT NULL,
  -- Makes a string column called "department_name" which cannot contain null --
  department_name VARCHAR(40) NOT NULL,
  -- Makes a decimal column called "price" which allows for two decimal places --
  price DECIMAL(10,2) NOT NULL,
  -- Makes a numeric column called "stock_quantity" --
  stock_quantity INT(10) NOT NULL,
  -- Sets item_id as this table's primary key which means all data contained within it will be unique --
  PRIMARY KEY (item_id)
);

Creates new rows containing data in all named columns --
INSERT INTO products (item_id, product_name, department_name, price, stock_quantity)
VALUES (46288, "Office chair", "Office Supplies", 125.00, 96);

INSERT INTO products (item_id, product_name, department_name, price, stock_quantity)
VALUES (23934,"Cooking utensil set", "Kitchen", 75.00, 82);

INSERT INTO products (item_id, product_name, department_name, price, stock_quantity)
VALUES (18483, "Computer monitor", "Electronics", 250.00, 110);

INSERT INTO products (item_id, product_name, department_name, price, stock_quantity)
VALUES (18845, "Computer game", "Electronics", 60.00, 87);

INSERT INTO products (item_id, product_name, department_name, price, stock_quantity)
VALUES (18327, "Keyboard", "Electronics", 45.00, 67);

INSERT INTO products (item_id, product_name, department_name, price, stock_quantity)
VALUES (21452, "Bed linens", "Bedroom", 150.00, 98);

INSERT INTO products (item_id, product_name, department_name, price, stock_quantity)
VALUES (46432, "Copy paper", "Office Supplies", 45.00, 200);

INSERT INTO products (item_id, product_name, department_name, price, stock_quantity)
VALUES (23636, "Pot and pan set", "Kitchen", 180.00, 84);

INSERT INTO products (item_id, product_name, department_name, price, stock_quantity)
VALUES (21473, "Matching pillow set", "Bedroom", 170.00, 105);

INSERT INTO products (item_id, product_name, department_name, price, stock_quantity)
VALUES (46536, "Printer Ink", "Office Supplies", 70.00, 108);

-- Checking the table to see that all products and data were correctly inserted
SELECT * FROM products

------------------------------------------------------------------------------------

