// CONFIGURACIÓN DEL SERVIDOR //

const express = require('express');
const app = express();

app.use(express.json());

// RUTAS
// tablas de la base de datos
app.use('/db-Table-raw/games', require('./routes/games.routes'));
app.use('/db-Table-raw/tags', require('./routes/tags.routes'));
app.use('/db-Table-raw/platforms', require('./routes/platforms.routes'));
// lista con información completa de los juegos
app.use('/games', require('./routes/gamesList.routes'));


app.get("/", (req, res) => {
    res.send("página de inicio");
});

const PORT = process.env.PORT || 3080;

app.listen(PORT, () => console.log(`http://localhost:${PORT}`));