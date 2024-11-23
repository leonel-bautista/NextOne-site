
////////////// CONTROLADORES DEL MÓDULO "JUEGOS" ////

const db = require('../../database/db');


// MÉTODO GET
// para todos los juegos
const showEveryGame = (req, res) => {
    const sql = `SELECT * FROM games`;

    db.query(sql, (error, result) => {
        if(error){
            return res.status(500).json({error: "(❌) ERROR: Vuelva a intentarlo más tarde"});
        }

        res.json(result);
    })
}
// para un solo juego
const showOneGame = (req, res) => {
    const {game_id} = req.params;
    const sql = `SELECT * FROM games WHERE game_id = ?`;

    db.query(sql, [game_id], (error, result) => {
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
const storeGame = (req, res) => {
    let imageName = "";
    if(req.file){
        imageName = req.file.filename;
    };
    const {game_name, launch_date, developer_id, game_description, status} = req.body;
    const sql = `INSERT INTO games (game_image, game_name, launch_date, developer_id, game_description, status)
                 VALUES (?,?,?,?,?,?)`;

    db.query(sql, [imageName, game_name, launch_date, developer_id, game_description, status], (error, result) => {
        if(error){
            return res.status(500).json({error: "(❌) ERROR: Vuelva a intentarlo más tarde"});
        }

        const game = {mensaje: "(✔) Juego registrado con éxito!",
                      game_id: result.insertId,
                      game_image: req.file.filename,
                      ...req.body};
        res.status(201).json(game);
    })
}

// MÉTODO PUT
const updateGame = (req, res) => {
    let imageName = "";
    if(req.file){
        imageName = req.file.filename;
    }
    const {game_id} = req.params;
    const {game_name, launch_date, developer_id, game_description, status} = req.body;
    const sql = `UPDATE games
                 SET game_image = ?, game_name = ?, launch_date = ?, developer_id = ?, game_description = ?, status = ?
                 WHERE game_id = ?`;

    db.query(sql, [imageName, game_name, launch_date, developer_id, game_description, status, game_id], (error, result) => {
        if(error){
            return res.status(500).json({error: "(❌) ERROR: Vuelva a intentarlo más tarde"});
        }
        if(result.affectedRows == 0){
            return res.status(404).json({error: "(❌) ERROR: No se encontraron los datos a actualizar"});
        }

        const game = {mensaje: "(✔) Juego actualizado con éxito!",
                      ...req.params,
                      game_image: req.file.filename,
                      ...req.body};
        res.json(game);
    })
}

// MÉTODO DELETE
const removeGame = (req, res) => {
    const {game_id} = req.params;
    const sql = `DELETE FROM games WHERE game_id = ?`;

    db.query(sql, [game_id], (error, result) => {
        if(error){
            return res.status(500).json({error: "(❌) ERROR: Vuelva a intentarlo más tarde"});
        }
        if(result.affectedRows == 0){
            return res.status(404).json({error: "(❌) ERROR: No se encontraron los datos a eliminar"});
        }

        res.json({mensaje: "(✔) Juego eliminado con éxito"});
    })
}


// EXPORTAR
module.exports = {
    // GET
    showEveryGame,
    showOneGame,
    // POST
    storeGame,
    // PUT
    updateGame,
    // DELETE
    removeGame,
}