const express = require('express');
const inquirer = require("inquirer");
const mysql = require('mysql2');
require("console.table");

const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Connect to database
const db = mysql.createConnection(
  {
    host: 'localhost',
    // MySQL username,
    user: 'root',
    // MySQL password
    password: '123',
    database: 'employee_db'
  },
  console.log(`Connected to the employee_db database.`)
);

db.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + db.threadId);
    console.log(`
    ╔═══╗─────╔╗────────────────╔═╗╔═╗
    ║╔══╝─────║║────────────────║║╚╝║║
    ║╚══╦╗╔╦══╣║╔══╦╗─╔╦══╦══╗──║╔╗╔╗╠══╦═╗╔══╦══╦══╦═╗
    ║╔══╣╚╝║╔╗║║║╔╗║║─║║║═╣║═╣──║║║║║║╔╗║╔╗╣╔╗║╔╗║║═╣╔╝
    ║╚══╣║║║╚╝║╚╣╚╝║╚═╝║║═╣║═╣──║║║║║║╔╗║║║║╔╗║╚╝║║═╣║
    ╚═══╩╩╩╣╔═╩═╩══╩═╗╔╩══╩══╝──╚╝╚╝╚╩╝╚╩╝╚╩╝╚╩═╗╠══╩╝
    ───────║║──────╔═╝║───────────────────────╔═╝║
    ───────╚╝──────╚══╝───────────────────────╚══╝`)
    // runs the app
    firstPrompt();
});

function firstPrompt(){
    inquirer
    .prompt({
        type:"list",
        name:"task",
        message:"What would you like to do?",
        choices:[
           "View All Department",
           "View All Roles",
           "View All Employees",
           "Add A Department",
           "Add A Role",
           "Update Employee role",
           "End"
        ]
    })
    .then (function ({ task}){
        switch (task){
            case "View All Department":
                viewAllDepartment();
                break;

            case "View All Roles":
                viewAllRoles();
                break;
            
            case "View All Employees":
                viewAllEmployee();
                break;

            case "Add A Department":
                addADepartment();
                break;

            case "Add A Role":
                addARole();
                break;

            case "Update Employee role":
                updateEmployeeRole();
                break;

            case "End":
                db.end();
                console.log("Thank you for using Employee Manager!")
                break;
        }
    });
}
// View All Department function
function viewAllDepartment(){
    console.log("View All Department\n");
    
    var query = 
    `SELECT * from department;`

    db.query(query, function(err, res){
        console.table(res);
        firstPrompt();
    });
}

// View All Roles function
function viewAllRoles(){
    console.log("View ALl Roles");

    var query = 
    `SELECT role.id, role.title, role.salary, department 
    FROM role 
    JOIN department on role.department_id = department.id;`

    db.query(query, function(err, res){
        console.table(res);
        firstPrompt();
    })
}

// Add A Department function
function addADepartment(){
    inquirer
    .prompt([
        {
            type:"input",
            name:"department",
            message:"What department would you want to add?"
        }
    ])
    .then (function(answer){
        var query = `INSERT INTO department SET?`
        db.query(query, {
            department:answer.department
        },
        function (err, res){
            if (err) throw err;

            console.log("Department Added!");

            firstPrompt();
        });
    });
}

// Add A Roles function
function addARole(){
    var query = `SELECT department.department, department.id
    FROM department`
    db.query(query, function(err, res){
        const departmentChoices = res.map(({ id, department }) => ({
            value: id, name: `${department}`
          }));
          console.table(res);
          console.log("Department array!");

          promptAddRole(departmentChoices);
    })
}

function promptAddRole(departmentChoices) {

    inquirer
      .prompt([
        {
            type: "list",
            name: "departmentId",
            message: "Department?",
            choices: departmentChoices
          },
        {
          type: "input",
          name: "title",
          message: "Role title?"
        },
        {
          type: "input",
          name: "salary",
          message: "Role Salary"
        }
      ])
      .then(function (answer) {
  
        var query = `INSERT INTO role SET ?`
  
        db.query(query, {
          title: answer.title,
          salary: answer.salary,
          department_id: answer.departmentId
        },
          function (err, res) {
            if (err) throw err;
  
            console.table(res);
            console.log("Role Inserted!");
  
            firstPrompt();
          });
  
      });
  }

  // Update Employee Role function
  function updateEmployeeRole() { 
    employeeArray();
  
  }
  
  function employeeArray() {
    console.log("Updating an employee");
  
    var query =
      `SELECT e.id, e.first_name, e.last_name, r.title, d.department AS department, r.salary, CONCAT(m.first_name, ' ', m.last_name) AS manager
    FROM employee e
    JOIN role r
      ON e.role_id = r.id
    JOIN department d
    ON d.id = r.department_id
    JOIN employee m
      ON m.id = e.manager_id`
  
    db.query(query, function (err, res) {
      if (err) throw err;
  
      const employeeChoices = res.map(({ id, first_name, last_name }) => ({
        value: id, name: `${first_name} ${last_name}`      
      }));
  
      console.table(res);
      console.log("employeeArray To Update!\n")
  
      roleArray(employeeChoices);
    });
  }
  
  function roleArray(employeeChoices) {
    console.log("Updating an role");
  
    var query =
      `SELECT r.id, r.title, r.salary 
    FROM role r`
    let roleChoices;
  
    db.query(query, function (err, res) {
      if (err) throw err;
  
      roleChoices = res.map(({ id, title, salary }) => ({
        value: id, title: `${title}`, salary: `${salary}`      
      }));
  
      console.table(res);
      console.log("roleArray to Update!\n")
  
      promptEmployeeRole(employeeChoices, roleChoices);
    });
  }
  
  function promptEmployeeRole(employeeChoices, roleChoices) {
  
    inquirer
      .prompt([
        {
          type: "list",
          name: "employeeId",
          message: "Which employee do you want to set with the role?",
          choices: employeeChoices
        },
        {
          type: "list",
          name: "roleId",
          message: "Which role do you want to update?",
          choices: roleChoices
        },
      ])
      .then(function (answer) {
  
        var query = `UPDATE employee SET role_id = ? WHERE id = ?`
        // when finished prompting, insert a new item into the db with that info
        db.query(query,
          [ answer.roleId,  
            answer.employeeId
          ],
          function (err, res) {
            if (err) throw err;
  
            console.table(res);
            console.log(res.affectedRows + " Updated successfully!");
  
            firstPrompt();
          });
      });
  }

  // View All Employee
  function viewAllEmployee(){
    var query = 
    `SELECT e.id, e.first_name, e.last_name, r.title, d.department AS department, r.salary, 
    CONCAT(m.first_name, ' ', m.last_name) AS manager
      FROM employee e
      LEFT JOIN role r
        ON e.role_id = r.id
      LEFT JOIN department d
      ON d.id = r.department_id
      LEFT JOIN employee m
        ON m.id = e.manager_id`
    db.query(query, function(err, res){
        if (err) throw err;
        console.table(res);

        firstPrompt();
    });
  }