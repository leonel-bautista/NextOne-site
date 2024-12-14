const userInfo = document.getElementById('user-info');

userInfo.addEventListener('click', (e) => {
    if(e.target.classList.contains("logout-btn")){
        document.cookie = 'jwt=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        window.location.href = "";
    }
    if(e.target.classList.contains("login-btn")){
        window.location.href = "/login";
    }
})

const createNav = () => {
    const token = document.cookie;

    if(!token){
        console.log("no hay cookie pe");
        userInfo.innerHTML = `<button id="login-btn" class="login-btn">Iniciar sesión</button>`
    } else{
        const authToken = token.replace('jwt=', '')

        // console.log(authToken)

        fetch('http://localhost:3080/auth/navbar', {
            headers: {'Authorization': authToken}
        })
        .then(res => res.json())
        .then(data => {
            if(data.nav){
                const navItems = document.getElementById('nav').querySelector('ul');
                navItems.innerHTML = data.nav.map(option => 
                    `<li><a href="">${option}</a></li>`).join('')

                userInfo.innerHTML = `<span id="userName">${data.user_name}</span>
                                      <a href="" id="userImage"><img src="${data.picture}" alt="Foto de Usuario"></a>
                                      <button id="logout-btn" class="logout-btn">Cerrar sesión</button>`
            }
        })
        .catch(() => {
            console.error("Hubo un fallo en la autenticación")
        })
    }
}

// createNav();