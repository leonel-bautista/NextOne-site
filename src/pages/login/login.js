const form = document.querySelector("form");
const username = document.querySelector("#userName");
const password = document.querySelector("#userPassword");

const submitBtn = document.querySelector("button[type='submit']");

const url = "https://nextone.alwaysdata.net";


// FUNCIONES DE VALIDACIÓN
const hasWhitespace = (element) => {
    const whitespace = /\s/g;
    return whitespace.test(element.value);
}
const setError = (element, message) => {
    const inputControl = element.parentElement
    const errorDisplay = inputControl.querySelector(".message");

    errorDisplay.innerText = message;
    inputControl.classList.add("error")
}
const setSuccess = (element, message) => {
    const inputControl = element.parentElement
    const errorDisplay = inputControl.querySelector(".message");

    if(!message){
        errorDisplay.innerText = '';
    } else {
        errorDisplay.innerText = message;
    }
    inputControl.classList.add("success")

    inputControl.classList.remove("error")
}

const validateInputs = async () => {
    let validationStatus = [];

    if(username.value === '' || hasWhitespace(username)){
        validationStatus[0] = false;
    } else{
        validationStatus[0] = true;
    }

    if(password.value === '' || hasWhitespace(password)){
        validationStatus[1] = false;
    } else{
        validationStatus[1] = true;
    }

    return validationStatus.includes(false) ? false : true;
}


// EVENTOS DE VALIDACIÓN
username.addEventListener('keyup', () => {setSuccess(submitBtn)})
password.addEventListener('keyup', () => {setSuccess(submitBtn)})


// MÉTODOS API
async function loginAccount(){
    const res = await fetch(`${url}/auth/login`, {
        method: 'POST',
        headers:{
          "Content-Type" : "application/json"
        },
        body: JSON.stringify({
            user_name: username.value,
            password: password.value
        })
    })

    submitBtn.parentElement.classList.add("loading");

    return await res.json();
}


// EVENTO DE ENVÍO DEL FORMULARIO
form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const validated = await validateInputs();
    if(!validated){
        return setError(submitBtn, 'Por favor, complete todos los campos');
    }

    const loader = submitBtn.parentElement.classList;

    const res = await loginAccount();
    if(res.error){
        setError(submitBtn, 'Hubo un problema al iniciar sesión');
        loader.remove("loading")
    } else if(res.user_error){
        setError(submitBtn, 'Nombre de usuario o contraseña incorrectos');
        loader.remove("loading")
    } else{
        setSuccess(submitBtn, 'Inicio de sesión con éxito');
        setTimeout(() => {
            window.location.href = res.redirect;
        }, 1000);
    }
})