
////////////// RUTAS DEL MÓDULO "DESARROLLADORAS" ////

const express = require('express');
const router = express.Router();

const controller = require('./developers.controller');


// MÉTODO GET
// para todas las desarrolladoras
router.get('/db-table-raw', controller.showEveryDeveloper);
// para una solo desarrolladora
router.get('/db-table-raw/:developer_id', controller.showOneDeveloper);

// MÉTODO POST
router.post('/db-table-raw', controller.storeDeveloper);

// MÉTODO PUT
router.put('/db-table-raw/:developer_id', controller.updateDeveloper);

// MÉTODO DELETE
router.delete('/db-table-raw/:developer_id', controller.removeDeveloper);


// EXPORTAR
module.exports = router;