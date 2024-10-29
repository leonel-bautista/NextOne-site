
////////////// CONTROLADORES DEL MÓDULO "JUEGOS" ////

const db = require('/@database/db');


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
// para la información completa de todos los juegos
const showFullList = (req, res) => {
    const sql = `
        SELECT gameInfo.game_id AS 'ID',
               gameInfo.game_image AS 'Image',
               gameInfo.game_name AS 'Name',
               gameInfo.tags AS 'Tags',
               gameInfo.platforms AS 'AvailablePlatforms',
               gameInfo.launch_date AS 'LaunchDate',
               gameInfo.developer AS 'Developer',
               gameInfo.game_description AS 'Description'
        FROM (
            SELECT games.game_id,
                   games.game_image,
                   games.game_name,
                   GROUP_CONCAT(tags.tag_name) AS 'tags',
                   gamePlatforms.platforms,
                   games.launch_date,
                   developers.developer_name AS 'developer',
                   games.game_description
            FROM games_tags
            JOIN games
                ON games.game_id = games_tags.game_id
            JOIN tags
                ON tags.tag_id = games_tags.tag_id
            JOIN (
                SELECT games.game_id,
                       GROUP_CONCAT(platforms.platform_name) AS 'platforms'
                FROM games_platforms
                JOIN games
                    ON games.game_id = games_platforms.game_id
                JOIN platforms
                    ON platforms.platform_id = games_platforms.platform_id
                GROUP BY games.game_id
                ORDER BY platforms.platform_name

            ) AS gamePlatforms
                ON games.game_id = gamePlatforms.game_id
            JOIN developers
                ON developers.developer_id = games.developer_id
            GROUP BY games.game_id

        ) AS gameInfo;
    `;

    db.query(sql, (error, result) => {
        if(error){
            return res.status(500).json({error: "(❌) ERROR: Vuelva a intentarlo más tarde"});
        }

        res.json(result);
    });
};
// para la información completa de un solo juego
const showOneFull = (req, res) => {
    const {game_id} = req.params;
    const sql = `
        SELECT gameInfo.game_id AS 'ID',
               gameInfo.game_image AS 'Image',
               gameInfo.game_name AS 'Name',
               gameInfo.tags AS 'Tags',
               gameInfo.platforms AS 'AvailablePlatforms',
               gameInfo.launch_date AS 'LaunchDate',
               gameInfo.developer AS 'Developer',
               gameInfo.game_description AS 'Description'
        FROM (
            SELECT games.game_id,
                   games.game_image,
                   games.game_name,
                   GROUP_CONCAT(tags.tag_name) AS 'tags',
                   gamePlatforms.platforms,
                   games.launch_date,
                   developers.developer_name AS 'developer',
                   games.game_description
            FROM games_tags
            JOIN games
                ON games.game_id = games_tags.game_id
            JOIN tags
                ON tags.tag_id = games_tags.tag_id
            JOIN (
                SELECT games.game_id,
                       GROUP_CONCAT(platforms.platform_name) AS 'platforms'
                FROM games_platforms
                JOIN games
                    ON games.game_id = games_platforms.game_id
                JOIN platforms
                    ON platforms.platform_id = games_platforms.platform_id
                GROUP BY games.game_id
                ORDER BY platforms.platform_name

            ) AS gamePlatforms
                ON games.game_id = gamePlatforms.game_id
            JOIN developers
                ON developers.developer_id = games.developer_id
            GROUP BY games.game_id

        ) AS gameInfo

        WHERE gameInfo.game_id = ?;
    `;

    db.query(sql, [game_id], (error, result) => {
        if(error){
            return res.status(500).json({error: "(❌) ERROR: Vuelva a intentarlo más tarde"});
        }
        if(result.length == 0){{
            return res.status(404).send({error: "(❌) ERROR: No se encontraron resultados"});
        }}

        res.json(result[0]);
    });
};

// MÉTODO POST
const storeGame = (req, res) => {
    let imageName = "";
    if(req.file){
        imageName = req.file.filename;
    };
    const {game_name, launch_date, developer_id, game_description} = req.body;
    const sql = `INSERT INTO games (game_image, game_name, launch_date, developer_id, game_description)
                 VALUES (?,?,?,?,?)`;

    db.query(sql, [imageName, game_name, launch_date, developer_id, game_description], (error, result) => {
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
const updateGame = (req, res) => {
    let imageName = "";
    if(req.file){
        imageName = req.file.filename;
    }
    const {game_id} = req.params;
    const {game_name, launch_date, developer_id, game_description} = req.body;
    const sql = `UPDATE games
                 SET game_image = ?, game_name = ?, launch_date = ?, developer_id = ?, game_description = ?
                 WHERE game_id = ?`;

    db.query(sql, [imageName, game_name, launch_date, developer_id, game_description, game_id], (error, result) => {
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
    showFullList,
    showOneFull,
    // POST
    storeGame,
    // PUT
    updateGame,
    // DELETE
    removeGame,
}