
////////////// RUTAS DEL MÓDULO "PLATAFORMAS" ////

const express = require('express');
const router = express.Router();

const controller = require('./platforms.controller');


// MÉTODO GET
// para todas las plataformas
router.get('/db-table-raw', controller.showEveryPlatform);
// para una sola plataforma
router.get('/db-table-raw/:platform_id', controller.showOnePlatform)

// MÉTODO POST
router.post('/db-table-raw', controller.storePlatform);

// MÉTODO PUT
router.put('/db-table-raw/:platform_id', controller.updatePlatform);

// MÉTODO DELETE
router.delete('/db-table-raw/:platform_id', controller.removePlatform);


// EXPORTAR
module.exports = router;