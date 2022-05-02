const inquirer = require('inquirer');
const cTable = require('console.table');
const db = require('./sqlconnect');

const Departments = require('./lib/Departments');
const Roles = require('./lib/Roles');

const firstQuestion = [
    {
        type: "list", 
        message: "What would you like to do?",
        choices: ["View Departments", "View Roles", "View Employees", "Add Department", "Add Role", "Add Employee", "Update Employee Role"],
        name: "choices"
    }
];

const addDep = [
    {
        type: "input",
        message: "What is the name of the department?",
        name: "depName"
    }
];

const addRole = [
    {
        type: "input",
        message: "What is the name of the role?",
        name: "roleTitle"
    },
    {
        type: "input",
        message: "What is the salary for this role?",
        name: "roleSalary"
    },
    {
        type: "list",
        message: "Which department does this role belong to?",
        choices: [],
        name: "roleDep"
    }
];

function init() { // How do I make it so that when I recall init() after I finish adding to or viewing a table, the table isn't formatted weirdly on the command-line questioning? see comments below... 
    inquirer
    .prompt(firstQuestion)
    .then((answers) => {
        if (answers.choices === "View Departments") {
            const departments = new Departments;
            departments.getDepartments();
            // init(); --> this currently overrides the command-line and makes the UI look funky
        } else if (answers.choices === "Add Department") {
            inquirer
            .prompt(addDep)
            .then((answers) => {
                const departments = new Departments(answers.depName);
                departments.addDepartment();
            });
        } else if (answers.choices === "View Roles") {
            const roles = new Roles;
            roles.getRoles();
        } else if (answers.choices === "Add Role") {
            db.query("SELECT * FROM departments", (err, data) => {
                if (err) {
                    console.log(err)
                };

                for (let i = 0; i < data.length; i++) {
                    addRole[2].choices.push(data[i].dep_name);
                };
            });

            inquirer
            .prompt(addRole)
            .then((answers) => {
                const departments = new Departments(answers.roleDep);
                departments.getSpecificDepID((err, data) => {
                    if (err) {
                        console.log(err)
                    };

                    let depId = JSON.stringify(data[0].id);

                    const roles = new Roles(answers.roleTitle, answers.roleSalary, depId);
                    roles.addRole();
                });
            });
        }
    });
};

init();