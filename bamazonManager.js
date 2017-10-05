var mysql = require("mysql");
var inquirer = require("inquirer");
var columnify = require("columnify");

var chosenProduct;
var inputCheck;

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,

  user: "root",

  password: "",
  database: "bamazon"
});

connection.connect(function(err) {
if (err) throw err;
consoleClear();
start();
});

// Found this recently; it will clear everything above the terminal/console before starting. Just provides a cleaner look
// when initiating the app.
function consoleClear(){
console.log('\033c');
}

// This function will display the welcome text and then call the function prompting the user to select a management option.
function start() {
  console.log("><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><")
  console.log("\r\n\tWelcome to the Bamazon Marketplace - Manager's Suite\r\n")
  console.log("\r\n       If you'd like to exit at any time, simply select 'Exit'.\r\n")
  console.log("><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><")
  managing();
};

// This function will prompt the user to make another choice once their previous action has been completed.
function moreManaging() {
	console.log("><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><")
  console.log("\r\n\tIs there anything else you'd like to do before logging off?\r\n")
  console.log("><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><")
  managing();
}

//This is our primary function. All of our app's actions are handled here.
function managing() {
	connection.query("SELECT item_id,product_name,price,stock_quantity FROM products", function(err, res) {
  inquirer.prompt([
    {
      name: "managerChoice",
      type: "list",
      message: "Please select an administrative option below:\n",
      choices: ["View Products for Sale","View Low Inventory","Add to Inventory","Add New Product","Exit"]  
    }
  ]).then(function(answer) {
    
    //If the user selects "View Products for Sale", they'll be shown the full marketplace table, minus Departments. 
    if (answer.managerChoice === "View Products for Sale"){
    var columns = columnify(res,{minWidth: 16,config: {stock_quantity: {align: 'right'},price: {align: 'right'}}})
    console.log("><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><\n")
    console.log(columns)
    console.log("><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><\n")
    moreManaging();
    }

    //If the user selects "View Low Inventory", they'll be shown the rows for any products that have 20 or less units
    //available for order. The instructions stated less than 5, but I felt marketplaces would want to order new products 
    //well before their stock went that low. Particularly if they sell in bulk.
    if (answer.managerChoice === "View Low Inventory"){
    connection.query("SELECT item_id,product_name,price,stock_quantity FROM products WHERE "+
      "stock_quantity <= 20", function(err, res) {
      var columns = columnify(res,{minWidth: 16,config: {stock_quantity: {align: 'right'},price: {align: 'right'}}})
      console.log("><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><\n")
      if (columns === ""){
      console.log("\t\t  All products are currently above\n\t\t 20 units in quantity at this time.\n")
      } else {
        console.log("\t\t\tLOW INVENTORY\n\n\tConsider ordering additional units of the items below.\n")
        console.log(columns)
      }
      console.log("><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><\n")
      moreManaging();
      });
    }

    //If the user selets "Add to Inventory", they'll be shown the catalog and asked to input an itemID for the 
    // product they'd like to order more units for. The validate function ensures that only a listed itemID will
    //be accepted and that only numbers up to 3 digits can be submitted for the quantity.
    if (answer.managerChoice === "Add to Inventory"){
    var columns = columnify(res,{minWidth: 16,config: {stock_quantity: {align: 'right'},price: {align: 'right'}}})
    console.log("><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><\n")
    console.log(columns)
    console.log("><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><\n")
    inquirer.prompt([
          {
            name: "itemID",
            type: "input",
            message: "Please enter the itemID of the product you'd like to add stock to.\n"
            +"  Note: If an unlisted or invalid ID is entered, you'll be able to try again.",
            suffix: "\n  ITEM_ID:",
            validate: function(itemID) {
            if (itemID.toLowerCase() === "exit"){
              process.exit()
            }
            inputCheck = false;
            for (var i = 0; i < res.length; i++) {
            if (parseInt(itemID) === res[i].item_id) {
              inputCheck = true;
              }
            }
            if (inputCheck == true) {
              return true;
              } else {
              return false;
              }
            }
          },
          {
            name: "quantity",
            type: "input",
            message: "Please enter the desired quantity you'd like to order for that item. (Up to 3 digits)",
            suffix: "\n  Quantity:",
            validate: function(quantity) {
            if (quantity.toLowerCase() === "exit"){
              process.exit()
            }
            if (quantity.match(/^-?\d+\.?\d*$/) && quantity.length <= 3) {
              return true;
              } else {
                return false;
              }
            }
          }
        ]).then(function(answer) {
          connection.query("UPDATE products SET stock_quantity = stock_quantity + "+answer.quantity+" WHERE ?",
            [
              {
                item_id: answer.itemID
              }
            ],
            function(err, res) {
              if (answer.quantity >= 2){
              console.log(answer.quantity+" units have been ordered for Item ID: "+answer.itemID+".\n");
            } else {
              console.log(answer.quantity+" unit has been ordered for Item ID: "+answer.itemID+".\n")
            }
            setTimeout(moreManaging, 5000);
            });
        });
    }

    //If the user selects "Add New Product", they'll be prompted with a series of questions to answer in order to add
    //a new product to the mySQL table. This is a hefty bit of code because I wanted to ensure that only valid answers
    //could be provided. To start, only unique itemID's will be accepted; if the app finds a match at this point, it will
    //return false and prompt the user to try again. Similarly, the itemIDs must be 5 digits in length. Product Name
    //has much more freedom, but with how unique product names can be, I allowed it. A list made sense for Department,
    //since most stores should have a set amount of those. And finally price and quantity both require numbers only
    //of a certain digit length, but the code for price allows decimals in the event that the user wants to add a value
    //that requires it.
    if (answer.managerChoice === "Add New Product"){
    inquirer.prompt([
          {
            name: "itemID",
            type: "input",
            message: "Please enter a unique 5-digit Item ID of the product you'd like to add to the marketplace.\n"
            +"  Note: If a previously listed ID is entered, you'll be able to try again.",
            suffix: "\n  ITEM_ID:",
            validate: function(itemID) {
            if (itemID.toLowerCase() === "exit"){
              process.exit()
            }
            inputCheck = false;
            for (var i = 0; i < res.length; i++) {
            if (parseInt(itemID) === res[i].item_id) {
              inputCheck = true;
              }
            }
            if (inputCheck == false && itemID.length == 5 && itemID.match(/^-?\d+\.?\d*$/)) {
              return true;
              } else {
              return false;
              }
            }
          },
          {
            name: "productName",
            type: "input",
            message: "Please enter the Product Name you'd like to post for that item (3 characters minimum).",
            suffix: "\n  Product Name:",
            validate: function(productName) {
            if (productName.toLowerCase() === "exit"){
              process.exit()
            }
            if (productName.length >= 3) {
              return true;
              } else {
                return false;
              }
            }
          },
          {
            name: "departmentName",
            type: "list",
            message: "Please select the Department this product should be categorized under.",
            choices: ["Accessories","Automotive","Bedroom","Clothing","Electronics",
            "Furniture","Holidays","Kitchen","Office Supplies","Personal Care","Toys"]
          },
          {
            name: "price",
            type: "input",
            message: "Please enter the desired price you'd like to post for that item. (2 digits minimum)",
            suffix: "\n  Price: $",
            validate: function(price) {
            if (price.toLowerCase() === "exit"){
              process.exit()
            }
            if (price.match(/^-?\d*[\.]?\d+$/) && price.length >= 2) {
              return true;
              } else {
                return false;
              }
            }
          },
          {
            name: "quantity",
            type: "input",
            message: "Please enter the desired quantity you'd like to post for that item. (Up to 3 digits)",
            suffix: "\n  Quantity:",
            validate: function(quantity) {
            if (quantity.toLowerCase() === "exit"){
              process.exit()
            }
            if (quantity.match(/^-?\d+\.?\d*$/) && quantity.length <= 3) {
              return true;
              } else {
                return false;
              }
            }
          }
        ]).then(function(answer) {
          var query = connection.query(
          "INSERT INTO products SET ?",
          {
            item_ID: answer.itemID,
            product_name: answer.productName,
            department_name: answer.departmentName,
            price: answer.price,
            stock_quantity: answer.quantity
          },
          function(err, res) {
            console.log("><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><")
            console.log("\tThe following product has been added to the marketplace.\n")
            console.log("\tItem ID: "+answer.itemID+" | Product: "+answer.productName+" | Department: "
              +answer.departmentName+"\n\t| Price: $"+answer.price+" | Quantity: "+answer.quantity+"\n")
            console.log("><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><")
            }
          );
          setTimeout(moreManaging, 5000)
          });
      };

    //And if the user should type "exit" in any way, they'll be presented with a thank you and the app exits.
    if (answer.managerChoice.toLowerCase() === "exit"){
      console.log("><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><")
      console.log("\r\n   Thank you for using the Bamazon Marketplace - Manager's Suite!\r\n")
      console.log("><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><")
      process.exit();
    }
  });
 });
};
