
////////////// RUTAS DEL MÓDULO "NIVELES" ////

const express = require('express');
const router = express.Router();

const controller = require('./tiers.controller');


// MÉTODO GET
// para todos los niveles
router.get('/db-table-raw', controller.showEveryTier);
// para un solo nivel
router.get('/db-table-raw/:tier_id', controller.showOneTier);

// MÉTODO POST
router.post('/db-table-raw', controller.storeTier);

// MÉTODO PUT
router.put('/db-table-raw/:tier_id', controller.updateTier);

// MÉTODO DELETE
router.delete('/db-table-raw/:tier_id', controller.removeTier);


// EXPORTAR
module.exports = router;