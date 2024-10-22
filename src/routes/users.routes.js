// RUTAS DEL MODULO //

const express = require('express');
const router = express.Router();

const controller = require('../controllers/users.controller');


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
// para todos los usuarios
router.get('/', controller.showEveryUser);
// para un solo usuario
router.get('/:user_id', controller.showOneUser);

// METODO PUT
router.put('/:user_id', upload.single('user_image'), controller.updateUser);

// METODO DELETE
router.delete('/:user_id', controller.removeUser);


// EXPORTAR
module.exports = router;