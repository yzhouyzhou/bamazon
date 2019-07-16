var mysql = require("mysql");
var inquirer = require("inquirer");
var cTable = require("console.table");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "ying",
    password: "12345678",
    database: "bamazondb"
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("id: ", connection.threadId);
    shopping();
})

function shopping() {
    connection.query("SELECT item_id, product_name, department_name, price, stock_quantity, product_sales FROM PRODUCTS",
        function (err, results) {
            if (err) throw err;
            console.log("\n");
            console.table(results);
            customInput();
        });

}

function exit() {
    console.log("Thank you for shopping with us! Have A Nice Day!");
    connection.end();
}

function customInput() {
    let itemId = 0;
    let numToBuy = 0;
    inquirer.prompt([{
        name: "itemIdOrQuit",
        type: "input",
        message: "What is the item_id you would like to purchase? [Quit with Q]",
        validate: function (value) {
            if (value.toUpperCase() === 'Q') {
                return true;
            }
            if (isNaN(value) === false) {
                return true;
            }
            return false;
        }
    },
    {
        name: "numToBuyOrQuit",
        type: "input",
        message: "How many would you like to purchase? [Quit with Q]",
        validate: function (value) {
            if (value.toUpperCase() === 'Q') {
                return true;
            }
            if (isNaN(value) === false) {
                return true;
            }
            return false;
        }
    }
    ]).then(function (answer) {
        if (answer.itemIdOrQuit.toUpperCase() === 'Q' ||
            answer.numToBuyOrQuit.toUpperCase() === 'Q') {
            exit();
            return;
        }
        itemId = answer.itemIdOrQuit;
        numToBuy = answer.numToBuyOrQuit;
        console.log(itemId, numToBuy);
        connection.query(
            "SELECT product_name, price, stock_quantity, product_sales FROM PRODUCTS where ?",
            {
                item_id: itemId
            }, function (err, response) {
                if (err) throw err;
                if (response[0].stock_quantity < numToBuy) {
                    console.log("Sorry! The item ", response[0].product_name, " has insufficient quantity !");
                }
                else {
                    connection.query(
                        "UPDATE PRODUCTS set ? where ?",
                        [
                            {
                                stock_quantity: response[0].stock_quantity - numToBuy,
                                product_sales: response[0].product_sales + response[0].price * numToBuy
                            },
                            {
                                item_id: itemId
                            }
                        ], function (err) {
                            if (err) throw err;
                            console.log("You order is filled: ", numToBuy, response[0].product_name, "and total charged $ ", response[0].price * numToBuy);
                        }
                    )
                }
                shopping();
            }
        )
    });
}


