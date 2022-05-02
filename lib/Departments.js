const db = require('../sqlconnect');

class Departments {
    constructor (dep_name) {
        this.dep_name = dep_name;
    };

    getDepartments() {
        db.query("SELECT * FROM departments", (err, data) => {
            if (err) {
                console.log(err)
            };
            console.table(data)
        });
    };

    addDepartment() {
        db.query("INSERT INTO departments (dep_name) VALUES (?)", this.dep_name, (err, data) => {
            if (err) {
                console.log(err)
            };
        });
    };

    getSpecificDepID(cb) {
        db.query("SELECT id FROM departments WHERE dep_name = ?", this.dep_name, cb);
    };

};

module.exports = Departments;