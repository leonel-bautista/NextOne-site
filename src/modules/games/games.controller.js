
////////////// CONTROLADORES DEL MÓDULO "JUEGOS" ////

// const db = require('/@database/db');
import {conn as db} from '../../database/db.js';


// MÉTODO GET
// para todos los juegos
const showEveryGame = async (req, res) => {
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
                 GROUP BY games.game_id DESC`;

    db.query(sql, (error, result) => {
        if(error){
            return res.status(500).json({error: "(❌) ERROR: Vuelva a intentarlo más tarde"});
        }

        res.json(result);
    })
}
// para un solo juego
const showOneGame = async (req, res) => {
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

        res.json(result[0]);
    })
}
// para la información completa de un solo juego
const showOneFullGame = async (req, res) => {
    const {game_id} = req.params;
    const checkStatus = 'SELECT status FROM games WHERE game_id = ?'
    db.query(checkStatus, [game_id], (error, result) => {
        if(error){
            return res.status(500).json({error: "(❌) ERROR: Vuelva a intentarlo más tarde"});
        }
        if(result.length === 0 || result[0].status === 'inactive'){
            return res.status(404).render('404/404.view.ejs');
        }

        const sql = `
            SELECT gameInfo.game_id AS 'id',
                gameInfo.game_image AS 'image',
                gameInfo.game_name AS 'name',
                gameInfo.tags AS 'tags',
                gameInfo.platforms AS 'platforms',
                gameInfo.launch_date AS 'launch',
                gameInfo.developer AS 'developer',
                gameInfo.game_description AS 'description'
            FROM (
                SELECT games.game_id,
                    games.game_image,
                    games.game_name,
                    GROUP_CONCAT(tags.tag_name) AS 'tags',
                    gamePlatforms.platforms,
                    games.launch_date,
                    developers.developer_name AS 'developer',
                    games.game_description
                FROM games
                LEFT JOIN games_tags
                    ON games.game_id = games_tags.game_id
                LEFT JOIN tags
                    ON tags.tag_id = games_tags.tag_id
                LEFT JOIN (
                    SELECT games.game_id,
                        GROUP_CONCAT(platforms.platform_name) AS 'platforms'
                    FROM games
                    JOIN games_platforms
                        ON games.game_id = games_platforms.game_id
                    JOIN platforms
                        ON platforms.platform_id = games_platforms.platform_id
                    GROUP BY games.game_id
                    ORDER BY platforms.platform_name

                ) AS gamePlatforms
                    ON games.game_id = gamePlatforms.game_id
                LEFT JOIN developers
                    ON developers.developer_id = games.developer_id
                GROUP BY games.game_id

            ) AS gameInfo
            
            WHERE gameInfo.game_id = ?;
        `
        db.query(sql, [game_id], (error, result) => {
            if(error){
                return res.status(500).json({error: "(❌) ERROR: Vuelva a intentarlo más tarde"});
            }
            
            const game = result[0];
            res.render('games/games.view.ejs', {game})
        })
    })
}
// por nombre
const showGamesByName = async (req, res) => {
    const name = req.query.name;
    const sql = `SELECT
                    games.game_id AS 'id',
                    games.game_image AS 'image',
                    games.game_name AS 'name',
                    games.launch_date AS 'launch_date',
                    developers.developer_name AS 'developer',
                    games.game_description AS 'description',
                    games.status AS 'status'
                 FROM games
                 JOIN developers ON games.developer_id = developers.developer_id
                 WHERE games.game_name LIKE ?
                 GROUP BY games.game_name`

    db.query(sql, [`${name}%`], (error, result) => {
        if(error){
            return res.status(500).json({error: "(❌) ERROR: Vuelva a intentarlo más tarde"});
        }

        res.json(result);
    })
}
// juegos activos por nombre
const showActiveGamesByName = async (req, res) => {
    const name = req.query.name;
    const sql = `SELECT *
                 FROM (
                    SELECT * FROM games
                    WHERE status = "active"
                 ) AS active_game
                 WHERE active_game.game_name LIKE ?`

    db.query(sql, [`${name}%`], (error, result) => {
        if(error){
            return res.status(500).json({error: "(❌) ERROR: Vuelva a intentarlo más tarde"});
        }

        res.json(result);
    })
}
// los últimos agregados
const showLatestGames = async (req, res) => {
    const amount = parseInt(req.query.amount, 10);
    const sql = `SELECT
                    active_game.game_id AS 'id',
                    active_game.game_image AS 'image',
                    active_game.game_name AS 'name',
                    active_game.launch_date AS 'launch_date',
                    developers.developer_name AS 'developer',
                    active_game.game_description AS 'description',
                    active_game.status AS 'status'
                 FROM (
                    SELECT * FROM games
                    WHERE status = "active"
                    ORDER BY game_id DESC
                    LIMIT ?
                 ) AS active_game
                 JOIN developers
                    ON active_game.developer_id = developers.developer_id
                 ORDER BY active_game.game_id DESC`;

    db.query(sql, [amount], (error, result) => {
        if(error){
            return res.status(500).json({error: "(❌) ERROR: Vuelva a intentarlo más tarde"});
        }
        
        res.json(result);
    })
}
// para cierta cantidad
const showFixedAmount = async (req, res) => {
    const limit = parseInt(req.query.limit, 10);
    const offset = parseInt(req.query.offset, 10) || 0;
    const sql = `SELECT active_game.game_id AS id,
                        active_game.game_name AS name,
                        active_game.game_image AS image
                 FROM (
                    SELECT * FROM games
                    WHERE status = "active"
                    ORDER BY game_name
                    LIMIT ? OFFSET ?
                 ) AS active_game
                 ORDER BY active_game.game_name`

    db.query(sql, [limit, offset], (error, result) => {
        if(error){
            return res.status(500).json({error: "(❌) ERROR: Vuelva a intentarlo más tarde"});
        }
        
        res.json(result);
    })
}

// MÉTODO POST
const storeGame = async (req, res) => {
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

// MÉTODO PATCH
// para el estado de un juego
const patchGameStatus = async (req, res) => {
    const {game_id} = req.params;
    const {status} = req.body;
    const sql = 'UPDATE games SET status = ? WHERE game_id = ?'
    db.query(sql, [status, game_id], (error, result) => {
        if(error){
            return res.status(500).json({error: "(❌) ERROR: Vuelva a intentarlo más tarde"});
        }
        if(result.affectedRows == 0){
            return res.status(404).json({error: "(❌) ERROR: No se encontraron los datos a actualizar"});
        }

        const game = {mensaje: "(✔) Estado del juego actualizado con éxito!"};
        res.json(game);
    })
}

// MÉTODO PUT
const updateGame = async (req, res) => {
    let imageName;
    if(req.file){
        imageName = req.file.filename;
    } else{
        imageName = req.body.game_image;
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

        const game = {mensaje: "(✔) Juego actualizado con éxito!"};
        res.json(game);
    })
}

// // MÉTODO DELETE
const removeGame = async (req, res) => {
    const {game_id} = req.params;

    const sql = `DELETE FROM games WHERE game_id = ?`

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
export const methods = {
    // GET
    showEveryGame,
    showOneGame,
    showOneFullGame,
    showGamesByName,
    showActiveGamesByName,
    showLatestGames,
    showFixedAmount,
    // POST
    storeGame,
    // PATCH
    patchGameStatus,
    // PUT
    updateGame,
    // DELETE
    removeGame
}