
////////////// CONTROLADOR DEL MÓDULO "AUTENTICACIÓN" ////

import {conn as db} from '../../database/db.js';
import jsonwebtoken from 'jsonwebtoken';
import bcryptjs from 'bcryptjs';


// MÉTODO GET
// para tipos de barras de navegación
const navbar = async (req, res) => {
    const sql = 'SELECT user_image, tier_name, user_alias FROM users JOIN tiers ON tiers.tier_id = users.tier_id WHERE user_id = ?';
    
    db.query(sql, [req.user.user_id], (error, result) => {
        if (error) {
            return res.status(500).json({ error: 'Error al obtener los datos del usuario' });
        }
        if (result.length == 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        const user = result[0];
        let userType = req.user.auth;

        let userPicture;
        user.user_image ? userPicture = "/users-pictures/" + user.user_image : userPicture = "/imgs/foto-usuario-predeterminada.png"

        let toolbar = [];
        let navbar = [];
        switch(userType){
            case 'user':
                toolbar = [['notifications-btn', 'home-btn', 'toggle-menu-btn', 'site-settings-btn', 'logout-btn'],
                           ['hn-envelope-solid', 'hn-home-solid', 'hn-play-solid', 'hn-cog-solid', 'hn-logout-solid'],
                           ['Correo', 'Inicio', 'Menú', 'Ajustes', 'Salir']];
                navbar = [['#', '#', '#', '#', '#', '#'],
                          ['large-link games-link', 'large-link downloads-link', 'account-settings-link', 'discussions-link', 'about-link', 'news-link'],
                          ['hn-save-solid', 'hn-download-alt-solid', 'hn-user-solid', 'hn-comments-solid', 'hn-info-circle-solid', 'hn-bullhorn-solid'],
                          ['Lista de juegos', 'Descargas', 'Ajustes de cuenta', 'Discusiones', 'Acerca de', 'Novedades']];
                break;
            case 'admin':
                toolbar = [['notifications-btn', 'home-btn', 'toggle-menu-btn', 'site-settings-btn', 'logout-btn'],
                           ['hn-envelope-solid', 'hn-home-solid', 'hn-play-solid', 'hn-cog-solid', 'hn-logout-solid'],
                           ['Correo', 'Inicio', 'Menú', 'Ajustes', 'Salir']];
                navbar = [['#', '#', '#', '#', '#', '#', '/admin/games'],
                          ['large-link games-link', 'large-link downloads-link', 'account-settings-link', 'discussions-link', 'about-link', 'news-link', 'large-link admin-link'],
                          ['hn-save-solid', 'hn-download-alt-solid', 'hn-user-solid', 'hn-comments-solid', 'hn-info-circle-solid', 'hn-bullhorn-solid', ''],
                          ['Lista de juegos', 'Descargas', 'Ajustes de cuenta', 'Discusiones', 'Acerca de', 'Novedades', 'Administración']];
                break;
        }

        const userInfo = {toolbar: toolbar,
                          navbar: navbar,
                          user_image: userPicture,
                          user_tier: user.tier_name,
                          user_name: req.user.user_name,
                          user_alias: user.user_alias};
        return res.json(userInfo);
    })
}
// buscar si existe ya un usuario similar
const checkUser = async (req, res) => {
    const {info} = req.query;
    const sql = 'SELECT COUNT(*) as users_found FROM users WHERE user_name = ? OR email = ?';

    db.query(sql, [info, info], (error ,result) => {
        if(error){
            return res.status(500).json({exists: false});
        }
        const found = result[0].users_found;
        return res.json({exists: found > 0});
    })
}

// MÉTODO POST
// registrar una cuenta
const register = async (req, res) => {
    let userImage = ""; // por defecto, el usuario no tendrá imágen (se le dará una predeterminada luego)
    let tier = 1; // al registrarme de forma normal, inicio con un usuario de tier normal
    let alias = req.body.user_name // el alias predeterminado será el nombre de usuario

    const {user_name, email, password} = req.body;
    // const salt = process.env.SALT;
    const hashedPassword = await bcryptjs.hash(password, 10);
    
    const findUser = `SELECT user_name, email FROM users WHERE user_name = ? OR email = ?`

    db.query(findUser, [user_name, email], (error, result) => {
        if(error){
            return res.status(500).json({error: "(❌) ERROR: Vuelva a intentarlo más tarde"});
        }
        const found = result[0];
        if(found){
            if(user_name === found.user_name){
                return res.status(500).json({error: "(❌) ERROR: El nombre de usuario ya está en uso"});
            }
            if(email === found.email){
                return res.status(500).json({error: "(❌) ERROR: El correo electrónico ya está registrado"});
            }
        }

        const sql = `INSERT INTO users (user_image, tier_id, user_name, user_alias, email, password)
                 VALUES (?, ?, ?, ?, ?, ?)`;

        db.query(sql, [userImage, tier, user_name, alias, email, hashedPassword], (error, result) => {
            if(error){
                return res.status(500).json({error: "(❌) ERROR: Vuelva a intentarlo más tarde"});
            }

            res.status(201).json({mensaje: "(✔) Registro con éxito!",
                                  redirect: "/login"});
        })
    })

}
// ingresar a una cuenta
const login = async (req, res) => {
    const {user_name, password} = req.body;
    const findUser = `SELECT user_id, user_name, password FROM users WHERE user_name = ?`;

    db.query(findUser, [user_name], async (error, result) => {
        if(error){
            return res.status(500).json({error: "(❌) ERROR: Vuelva a intentarlo más tarde"});
        }
        if(result.length == 0){
            return res.status(404).json({user_error: "(❌) ERROR: Usuario no encontrado"});
        }
        const passwordIsValid = await bcryptjs.compare(password, result[0].password);
        if(!passwordIsValid){
            return res.status(401).json({user_error: "(❌) ERROR: Contraseña incorrecta",
                                         auth: false,
                                         token: null});
        }

        const user = result[0];
        const checkAdmin = 'SELECT role_id FROM admins JOIN users ON admins.user_id = users.user_id WHERE users.user_id = ?'

        db.query(checkAdmin, [user.user_id], (error, result) => {
            let auth = "";
            result.length == 0 ? auth = "user" : auth = "admin";

            const token = jsonwebtoken.sign({user_id: user.user_id,
                                            user_name: user.user_name,
                                            auth: auth},
                                            process.env.SECRET_KEY,
                                            {expiresIn: process.env.TOKEN_EXPIRATION});
            const cookie = {
                // httpOnly: false,
                secure: process.env.PRODUCTION,
                sameSite: "None",
                expires: new Date(Date.now() + process.env.COOKIE_EXPIRATION * 24 * 60 * 60 * 1000),
                path: "/",
                // domain: process.env.DOMAIN
            }
            
            res.cookie("jwt", token, cookie)
            res.json({mensaje: "(✔) Inicio de sesión con éxito!",
                      token: token,
                      redirect: "/"});
        })
    })

}


// EXPORTAR
export const methods = {
    // GET
    navbar,
    checkUser,
    // POST
    register,
    login
}