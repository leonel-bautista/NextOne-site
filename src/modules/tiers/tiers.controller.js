
////////////// CONTROLADORES DEL MÓDULO "NIVELES" ////

const db = require('../../database/db');


// MÉTODO GET
// para todas los niveles
const showEveryTier = (req, res) => {
    const sql = `SELECT * FROM tiers`;

    db.query(sql, (error, result) => {
        if(error){
            return res.status(500).json({error: "(❌) ERROR: Vuelva a intentarlo más tarde"});
        }

        res.json(result);
    })
}
// para un solo nivel
const showOneTier = (req, res) => {
    const {tier_id} = req.params;
    const sql = `SELECT * FROM tiers WHERE tier_id = ?`;

    db.query(sql, [tier_id], (error, result) => {
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
const storeTier = (req, res) => {
    const {tier_name, tier_description} = req.body;
    const sql = `INSERT INTO tiers (tier_name, tier_description) VALUES (?,?)`;

    db.query(sql, [tier_name, tier_description], (error, result) => {
        if(error){
            return res.status(500).json({error: "(❌) ERROR: Vuelva a intentarlo más tarde"});
        }

        const tier = {mensaje: "(✔) Nivel registrada con éxito!",
                      tier_id: result.insertId,
                      ...req.body};
        res.status(201).json(tier);
    })
}

// MÉTODO PUT
const updateTier = (req, res) => {
    const {tier_id} = req.params;
    const {tier_name, tier_description} = req.body;
    const sql = `UPDATE tiers SET tier_name = ?, tier_description = ? WHERE tier_id = ?`;

    db.query(sql, [tier_name, tier_description, tier_id], (error, result) => {
        if(error){
            return res.status(500).json({error: "(❌) ERROR: Vuelva a intentarlo más tarde"});
        }
        if(result.affectedRows = 0){
            return res.status(404).json({error: "(❌) ERROR: No se encontraron los datos a actualizar"});
        }

        const tier = {mensaje: "(✔) Nivel actualizado con éxito!",
                      ...req.params,
                      ...req.body};
        res.json(tier);
    })
}

// MÉTODO DELETE
const removeTier = (req, res) => {
    const {tier_id} = req.params;
    const sql = `DELETE FROM tiers WHERE tier_id = ?`;

    db.query(sql, [tier_id], (error, result) => {
        if(error){
            return res.status(500).json({error: "(❌)ERROR: Vuelva a intentarlo más tarde"});
        }
        if(result.affectedRows == 0){
            return res.status(404).json({error: "(❌)ERROR: No se encontraron los datos a eliminar"});
        }

        res.json({mensaje: "(✔) Nivel eliminado con éxito!"});
    })
}


// EXPORTAR
module.exports = {
    // GET
    showEveryTier,
    showOneTier,
    // POST
    storeTier,
    // PUT
    updateTier,
    // DELETE
    removeTier
}