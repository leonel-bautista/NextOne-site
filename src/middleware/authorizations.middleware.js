
////////////// MIDDLEWARE DE "AUTORIZACIÓN" ////

import jsonwebtoken from 'jsonwebtoken';
import {conn as db} from '../database/db.js';


// verificar la cookie y que el usuario relacionada a esta exista
const checkCookie = (req, res) => {
    try {
        const cookie = req.headers.cookie.split("; ").find(cookie => cookie.startsWith("jwt=")).slice(4);
        const decoded = jsonwebtoken.verify(cookie, process.env.SECRET_KEY);

        const sql = `SELECT user_name FROM users WHERE user_id = ?`;
        db.query(sql, [decoded.user_id], (error, result) => {
            if(result.length == 0){
                console.error("(❌) No existe usuario relacionado a la cookie")
                return res(false);
            }

            console.log("(✔) Usuario encontrado: " + result[0].user_name)
            return res(true);
        })
    }
    catch(error){
        console.error("(❌) Hubo un problema al verificar la cookie")
        // console.error(error)
        return res(false);
    }
}

// verificar si un usuario es administrador o no para su respectiva navbar
const authUser = (req, res, next) => {
    const token = req.headers['authorization'];

    if(!token) return res.sendStatus(401);
    jsonwebtoken.verify(token, process.env.SECRET_KEY, (error, user) => {
        if(error) return res.sendStatus(401);
        req.user = user;
        next();
    })
}

// autorización permitida solo a USUARIOS
const userOnly = (req, res, next) => {
    checkCookie(req, (signedIn) => {
        if(signedIn) return next();
        return res.redirect("/login");
    })
}

// autorización permitida solo a ADMINS
const adminOnly = (req, res, next) => {
    checkCookie(req, (signedIn) => {
        if(signedIn){
            const cookie = req.headers.cookie.split("; ").find(cookie => cookie.startsWith("jwt=")).slice(4);
            const decoded = jsonwebtoken.verify(cookie, process.env.SECRET_KEY);

            if(decoded.auth === 'admin') return next();
            console.error("Acceso denegado")
            return res.redirect("/");
        }
        
        return res.redirect("/");
    })
}


export const authorizations = {
    authUser,
    userOnly,
    adminOnly
}