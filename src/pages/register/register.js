const form = document.querySelector("form");
const username = document.querySelector("#userName");
const email = document.querySelector("#userEmail");
const password = document.querySelector("#userPassword");
const confirmPassword = document.querySelector("#confirmPassword");

const submitBtn = document.querySelector("button[type='submit']");
const modal = document.querySelector("dialog");

const url = "https://c95s12k5-3080.brs.devtunnels.ms";


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
const isValidEmail = (email) => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email.value).toLowerCase());
}

const validateInputs = async () => {
    const name = await checkUser(username.value);
    const mail = await checkUser(email.value)
    let validationStatus = [];

    if(username.value === '' || hasWhitespace(username) || name.exists || username.value.length < 5 || username.value.length > 20){
        validationStatus[0] = false;
    } else{
        validationStatus[0] = true;
    }

    if(email.value === '' || hasWhitespace(email) || !isValidEmail(email) || mail.exists){
        validationStatus[1] = false;
    } else{
        validationStatus[1] = true;
    }

    if(password.value === '' || hasWhitespace(password) || password.value.length < 8){
        validationStatus[2] = false;
    } else{
        validationStatus[2] = true;
    }

    if(confirmPassword.value === '' || confirmPassword.value !== password.value){
        validationStatus[3] = false;
    } else{
        validationStatus[3] = true;
    }

    return validationStatus.includes(false) ? false : true;
}


// EVENTOS DE VALIDACIÓN
let timer;
username.addEventListener('keydown', () => {
    clearTimeout(timer);
    timer = setTimeout(async () => {
        const name = await checkUser(username.value)

        if(name.exists){
            setError(username, 'El nombre de usuario ya está en uso')
        }
    }, 400);
})
username.addEventListener('keyup', () => {
    setSuccess(submitBtn);

    if(username.value === ''){
        setError(username, 'Este campo es requerido');
    } else if(hasWhitespace(username)){
        setError(username, 'El campo no puede contener espacios en blanco');
    } else if(username.value.length < 5 || username.value.length > 20){
        setError(username, 'El nombre de usuario debe contener entre 5-20 caracteres');
    }else{
        setSuccess(username);
    }
})

email.addEventListener('keydown', () => {
    clearTimeout(timer);
    timer = setTimeout(async () => {
        const mail = await checkUser(email.value)

        if(mail.exists){
            setError(email, 'El correo electrónico ya está registrado')
        }
    }, 400);
})
email.addEventListener('keyup', () => {
    setSuccess(submitBtn);

    if(email.value === ''){
        setError(email, 'Este campo es requerido')
    } else if(hasWhitespace(email)){
        setError(email, 'El campo no puede contener espacios en blanco');
    } else if(!isValidEmail(email)){
        setError(email, 'Correo electrónico no válido')
    } else{
        setSuccess(email)
    }
})

password.addEventListener('keyup', () => {
    setSuccess(submitBtn);

    if(password.value === ''){
        setError(password, 'Este campo es requerido')
    } else if(hasWhitespace(password)){
        setError(password, 'El campo no puede contener espacios en blanco');
    } else if(password.value.length < 8){
        setError(password, 'La contraseña debe contener por lo menos 8 caracteres')
    } else{
        setSuccess(password)
    }

    if(confirmPassword.value !== password.value && confirmPassword.value !== ''){
        setError(confirmPassword, 'La contraseña debe ser la misma')
    } else if(confirmPassword.value !== ''){
        setSuccess(confirmPassword)
    }
})

confirmPassword.addEventListener('keyup', () => {
    setSuccess(submitBtn);

    if(confirmPassword.value === ''){
        setError(confirmPassword, 'Este campo es requerido')
    } else if(confirmPassword.value !== password.value){
        setError(confirmPassword, 'La contraseña debe ser la misma')
    } else{
        setSuccess(confirmPassword)
    }
})


// MÉTODOS API
async function registerAccount(){
    const res = await fetch(`${url}/auth/register`, {
        method: 'POST',
        headers:{
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
            user_name: username.value,
            email: email.value,
            password: password.value
        })
    })

    submitBtn.parentElement.classList.add("loading");

    return await res.json();
}

async function checkUser(info){
    const res = await fetch(`${url}/auth/check-user?info=${info}`)

    const resJson = await res.json();
    if(resJson) return resJson;
}


// EVENTO DE ENVÍO DEL FORMULARIO
form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const validated = await validateInputs();
    if(!validated){
        return setError(submitBtn, 'Por favor, complete todos los campos');
    }

    const loader = submitBtn.parentElement.classList;

    const res = await registerAccount();
    if(res.error){
        setError(submitBtn, 'Hubo un problema al crear la cuenta');
        loader.remove("loading")
    } else{
        modal.showModal();
        setTimeout(() => {
            window.location.href = res.redirect;
        }, 1000);
    }
})

modal.addEventListener('click', (e) => {
    if(e.target.classList.contains('hn-times-solid')){
        modal.close();
    }
})