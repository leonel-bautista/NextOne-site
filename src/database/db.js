import mySql from 'mysql2';

// const mySql = require('mysql2');

const connection = mySql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "nextone_db"
});

connection.connect((error) => {
    if(error){
        return console.error("(❌)" + error);
    }

    console.log("(✔) Conectado a la base de datos");
})

// module.exports = connection;

export const conn = connection;