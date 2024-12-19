const menu = document.querySelector(".menu");
const toolbar = document.querySelector(".toolbar");
const navbar = document.querySelector(".navbar");
const menu_bg = document.querySelector(".menu-dark-background");

const url = "https://nextone.alwaysdata.net";


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
            if(data.toolbar){
                const toolbarData = data.toolbar;
                const toolbarLength = Math.max(...toolbarData.map(items => items.length))

                toolbar.innerHTML = "";
                for(let i = 0; i < toolbarLength; i++){
                    toolbar.innerHTML += `<li>
                                              <button class="tools ${toolbarData[0][i]}">
                                                  <i class="hn ${toolbarData[1][i]}"></i>
                                                  <span>${toolbarData[2][i]}</span>
                                                  <i class="hn hn-angle-left tool-pointer"></i>
                                              </button>
                                          </li>`
                }
            }

            if(data.navbar){
                const navData = data.navbar;
                const header = navbar.querySelector('header');
                const nav = navbar.querySelector('nav')

                header.innerHTML = `<a href="#" class="user-image">
                                        <img src="${data.user_image}" alt="Foto de perfil">
                                    </a>
                                    <div class="user-info-box">
                                        <span class="user-tier ${data.user_tier}">${data.user_tier}</span>
                                        <span class="user-alias">${data.user_alias}</span>
                                        <a href="/login" class="user-name">@${data.user_name}</a>
                                    </div>`

                const navLength = Math.max(...navData.map(items => items.length))

                nav.innerHTML = "";
                for(let i = 0; i < navLength; i++){
                    nav.innerHTML += `<a href="${navData[0][i]}" class="links ${navData[1][i]}">
                                          <i class="hn ${navData[2][i]}"></i>
                                          <span>${navData[3][i]}</span>
                                      </a>`
                }
            }
        })
        .catch((error) => {
            console.error("Hubo un fallo en la autenticación")
            console.error(error);
        })
    }
}
createNav();


menu_bg.addEventListener('click', () => {
    menu.classList.remove("expanded-menu");
    navbar.classList.remove("expanded-menu");
    menu_bg.classList.remove("expanded-menu");
})

toolbar.addEventListener('click', (e) => {
    if(e.target.classList.contains("home-btn")){
        window.location.href = "/";
    }
    if(e.target.classList.contains("toggle-menu-btn")){
        menu.classList.toggle("expanded-menu");
        navbar.classList.toggle("expanded-menu");
        menu_bg.classList.toggle("expanded-menu");
    }
    if(e.target.classList.contains("logout-btn")){
        document.cookie = `jwt=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT; HttpOnly; Secure; SameSite=None; domain=nextone.alwaysdata.net`;
        window.location.href = "/";
    }
})

navbar.addEventListener('click', (e) => {
    if(e.target.classList.contains("login-btn")){
        window.location.href = "/login"
    }
})