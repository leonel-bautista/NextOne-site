// CONFIGURACIÓN DEL SERVIDOR //

require('dotenv').config();

const express = require('express');
const app = express();

app.use(express.json());


// RUTAS
// tablas relacionadas a juegos de la base de datos
app.use('/db-Table-raw/games', require('./routes/games.routes'));
app.use('/db-Table-raw/tags', require('./routes/tags.routes'));
app.use('/db-Table-raw/platforms', require('./routes/platforms.routes'));
app.use('/db-Table-raw/developers', require('./routes/developers.routes'));

// lista con información completa de los juegos
app.use('/games', require('./routes/gamesList.routes'));

// lista de usuarios
app.use('/users', require('./routes/users.routes'));

// autenticacion de usuario
app.use('/auth', require('./routes/auth.routes'));


app.get('/', (req, res) => {
    res.send("página de inicio");
});

const PORT = process.env.PORT || 3081;

app.listen(PORT, () => console.log(`http://localhost:${PORT}`));