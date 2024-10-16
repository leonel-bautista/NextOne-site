// RUTAS DEL MODULO //

const express = require('express');
const router = express.Router();

const controller = require('../controllers/gamesList.controller');


// METODO GET
// para toda ls lista de juegos
router.get('/', controller.showFullList);
// para una fila
router.get('/:game_id', controller.showOneRow);


// EXPORTAR
module.exports = router;