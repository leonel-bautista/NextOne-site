
////////////// RUTAS DEL MÓDULO "PLATAFORMAS" ////

const express = require('express');
const router = express.Router();

const controller = require('./platforms.controller');


// MÉTODO GET
// para todas las plataformas
router.get('/', controller.showEveryPlatform);
// para una sola plataforma
router.get('/:platform_id', controller.showOnePlatform)

// MÉTODO POST
router.post('/', controller.storePlatform);

// MÉTODO PUT
router.put('/:platform_id', controller.updatePlatform);

// MÉTODO DELETE
router.delete('/:platform_id', controller.removePlatform);


// EXPORTAR
module.exports = router;