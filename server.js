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
      console.log("Connected to the database.");
      start();
    });

  // function to initialize app
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

// function to view all departments
function viewAllDepartments() {
    const query = "SELECT * FROM departments";
    connection.query(query, (err, res) => {
        if (err) throw err;
        console.table(res);
        start();
    });
}

// function to view all roles
function viewAllRoles() {
    const query = "SELECT roles.title, roles.id, departments.department_name, roles.salary from roles join departments on roles.department_id = departments.id";
    connection.query(query, (err, res) => {
        if (err) throw err;
        console.table(res);
        start();
    });
}

// function to view all employees
function viewAllEmployees() {
    const query = `
    SELECT e.id, e.first_name, e.last_name, r.title, d.department_name, r.salary, CONCAT(m.first_name, ' ', m.last_name) AS manager_name
    FROM employee e
    LEFT JOIN roles r ON e.role_id = r.id
    LEFT JOIN departments d ON r.department_id = d.id
    LEFT JOIN employee m ON e.manager_id = m.id;
    `;
    connection.query(query, (err, res) => {
        if (err) throw err;
        console.table(res);
        start();
    });
}

// function to add a department
function addDepartment() {
    inquirer
        .prompt({
          type: "input",
          name: "name",
          message: "Enter the name of new department:",
        })
        .then((answer) => {
            console.log(answer.name);
            const query = `INSERT INTO departments (department_name) VALUES ("${answer.name}")`;
            connection.query(query, (err, res) => {
                if (err) throw err;
                console.log(`Added department ${answer.name} to the database!`);
                start();
                console.log(answer.name);
            });
      });
}


// function to add a role
function addRole() {
    const query = "SELECT * FROM departments";
    connection.query(query, (err, res) => {
        if (err) throw err;
        const departmentChoices = res.map((department) => department.department_name);
        inquirer
            .prompt([
                {   
                    type: "input",
                    name: "title",
                    message: "Enter the title of the new role:",
                },
                {
                    type:"input",
                    name: "salary",
                    message: "Enter the salary of the new role:",
                },
                {
                    type: "list",
                    name: "departments",
                    message: "Select the department for the new role:",
                    choices: departmentChoices,
                },
            ])
            .then((answer) => {
                const department = res.find(
                    (department) => department.department_name === answer.departments
                );
                const query = "INSERT INTO roles SET ?";
                connection.query(query, {
                    title: answer.title,
                    salary: answer.salary,
                    department_id: department.id,
                }, 
                (err, res) => {
                    if (err) throw err;
                    console.log(`added role ${answer.title} wih salary ${answer.salary} to the ${answer.departments} department in the database!`);
                    start();
                });         
        });
    });
}

// function to add an employee
function addEmployee() {
    connection.query("SELECT id, title FROM roles", (error, results) => {
        if (error) {
            console.table(error);
            return;
        }
        })
      
        const roles = results.map(({ id, title }) => ({
            name: title,
            value: id,
        }));

        connection.query("SELECT id, CONCAT(first_name, last_name FROM employees", (error, results) => {
            if (error) {
                console.table(error);
                return;
            }
            })
            const managers = results.map(({ id, name }) => ({
                name: name,
                value: id,
            }));
            inquirer
                .prompt([
                    {
                        type: "input",
                        name: "firstName",
                        message: "Enter the employee's first name:",
                    },
                    {
                        type: "input",
                        name: "lastName",
                        message: "Enter the employee's last name:",
                    },
                    {
                        type: "list",
                        name: "roleId",
                        message: "Select the employee's role:",
                        choices: roles,
                    },
                    {
                        type: "list",
                        name: "managerId",
                        message: "Select the employee's manager:",
                        choices: [
                            { name: "NONE", value: null },
                                                      ...managers,
                        ],
                    },
                ])
                .then((answer) => {
                    const sql = "INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?,?,?,?)";
                    const values = [
                        answer.firstName,
                        answer.lastName,
                        answer.roleId,
                        answer.managerId,

                    ];
                    connection.query(sql, values, (error) => {
                        if (error) {
                            console.error(error);
                            return;
                    }
                    console.log("Employee added successfully");
                    start();
                });
            })
            .catch((error) => {
                console.error(error);
            });
            
}


// function to add a manager
// function addManager() {
//     const qDepartments = "SELECT * FROM departmemts";
//     const qEmployees = "SELECT * FROM employee";

//     connection.query(qDepartments, (err, resDepartments) => {