const mySql = require('mysql2');

const connection = mySql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "games_list"
});

connection.connect((error) => {
    if(error){
        return console.error("❌" + error);
    }

    console.log("✅ Conectado a la base de datos");
})

module.exports = connection;