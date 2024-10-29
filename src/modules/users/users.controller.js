
////////////// CONTROLADORES DEL MÓDULO "USUARIOS" ////

const db = require('/@database/db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');


// MÉTODO GET
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

// MÉTODO POST
// registrar una cuenta
const registerUser = (req, res) => {
    let userImage = "";
    if(req.file){
        userImage = req.file.filename;
    }
    const {tier_id, user_name, user_alias, email, password} = req.body;
    const sql = `INSERT INTO users (user_image, tier_id, user_name, user_alias, email, password)
                 VALUES (?, ?, ?, ?, ?, ?)`;
    const hashedPassword = bcrypt.hashSync(password, 8);

    db.query(sql, [userImage, tier_id, user_name, user_alias, email, hashedPassword], (error, result) => {
        if(error){
            return res.status(500).json({error: "(❌) ERROR: Vuelva a intentarlo más tarde"});
        }

        const token = jwt.sign({user_id: result.insertId}, process.env.SECRET_KEY, {
            expiresIn: "1h"
        });

        const userInfo = {mensaje: "(✔) Usuario registrado con éxito!",
                          user_id: result.insertId,
                          ...req.file,
                          ...req.body,
                          token: token};
        res.status(201).send(userInfo);
    })

}
// ingresar a una cuenta
const loginUser = (req, res) => {
    const {user_name, password} = req.body;
    const sql = `SELECT * FROM users WHERE user_name = ?`;

    db.query(sql, [user_name, password], (error, result) => {
        if(error){
            return res.status(500).json({error: "(❌) ERROR: Vuelva a intentarlo más tarde"});
        }
        if(result.length == 0){
            return res.status(404).json({mensaje: "(❌) ERROR: Usuario no encontrado"});
        }

        const passwordIsValid = bcrypt.compareSync(password, result[0].password);
        if(!passwordIsValid){
            return res.status(401).json({mensaje: "(❌) ERROR: Contraseña incorrecta",
                                         auth: false,
                                         token: null});
        }

        const token = jwt.sign({user_id: result.user_id}, process.env.SECRET_KEY, {
            expiresIn: "1h"
        });
        
        res.send({mensaje: "(✔) Login con éxito!",
                  auth: true,
                  token: token});
    })

};

// MÉTODO PUT
const updateUser = (req, res) => {
    let userImage = "";
    if(req.file){
        userImage = req.file.filename;
    }
    const {user_id} = req.params;
    const {tier_id, user_name, user_alias, email, password} = req.body;
    const sql = `UPDATE users
                 SET user_image = ?, tier_id = ?, user_name = ?, user_alias = ?, email = ?, password = ?
                 WHERE user_id = ?`;
    const hashedPassword = bcrypt.hashSync(password, 8);

    db.query(sql, [userImage, tier_id, user_name, user_alias, email, hashedPassword, user_id], (error, result) => {
        if(error){
            return res.status(500).json({error: "(❌) ERROR: Vuelva a intentarlo más tarde"});
        }
        if(result.affectedRows == 0){
            return res.status(404).json({error: "(❌) ERROR: No se encontraron los datos a actualizar"});
        }

        const token = jwt.sign({user_id: result.insertId}, process.env.SECRET_KEY, {
            expiresIn: "1h"
        });

        const userInfo = {mensaje: "(✔) Usuario actualizado con éxito!",
                          ...req.params,
                          ...req.file,
                          ...req.body,
                          token: token};
        res.status(201).send(userInfo);
    })
}

// MÉTODO DELETE
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
    // GET
    showEveryUser,
    showOneUser,
    // POST
    registerUser,
    loginUser,
    // PUT
    updateUser,
    // DELETE
    removeUser,
}