
////////////// RUTAS DEL MODULO "AREAS" ////

const express = require('express');
const router = express.Router();

const controller = require('./areas.controller');


// MÉTODO GET
// para todas las areas
router.get('/db-table-raw', controller.showEveryArea);
// para una sola area
router.get('/db-table-raw/:area_id', controller.showOneArea);

// MÉTODO POST
router.post('/db-table-raw', controller.storeArea);

// MÉTODO PUT
router.put('/db-table-raw/:area_id', controller.updateArea);

// MÉTODO DELETE
router.delete('/db-table-raw/:area_id', controller.removeArea);


// EXPORTAR
module.exports = router;