// CONTROLADORES DEL MODULO //

const db = require('../db/db');


// METODO GET
// para todas las etiquetas
const showEveryTag = (req, res) => {
    const sql = `SELECT * FROM tags`;

    db.query(sql, (error, result) => {
        if(error){
            return res.status(500).json({error: "(❌) ERROR: Vuelva a intentarlo más tarde"});
        }

        res.json(result);
    })
}
// para una sola etiqueta
const showOneTag = (req, res) => {
    const {tag_id} = req.params;
    const sql = `SELECT * FROM tags WHERE tag_id = ?`;

    db.query(sql, [tag_id], (error, result) => {
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
const storeTag = (req, res) => {
    const {tag_name} = req.body;
    const sql = `INSERT INTO tags (tag_name) VALUES (?)`;

    db.query(sql, [tag_name], (error, result) => {
        if(error){
            return res.status(500).json({error: "(❌) ERROR: Vuelva a intentarlo más tarde"});
        }

        const tag = {
                        mensaje: "(✔) Etiqueta registrada con éxito!",
                        tag_id: result.insertId,
                        ...req.body
                    };
        res.status(201).json(tag);
    })
}

// METODO PUT
const updateTag = (req, res) => {
    const {tag_id} = req.params;
    const {tag_name} = req.body;
    const sql = `UPDATE tags SET tag_name = ? WHERE tag_id = ?`;

    db.query(sql, [tag_name, tag_id], (error, result) => {
        if(error){
            return res.status(500).json({error: "(❌) ERROR: Vuelva a intentarlo más tarde"});
        }
        if(result.affectedRows = 0){
            return res.status(404).json({error: "(❌) ERROR: No se encontraron los datos a actualizar"});
        }

        const tag = {
                        mensaje: "(✔) Etiqueta actualizada con éxito!",
                        ...req.params,
                        ...req.body
                    };
        res.json(tag);
    })
}

// METODO DELETE
const removeTag = (req, res) => {
    const {tag_id} = req.params;
    const sql = `DELETE FROM tags WHERE tag_id = ?`;

    db.query(sql, [tag_id], (error, result) => {
        if(error){
            return res.status(500).json({error: "(❌)ERROR: Vuelva a intentarlo más tarde"});
        }
        if(result.affectedRows == 0){
            return res.status(404).json({error: "(❌)ERROR: No se encontraron los datos a eliminar"});
        }

        res.json({mensaje: "(✔) Etiqueta eliminada con éxito!"});
    })
}


// EXPORT
module.exports = {
    showEveryTag,
    showOneTag,
    storeTag,
    updateTag,
    removeTag
}