
////////////// RUTAS DEL MÓDULO "ETIQUETAS" ////

const express = require('express');
const router = express.Router();

const controller = require('./tags.controller');


// MÉTODO GET
// para todas las etiquetas
router.get('/db-table-raw', controller.showEveryTag);
// para una sola etiqueta
router.get('/db-table-raw/:tag_id', controller.showOneTag);

// MÉTODO POST
router.post('/db-table-raw', controller.storeTag);

// MÉTODO PUT
router.put('/db-table-raw/:tag_id', controller.updateTag);

// MÉTODO DELETE
router.delete('/db-table-raw/:tag_id', controller.removeTag);


// EXPORTAR
module.exports = router;