
////////////// CONTROLADORES DEL MÓDULO "JUEGO-ETIQUETA" ////

const db = require('../../database/db');


// METODO GET
// para todos los juegos-etiquetas
const showEveryGameTag = (req, res) => {
    const sql = `SELECT * FROM games_tags`;

    db.query(sql, (error, result) => {
        if(error){
            return res.status(500).json({error: "(❌) ERROR: Vuelva a intentarlo más tarde"});
        }

        res.json(result);
    })
}
// para un solo juego-etiqueta
const showOneGameTag = (req, res) => {
    const {game_tag_id} = req.params;
    const sql = `SELECT * FROM games_tags WHERE game_tag_id = ?`;

    db.query(sql, [game_tag_id], (error, result) => {
        if(error){
            return res.status(500).json({error: "(❌) ERROR: Vuelva a intentarlo más tarde"});
        }
        if(result.length == 0){
            return res.status(404).json({error: "(❌) ERROR: No se encontraron resultados"});
        }

        res.json(result[0]);
    })
}

// METODO POST
const storeGameTag = (req, res) => {
    const {game_id, tag_id} = req.body;
    const sql = `INSERT INTO games_tags (game_id, tag_id) VALUES (?,?)`;

    db.query(sql, [game_id, tag_id], (error, result) => {
        if(error){
            return res.status(500).json({error: "(❌) ERROR: Vuelva a intentarlo más tarde"});
        }

        const gameTag = {mensaje: "(✔) Juego-Etiqueta registrado con éxito!",
                         game_tag_id: result.insertId,
                         ...req.body};
        res.status(201).json(gameTag);
    })
}

// METODO PUT
const updateGameTag = (req, res) => {
    const {game_tag_id} = req.params;
    const {game_id, tag_id} = req.body;
    const sql = `UPDATE games_tags SET game_id = ?, tag_id = ? WHERE game_tag_id = ?`;

    db.query(sql, [game_id, tag_id, game_tag_id], (error, result) => {
        if(error){
            return res.status(500).json({error: "(❌) ERROR: Vuelva a intentarlo más tarde"});
        }
        if(result.affectedRows == 0){
            return res.status(404).json({error: "(❌) ERROR: No se encontraron los datos a actualizar"});
        }

        const gameTag = {mensaje: "(✔) Juego-Etiqueta actualizado con éxito!",
                         ...req.params,
                         ...req.body};
        res.json(gameTag);
    })
}


// EXPORTAR
module.exports = {
    // GET
    showEveryGameTag,
    showOneGameTag,
    // POST
    storeGameTag,
    // PUT
    updateGameTag
}