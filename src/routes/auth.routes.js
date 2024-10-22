// RUTAS DEL MODULO

const express = require('express');
const router = express.Router();

const controller = require('../controllers/auth.controller');
const authMiddleware = require('../middleware/auth.middleware');

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


// METODO GET //
// router.get('/protected', authMiddleware, (req, res) => {
//     res.status(200).send(`Hola, Usuario N°${req.user_id}`);
// })

// METODO POST
// registrarse
router.post('/register', upload.single('user_image'), controller.register);
// login
router.post('/login', controller.login);


// EXPORTAR
module.exports = router;