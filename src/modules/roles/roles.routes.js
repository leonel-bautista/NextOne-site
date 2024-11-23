
////////////// RUTAS DEL MÓDULO "CARGOS" ////

const express = require('express');
const router = express.Router();

const controller = require('./roles.controller')


// MÉTODO GET
// para todos los cargos
router.get('/', controller.showEveryRole);
// para un solo cargo
router.get('/:role_id', controller.showOneRole);

// MÉTODO POST
router.post('/', controller.storeRole);

// MÉTODO PUT
router.put('/:role_id', controller.updateRole);

// MÉTODO DELETE
router.delete('/:role_id', controller.removeRole);


// EXPORTAR
module.exports = router;