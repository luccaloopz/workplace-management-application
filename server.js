const inquirer = require('inquirer');
const cTable = require('console.table');

const Departments = require('./lib/Departments');

const firstQuestion = [
    {
        type: "list", 
        message: "What would you like to do?",
        choices: ["View Departments", "View Roles", "View Employees", "Add Department", "Add Role", "Add Employee", "Update Employee Role"],
        name: "choices"
    }
];

const departmentName = [
    {
        type: "input",
        message: "What is the name of the department?",
        name: "depName"
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
            .prompt(departmentName)
            .then((answers) => {
                const departments = new Departments;
                departments.addDepartment(answers.depName);
            });
        }
    });
};

init();