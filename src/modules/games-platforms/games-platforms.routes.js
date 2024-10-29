
////////////// RUTAS DEL MÓDULO "JUEGO-PLATAFORMA" ////

const express = require('express');
const router = express.Router();

const controller = require('./games-platforms.controller');


// MÉTODO GET
// para todos los juegos-plataformas
router.get('/db-table-raw', controller.showEveryGamePlatform);
// para un solo juego-plataforma
router.get('/db-table-raw/:game_platform_id', controller.showOneGamePlatform);

// MÉTODO POST
router.post('/db-table-raw', controller.storeGamePlatform);

// MÉTODO PUT
router.put('/db-table-raw/:game_platform_id', controller.updateGamePlatform);


// EXPORTAR
module.exports = router;