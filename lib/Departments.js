const db = require('../sqlconnect')

class Departments {
    // constructor (dep_name) { -------> do I even need this block?
    //     this.dep_name = dep_name;
    // };

    getDepartments() {
        db.query("SELECT * FROM departments", (err, data) => {
            if (err) {
                console.log(err)
            };
            console.table(data)
        });
    };

    addDepartment(dep_name) {
        db.query("INSERT INTO departments (dep_name) VALUES (?);", dep_name, (err, data) => {
            if (err) {
                console.log(err)
            };
        });
    };

};

module.exports = Departments;