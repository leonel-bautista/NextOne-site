
////////////// RUTAS DEL MÓDULO "USUARIOS" ////

import express from 'express';
const router = express.Router();

import {methods as controller} from './users.controller.js'


// MULTER
import multer from 'multer';
import path from 'node:path';

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'src/uploads/user-images');
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
// para todos los usuarios
router.get('/', controller.showEveryUser);
// para un solo usuario
router.get('/:user_id', controller.showOneUser);
// autenticación
// router.get('/protected', authMiddleware, (req, res) => {
//     res.status(200).send(`Hola, Usuario N°${req.user_id}`);
// })

// MÉTODO POST
// registrar una cuenta
router.post('/register', upload.single('user_image'), controller.registerUser);
// ingresar a una cuenta
router.post('/login', controller.loginUser);

// MÉTODO PUT
router.put('/:user_id', upload.single('user_image'), controller.updateUser);

// MÉTODO PATCH
// acá iría el método

// MÉTODO DELETE
router.delete('/:user_id', controller.removeUser);


// EXPORTAR
export const usersRoutes = router;