// RUTAS DEL MODULO //

const express = require('express');
const router = express.Router();

const controller = require('../controllers/tags.controller');


// METODO GET
// para todas las etiquetas
router.get('/', controller.showEveryTag);
// para una sola etiqueta
router.get('/:tag_id', controller.showOneTag);

// METODO POST
router.post('/', controller.storeTag);

// METODO PUT
router.put('/:tag_id', controller.updateTag);

// METODO DELETE
router.delete('/:tag_id', controller.removeTag);


// EXPORT
module.exports = router;