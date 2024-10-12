const db = require('../db/db')

// METODO GET
// para todos los juegos  // gracias a: https://stackoverflow.com/questions/46224992/sql-query-multiple-values-of-same-column-in-one-row
const showEveryGame = (req, res) => {
    const sql = `
        SELECT gameInfo.game_id as 'ID',
               gameInfo.image as 'Image',
               gameInfo.game_name as 'Name',
               gameInfo.tags as 'Tags',
               gameInfo.platforms as 'AvailablePlatforms',
               gameInfo.launch_date as 'LaunchDate',
               gameInfo.developer as 'Developer'
        FROM (
            SELECT games.game_id,
                   games.image,
                   games.game_name,
                   GROUP_CONCAT(tags.tag_name) as 'tags',
                   gamePlatforms.platforms,
                   games.launch_date,
                   developers.developer_name as 'developer'
            FROM games_tags
            JOIN games
                ON games.game_id = games_tags.game_id
            JOIN tags
                ON tags.tag_id = games_tags.tag_id
            JOIN (
                SELECT games.game_id,
                       GROUP_CONCAT(platforms.platform_name) as 'platforms'
                FROM games_platforms
                JOIN games
                    ON games.game_id = games_platforms.game_id
                JOIN platforms
                    ON platforms.platform_id = games_platforms.platform_id
                GROUP BY games.game_id
                ORDER BY platforms.platform_name

            ) as gamePlatforms
                ON games.game_id = gamePlatforms.game_id
            JOIN developers
                ON developers.developer_id = games.developer_id
            GROUP BY games.game_id

        ) as gameInfo;
    `;

    db.query(sql, (error, rows) => {
        if(error){
            return res.status(500).json({error: "❌ERROR: Vuelva a intentarlo más tarde"});
        }

        res.json(rows);
    });
};
// para un juego    // cambié la consulta a una más simple por problemas con el POST y PUT
const showOneGame = (req, res) => {
    const {game_id} = req.params;
    const sql = `
        SELECT * FROM games WHERE game_id = ?
    `;

    db.query(sql, [game_id], (error, rows) => {
        if(error){
            return res.status(500).json({error: "❌ERROR: Vuelva a intentarlo más tarde"});
        }
        if(rows.length == 0){{
            return res.status(404).send({error: "❌ERROR: No se encontraron resultados"});
        }}

        res.json(rows[0]);
    });
};

// METODO POST  // no sé cómo insertar todos los datos necesarios a la vez, así que solo inserto en la tabla "games"
const storeGame = (req, res) => {
    const {image, game_name, launch_date, developer_id} = req.body;
    const sql = `
        INSERT INTO games (
            image,
            game_name,
            launch_date,
            developer_id
        )
        VALUES (?, ?, ?, ?)
    `;

    db.query(sql, [image, game_name, launch_date, developer_id], (error, result) => {
        console.log(result);
        if(error){
            return res.status(500).send({error: "❌ERROR: Vuelva a intentarlo más tarde"})
        }

        const game = {...req.body, id: result.insertId};
        res.status(201).json(game);
    });
};

// METODO PUT   // lo mismo que mencioné en el método POST sobre los datos
const updateGame = (req, res) => {
    const {game_id} = req.params;
    const {image, game_name, launch_date, developer_id} = req.body;
    const sql = `
        UPDATE games SET
            image = ?,
            game_name = ?,
            launch_date = ?, 
            developer_id = ?
        WHERE game_id = ?
    `;

    db.query(sql, [image, game_name, launch_date, developer_id, game_id], (error, result) => {
        console.log(result);
        if(error){
            return res.status(500).send({error: "❌ERROR: Vuelva a intentarlo más tarde"})
        }
        if(result.affectedRows == 0){
            return res.status(404).send({error: "❌ERROR: No se encontraron resultados"});
        }

        const game = {...req.body, ...req.params};
        res.json(game);
    })
}

// METODO DELETE
const removeGame = (req, res) => {
    const {game_id} = req.params;
    const sql = `
        DELETE FROM games WHERE game_id = ?
    `;

    db.query(sql, [game_id], (error, result) => {
        if(error){
            return res.status(500).send({error: "❌ERROR: Vuelva a intentarlo más tarde"})
        }
        if(result.affectedRows == 0){
            return res.status(404).send({error: "❌ERROR: No se encontraron resultados"});
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
};