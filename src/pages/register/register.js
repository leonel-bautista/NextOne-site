const form = document.querySelector(".register-form");

// const fileInput = form.querySelector("input[type=file]")
// const image = form.querySelector("img")


// evento al guardar los cambios del formulario de registro
form.addEventListener('submit', (e) => {
    e.preventDefault();

    registerUser(e);
})

// MÉTODOS API
async function registerUser(e){
    const formData = new FormData();
    formData.append('user_image', '/imgs/foto-usuario-predeterminada.png')
    formData.append('tier_id', '1')
    formData.append('user_name', e.target.userName.value)
    formData.append('user_alias', e.target.userName.value)
    formData.append('email', e.target.userEmail.value)
    formData.append('password', e.target.userPassword.value)

    console.log(formData)

    const res = await fetch("http://localhost:3080/api/users/register", {
        method: 'POST',
        body: formData
    })

    const resJson = await res.json();
    if(resJson.redirect){
        window.location.href = resJson.redirect;
    }
}


// FUNCIONES DE FILTRO
// // funcion que cambia el contenedor de la imágen en tiempo real
// fileInput.onchange = function(){
//     if(fileInput.files[0].size < 1000000){   // 1MB
//         let fileReader = new FileReader();

//         fileReader.onload = function(e){
//             imgUrl = e.target.result;
//             image.src = imgUrl;
//         }

//         fileReader.readAsDataURL(fileInput.files[0]);
//     }
//     else{
//         alert("Solo se permiten imagenes con un peso menor a 1MB (megabyte)!")
//     }
// }