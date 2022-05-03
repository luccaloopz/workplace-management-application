const db = require('../sqlconnect');

class Employees {
    constructor (first_name, last_name, role_id, manager_id) {
        this.first_name = first_name;
        this.last_name = last_name;
        this.role_id = role_id;
        this.manager_id = manager_id;
    };

    getEmployees() {
        db.query("SELECT employees.id, employees.first_name, employees.last_name, roles.title, departments.dep_name AS department, roles.salary, CONCAT (m.first_name, ' ', m.last_name) AS manager FROM employees LEFT JOIN roles ON employees.role_id = roles.id LEFT JOIN departments ON roles.department_id = departments.id LEFT JOIN employees m ON employees.manager_id = m.id", (err, data) => {
            if (err) {
                console.log(err)
            };
            console.table(data)
        });
    };

    addEmployee() {
        db.query("INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)", [this.first_name, this.last_name, this.role_id, this.manager_id], (err, data) => {
            if (err) {
                console.log(err)
            };
        });
    };

    getSpecificManagerID(cb) {
        db.query("SELECT id FROM employees WHERE first_name = ? AND last_name = ?", [this.first_name, this.last_name], cb)
    };

    addManager() {
        db.query("INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, null)", [this.first_name, this.last_name, this.role_id], (err, data) => {
            if (err) {
                console.log(err)
            };
        });
    };

};

module.exports = Employees;