
////////////// CONTROLADORES DEL MÓDULO "JUEGO-PLATAFORMA" ////

const db = require('../../database/db');


// MÉTODO GET
// para todos los juegos-plataformas
const showEveryGamePlatform = (req, res) => {
    const sql = `SELECT * FROM games_platforms`;

    db.query(sql, (error, result) => {
        if(error){
            return res.status(500).json({error: "(❌) ERROR: Vuelva a intentarlo más tarde"});
        }

        res.json(result);
    })
}
// para un solo juego-plataforma
const showOneGamePlatform = (req, res) => {
    const {game_platform_id} = req.params;
    const sql = `SELECT * FROM games_platforms WHERE game_platform_id = ?`;

    db.query(sql, [game_platform_id], (error, result) => {
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
const storeGamePlatform = (req, res) => {
    const {game_id, platform_id} = req.body;
    const sql = `INSERT INTO games_platforms (game_id, platform_id) VALUES (?,?)`;

    db.query(sql, [game_id, platform_id], (error, result) => {
        if(error){
            return res.status(500).json({error: "(❌) ERROR: Vuelva a intentarlo más tarde"});
        }

        const gamePlatform = {mensaje: "(✔) Juego-Plataforma registrado con éxito!",
                              game_platform_id: result.insertId,
                              ...req.body};
        res.status(201).json(gamePlatform);
    })
}

// MÉTODO PUT
const updateGamePlatform = (req, res) => {
    const {game_platform_id} = req.params;
    const {game_id, platform_id} = req.body;
    const sql = `UPDATE games_platforms SET game_id = ?, platform_id = ? WHERE game_platform_id = ?`;

    db.query(sql, [game_id, platform_id, game_platform_id], (error, result) => {
        if(error){
            return res.status(500).json({error: "(❌) ERROR: Vuelva a intentarlo más tarde"});
        }
        if(result.affectedRows == 0){
            return res.status(404).json({error: "(❌) ERROR: No se encontraron los datos a actualizar"});
        }

        const gamePlatform = {mensaje: "(✔) Juego-Plataforma actualizado con éxito!",
                              ...req.params,
                              ...req.body};
        res.json(gamePlatform);
    })
}


// EXPORTAR
module.exports = {
    // GET
    showEveryGamePlatform,
    showOneGamePlatform,
    // POST
    storeGamePlatform,
    // PUT
    updateGamePlatform
}