const express = require('express');
const app = express();

app.use(express.json());

const gamesListRouter = require('./routes/gamesList.routes');
app.use('/games', gamesListRouter);


app.get("/", (req, res) => {
    res.send("holi");
});

const PORT = 3080;

app.listen(PORT, () => console.log(`http://localhost:${PORT}`));