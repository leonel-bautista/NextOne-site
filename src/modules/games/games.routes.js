
////////////// RUTAS DEL MÓDULO "JUEGOS" ////

import express from 'express';
const router = express.Router();
const viewsrouter = express.Router();

import {methods as controller} from './games.controller.js'


// MULTER
import multer from 'multer';
import path from 'node:path';

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'src/uploads/games-images');
    },
    filename: (req, file, callback) => {
        callback(null, "g-" + Date.now() + path.extname(file.originalname));
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
// todos los juegos
router.get('/', controller.showEveryGame);
// los últimos agregados
router.get('/latest', controller.showLatestGames);
// por nombre
router.get('/search', controller.showGamesByName);
// juegos activos por nombre
router.get('/search-active', controller.showActiveGamesByName);
// cierta cantidad
router.get('/fixed', controller.showFixedAmount);
// un solo juego
router.get('/:game_id', controller.showOneGame);
// toda la información de un solo juego (vista)
viewsrouter.get('/:game_id', controller.showOneFullGame);

// MÉTODO POST
router.post('/', upload.single('game_image'), controller.storeGame);

// MÉTODO PATCH
// para el estado de un juego
router.patch('/:game_id/status', controller.patchGameStatus);

// MÉTODO PUT
router.put('/:game_id', upload.single('game_image'), controller.updateGame);

// MÉTODO PATCH
// acá iría el método

// MÉTODO DELETE
router.delete('/:game_id', controller.removeGame);


// EXPORTAR
export const gamesRoutes = router;
export const viewsGamesRoutes = viewsrouter;