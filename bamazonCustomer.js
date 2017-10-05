var mysql = require("mysql");
var inquirer = require("inquirer");

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
  console.log("\r\nWelcome to the Bamazon Marketplace! Please see our inventory below!\r\n")
  console.log("\r\nIf you'd like to exit at any time, simply input 'exit' at any prompt.\r\n")
  console.log("><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><")
  shopping();
};

// This function will prompt the user to purhcase another item once that has been completed, posting 
// the marketplace listing again.
function moreShopping() {
	console.log("><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><")
  console.log("\r\n\tMay we interest you in any other items? Please see below!\r\n")
  console.log("><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><")
  shopping();
}

//This is our primary shopping function. All customer purchase functionality will take place here.
function shopping() {
	connection.query("SELECT item_id,product_name,price,stock_quantity FROM products", function(err, res) {
	console.log("><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><")
	for (var i=0;i<res.length;i++){
	if (res[i].product_name.length >= 1 && res[i].product_name.length <= 10 && res[i].stock_quantity >= 1){
	console.log((i+1)+". ID: "+res[i].item_id+"\t  |  "+res[i].product_name+"\t\t\t| Price: $"+res[i].price.toFixed(2))
		} else if (res[i].product_name.length >= 11 && res[i].product_name.length <= 18 && res[i].stock_quantity >= 1){
		console.log((i+1)+". ID: "+res[i].item_id+"\t  |  "+res[i].product_name+"\t\t| Price: $"+res[i].price.toFixed(2))
		} else if (res[i].product_name.length >= 18 && res[i].stock_quantity >= 1){
		console.log((i+1)+". ID: "+res[i].item_id+"\t  |  "+res[i].product_name+"\t| Price: $"+res[i].price.toFixed(2))
		}
  }
	console.log("><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><")
 	
  inquirer.prompt([
    //Here the user inupts an itemID from the field above. If they fail to match, the validate function will return false
    //and they'll need to tr again. Or they can exit by typing 'exit'.
    //Below that, they can input the number of units they'd like to order. The validate function there ensures that
    //only numbers can be entered for the quantity, maxium of 3 digits in length.
    {
      name: "itemID",
      type: "input",
      message: "Please enter the itemID of the product you'd like to purchase.\n"
      +"  Note: If an unlisted or invalid ID is entered, you'll be able to try again.",
      suffix: "\n  ITEM_ID:",
      validate: function(itemID) {
      if (itemID.toLowerCase() === "exit"){
      	end();
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
      message: "Please enter the desired quantity of the item you'd like to purchase. (Up to 3 digits)",
      suffix: "\n  Quantity:",
      validate: function(quantity) {
      if (quantity.toLowerCase() === "exit"){
      	end();
      }
    	if (quantity.match(/^-?\d+\.?\d*$/) && quantity.length <= 3) {
    		return true;
    		} else {
    			return false;
    		}
    	}
    }
  ]).then(function(answer) {
  		// Here, the user's answer for the itemID will be compared against the response we received from the mySQL
      // query further above. If there's a match, it assigns that object and all of its properties to the variable
      // chosenProduct. We then subtract the requested quantity from the product IF there's enough available stock.
    	var chosenProduct;
    	for (var i = 0; i < res.length; i++) {
      if (parseInt(answer.itemID) === res[i].item_id) {
        chosenProduct = res[i];
      	} 
    	}

      if (chosenProduct.stock_quantity >= parseInt(answer.quantity)) {
        
        connection.query(
          "UPDATE products SET ? WHERE ?",
          [
            {
              stock_quantity: (chosenProduct.stock_quantity - answer.quantity)
            },
            {
              item_id: chosenProduct.item_id
            }
          ],
          function(error) {
            //if all goes well, a success message will be generated and the user will be shown how much they'll
            //be charged for their order.
            if (error) throw err;
            console.log("\r\nThank you! Your order has been placed and your account has been charged $"+
            	(answer.quantity*chosenProduct.price).toFixed(2)
            +"\r\nWe'll have that shipped out to you soon!\r\n");
            console.log("Marketplace loading...\r\n")
            setTimeout(moreShopping, 5000)
          }
        );
      }
      //If the user requested more units of a particular item than we have in stock, the order will be refused
      //and the user will be sent back to the marketplace to order another item or a smaller amount.
      else {
        console.log("I'm afraid we don't have enough in stock to complete your order."+
        	"\r\nPlease check our inventory again for another item or order a lower quantity.");
        console.log("Marketplace loading...\r\n")
        setTimeout(moreShopping, 5000)
      }
    });
   });
};

//And this simply presents a brief farewell message should the user exit the app.
function end() {
  console.log("\r\n><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><")
  console.log("\r\nThank you for visiting the Bamazon Marketplace! We hope to see you again!\r\n")
  console.log("><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><")
  process.exit();
}