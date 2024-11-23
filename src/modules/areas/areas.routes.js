
////////////// RUTAS DEL MODULO "AREAS" ////

const express = require('express');
const router = express.Router();

const controller = require('./areas.controller');


// MÉTODO GET
// para todas las areas
router.get('/', controller.showEveryArea);
// para una sola area
router.get('/:area_id', controller.showOneArea);

// MÉTODO POST
router.post('/', controller.storeArea);

// MÉTODO PUT
router.put('/:area_id', controller.updateArea);

// MÉTODO DELETE
router.delete('/:area_id', controller.removeArea);


// EXPORTAR
module.exports = router;