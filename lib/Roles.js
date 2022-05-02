const db = require('../sqlconnect');

class Roles {
    constructor (title, salary, department_id) {
        this.title = title;
        this.salary = salary;
        this.department_id = department_id;
    };

    getRoles() {
        db.query("SELECT roles.id, roles.title, departments.dep_name AS department, roles.salary FROM roles JOIN departments ON departments.id = roles.department_id", (err, data) => {
            if (err) {
                console.log(err)
            }
            console.table(data)
        });
    };

    addRole() {
        db.query("INSERT INTO roles (title, salary, department_id) VALUES (?, ?, ?)", [this.title, this.salary, this.department_id], (err, data) => {
            if (err) {
                console.log(err)
            };
        });
    };

};

module.exports = Roles;