// CONFIGURACIÓN DEL SERVIDOR //

const express = require('express');
const app = express();

app.use(express.json());

// RUTAS
app.use('/db-Table-raw/games', require('./routes/games.routes'));

app.use('/games', require('./routes/gamesList.routes'));


app.get("/", (req, res) => {
    res.send("página de inicio");
});

const PORT = process.env.PORT || 3080;

app.listen(PORT, () => console.log(`http://localhost:${PORT}`));