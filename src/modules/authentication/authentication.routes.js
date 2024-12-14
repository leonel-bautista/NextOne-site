
////////////// RUTAS DEL MÓDULO "AUTENTICACIÓN" ////

import express from 'express';
const router = express.Router();

import {methods as controller} from './authentication.controller.js'
import { authorizations } from '../../middleware/authorizations.middleware.js';


// MÉTODO GET
// tipos de barra de navegación
router.get('/navbar', authorizations.authUser, controller.navbar);
// verificar que el usuario exista
router.get('/check-user', controller.checkUser);

// MÉTODO POST
// registrar una cuenta
router.post('/register', controller.register);
// ingresar a una cuenta
router.post('/login', controller.login);


// EXPORTAR
export const authRoutes = router;