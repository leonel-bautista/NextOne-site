
////////////// CONFIGURACIÓN DEL SERVIDOR ////

require('dotenv').config();

const express = require('express');
const app = express();

app.use(express.json());


// RUTAS
// tablas relacionadas a JUEGOS
app.use('/games', require('/@modules/games/games.routes'));
app.use('/tags', require('/@modules/tags/tags.routes'));
app.use('/platforms', require('/@modules/platforms/platforms.routes'));
app.use('/developers', require('/@modules/developers/developers.routes'));
// tablas intermedias
app.use('/games-tags', require('/@modules/games-tags/games-tags.routes'));
app.use('/games-platforms', require('/@modules/games-platforms/games-platforms.routes'));

// tablas relacionadas a USUARIOS
app.use('/users', require('/@modules/users/users.routes'));


// raíz
app.get('/', (req, res) => {
    res.send("página de inicio");
});

const PORT = process.env.PORT || 3081;

app.listen(PORT, () => console.log(`http://localhost:${PORT}`));