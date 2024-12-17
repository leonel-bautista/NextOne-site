const table = document.querySelector("table");
const searchInput = document.querySelector(".search-box")

const modal = document.querySelector("dialog");
const openFormBtn = document.querySelector(".add-new-btn");
const modalForm = document.querySelector(".modal-form");

const imageInput = modalForm.querySelector("img");
const gameImg = modalForm.querySelector("#gameImg");
const gameName = modalForm.querySelector("#gameName");
const gameLaunch = modalForm.querySelector("#gameLaunch");
const gameDeveloper = modalForm.querySelector("#gameDeveloper");
const gameDescription = modalForm.querySelector("#gameDescription");
const gameStatus = modalForm.querySelector('input[name=gameStatus]:checked');

const url = "https://localhost:3080";


// MÉTODOS API
const placeGames = async (searched) => {
    const res = await fetch(`${url}/api/games`)
    const gamesdata = await res.json();
    
    const tbody = table.querySelector("tbody");
    tbody.innerHTML = "";

    let data;
    searched ? data = searched : data = gamesdata;

    data.forEach((game) => {
        if(game.status === "active"){
            statusText = "Activo";
            statusIcon = "hn-eye-cross-solid";
        } else{
            statusText = "Inactivo";
            statusIcon = "hn-eye-solid";
        }

        if(!game.image){
            fileFolder = "/imgs/";
            gameImage = 'game-default-image.jpg';
        } else{
            fileFolder = "/games-images/";
            gameImage = game.image;
        }

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
                    <span class="game-status ${game.status}">${statusText}</span>
                </td>
                <td>
                    <button class="table-btn toggle-status-btn">
                        <i class="hn ${statusIcon}"></i>
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

const getGame = async (id) => {
    const res = await fetch(`${url}/api/games/${id}`)
    const game = await res.json();

    if(!game.image){
        fileFolder = "/imgs/";
        gameImage = 'game-default-image.jpg';
    } else{
        fileFolder = "/games-images/";
        gameImage = game.image;
    }

    modalForm.dataset.gameId = game.id;

    imageInput.src = `${fileFolder+gameImage}`;
    gameImg.dataset.originalImage = game.image || '';
    gameName.value = game.name || '';
    gameLaunch.value = game.launch_date ? new Date(game.launch_date).toISOString().split('T')[0] : '';
    gameDeveloper.value = game.developer || '';
    if(game.status == "active") modalForm.querySelector("#active-status").checked = true;
    if(game.status == "inactive") modalForm.querySelector("#inactive-status").checked = true;
    gameDescription.value = game.description || '';
}

const saveEdit = async () => {
    const gameId = modalForm.dataset.gameId;
    const originalImg = gameImg.dataset.originalImage;
    const formData = new FormData();

    if(gameImg.files[0]){
        formData.append('game_image', gameImg.files[0]);
    } else{
        formData.append('game_image', originalImg);
    }
    formData.append('game_name', gameName.value);
    formData.append('launch_date', gameLaunch.value);
    formData.append('developer_id', gameDeveloper.value);
    formData.append('game_description', gameDescription.value);
    formData.append('status', gameStatus.checked ? "active" : "inactive");

    await fetch(`${url}/api/games/${gameId}`, {
        method: 'PUT',
        body: formData
    });
};

const saveNewGame = async () => {
    const formData = new FormData();
    formData.append('game_image', gameImg.files[0])
    formData.append('game_name', gameName.value)
    formData.append('launch_date', gameLaunch.value)
    formData.append('developer_id', gameDeveloper.value)
    formData.append('game_description', gameDescription.value)
    formData.append('status', gameStatus.checked ? "active" : "inactive")

    await fetch(`${url}/api/games`, {
        method: 'POST',
        body: formData
    })
}

const toggleGameStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active";

    await fetch(`${url}/api/games/${id}/status`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            status: newStatus
        })
    })
}

const deleteGame = async (id) => {
    await fetch(`${url}/api/games/${id}`, {
        method: 'DELETE'
    })
}

// BUSCADOR
const searchGames = async (name) => {
    const res = await fetch(`${url}/api/games/search?name=${name}`);
    const gamesInfo = await res.json();

    placeGames(gamesInfo);
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
gameImg.onchange = function(){
    if(gameImg.files[0].size < 1000000){   // 1MB
        let fileReader = new FileReader();

        fileReader.onload = function(e){
            imgUrl = e.target.result;
            imageInput.src = imgUrl;
        }

        fileReader.readAsDataURL(gameImg.files[0]);
    }
    else{
        alert("Solo se permiten imagenes con un peso menor a 1MB (megabyte)!")
    }
}

const refreshForm = () => {
    modalForm.reset();

    imageInput.src = "/imgs/game-default-image.jpg";
    gameImg.dataset.originalImage = "";
    modalForm.dataset.gameId = "";
    
    modal.classList.remove("edit-mode");
}


// EVENTOS
// evento al buscar juegos
searchInput.addEventListener('input', () => {
    const searchTerm = searchInput.value;
    if(searchTerm.trim() !== ''){
        // return;
        searchGames(searchTerm);
    } else{
        placeGames();
    }
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
modal.addEventListener('click', (e) => {
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

    if(!modal.classList.contains("edit-mode")){
        saveNewGame();
    }
    else{
        saveEdit();
    }

    placeGames();

    modal.close();
    refreshForm();
})

table.addEventListener('click', (e) => {
    e.preventDefault();

    if(e.target.classList.contains('toggle-status-btn')){
        const gameID = e.target.closest('tr').dataset.id;
        const currentStatus = e.target.closest('tr').querySelector(".game-status").className.replace("game-status ", "");
        console.log(currentStatus)
        toggleGameStatus(gameID, currentStatus);
        placeGames();
    }

    if(e.target.classList.contains('edit-btn')){
        const gameID = e.target.closest('tr').dataset.id;

        modalForm.reset();

        modal.classList.add("edit-mode");
        getGame(gameID);
        const modalTitle = modal.querySelector("h2");
        modalTitle.innerHTML = `Formulario modificación de juego <span data-id="${gameID}">ID ${gameID}</span>`;

        modal.showModal();
    }

    if(e.target.classList.contains('delete-btn')){
        const gameID = e.target.closest('tr').dataset.id;

        if(confirm(`Está seguro de eliminar el juego (ID: ${gameID})?`)){
            deleteGame(gameID);
            placeGames();
        }
    }
});

// evento al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    placeGames();
})