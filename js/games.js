const form = document.querySelector(".form-body");
const gameList = document.querySelector("#data");
const formScreen = document.querySelector(".form-dark-background");

const gameImage = document.querySelector("#img");
const gameName = document.querySelector("#name");
const gameTags = document.querySelector("#tags");
const gamePlatforms = document.querySelector("#platforms");
const gameLaunchDate = document.querySelector("#launch-date");
const gameDeveloper = document.querySelector("#developer");

const hideBtn = document.querySelector(".toggle-hide-btn");
const saveBtn = document.querySelector(".form-save-btn");
const closeBtn = document.querySelector(".form-close-btn");
const addGameBtn = document.querySelector(".add-game-btn");


let getData = localStorage.getItem('gameInfo') ? JSON.parse(localStorage.getItem('gameInfo')) : [];

let imgInput = document.querySelector("#input-img");

showInfo();

// gameImage.onchange = function(){
//     let fileReader = new FileReader();
//     let imgInput = document.querySelector(".game-img");

//     fileReader.onload = function(e){
//         // imgUrl = e.target.result;
//         imgInput.src = e.target.result;
//     };

//     fileReader.readAsDataURL(gameImage.files[0]);
// }
gameImage.onchange = function(){
    imgInput.src = URL.createObjectURL(gameImage.files[0]);
}

function showInfo(){
    document.querySelectorAll('#data tr').forEach(info => info.remove());

    getData.forEach((element, index) => {
        let createElement = `
            <tr>
                <!-- Campo: Número ID del juego -->
                <td>${index + 1}</td>
                <!-- Campo: Imágen del juego -->
                <td>
                    <img class="game-img" id="input-img" src="${element.gameImage}" alt="${element.gameName}">
                </td>
                <!-- Campo: Información del juego -->
                <td>
                    <span class="game-name">${element.gameName}</span>
                    <span class="game-tags">
                        <span>${element.gameTags}</span>
                    </span>
                    <span class="game-available-platforms">
                        <span>Disponible en</span>

                        <span>${element.gamePlatforms}</span>
                    </span>
                </td>
                <!-- Campo: Desarrollo -->
                <td>
                    <span class="game-launch-date">${element.gameLaunchDate}</span>
                    <br>
                    <span class="game-developed-by">${element.gameDeveloper}</span>
                </td>
                <!-- Campo: Administración -->
                <td>
                    <button class="toggle-hide-btn" onclick="hideInfo()">
                        <i class="material-symbols-rounded">visibility_off</i>
                    </button>
                    <button class="delete-btn" onclick="deleteInfo(${index})">
                        <i class="material-symbols-rounded">delete</i>
                    </button>
                </td>
            </tr>
        `

        gameList.innerHTML += createElement
    });
}

function deleteInfo(index){
    if(confirm("Está seguro de eliminar?")){
        getData.splice(index, 1);
        localStorage.setItem("gameInfo", JSON.stringify(getData));
        showInfo();
    };
}
function hideInfo(){
    let tr = document.querySelector("#data tr")
    tr.classList.toggle("hide");
}


addGameBtn.addEventListener('click', ()=> {
    formScreen.style.display = "flex";
    form.reset();
})

closeBtn.addEventListener('click', () => {
    formScreen.style.display = "none";
})

form.addEventListener('submit', (e)=> {
    e.preventDefault();

    const information = {
        gameImage: gameImage.src,
        gameName: gameName.value,
        gameTags: gameTags.value,
        gamePlatforms: gamePlatforms.value,
        gameLaunchDate: gameLaunchDate.value,
        gameDeveloper: gameDeveloper.value
    };
    getData.push(information);
    localStorage.setItem('gameInfo', JSON.stringify(getData));
    showInfo();

    form.reset();
    formScreen.style.display = "none";
})