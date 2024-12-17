
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

app.use(cors(corsConfig));
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
// página LOGIN
app.use(express.static(__dirname + '/src/pages/login'));
app.get('/login', (req, res) => {
    res.sendFile(__dirname + '/src/pages/login/login.html');
})
// página REGISTRO
app.use(express.static(__dirname + '/src/pages/register'));
app.get('/register', (req, res) => {
    res.sendFile(__dirname + '/src/pages/register/register.html');
})

// página INICIO
app.use(express.static(__dirname + '/src/pages/index'))
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/src/pages/index/index.html');
});
// página JUEGOS
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


// SERVER
app.listen(PORT, () => console.log(`http://localhost:${PORT}`));