// RUTAS DEL MODULO //

const express = require('express');
const router = express.Router();

const controller = require('../controllers/games.controller');


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
        callback("❌ERROR: Tipo de archivo no soportado");
    },

    limits: {fileSize: 1024 * 1024 * 1}
});


// METODO GET
// para todos los juegos
router.get('/', controller.showEveryGame);
// para un solo juego
router.get('/:game_id', controller.showOneGame);

// METODO POST
router.post('/', upload.single('image'), controller.storeGame);

// METODO PUT
router.put('/:game_id', upload.single('image'), controller.updateGame);

// METODO DELETE
router.delete('/:game_id', controller.removeGame);


// EXPORTAR
module.exports = router;