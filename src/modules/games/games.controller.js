
////////////// CONTROLADORES DEL MÓDULO "JUEGOS" ////

// const db = require('/@database/db');
import {conn as db} from '../../database/db.js';


// MÉTODO GET
// para todos los juegos
async function showEveryGame(req, res){
    const sql = `SELECT
                    games.game_id AS 'id',
                    games.game_image AS 'image',
                    games.game_name AS 'name',
                    games.launch_date AS 'launch_date',
                    developers.developer_name AS 'developer',
                    games.game_description AS 'description',
                    games.status AS 'status'
                 FROM games
                 JOIN developers
                    ON games.developer_id = developers.developer_id
                 GROUP BY games.game_id`;

    db.query(sql, (error, result) => {
        if(error){
            return res.status(500).json({error: "(❌) ERROR: Vuelva a intentarlo más tarde"});
        }

        res.send(result);
    })
}
// para un solo juego
async function showOneGame(req, res){
    const {game_id} = req.params;
    const sql = `SELECT
                    games.game_id AS 'id',
                    games.game_image AS 'image',
                    games.game_name AS 'name',
                    games.launch_date AS 'launch_date',
                    games.developer_id AS 'developer',
                    games.game_description AS 'description',
                    games.status AS 'status'
                 FROM games WHERE game_id = ?`;

    db.query(sql, [game_id], (error, result) => {
        if(error){
            return res.status(500).json({error: "(❌) ERROR: Vuelva a intentarlo más tarde"});
        }
        if(result.length == 0){
            return res.status(404).json({error: "(❌) ERROR: No se encontraron resultados"});
        }

        res.send(result);
    })
}

// MÉTODO POST
async function storeGame(req, res){
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
                      ...req.file,
                      ...req.body};
        res.status(201).json(game);
    })
}

// MÉTODO PUT
async function updateGame(req, res){
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
                      ...req.file,
                      ...req.body};
        res.json(game);
    })
}

// // MÉTODO DELETE
async function removeGame(req, res){
    const {game_id} = req.params;

    const sql = `DELETE FROM games WHERE game_id = ?`

    db.query(sql, [game_id], (error, result) => {
        if(error){
            return res.status(500).json({error: "(❌) ERROR: Vuelva a intentarlo más tarde"});
        }
        if(result.affectedRows == 0){
            return res.status(404).json({error: "(❌) ERROR: No se encontraron los datos a eliminar"});
        }

        res.send({mensaje: "(✔) Juego eliminado con éxito"});
    })
}


// EXPORTAR
export const methods = {
    showEveryGame,
    showOneGame,
    storeGame,
    updateGame,
    removeGame
}