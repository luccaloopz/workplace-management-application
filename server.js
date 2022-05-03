const inquirer = require('inquirer');
const cTable = require('console.table');
const db = require('./sqlconnect');

const Departments = require('./lib/Departments');
const Roles = require('./lib/Roles');
const Employees = require('./lib/Employees');

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

const addEmployee = [
    {
        type: "input",
        message: "What is the employee's first name?",
        name: "employeeFirst"
    },
    {
        type: "input",
        message: "What is the employee's last name?",
        name: "employeeLast"
    },
    {
        type: "list",
        message: "What is the employee's role?",
        choices: [],
        name: "employeeRole"
    },
    {
        type: "list",
        message: "Who is the employee's manager?",
        choices: ["None"],
        name: "employeeManager"
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
        } else if (answers.choices === "View Employees") {
            const employees = new Employees;
            employees.getEmployees();
        } else if (answers.choices === "Add Employee") {
            db.query("SELECT title FROM roles", (err, data) => {
                if (err) {
                    console.log(err)
                };

                for (let i = 0; i < data.length; i++) {
                    addEmployee[2].choices.push(data[i].title);
                };
            });

            db.query("SELECT CONCAT(first_name, ' ', last_name) AS name FROM employees", (err, data) => {
                if (err) {
                    console.log(err)
                };

                for (let i = 0; i < data.length; i++) {
                    addEmployee[3].choices.push(data[i].name);
                };
            });

            inquirer
            .prompt(addEmployee)
            .then((answers) => {
                const roles = new Roles(answers.employeeRole);
                roles.getSpecificRoleID((err, data) => {
                    if (err) {
                        console.log(err)
                    };

                    let roleId = JSON.stringify(data[0].id);

                    let nameArr = answers.employeeManager.split(' ');

                    if (nameArr.length === 2) {
                        let firstName = nameArr[0];
                        let lastName = nameArr[1];

                        const employees1 = new Employees(firstName, lastName);
                        employees1.getSpecificManagerID((err, data) => {
                            if (err) {
                                console.log(err)
                            };

                            let managerId = JSON.stringify(data[0].id);

                            const employees2 = new Employees(answers.employeeFirst, answers.employeeLast, roleId, managerId);
                            employees2.addEmployee();
                        });
                    } else if (nameArr.length === 1) {
                        const employees3 = new Employees(answers.employeeFirst, answers.employeeLast, roleId);
                        employees3.addManager();
                    };
                
                });
            });
        }
    });
};

init();