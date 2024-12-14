const table = document.querySelector("table");

const modal = document.querySelector("dialog");
const openFormBtn = document.querySelector(".add-new-btn");
const modalForm = document.querySelector(".modal-form");

const fileInput = modalForm.querySelector("input[type=file]")
const image = modalForm.querySelector("img")

const url = "http://localhost:3080";


// evento al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    getGames();
})


// evento para abrir y cerrar la pantalla de alta
openFormBtn.addEventListener('click', () => {
    if(modal.classList.contains("edit-mode")){
        refreshForm();
        modal.showModal();
    }
    else{
        modal.showModal();
        const modalTitle = modal.querySelector("h2");
        modalTitle.innerHTML = "Formulario alta de juego";
    }
    modal.showModal();
})
modal.addEventListener('click', async (e) => {
    if(e.target.classList.contains('cancel-btn')){
        modal.close();
        refreshForm();
    }
    if(e.target.classList.contains('close-modal-btn')){
        if(modal.classList.contains("edit-mode")){
            modal.close();
            refreshForm();
        }
        else{
            modal.close();
        }
    }
})

// evento al guardar los cambios del formulario de alta
modalForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // if(modal.classList.)

    // console.log(gameID)



    if(!modal.classList.contains("edit-mode")){
        postGame(e);
    }
    else{
        putGame(gameID, e);
    }

    // getGames();

    modal.close();
    refreshForm();
})

table.addEventListener('click', async(e) => {
    e.preventDefault();

    // if(e.target.classList.contains('toggle-status-btn')){
    //     const gameID = e.target.closest('tr').dataset.id;

    //     patchGameStatus(gameID)

    //     getGames();
    // }

    if(e.target.classList.contains('edit-btn')){
        const gameID = e.target.closest('tr').dataset.id;

        modalForm.reset();

        modal.classList.add("edit-mode");
        getOneGame(gameID);
        const modalTitle = modal.querySelector("h2");
        modalTitle.innerHTML = `Formulario modificación de juego | ID: ${gameID}`;

        modal.showModal();
    }

    if(e.target.classList.contains('delete-btn')){
        const gameID = e.target.closest('tr').dataset.id;

        if(confirm(`Está seguro de eliminar el juego (ID: ${gameID})?`)){
            deleteGame(gameID);

            getGames();
        }
    }
});


// MÉTODOS API
async function getGames(){
    const res = await fetch(`${url}/api/games`)

    const gamesdata = await res.json();
    const tbody = table.querySelector('tbody');
    tbody.innerHTML = "";

    gamesdata.forEach((game) => {
        let gameStatus = "";
        let gameImage = "";

        game.status == "active" ? gameStatus = "Activo" : gameStatus = "Inactivo";

        if(!game.image){
            fileFolder = "/imgs/"
            gameImage = 'game-default-image.jpg';
        } else{
            fileFolder = "/games-images/"
            gameImage = game.image;
        }
        console.log(gameImage)

        const tableRow = `
            <tr data-id="${game.id}">
                <td>
                    <input type="checkbox" id="select-row-input">
                </td>
                <td>${game.id}</td>
                <td>
                    <img class="game-img" src="${fileFolder+gameImage}" alt="Portada de ${game.name}">
                </td>
                <td>
                    <span class="game-name">${game.name}</span>
                </td>
                <td>
                    <span class="game-launch-date">${formatDate(game.launch_date)}</span>
                    <br>
                    <span class="game-developer">${game.developer}</span>
                </td>
                <td>
                    <span class="game-status ${game.status}">${gameStatus}</span>
                </td>
                <td>
                    <button class="table-btn toggle-status-btn">
                        <i class="hn hn-eye-solid"></i>
                    </button>
                    <button class="table-btn edit-btn">
                        <i class="hn hn-pen-solid"></i>
                    </button>
                    <button class="table-btn delete-btn">
                        <i class="hn hn-trash-alt-solid"></i>
                    </button>
                </td>
            </tr>
        `

        tbody.innerHTML += tableRow;
    })
}

async function getOneGame(id){
    const res = await fetch(`${url}/api/games/${id}`, {
        params: JSON.stringify({
            game_id: id
        })
    })
    const gamesdata = await res.json();

    image.src = `/games-images/${gamesdata[0].image}`;
    // modalForm.querySelector("#gameImg").value = gamesdata[0].image;
    modalForm.querySelector("#gameName").value = gamesdata[0].name;
    // modalForm.querySelector("#gameLaunch").value = gamesdata[0].launch_date;
    modalForm.querySelector("#gameDeveloper").value = gamesdata[0].developer;
    if(gamesdata[0].status == "active") modalForm.querySelector("#active-status").checked = true;
    if(gamesdata[0].status == "inactive") modalForm.querySelector("#inactive-status").checked = true;
    modalForm.querySelector("#gameDescription").value = gamesdata[0].description;
}

async function postGame(e){
    const formData = new FormData();
    formData.append('game_image', e.target.gameImg.files[0])
    formData.append('game_name', e.target.gameName.value)
    formData.append('launch_date', e.target.gameLaunch.value)
    formData.append('developer_id', e.target.gameDeveloper.value)
    formData.append('game_description', e.target.gameDescription.value)
    formData.append('status', e.target.gameStatus.value)

    await fetch("http://localhost:3080/api/games", {
        method: 'POST',
        body: formData
    })
}

async function putGame(id, e){
    const formData = new FormData();
    formData.append('game_image', e.target.gameImg.files[0])
    formData.append('game_name', e.target.gameName.value)
    formData.append('launch_date', e.target.gameLaunch.value)
    formData.append('developer_id', e.target.gameDeveloper.value)
    formData.append('game_description', e.target.gameDescription.value)
    formData.append('status', e.target.gameStatus.value)

    await fetch(`http://localhost:3080/api/games/${id}`, {
        method: 'PUT',
        params: JSON.stringify({
            game_id: id
        }),
        body: formData
    })
}

// async function patchGame(id){

// }

async function deleteGame(id){
    await fetch(`${url}/api/games/${id}`, {
        method: 'DELETE',
        params: JSON.stringify({
            game_id: id
        })
    })
}


// FUNCIONES DE FILTRO
// funcion que le da un formato a una fecha
const formatDate = (date) => {
    const dateValue = new Date(date);
    const dateFormatter = new Intl.DateTimeFormat("es-ar", {
        dateStyle: "medium",
    })
    const formattedDate = dateFormatter.format(dateValue).toUpperCase()

    return formattedDate;
}
// funcion que cambia el contenedor de la imágen en tiempo real
fileInput.onchange = function(){
    if(fileInput.files[0].size < 1000000){   // 1MB
        let fileReader = new FileReader();

        fileReader.onload = function(e){
            imgUrl = e.target.result;
            image.src = imgUrl;
        }

        fileReader.readAsDataURL(fileInput.files[0]);
    }
    else{
        alert("Solo se permiten imagenes con un peso menor a 1MB (megabyte)!")
    }
}

const refreshForm = () => {
    modalForm.reset();
    image.src = "/imgs/game-default-image.jpg"
    
    modal.classList.remove("edit-mode");
}