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
    displayDepartment();
})

function displayDepartment(){
    connection.query("SELECT department_id, department_name, over_head_costs FROM departments",
    function (err, results) {
        if (err) throw err;
        console.table(results);
        supervisor();
    });
}

function supervisor() {   
    inquirer.prompt(
        {
            name: "choice",
            type: "rawlist",
            message: "List a set of menu options:",
            choices: [
                "View Product Sales by Department",
                "Add New Department",
                "Exit"
            ]
        }
    ).then(function (answer) {
        switch (answer.choice) {
            case "View Product Sales by Department":
                querySalesByDepartment();
                break;
            case "Add New Department":
                addNewDepartment();
                break;
            case "Exit":
                exit();
                return;
            default:
                displayDepartment();
        }
    })
}

function querySalesByDepartment() {
//    SELECT d.department_id, d.department_name, d.over_head_costs, ifnull(p,0) as product_sales, (ifnull(p,0)-d.over_head_costs) as total_profit
//    FROM departments as d left join (
//    select department_name, SUM(product_sales) as p from products group by department_name
//    ) s on s.department_name = d.department_name order by department_id
    var sql = "SELECT d.department_id, d.department_name, d.over_head_costs, ifnull(p,0) as product_sales, (ifnull(p,0)-d.over_head_costs) as total_profit FROM departments as d left join ( select department_name, SUM(product_sales) as p from products group by department_name ) s on s.department_name = d.department_name order by department_id";
       
    connection.query(
        sql, function (err, results) {
        if (err) throw err;
        console.table(results);
        supervisor();
    });

}

function addNewDepartment() {
    inquirer.prompt([
        {
            name: 'departmentName',
            type: 'input',
            message: 'Enter its department name:'
        },
        {
            name: 'cost',
            type: 'input',
            message: 'Enter its over_head_costs:',
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
            "INSERT INTO departments SET ?",
            {
                department_name: answer.departmentName,
                over_head_costs: answer.cost || 0
            },
            function (err) {
                if (err) throw err;
                console.log("The new department was added successfully!");               
                displayDepartment();
            }
        );
    });
}

function exit() {
    console.log("DONE");
    connection.end();
}