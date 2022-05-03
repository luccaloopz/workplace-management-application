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

const updateEmployee = [
    {
        type: "list",
        message: "Which employee's role would you like to update?",
        choices: [],
        name: "listOfEmployees"
    },
    {
        type: "list",
        message: "Which role would you like to assign the selected employee?",
        choices: [],
        name: "listOfEmployeeRoles"
    }
];

function init() {
    inquirer
    .prompt(firstQuestion)
    .then((answers) => {
        if (answers.choices === "View Departments") {
            const departments = new Departments;
            departments.getDepartments().then(() => {
                init(); 
            }).catch((err) => {
                console.log(err);
            });

        } else if (answers.choices === "Add Department") {
            inquirer
            .prompt(addDep)
            .then((answers) => {
                const departments = new Departments(answers.depName);
                departments.addDepartment().then(() => {
                    init(); 
                }).catch((err) => {
                    console.log(err);
                });
            });

        } else if (answers.choices === "View Roles") {
            const roles = new Roles;
            roles.getRoles().then(() => {
                init(); 
            }).catch((err) => {
                console.log(err);
            });

        } else if (answers.choices === "Add Role") {
            db.promise().query("SELECT * FROM departments").then(([data]) => {
                for (let i = 0; i < data.length; i++) {
                    addRole[2].choices.push(data[i].dep_name);
                };

                inquirer
                .prompt(addRole)
                .then((answers) => {
                    const departments = new Departments(answers.roleDep);
                    departments.getSpecificDepID().then(([data]) => {
                        let depId = JSON.stringify(data[0].id);

                        const roles = new Roles(answers.roleTitle, answers.roleSalary, depId);
                        roles.addRole().then(() => {
                            init(); 
                        });
                    });
                });
            }).catch((err) => {
                console.log(err);
            });

        } else if (answers.choices === "View Employees") {
            const employees = new Employees;
            employees.getEmployees().then(() => {
                init();
            }).catch((err) => {
                console.log(err);
            });
        } else if (answers.choices === "Add Employee") {
            db.promise().query("SELECT title FROM roles").then(([data]) => {
                for (let i = 0; i < data.length; i++) {
                    addEmployee[2].choices.push(data[i].title);
                };

                db.promise().query("SELECT CONCAT(first_name, ' ', last_name) AS name FROM employees").then(([data]) => {
                    for (let i = 0; i < data.length; i++) {
                        addEmployee[3].choices.push(data[i].name);
                    };

                    inquirer
                    .prompt(addEmployee)
                    .then((answers) => {
                        const roles = new Roles(answers.employeeRole);
                        roles.getSpecificRoleID().then(([data]) => {
                            let roleId = JSON.stringify(data[0].id);

                            let nameArr = answers.employeeManager.split(' ');

                            if (nameArr.length === 2) {
                                let firstName = nameArr[0];
                                let lastName = nameArr[1];

                                const employees1 = new Employees(firstName, lastName);
                                employees1.getSpecificManagerID().then(([data]) => {
                                    let managerId = JSON.stringify(data[0].id);

                                    const employees2 = new Employees(answers.employeeFirst, answers.employeeLast, roleId, managerId);
                                    employees2.addEmployee().then(() => {
                                        init();
                                    });
                                });
                            } else if (nameArr.length === 1) {
                                const employees3 = new Employees(answers.employeeFirst, answers.employeeLast, roleId);
                                employees3.addManager().then(() => {
                                    init();
                                });
                            };
                        });
                    });
                });
            }).catch((err) => {
                console.log(err);
            });
             
        } else if (answers.choices === "Update Employee Role") {
            db.promise().query("SELECT CONCAT(first_name, ' ', last_name) AS name FROM employees").then(([data]) => {
                for (let i = 0; i < data.length; i++) {
                    updateEmployee[0].choices.push(data[i].name);
                };

                db.promise().query("SELECT title FROM roles").then(([data]) => {
                    for (let i = 0; i < data.length; i++) {
                        updateEmployee[1].choices.push(data[i].title);
                    };
                    
                    inquirer
                    .prompt(updateEmployee)
                    .then((answers) => {
                        const roles = new Roles(answers.listOfEmployeeRoles);
                        roles.getSpecificRoleID().then(([data]) => {
                            let employeesRoleId = JSON.stringify(data[0].id); 

                            let employeeNameArr = answers.listOfEmployees.split(' ');
                            let firstEmpName = employeeNameArr[0];
                            let lastEmpName = employeeNameArr[1];

                            const employees = new Employees(firstEmpName, lastEmpName, employeesRoleId);
                                employees.updateEmployeeRole().then(() => {
                                    init();
                                });
                        });
                    });
                });
            }).catch((err) => {
                console.log(err);
            });
        };
    });
};

init();