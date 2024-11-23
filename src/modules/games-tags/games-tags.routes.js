
////////////// RUTAS DEL MÓDULO "JUEGO-ETIQUETA" ////

const express = require('express');
const router = express.Router();

const controller = require('./games-tags.controller');


// MÉTODO GET
// para todos los juegos-etiquetas
router.get('/', controller.showEveryGameTag);
// para un solo juego-etiqueta
router.get('/:game_tag_id', controller.showOneGameTag);

// MÉTODO POST
router.post('/', controller.storeGameTag);

// MÉTODO PUT
router.put('/:game_tag_id', controller.updateGameTag);


// EXPORTAR
module.exports = router;