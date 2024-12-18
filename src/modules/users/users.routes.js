
////////////// RUTAS DEL MÓDULO "USUARIOS" ////

import express from 'express';
const router = express.Router();

import {methods as controller} from './users.controller.js'


// MULTER
import path from 'node:path';
import multer from 'multer';

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

// MÉTODO POST
router.post('/', upload.single('user_image'), controller.storeUser);

// MÉTODO PUT
router.put('/:user_id', upload.single('user_image'), controller.updateUser);

// MÉTODO PATCH
// acá iría el método

// MÉTODO DELETE
router.delete('/:user_id', controller.removeUser);


// EXPORTAR
export const usersRoutes = router;