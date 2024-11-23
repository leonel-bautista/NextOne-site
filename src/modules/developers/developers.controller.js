
////////////// CONTROLADORES DEL MÓDULO "DESARROLLADORAS" ////

const db = require('../../database/db');


// MÉTODO GET
// para todas las desarrolladoras
const showEveryDeveloper = (req, res) => {
    const sql = `SELECT * FROM developers`;

    db.query(sql, (error, result) => {
        if(error){
            return res.status(500).json({error: "(❌) ERROR: Vuelva a intentarlo más tarde"});
        }

        res.json(result);
    })
}
// para una sola desarrolladora
const showOneDeveloper = (req, res) => {
    const {developer_id} = req.params;
    const sql = `SELECT * FROM developers WHERE developer_id = ?`;

    db.query(sql, [developer_id], (error, result) => {
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
const storeDeveloper = (req, res) => {
    const {developer_name} = req.body;
    const sql = `INSERT INTO developers (developer_name) VALUES (?)`;

    db.query(sql, [developer_name], (error, result) => {
        if(error){
            return res.status(500).json({error: "(❌) ERROR: Vuelva a intentarlo más tarde"});
        }

        const developer = {mensaje: "(✔) Desarrollador registrado con éxito!",
                           developer_id: result.insertId,
                           ...req.body};
        res.status(201).json(developer);
    })
}

// MÉTODO PUT
const updateDeveloper = (req, res) => {
    const {developer_id} = req.params;
    const {developer_name} = req.body;
    const sql = `UPDATE developers SET developer_name = ? WHERE developer_id = ?`;

    db.query(sql, [developer_name, developer_id], (error ,result) => {
        if(error){
            return res.status(500).json({error: "(❌) ERROR: Vuelva a intentarlo más tarde"});
        }
        if(result.affectedRows == 0){
            return res.status(404).json({error: "(❌) ERROR: No se encontraron los datos a actualizar"});
        }

        const developer = {mensaje: "(✔) Desarrolladora actualizada con éxito!",
                           ...req.params,
                           ...req.body};
        res.json(developer);
    })
}

// MÉTODO DELETE
const removeDeveloper = (req, res) => {
    const {developer_id} = req.params;
    const sql = `DELETE FROM developers WHERE developer_id = ?`;

    db.query(sql, [developer_id], (error, result) => {
        if(error){
            return res.status(500.20).json({error: "(❌) ERROR: Vuelva a intentarlo más tarde"});
        }
        if(result.affectedRows == 0){
            return res.status(404).json({error: "(❌) ERROR: No se encontraron los datos a eliminar"});
        }

        res.json({mensaje: "(✔) Desarrolladora eliminada con éxito!"});
    })
}


// EXPORTAR
module.exports = {
    // GET
    showEveryDeveloper,
    showOneDeveloper,
    // POST
    storeDeveloper,
    // PUT
    updateDeveloper,
    // DELETE
    removeDeveloper
}