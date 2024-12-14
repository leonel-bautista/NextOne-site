
////////////// CONTROLADOR DEL MÓDULO "USUARIOS" ////

import {conn as db} from '../../database/db.js';
import jsonwebtoken from 'jsonwebtoken';
import bcryptjs from 'bcryptjs';


// MÉTODO GET
// para todos los usuarios
async function showEveryUser(req, res){
    const sql = `SELECT * FROM users`;

    db.query(sql, (error, result) => {
        if(error){
            return res.status(500).json({error: "(❌) ERROR: Vuelva a intentarlo más tarde"});
        }

        res.json(result);
    })
}
// para un solo usuario
async function showOneUser(req, res){
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
async function storeUser(req, res){
    let userImage = "";
    if(req.file){
        userImage = req.file.filename;
    }
    const {tier_id, user_name, user_alias, email, password} = req.body;
    const sql = `INSERT INTO users (user_image, tier_id, user_name, user_alias, email, password)
                 VALUES (?, ?, ?, ?, ?, ?)`;
    const hashedPassword = await bcryptjs.hash(password, 10);

    db.query(sql, [userImage, tier_id, user_name, user_alias, email, hashedPassword], (error, result) => {
        if(error){
            return res.status(500).json({error: "(❌) ERROR: Vuelva a intentarlo más tarde"});
        }

        res.status(201).json({mensaje: "(✔) Usuario registrado con éxito!"});
    })

}

// MÉTODO PUT
async function updateUser(req, res){
    let userImage = "";
    if(req.file){
        userImage = req.file.filename;
    }
    const {user_id} = req.params;
    const {tier_id, user_name, user_alias, email, password} = req.body;
    const sql = `UPDATE users
                 SET user_image = ?, tier_id = ?, user_name = ?, user_alias = ?, email = ?, password = ?
                 WHERE user_id = ?`;
    const hashedPassword = await bcryptjs.hash(password, process.env.SALT);

    db.query(sql, [userImage, tier_id, user_name, user_alias, email, hashedPassword, user_id], (error, result) => {
        if(error){
            return res.status(500).json({error: "(❌) ERROR: Vuelva a intentarlo más tarde"});
        }
        if(result.affectedRows == 0){
            return res.status(404).json({error: "(❌) ERROR: No se encontraron los datos a actualizar"});
        }

        res.status(201).json({mensaje: "(✔) Usuario actualizado con éxito!"});
    })
}

// MÉTODO DELETE
async function removeUser(req, res){
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
export const methods = {
    // GET
    showEveryUser,
    showOneUser,
    // POST
    storeUser,
    // PUT
    updateUser,
    // DELETE
    removeUser,
}