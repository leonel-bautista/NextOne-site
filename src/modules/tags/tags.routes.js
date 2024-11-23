
////////////// RUTAS DEL MÓDULO "ETIQUETAS" ////

const express = require('express');
const router = express.Router();

const controller = require('./tags.controller');


// MÉTODO GET
// para todas las etiquetas
router.get('/', controller.showEveryTag);
// para una sola etiqueta
router.get('/:tag_id', controller.showOneTag);

// MÉTODO POST
router.post('/', controller.storeTag);

// MÉTODO PUT
router.put('/:tag_id', controller.updateTag);

// MÉTODO DELETE
router.delete('/:tag_id', controller.removeTag);


// EXPORTAR
module.exports = router;