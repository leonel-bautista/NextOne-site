// CONTROLADORES DEL MODULO //

const db = require('../db/db')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');


// METODO GET
// para todos los usuarios
const showEveryUser = (req, res) => {
    const sql = `SELECT * FROM users`;

    db.query(sql, (error, result) => {
        if(error){
            return res.status(500).json({error: "(❌) ERROR: Vuelva a intentarlo más tarde"});
        }

        res.json(result);
    })
}
// para un solo usuario
const showOneUser = (req, res) => {
    const {user_id} = req.params;
    const sql = `SELECT * FROM users WHERE user_id = ?`;

    db.query(sql, [user_id], (error, result) => {
        if(error){
            return res.status(500).json({error: "(❌) ERROR: Vuelva a intentarlo más tarde"});
        }
        if(result.length == 0){
            return res.status(404).json({error: "(❌) ERROR: No se encontraron resultados"});
        }

        res.json(result[0]);
    })
}

// METODO PUT
const updateUser = (req, res) => {
    let userImage = "";
    if(req.file){
        userImage = req.file.filename;
    }
    
    const {user_id} = req.params;
    const {role_id, user_name, user_alias, email, password} = req.body;
    const sql = `UPDATE users
                 SET user_image = ?, role_id = ?, user_name = ?, user_alias = ?, email = ?, password = ?
                 WHERE user_id = ?`;
    
    const hashedPassword = bcrypt.hashSync(password, 8);
    console.log(hashedPassword);

    db.query(sql, [userImage, role_id, user_name, user_alias, email, hashedPassword, user_id], (error, result) => {
        if(error){
            return res.status(500).json({error: "(❌) ERROR: Vuelva a intentarlo más tarde"});
        }
        if(result.affectedRows == 0){
            return res.status(404).json({error: "(❌) ERROR: No se encontraron los datos a actualizar"});
        }

        const token = jwt.sign({user_id: result.insertId}, process.env.SECRET_KEY, {
            expiresIn: "1h"
        });
        const userInfo = {
                            mensaje: "(✔) Usuario actualizado con éxito!",
                            ...req.params,
                            user_image: userImage,
                            role_id: role_id,
                            username: user_name,
                            alias: user_alias, 
                            email: email,
                            password: hashedPassword,
                            token: token
                         };
    
        res.status(201).send(userInfo);
    })
}

// METODO DELETE
const removeUser = (req, res) => {
    const {user_id} = req.params;
    const sql = `DELETE FROM users WHERE user_id = ?`

    db.query(sql, [user_id], (error, result) => {
        if(error){
            return res.status(500).json({error: "(❌) ERROR: Vuelva a intentarlo más tarde"});
        }
        if(result.affectedRows == 0){
            return res.status(404).json({error: "(❌) ERROR: No se encontraron los datos a eliminar"});
        }

        res.json({mensaje: "(✔) Usuario eliminado con éxito!"})
    })
}


// EXPORTAR
module.exports = {
    showEveryUser,
    showOneUser,
    updateUser,
    removeUser
}