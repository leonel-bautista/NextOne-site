
////////////// RUTAS DEL MÓDULO "ADMINS" ////

const express = require('express');
const router = express.Router();

const controller = require('./admins.controller');


// MÉTODO GET
// para todos los admins
router.get('/', controller.showEveryAdmin);
// para un solo admin
router.get('/:admin_id', controller.showOneAdmin);

// MÉTODO POST
router.post('/', controller.storeAdmin);

// MÉTODO PUT
router.put('/:admin_id', controller.updateAdmin);

// MÉTODO DELETE
router.delete('/:admin_id', controller.removeAdmin);


// EXPORTAR
module.exports = router;