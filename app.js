
////////////// CONFIGURACIÓN DEL SERVIDOR ////

// require('dotenv').config();

import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.use(express.json());


// // RUTAS
// // tablas relacionadas a JUEGOS
// app.use('/games', require('/@modules/games/games.routes'));
// app.use('/tags', require('/@modules/tags/tags.routes'));
// app.use('/platforms', require('/@modules/platforms/platforms.routes'));
// app.use('/developers', require('/@modules/developers/developers.routes'));
// // tablas intermedias
// app.use('/games-tags', require('/@modules/games-tags/games-tags.routes'));
// app.use('/games-platforms', require('/@modules/games-platforms/games-platforms.routes'));

// // tablas relacionadas a USUARIOS
// app.use('/users', require('/@modules/users/users.routes'));
// app.use('/tiers', require('/@modules/tiers/tiers.routes'));
// // tablas de administradores
// app.use('/admins', require('/@modules/admins/admins.routes'));
// app.use('/roles', require('/@modules/roles/roles.routes'));
// app.use('/areas', require('/@modules/areas/areas.routes'));


// PÁGINAS
// directorios estáticos universales
app.use(express.static(__dirname + '/node_modules'));
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/src/components'));
app.use(express.static(__dirname + '/src/uploads'));


// página de login

// página de inicio
// app.use(express.static(__dirname + '/src/pages/index'))
// app.get('/', (req, res) => {
//     res.sendFile(__dirname + '/src/pages/index/index.html');
// });

// administración de juegos
app.use(express.static(__dirname + '/src/pages/admin/games'));
app.get('/admin/games', (req, res) => {
    res.sendFile(__dirname + '/src/pages/admin/games/games.html');
});


// API
import {gamesRoutes} from "./src/modules/games/games.routes.js";
app.use('/api/games', gamesRoutes);


// SERVER
// const PORT = process.env.PORT || 3081;
const PORT = 3080;
app.listen(PORT, () => console.log(`http://localhost:${PORT}`));