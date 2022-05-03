const db = require('../sqlconnect');

class Employees {
    constructor (first_name, last_name, role_id, manager_id) {
        this.first_name = first_name;
        this.last_name = last_name;
        this.role_id = role_id;
        this.manager_id = manager_id;
    };

    getEmployees() {
        return db.promise().query("SELECT employees.id, employees.first_name, employees.last_name, roles.title, departments.dep_name AS department, roles.salary, CONCAT (m.first_name, ' ', m.last_name) AS manager FROM employees LEFT JOIN roles ON employees.role_id = roles.id LEFT JOIN departments ON roles.department_id = departments.id LEFT JOIN employees m ON employees.manager_id = m.id").then(([data]) => {
            console.table(data);
        });
    };

    addEmployee() {
        return db.promise().query("INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)", [this.first_name, this.last_name, this.role_id, this.manager_id]).then(([data]) => {
        });
    };

    getSpecificManagerID() {
        return db.promise().query("SELECT id FROM employees WHERE first_name = ? AND last_name = ?", [this.first_name, this.last_name]);
    };

    addManager() {
        return db.promise().query("INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, null)", [this.first_name, this.last_name, this.role_id]).then(([data]) => {
        });
    };

    updateEmployeeRole() {
        return db.promise().query("UPDATE employees SET role_id = ? WHERE first_name = ? AND last_name = ?", [this.role_id, this.first_name, this.last_name]).then(([data]) => {
        });
    };
};

module.exports = Employees;