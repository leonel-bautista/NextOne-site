
////////////// RUTAS DEL MÓDULO "CARGOS" ////

const express = require('express');
const router = express.Router();

const controller = require('./roles.controller')


// MÉTODO GET
// para todos los cargos
router.get('/db-table-raw', controller.showEveryRole);
// para un solo cargo
router.get('/db-table-raw/:role_id', controller.showOneRole);

// MÉTODO POST
router.post('/db-table-raw', controller.storeRole);

// MÉTODO PUT
router.put('/db-table-raw/:role_id', controller.updateRole);

// MÉTODO DELETE
router.delete('/db-table-raw/:role_id', controller.removeRole);


// EXPORTAR
module.exports = router;