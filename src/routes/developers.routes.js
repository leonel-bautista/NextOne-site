// RUTAS DEL MODULO //

const express = require('express');
const router = express.Router();

const controller = require('../controllers/developers.controller');


// METODO GET
// para todas las desarrolladoras
router.get('/', controller.showEveryDeveloper);
// para una solo desarrolladora
router.get('/:developer_id', controller.showOneDeveloper);

// METODO POST
router.post('/', controller.storeDeveloper);

// METODO PUT
router.put('/:developer_id', controller.updateDeveloper);

// METODO DELETE
router.delete('/:developer_id', controller.removeDeveloper);


// EXPORTAR
module.exports = router;