const express = require('express');
const router = express.Router();

const controller = require('../controllers/gamesList.controller');

// METODO GET
// para todos los juegos
router.get('/', controller.showEveryGame);
// para un juego
router.get('/:game_id', controller.showOneGame);

// METODO POST
router.post('/', controller.storeGame);

// METODO PUT
router.put('/:game_id', controller.updateGame);

// METODO DELETE
router.delete('/:game_id', controller.removeGame);



// EXPORTAR
module.exports = router;