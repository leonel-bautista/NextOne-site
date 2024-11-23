
////////////// RUTAS DEL MÓDULO "NIVELES" ////

const express = require('express');
const router = express.Router();

const controller = require('./tiers.controller');


// MÉTODO GET
// para todos los niveles
router.get('/', controller.showEveryTier);
// para un solo nivel
router.get('/:tier_id', controller.showOneTier);

// MÉTODO POST
router.post('/', controller.storeTier);

// MÉTODO PUT
router.put('/:tier_id', controller.updateTier);

// MÉTODO DELETE
router.delete('/:tier_id', controller.removeTier);


// EXPORTAR
module.exports = router;