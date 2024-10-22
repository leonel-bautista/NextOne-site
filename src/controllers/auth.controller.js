// CONTROLADORES DEL MODULO

const db = require('../db/db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');


// METODO POST
// registrarse
const register = (req, res) => {
    let userImage = "";
    if(req.file){
        userImage = req.file.filename;
    }

    const {role_id, user_name, user_alias, email, password} = req.body;
    const sql = `INSERT INTO users (user_image, role_id, user_name, user_alias, email, password)
                 VALUES (?, ?, ?, ?, ?, ?)`;
    const hashedPassword = bcrypt.hashSync(password, 8);
    console.log(hashedPassword);

    db.query(sql, [userImage, role_id, user_name, user_alias, email, hashedPassword], (error, result) => {
        if(error){
            return res.status(500).json({error: "(❌) ERROR: Vuelva a intentarlo más tarde"});
        }

        const token = jwt.sign({user_id: result.insertId}, process.env.SECRET_KEY, {
            expiresIn: "1h"
        });
        const userInfo = {
                            mensaje: "(✔) Usuario registrado con éxito!",
                            user_id: result.insertId,
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
// login
const login = (req, res) => {
    const {user_name, password} = req.body;
    const sql = `SELECT * FROM users WHERE user_name = ?`;

    
    db.query(sql, [user_name, password], (error, result) => {
        if(error){
            return res.status(500).json({error: "(❌) ERROR: Vuelva a intentarlo más tarde"});
        }
        if(result.length == 0){
            return res.status(404).json({mensaje: "(❌) Usuario no encontrado"});
        }

        const passwordIsValid = bcrypt.compareSync(password, result[0].password);
        if(!passwordIsValid){
            return res.status(401).json({mensaje: "(❌) Contraseña incorrecta", auth: false, token: null});
        }
        
        const token = jwt.sign({user_id: result.user_id}, process.env.SECRET_KEY, {
            expiresIn: "1h"
        });
        
        res.send({
                    mensaje: "(✔) Login con éxito!",
                    auth: true,
                    token: token
                });
    })

};


// EXPORTAR
module.exports = {
    register,
    login
}