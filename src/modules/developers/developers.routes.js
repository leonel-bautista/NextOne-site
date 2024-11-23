
////////////// RUTAS DEL MÓDULO "DESARROLLADORAS" ////

const express = require('express');
const router = express.Router();

const controller = require('./developers.controller');


// MÉTODO GET
// para todas las desarrolladoras
router.get('/', controller.showEveryDeveloper);
// para una solo desarrolladora
router.get('/:developer_id', controller.showOneDeveloper);

// MÉTODO POST
router.post('/', controller.storeDeveloper);

// MÉTODO PUT
router.put('/:developer_id', controller.updateDeveloper);

// MÉTODO DELETE
router.delete('/:developer_id', controller.removeDeveloper);


// EXPORTAR
module.exports = router;