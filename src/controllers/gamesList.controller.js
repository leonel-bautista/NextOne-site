// CONTROLADORES DEL MODULO //

const db = require('../db/db')


// METODO GET
// para toda la lista de juegos  // gracias a: https://stackoverflow.com/questions/46224992/sql-query-multiple-values-of-same-column-in-one-row
const showFullList = (req, res) => {
    const sql = `
        SELECT gameInfo.game_id AS 'ID',
               gameInfo.image AS 'Image',
               gameInfo.game_name AS 'Name',
               gameInfo.tags AS 'Tags',
               gameInfo.platforms AS 'AvailablePlatforms',
               gameInfo.launch_date AS 'LaunchDate',
               gameInfo.developer AS 'Developer'
        FROM (
            SELECT games.game_id,
                   games.image,
                   games.game_name,
                   GROUP_CONCAT(tags.tag_name) AS 'tags',
                   gamePlatforms.platforms,
                   games.launch_date,
                   developers.developer_name AS 'developer'
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
// para una fila
const showOneRow = (req, res) => {
    const {game_id} = req.params;
    const sql = `
        SELECT gameInfo.game_id AS 'ID',
               gameInfo.image AS 'Image',
               gameInfo.game_name AS 'Name',
               gameInfo.tags AS 'Tags',
               gameInfo.platforms AS 'AvailablePlatforms',
               gameInfo.launch_date AS 'LaunchDate',
               gameInfo.developer AS 'Developer'
        FROM (
            SELECT games.game_id,
                   games.image,
                   games.game_name,
                   GROUP_CONCAT(tags.tag_name) AS 'tags',
                   gamePlatforms.platforms,
                   games.launch_date,
                   developers.developer_name AS 'developer'
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


// EXPORTAR
module.exports = {
    showFullList,
    showOneRow
};