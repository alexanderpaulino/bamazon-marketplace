# bamazon-marketplace

## Assignment 11 - Amazon-like storefront with MySQL 

For this assignment, we were tasked with creating an Amazon-like storefront utilizing MySQL database and table functionality. This app allows users to submit orders that deplete stock from the store's inventory. Additionally, a manager's suite app that provides users with access to the same database, but with administrative controls, allowing them to restore depleted stock, add new products to the database, among other features. Please see below for GIFs demonstrating some of the apps functions.

## Customer View & Features

Upon starting the app, cusomters are greeted with a welcome message and shown the list of items for sale in the database. This information is queried from a MySQL server I'm running off of my laptop. The user is prompted to enter a matching ItemID of a product they're interested and then subsequently prompted for a desired quantity. If you look to the right, you'll see that once the order has completed, the MySQL table is updated to reflect that. In this case, the customer's purchase of 4 keyboards reduced our stock to 15. 

<img src="https://github.com/alexanderpaulino/bamazon-marketplace/blob/master/demogifs/customerpurchase.gif?raw=true">

Should a user request a larger quantity than is available, they'll be informed of such and sent back to the marketplace to choose another item or request a smaller quantity to order.

<img src="https://github.com/alexanderpaulino/bamazon-marketplace/blob/master/demogifs/customerrejection.gif?raw=true">

If the user would like to exit at any time, they would simply need to type in exit at any prompt. In such an event, they'll be presented with a farewell message, thanking them for their patronage and hoping they'll return.

<img src="https://github.com/alexanderpaulino/bamazon-marketplace/blob/master/demogifs/customerexit.gif?raw=true">

## Manager View & Features

Upon starting the app, users will be presented with a welcome message for the Manager's Suite and a list of options to choose from. Their first option, "View Products for Sale" allows them to view all items listed for sale and their available stock - inormation that was hidden from the user accessing the same table through the Customer app.

<img src="https://github.com/alexanderpaulino/bamazon-marketplace/blob/master/demogifs/managerviewall.gif?raw=true">

Should the user select "View Low Inventory", they'll be presented with all products in the database with 20 or less available units for purchase.

<img src="https://github.com/alexanderpaulino/bamazon-marketplace/blob/master/demogifs/managerviewlow.gif?raw=true">

If, however, all products have more than 20 available units for sale, the user will be informed of such and presented with selecting another option.

<img src="https://github.com/alexanderpaulino/bamazon-marketplace/blob/master/demogifs/managerviewlowfail.gif?raw=true">

Should the user wish to restock particular items, they may do so through the "Add to Inventory" option. Here they'll be presented with the marketplace listing and asked to input an itemID from those listed. Then they'll be prompted to enter the desired quantity they'd like to order for restocking.

<img src="https://github.com/alexanderpaulino/bamazon-marketplace/blob/master/demogifs/manageraddinventory.gif?raw=true">

The fourth option, "Add New Product", will prompt the user to enter a unique Item ID, a product name, a department name, a price, and the starting quantity. Once all answers have been submitted, they'll be added to the table. See below for both the manager's addition of the new product. 

<img src="https://github.com/alexanderpaulino/bamazon-marketplace/blob/master/demogifs/manageraddproduct.gif?raw=true">

And the customer seeing the same on their next login.

<img src="https://github.com/alexanderpaulino/bamazon-marketplace/blob/master/demogifs/customernewproduct.gif?raw=true">

Finally, should the user of the manager's suite select exit, they'll be presented with a simple exit message.

<img src="https://github.com/alexanderpaulino/bamazon-marketplace/blob/master/demogifs/managerexit.gif?raw=true">

## Final Notes

This app is powered by the MySQL, Inquirer, and Columnify NPM packages. 