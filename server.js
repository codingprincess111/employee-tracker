const inquirer = require("inquirer");
const mysql = require('mysql2');

// Connect to database
const connection = mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: 'password',
      database: 'employeeTracker_db',
    });
 
// Connect to database
connection.connect((err) => {
      if (err) throw err;
      console.log("Connected to the employeeTracker_db database.");
      start();
    });

  // Create a function to initialize app
function start() {
    inquirer
     .prompt({
        name: 'action',
        type: 'rawlist',
        message: 'What would you like to do?',
        choices: [
          'View all departments',
          'View all roles',
          'View all employees',
          'Add a department',
          'Add a role',
          'Add an employee',
          'Update an employee role',
          'Exit',
        ],
      })
      .then((answer) => {
        switch (answer.action) {
            case 'View all departments':
                viewAllDepartments();
                break;
            case 'View all roles':
                viewAllRoles();
                break;
            case 'View all employees':
                viewAllEmployees();
                break;
            case 'Add a department':
                addDepartment();
                break;
            case 'Add a role':
                addRole();
                break;
            case 'Add an employee':
                addEmployee();
                break;
            case 'Add a Manager':
                addManager();
                break;
            case 'Update an employee role':
                updateEmployeeRole();
                break;    
            case "View Employees by Manager":
                viewEmployeesByManager();
                break;
            case "View Employees by Department":
                viewEmployeesByDepartment();
                break;
            case "Delete Departments | Roles | Employees":
                deleteDepartmentsRolesEmployees();
                break;
            case 'Exit':
                connection.end();
                console.log("bye");
                break;
        }
    });
}

// Create a function to view all departments
function viewAllDepartments() {
    connection.query('SELECT * FROM department', (err, res) => {
        if (err) throw err;
        console.table(res);
        start();
    });
}

// Create a function to view all roles
function viewAllRoles() {
    connection.query('SELECT * FROM role', (err, res) => {
        if (err) throw err;
        console.table(res);
        start();
    });
}

// Create a function to view all employees
function viewAllEmployees() {
    connection.query('SELECT * FROM employee', (err, res) => {
        if (err) throw err;
        console.table(res);
        start();
    });
}

// Create a function to add a department
function addDepartment() {
    inquirer
    .prompt([
        {
          name: 'department',
          type: 'input',
          message: 'What is the name of the department?',
        },
      ])
    .then((answer) => {
        console.log(answer.name)
        connection.query(
          'INSERT INTO department SET?',
          {
            name: answer.department,
          },
          (err, res) => {
            if (err) throw err;
            console.table(res);
            start();
            console.log(answer.name);
          }
        );
      });
}
