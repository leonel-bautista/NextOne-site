const db = require('../db/db');
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const authHeader = req.headers["authorization"];

    if(!authHeader)
        return res
                .status(403)
                .send({auth: false, message: "No se entregó un token"});

    const token = authHeader.split(" ")[1];

    if(!token)
        return res
                .status(403)
                .send({auth: false, message: "Token malformado"});
    

    jwt.verify(token, process.env.SECRET_KEY, (error, decoded) => {
        if(error)
            return res
                    .status(500)
                    .send({auth: false, message: "Hubo un error al autenticar el token"});
        
        req.user_id = decoded.id;

        next();
    });
}