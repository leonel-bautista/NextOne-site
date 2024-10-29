
////////////// CONTROLADORES DEL MÓDULO "ÁREAS" ////

const db = require('/@database/db');


// MÉTODO GET
// para todas las areas
const showEveryArea = (req, res) => {
    const sql = `SELECT * FROM areas`;

    db.query(sql, (error, result) => {
        if(error){
            return res.status(500).json({error: "(❌) ERROR: Vuelva a intentarlo más tarde"});
        }

        res.json(result);
    })
}
// para una sola area
const showOneArea = (req, res) => {
    const {area_id} = req.params;
    const sql = `SELECT * FROM areas WHERE area_id = ?`;

    db.query(sql, [area_id], (error, result) => {
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
const storeArea = (req, res) => {
    const {area_name} = req.body;
    const sql = `INSERT INTO areas (area_name) VALUES (?)`;

    db.query(sql, [area_name], (error, result) => {
        if(error){
            return res.status(500).json({error: "(❌) ERROR: Vuelva a intentarlo más tarde"});
        }

        const area = {mensaje: "(✔) Area registrada con éxito!",
                      area_id: result.insertId,
                      ...req.body};
        res.status(201).json(area);
    })
}

// MÉTODO PUT
const updateArea = (req, res) => {
    const {area_id} = req.params;
    const {area_name} = req.body;
    const sql = `UPDATE areas SET area_name = ? WHERE area_id = ?`;

    db.query(sql, [area_name, area_id], (error, result) => {
        if(error){
            return res.status(500).json({error: "(❌) ERROR: Vuelva a intentarlo más tarde"});
        }
        if(result.affectedRows = 0){
            return res.status(404).json({error: "(❌) ERROR: No se encontraron los datos a actualizar"});
        }

        const tier = {mensaje: "(✔) Area actualizada con éxito!",
                      ...req.params,
                      ...req.body};
        res.json(tier);
    })
}

// MÉTODO DELETE
const removeArea = (req, res) => {
    const {area_id} = req.params;
    const sql = `DELETE FROM tiers WHERE area_id = ?`;

    db.query(sql, [area_id], (error, result) => {
        if(error){
            return res.status(500).json({error: "(❌) ERROR: Vuelva a intentarlo más tarde"});
        }
        if(result.affectedRows == 0){
            return res.status(404).json({error: "(❌) ERROR: No se encontraron los datos a eliminar"});
        }

        res.json({mensaje: "(✔) Area eliminada con éxito!"});
    })
}


// EXPORTAR
module.exports = {
    // GET
    showEveryArea,
    showOneArea,
    // POST
    storeArea,
    // PUT
    updateArea,
    // DELETE
    removeArea
}