const mysql = require('mysql2');

const db = mysql.createConnection(
    {
      host: 'localhost',
      user: 'root',
      password: 'password',
      database: 'workplace_db'
    },
    
    console.log("Connected to database workplace_db")
);

module.exports = db; 