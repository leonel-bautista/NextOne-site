
////////////// RUTAS DEL MÓDULO "ADMINS" ////

const express = require('express');
const router = express.Router();

const controller = require('/@modules/admins/admins.controller');


// MÉTODO GET
// para todos los admins
router.get('/db-table-raw', controller.showEveryAdmin);
// para un solo admin
router.get('/db-table-raw/:admin_id', controller.showOneAdmin);

// MÉTODO POST
router.post('/db-table-raw', controller.storeAdmin);

// MÉTODO PUT
router.put('/db-table-raw/:admin_id', controller.updateAdmin);

// MÉTODO DELETE
router.delete('/db-table-raw/:admin_id', controller.removeAdmin);


// EXPORTAR
module.exports = router;