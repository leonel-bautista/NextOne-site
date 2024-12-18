const userInfo = document.getElementById('user-info');

const url = "https://c95s12k5-3080.brs.devtunnels.ms";


// Función para obtener una cookie específica por su nombre
function getCookie(name) {
    // Busca la cookie por el nombre
    const cookies = document.cookie.split('; ');
    for (let cookie of cookies) {
        // Si la cookie tiene el nombre que buscamos, la retornamos
        if (cookie.startsWith(name + '=')) {
            return decodeURIComponent(cookie.substring(name.length + 1)); // Retorna el valor de la cookie
        }
    }
    return null; // Si no se encuentra la cookie
}

const createNav = async () => {
    const token = getCookie('jwt');

    if(token){
        const authToken = token.replace('jwt=', '')

        await fetch(`${url}/auth/navbar`, {
            headers: {'Authorization': authToken},
            credentials: 'include'
        })
        .then(res => {
            if (res.ok && res.headers.get("Content-Type").includes("application/json")) {
                return res.json();
            } else {
                throw new Error("La respuesta no es JSON o hubo un error");
            }
        })
        .then(data => {
            // if(data.navbar){
            //     const navItems = document.getElementById('nav').querySelector('ul');
            //     navItems.innerHTML = data.navbar.map(option => 
            //         `<li><a href="">${option}</a></li>`).join('')

            //     userInfo.innerHTML = `<span id="userName">${data.user_name}</span>
            //                           <a href="" id="userImage"><img src="${data.picture}" alt="Foto de Usuario"></a>
            //                           <button id="logout-btn" class="logout-btn">Cerrar sesión</button>`
            // }

            userInfo.innerHTML = `
                <span id="userName">${data.user_name}</span>
                <a href="" id="userImage"><img src="${data.user_image}" alt="Foto de Usuario"></a>
                <button id="logout-btn" class="logout-btn">
                    <i class="hn hn-logout-solid"></i>
                </button>
            `
        })
        .catch(() => {
            console.error("Hubo un fallo en la autenticación")
        })
    }
}
createNav();

userInfo.addEventListener('click', (e) => {
    if(e.target.classList.contains("logout-btn")){
        document.cookie = `jwt=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT; Secure; SameSite=None; domain=c95s12k5-3080.brs.devtunnels.ms`;
        window.location.href = "/";
    }
})