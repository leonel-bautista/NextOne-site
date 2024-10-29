
////////////// CONTROLADORES DEL MÓDULO "CARGOS" ////

const db = require('/@database/db');


// MÉTODO GET
// para todos los cargos
const showEveryRole = (req, res) => {
    const sql = `SELECT * FROM roles`;

    db.query(sql, (error, result) => {
        if(error){
            return res.status(500).json({error: "(❌) ERROR: Vuelva a intentarlo más tarde"});
        }

        res.json(result);
    })
}
// para un solo cargo
const showOneRole = (req, res) => {
    const {role_id} = req.params;
    const sql = `SELECT * FROM roles WHERE role_id = ?`;

    db.query(sql, [role_id], (error ,result) => {
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
const storeRole = (req, res) => {
    const {role_name, role_description} = req.body;
    const sql = `INSERT INTO roles (role_name, role_description) VALUES (?,?)`;

    db.query(sql, [role_name, role_description], (error, result) => {
        if(error){
            return res.status(500).json({error: "(❌) ERROR: Vuelva a intentarlo más tarde"});
        }

        const role = {mensaje: "(✔) Cargo registrado con éxito!",
                      role_id: result.insertId,
                      ...req.body};
        res.status(201).json(role);
    })
}

// MÉTODO PUT
const updateRole = (req, res) => {
    const {role_id} = req.params;
    const {role_name, role_description} = req.body;
    const sql = `UPDATE roles SET role_name = ?, role_description = ? WHERE role_id = ?`;

    db.query(sql, [role_name, role_description, role_id], (error, result) => {
        if(error){
            return res.status(500).json({error: "(❌) ERROR: Vuelva a intentarlo más tarde"});
        }
        if(result.affectedRows == 0){
            return res.status(404).json({error: "(❌) ERROR: No se encontraron los datos a actualizar"});
        }

        const role = {mensaje: "(✔) Cargo actualizado con éxito!",
                      ...req.params,
                      ...req.body};
        res.json(role);
    })
}

// MÉTODO DELETE
const removeRole = (req, res) => {
    const {role_id} = req.params;
    const sql = `DELETE FROM roles WHERE role_id = ?`;

    db.query(sql, [role_id], (error, result) => {
        if(error){
            return res.status(500).json({error: "(❌) ERROR: Vuelva a intentarlo más tarde"});
        }
        if(result.affectedRows == 0){
            return res.status(500).json({error: "(❌) ERROR: No se encontraron los datos a eliminar"});
        }

        res.json({mensaje: "(✔) Cargo eliminado con éxito!"})
    })
}


// EXPORTAR
module.exports = {
    // GET
    showEveryRole,
    showOneRole,
    // POST
    storeRole,
    // PUT
    updateRole,
    // DELETE
    removeRole
}