const form = document.querySelector(".form-body");
const gameList = document.querySelector("#data");
const formScreen = document.querySelector(".form-dark-background");

const gameImage = document.querySelector("#img");
const gameName = document.querySelector("#name");
const gameTags = document.querySelector("#tags");
const gamePlatforms = document.querySelector("#platforms");
const gameLaunchDate = document.querySelector("#launch-date");
const gameDeveloper = document.querySelector("#developer");

const closeBtn = document.querySelector(".form-close-btn");
const addGameBtn = document.querySelector(".add-game-btn");


let getData = localStorage.getItem('gameInfo') ? JSON.parse(localStorage.getItem('gameInfo')) : [];

const showGames = () => {
    gameList.innerHTML = "";

    getData.forEach((game, index) => {
        const tableRow = `
            <tr data-id="${game.id}" class="${!game.isActive && "hidden"}">
                <!-- Campo: Número del juego -->
                <td>${index + 1}</td>
                <!-- Campo: Imágen del juego -->
                <td>
                    <img class="game-img" src="${game.image}" alt="${game.name}">
                </td>
                <!-- Campo: Información del juego -->
                <td>
                    <span class="game-name">${game.name}</span>
                    <span class="game-tags">
                        <span>${game.tags}</span>
                    </span>
                    <span class="game-available-platforms">
                        <span>Disponible en</span>

                        <span>${game.platforms}</span>
                    </span>
                </td>
                <!-- Campo: Desarrollo -->
                <td>
                    <span class="game-launch-date">${game.launchDate}</span>
                    <br>
                    <span class="game-developed-by">${game.developer}</span>
                </td>
                <!-- Campo: Administración -->
                <td>
                    <button class="toggle-hide-btn hide">
                        <i class="material-symbols-rounded hide">visibility_off</i>
                    </button>
                    <button class="delete-btn delete">
                        <i class="material-symbols-rounded delete">delete</i>
                    </button>
                </td>
            </tr>
        `

        gameList.innerHTML += tableRow;
    });
}

gameList.addEventListener('click', (event) => {
    if(event.target.classList.contains("hide")){
        const id = event.target.closest("tr").dataset.id;
        const game = getData.find((game) => game.id == id);
    
        game.isActive = !game.isActive;

        event.target.closest("tr").classList.toggle("hidden");
        
        localStorage.setItem('gameInfo', JSON.stringify(getData));
        showGames();
    }
    if(event.target.classList.contains("delete")){
        const id = event.target.closest("tr").dataset.id;
        const game = getData.find((game) => game.id == id);

        if(confirm("Está seguro de eliminar?")){
            getData.splice(game, 1);

            const tableRow = event.target.closest("tr");
            tableRow.remove();

            localStorage.setItem('gameInfo', JSON.stringify(getData));
        };
    }
})

addGameBtn.addEventListener('click', () => {
    formScreen.style.display = "flex";
    form.reset();
})

closeBtn.addEventListener('click', () => {
    formScreen.style.display = "none";
})

gameImage.addEventListener('change', function () {
    const reader = new FileReader();

    reader.addEventListener("load", () => {
        imgURL = reader.result;
    });

    reader.readAsDataURL(this.files[0]);
})

form.addEventListener('submit', async (event)=> {
    event.preventDefault();

    const value_gameName = gameName.value.trim();
    const value_gameDeveloper = gameDeveloper.value.trim();

    const game = {
        id: Date.now(),
        image: imgURL,
        name: value_gameName,
        tags: gameTags.value,
        platforms: gamePlatforms.value,
        launchDate: gameLaunchDate.value,
        developer: value_gameDeveloper,
        isActive: true,
    };
    getData.push(game);
    localStorage.setItem('gameInfo', JSON.stringify(getData));
    showGames();

    form.reset();
    formScreen.style.display = "none";
})

document.addEventListener('DOMContentLoaded', () => {
    showGames();
})