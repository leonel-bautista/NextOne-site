import mySql from 'mysql2';

const data = process.env;

const connection = mySql.createConnection({
    host: data.DB_HOST,
    user: data.DB_USER,
    password: data.DB_PASSWORD,
    database: data.DATABASE
});

connection.connect((error) => {
    if(error){
        return console.error("|❌| ERROR AL CONECTARSE A LA BASE DE DATOS (" + error + ")");
    }

    console.log("✅ Conectado a la base de datos!");
})

export const conn = connection;