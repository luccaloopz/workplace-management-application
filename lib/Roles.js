const db = require('../sqlconnect');

class Roles {
    constructor (title, salary, department_id) {
        this.title = title;
        this.salary = salary;
        this.department_id = department_id;
    };

    getRoles() {
        return db.promise().query("SELECT roles.id, roles.title, departments.dep_name AS department, roles.salary FROM roles JOIN departments ON departments.id = roles.department_id ORDER by department").then(([data]) => {
            console.table(data);
        });
    };

    addRole() {
        return db.promise().query("INSERT INTO roles (title, salary, department_id) VALUES (?, ?, ?)", [this.title, this.salary, this.department_id]).then(([data]) => {
        });
    };

    getSpecificRoleID() {
        return db.promise().query("SELECT id FROM roles WHERE title = ?", this.title);
    };

};

module.exports = Roles;