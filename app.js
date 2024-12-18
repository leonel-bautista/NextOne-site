
////////////// CONFIGURACIÓN DEL SERVIDOR ////

import 'dotenv/config';

import path from 'node:path';
import { fileURLToPath } from 'node:url';

import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';

const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const URL = process.env.URL;
const PORT = process.env.PORT || 4000;
const corsConfig = {
    origin: URL,
    credentials: true
}

// MOTOR DE VISTAS
app.set('view engine', 'ejs');
app.set('views', __dirname + '/src/pages/views');

app.use(cors(corsConfig));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());



// autorizaciones
import { authorizations } from './src/middleware/authorizations.middleware.js';

// directorios estáticos universales
app.use(express.static(__dirname + '/node_modules'));
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/src/components'));
app.use(express.static(__dirname + '/src/uploads'));

// PÁGINAS
// página INICIO DE SESIÓN
app.use(express.static(__dirname + '/src/pages/login'));
app.get('/login', (req, res) => {
    res.sendFile(__dirname + '/src/pages/login/login.html');
})
// página REGISTRO DE CUENTA
app.use(express.static(__dirname + '/src/pages/register'));
app.get('/register', (req, res) => {
    res.sendFile(__dirname + '/src/pages/register/register.html');
})

// página INICIO
app.use(express.static(__dirname + '/src/pages/index'))
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/src/pages/index/index.html');
});
// página LISTA DE JUEGOS
app.use(express.static(__dirname + '/src/pages/games-list'))
app.get('/games', (req, res) => {
    res.sendFile(__dirname + '/src/pages/games-list/games-list.html');
});

// páginas de administración
// administración JUEGOS
app.use(express.static(__dirname + '/src/pages/admin/games'));
app.get('/admin/games', authorizations.adminOnly, (req, res) => {
    res.sendFile(__dirname + '/src/pages/admin/games/games.html');
});


// API
import { authRoutes } from './src/modules/authentication/authentication.routes.js';
app.use('/auth', authRoutes);

import { gamesRoutes } from './src/modules/games/games.routes.js';
app.use('/api/games', gamesRoutes);

import { usersRoutes } from './src/modules/users/users.routes.js';
app.use('/api/users', usersRoutes);


// página APLICACIÓN JUEGO
import { viewsGamesRoutes } from './src/modules/games/games.routes.js';
app.use(express.static(__dirname + '/src/pages/views/games'));
app.use('/games/app', viewsGamesRoutes)


// SERVER
app.listen(PORT, () => console.log(`servidor escuchando en el puerto ${PORT}`));