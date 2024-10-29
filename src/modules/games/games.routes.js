
////////////// RUTAS DEL MÓDULO "JUEGOS" ////

const express = require('express');
const router = express.Router();

const controller = require('./games.controller');


// MULTER
const multer = require('multer');
const path = require('node:path');

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'uploads');
    },
    filename: (req, file, callback) => {
        callback(null, Date.now() + path.extname(file.originalname));
    },
});

const upload = multer({
    storage,
    fileFilter: (req, file, callback) => {
        console.log(file);
        const fileTypes = /jpg|jpeg|png|webp/;
        const mimetype = fileTypes.test(file.mimetype);
        const extname = fileTypes.test(
            path.extname(file.originalname).toLowerCase()
        );

        if(mimetype && path.extname){
            return callback(null, true);
        }
        callback("(❌) ERROR: Tipo de archivo no soportado");
    },

    limits: {fileSize: 1024 * 1024 * 1} // 1MB
});


// MÉTODO GET
// para todos los juegos
router.get('/db-table-raw', controller.showEveryGame);
// para un solo juego
router.get('/db-table-raw/:game_id', controller.showOneGame);
// para la información completa de todos los juegos
router.get('/', controller.showFullList);
// para la información completa de un solo juego
router.get('/:game_id', controller.showOneFull);

// MÉTODO POST
router.post('/db-table-raw', upload.single('game_image'), controller.storeGame);

// MÉTODO PUT
router.put('/db-table-raw/:game_id', upload.single('game_image'), controller.updateGame);

// MÉTODO DELETE
router.delete('/db-table-raw/:game_id', controller.removeGame);


// EXPORTAR
module.exports = router;