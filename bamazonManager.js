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
    mantenience();
});

function mantenience() {
    inquirer.prompt(
        {
            name: "choice",
            type: "rawlist",
            message: "List a set of menu options:",
            choices: [
                "View Products for Sale",
                "View Low Inventory",
                "Add more to Inventory",
                "Add New Product",
                "Exit"
            ]
        }
    ).then(function (answer) {
        switch (answer.choice) {
            case "View Products for Sale":
                querySales();
                break;
            case "View Low Inventory":
                checkLowInventory();
                break;
            case "Add more to Inventory":
                addInventory();
                break;
            case "Add New Product":
                addNewProduct();
                break;
            case "Exit":
                exit();
                return;
            default:
                mantenience();
        }
    })
}

function querySales() {
    connection.query("SELECT item_id, product_name, department_name, price, stock_quantity, product_sales FROM PRODUCTS",
        function (err, results) {
            if (err) throw err;
            console.log("The list of Items for Sale");
            console.table(results);
            mantenience();
        });
}
function checkLowInventory() {
    connection.query("SELECT item_id, product_name, department_name, price, stock_quantity, product_sales FROM PRODUCTS WHERE stock_quantity < 5",
        function (err, results) {
            if (err) throw err;
            console.log("\nItems are in lower inventory less than five\n");
            console.table(results);
            mantenience();
        });
}
function addInventory() {
    let itemId = 0;
    let numToAdd = 0;
    inquirer.prompt([{
        name: "itemIdOrQuit",
        type: "input",
        message: "What is the item_id to add more? [Quit with Q]",
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
        name: "numToAddOrQuit",
        type: "input",
        message: "How many would you like to add? [Quit with Q]",
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
            answer.numToAddOrQuit.toUpperCase() === 'Q') {
            return;
        }
        itemId = answer.itemIdOrQuit;
        numToAdd = answer.numToAddOrQuit;
        var sql = "UPDATE PRODUCTS set stock_quantity = stock_quantity + "
            + numToAdd + " where item_id = " + itemId;
        console.log(sql);

        connection.query(sql, function (err) {
            if (err) throw err;
            console.log(numToAdd, " more is added successfully");
        })
        querySales();
    })
}

function addNewProduct() {
    inquirer.prompt([
        {
            name: 'productName',
            type: 'input',
            message: 'Enter the new product name:'
        },
        {
            name: 'departmentName',
            type: 'input',
            message: 'Enter its department name:'
        },
        {
            name: 'price',
            type: 'input',
            message: 'Enter its price:'
        },
        {
            name: 'quantity',
            type: 'input',
            message: 'Enter its stock_quantity:',
            validate: function (value) {
                if (isNaN(value) === false) {
                    return true;
                }
                return false;
            }
        }
    ]).then(function (answer) {
        // when finished prompting, insert a new item into the db with that info
        connection.query(
            "INSERT INTO products SET ?",
            {
                product_name: answer.productName,
                department_name: answer.departmentName,
                price: answer.price,
                stock_quantity: answer.quantity || 0
            },
            function (err) {
                if (err) throw err;
                console.log("The new product was added successfully!");
                querySales();
            }
        );
    });    
}

function exit() {
    console.log("DONE");
    connection.end();
}