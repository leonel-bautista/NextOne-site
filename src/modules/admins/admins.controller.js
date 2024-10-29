
////////////// CONTROLADORES DEL MÓDULO "ADMINS" ////

const db = require('/@database/db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');


// MÉTODO GET
// para todos los admins
const showEveryAdmin = (req, res) => {
    const sql = `SELECT * FROM admins`;

    db.query(sql, (error, result) => {
        if(error){
            return res.status(500).json({error: "(❌) ERROR: Vuelva a intentarlo más tarde"});
        }

        res.json(result);
    })
}
// para un solo admin
const showOneAdmin = (req, res) => {
    const {admin_id} = req.params;
    const sql = `SELECT * FROM admins WHERE admin_id ?`;

    db.query(sql, [admin_id], (error, result) => {
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
const storeAdmin = (req, res) => {
    const {user_id, role_id, area_id, pin} = req.body;
    const sql = `INSERT INTO admins (user_id, role_id, area_id, pin)
                 VALUES (?,?,?,?)`;
    const hashedPin = bcrypt.hashSync(pin, 12);

    db.query(sql, [user_id, role_id, area_id, hashedPin], (error, result) => {
        if(error){
            return res.status(500).json({error: "(❌) ERROR: Vuelva a intentarlo más tarde"});
        }

        const admin = {mensaje: "(✔) Admin registrado con éxito!",
                       admin_id: result.insertId,
                       ...req.body};
        res.status(201).json(admin);
    })
}

// MÉTODO PUT
const updateAdmin = (req, res) => {
    const {admin_id} = req.params;
    const {user_id, role_id, area_id, pin} = req.body;
    const sql = `UPDATE admins
                 SET user_id = ?, role_id = ?, area_id = ?, pin = ?
                 WHERE admin_id ?`;
    const hashedPin = bcrypt.hashSync(pin, 12);

    db.query(sql, [user_id, role_id, area_id, hashedPin, admin_id], (error, result) => {
        if(error){
            return res.status(500).json({error: "(❌) ERROR: Vuelva a intentarlo más tarde"});
        }
        if(result.affectedRows == 0){
            return res.status(404).json({error: "(❌) ERROR: No se encontraron los datos a actualizar"});
        }

        const admin = {mensaje: "(✔) Admin actualizado con éxito!",
                       ...req.params,
                       ...req.body};
        res.json(admin);
    })
}

// MÉTODO DELETE
const removeAdmin = (req, res) => {
    const {admin_id} = req.params;
    const sql = `DELETE FROM admins WHERE admin_id = ?`;

    db.query(sql, [admin_id], (error, result) => {
        if(error){
            return res.status(500).json({error: "(❌) ERROR: Vuelva a intentarlo más tarde"});
        }
        if(result.affectedRows == 0){
            return res.status(404).json({error: "(❌) ERROR: No se encontraron los datos a eliminar"});
        }

        res.json({mensaje: "(✔) Admin eliminado con éxito!"})
    })
}


// EXPORTAR
module.exports = {
    // GET
    showEveryAdmin,
    showOneAdmin,
    // POST
    storeAdmin,
    // PUT
    updateAdmin,
    // DELETE
    removeAdmin
}