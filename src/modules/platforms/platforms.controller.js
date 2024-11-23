
////////////// CONTROLADORES DEL MÓDULO "PLATAFORMAS" ////

const db = require('../../database/db');


// MÉTODO GET
// para todas las plataformas
const showEveryPlatform = (req, res) => {
    const sql = `SELECT * FROM platforms`;

    db.query(sql, (error, result) => {
        if(error){
            return res.status(500).json({error: "(❌) ERROR: Vuelva a intentarlo más tarde"});
        }

        res.json(result);
    })
}
// para una sola plataforma
const showOnePlatform = (req, res) => {
    const {platform_id} = req.params;
    const sql = `SELECT * FROM platforms WHERE platform_id = ?`;

    db.query(sql, [platform_id], (error, result) => {
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
const storePlatform = (req, res) => {
    const {platform_name} = req.body;
    const sql = `INSERT INTO platforms (platform_name) VALUES (?)`;

    db.query(sql, [platform_name], (error, result) => {
        if(error){
            return res.status(500).jason({error: "(❌) ERROR: Vuelva a intentarlo más tarde"});
        }

        const platform = {mensaje: "(✔) Plataforma registrada con éxito!",
                          platform_id: result.insertId,
                          ...req.body};
        res.status(201).json(platform);
    })
}

// MÉTODO PUT
const updatePlatform = (req, res) => {
    const {platform_id} = req.params;
    const {platform_name} = req.body;
    const sql = `UPDATE platforms SET platform_name = ? WHERE platform_id = ?`;

    db.query(sql, [platform_name, platform_id], (error, result) => {
        if(error){
            return res.status(500).json({error: "(❌) ERROR: Vuelva a intentarlo más tarde"});
        }
        if(result.affectedRows == 0){
            return res.status(404).json({error: "(❌) ERROR: No se encontraron los datos a actualizar"});
        }

        const platform = {mensaje: "(✔) Plataforma actualizada con éxito!",
                          ...req.params,
                          ...req.body};
        res.json(platform);
    })
}

// MÉTODO DELETE
const removePlatform = (req, res) => {
    const {platform_id} = req.params;
    const sql = `DELETE FROM platforms WHERE platform_id = ?`;

    db.query(sql, [platform_id], (error, result) => {
        if(error){
            return res.status(500).json({error: "(❌)ERROR: Vuelva a intentarlo más tarde"});
        }
        if(result.affectedRows == 0){
            return res.status(404).json({error: "(❌)ERROR: No se encontraron los datos a eliminar"});
        }

        res.json({mensaje: "(✔) Plataforma eliminada con éxito!"});
    })
}


// EXPORTAR
module.exports = {
    // GET
    showEveryPlatform,
    showOnePlatform,
    // POST
    storePlatform,
    // PUT
    updatePlatform,
    // DELETE
    removePlatform
}