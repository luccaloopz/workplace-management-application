const db = require('../sqlconnect');

class Departments {
    constructor (dep_name) {
        this.dep_name = dep_name;
    };

    getDepartments() {
        return db.promise().query("SELECT * FROM departments").then(([data]) => {
            console.table(data);
        });
    };

    addDepartment() {
        return db.promise().query("INSERT INTO departments (dep_name) VALUES (?)", this.dep_name);
    };

    getSpecificDepID() {
        return db.promise().query("SELECT id FROM departments WHERE dep_name = ?", this.dep_name);
    };

};

module.exports = Departments;