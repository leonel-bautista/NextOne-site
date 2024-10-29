
////////////// RUTAS DEL MÓDULO "JUEGO-ETIQUETA" ////

const express = require('express');
const router = express.Router();

const controller = require('./games-tags.controller');


// MÉTODO GET
// para todos los juegos-etiquetas
router.get('/db-table-raw', controller.showEveryGameTag);
// para un solo juego-etiqueta
router.get('/db-table-raw/:game_tag_id', controller.showOneGameTag);

// MÉTODO POST
router.post('/db-table-raw', controller.storeGameTag);

// MÉTODO PUT
router.put('/db-table-raw/:game_tag_id', controller.updateGameTag);


// EXPORTAR
module.exports = router;