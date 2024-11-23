
////////////// RUTAS DEL MÓDULO "USUARIOS" ////

const express = require('express');
const router = express.Router();

const controller = require('./users.controller');
const authMiddleware = require('../../middleware/auth.middleware');


// MULTER
const multer = require('multer');
const path = require('node:path');

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'src/uploads/users-pictures');
    },
    filename: (req, file, callback) => {
        callback(null, "u-" + Date.now() + path.extname(file.originalname));
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
// para todos los usuarios
router.get('/', controller.showEveryUser);
// para un solo usuario
router.get('/:user_id', controller.showOneUser);
// autenticación
router.get('/auth/protected', authMiddleware, (req, res) => {
    res.status(200).send(`Hola, Usuario N°${req.user_id}`);
})

// MÉTODO POST
// registrar una cuenta
router.post('/auth/register', upload.single('user_image'), controller.registerUser);
// ingresar a una cuenta
router.post('/auth/login', controller.loginUser);

// MÉTODO PUT
router.put('/:user_id', upload.single('user_image'), controller.updateUser);

// MÉTODO DELETE
router.delete('/:user_id', controller.removeUser);


// EXPORTAR
module.exports = router;