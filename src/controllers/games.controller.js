// CONTROLADORES DEL MODULO //

const db = require('../db/db');


// METODO GET
// para todos los juegos
const showEveryGame = (req, res) => {
    const sql = `SELECT * FROM games`;

    db.query(sql, (error, rows) => {
        if(error){
            return res.status(500).json({error: "(❌)ERROR: Vuelva a intentarlo más tarde"});
        }
        res.json(rows);
    })
}
// para un solo juego
const showOneGame = (req, res) => {
    const {game_id} = req.params;
    const sql = `SELECT * FROM games WHERE game_id = ?`;

    db.query(sql, [game_id], (error, rows) => {
        if(error){
            return res.status(500).json({error: "(❌)ERROR: Vuelva a intentarlo más tarde"});
        }
        if(rows.length == 0){
            return res.status(404).json({error: "(❌)ERROR: No se encontraron resultados"});
        }
        res.json(rows[0]);
    })
}
// METODO POST
const storeGame = (req, res) => {
    let imageName = "";
    if(req.file){
        imageName = req.file.filename;
    };
    const {game_name, launch_date, developer_id} = req.body;
    const sql = `INSERT INTO games (image, game_name, launch_date, developer_id) VALUES (?,?,?,?)`;

    db.query(sql, [imageName, game_name, launch_date, developer_id], (error, result) => {
        if(error){
            return res.status(500).json({error: "(❌)ERROR: Vuelva a intentarlo más tarde"});
        }
        const game = {game_id: result.insertId, image: imageName, ...req.body};
        res.status(201).json(game);
    })
}

// METODO PUT
const updateGame = (req, res) => {
    let imageName = "";
    if(req.file){
        imageName = req.file.filename;
    }
    const {game_id} = req.params;
    const {game_name, launch_date, developer_id} = req.body;
    const sql = `UPDATE games SET image = ?, game_name = ?, launch_date = ?, developer_id = ? WHERE game_id = ?`;

    db.query(sql, [imageName, game_name, launch_date, developer_id, game_id], (error, result) => {
        if(error){
            return res.status(500).json({error: "(❌)ERROR: Vuelva a intentarlo más tarde"});
        }
        if(result.affectedRows == 0){
            return res.status(404).json({error: "(❌)ERROR: No se encontraron los datos a actualizar"});
        }
        const game = {...req.params, image: imageName, ...req.body};
        res.json(game);
    })
}

// METODO DELETE
const removeGame = (req, res) => {
    const {game_id} = req.params;
    const sql = `DELETE FROM games WHERE game_id = ?`;

    db.query(sql, [game_id], (error, result) => {
        if(error){
            return res.status(500).json({error: "(❌)ERROR: Vuelva a intentarlo más tarde"});
        }
        if(result.affectedRows == 0){
            return res.status(404).json({error: "(❌)ERROR: No se encontraron los datos a eliminar"})
        }
        res.json({mensaje: "✅ Juego eliminado con éxito"});
    })
}


// EXPORTAR
module.exports = {
    showEveryGame,
    showOneGame,
    storeGame,
    updateGame,
    removeGame
}