// RUTAS DEL MODULO //

const express = require('express');
const router = express.Router();

const controller = require('../controllers/platforms.controller');


// METODO GET
// para todas las plataformas
router.get('/', controller.showEveryPlatform);
// para una sola plataforma
router.get('/:platform_id', controller.showOnePlatform)

// METODO POST
router.post('/', controller.storePlatform);

// METODO PUT
router.put('/:platform_id', controller.updatePlatform);

// METODO DELETE
router.delete('/:platform_id', controller.removePlatform);


// EXPORT
module.exports = router;