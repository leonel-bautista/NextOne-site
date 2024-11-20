// import {methods as gameInfo} from '../../modules/games/games.controller.js';

const table = document.querySelector("table");

const modal = document.querySelector("dialog");
const openFormBtn = document.querySelector(".add-game-btn")
const closeFormBtn = document.querySelector(".close-modal-btn")
const modalForm = document.querySelector(".modal-form")


openFormBtn.addEventListener('click', () => {
    modal.showModal();
})
closeFormBtn.addEventListener('click', () => {
    modal.close();
})

modalForm.addEventListener('submit', async(e) => {
    e.preventDefault();

    const res = await fetch("http://localhost:3080/api/games", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            game_image: e.target.gameImg.value,
            game_name: e.target.gameName.value,
            launch_date: e.target.gameLaunch.value,
            developer_id: e.target.gameDeveloper.value,
            game_description: e.target.gameDescription.value
        })
    });

    const resJson = await res.json();
    if(resJson.redirect){
        window.location.href = resJson.redirect;
    }

    modal.close();
    showGameList();
})

async function showGameList(){
    const res = await fetch("http://localhost:3080/api/games");
    const gamesdata = await res.json();

    const tableBody = table.querySelector("tbody");
    tableBody.innerHTML = '';

    gamesdata.forEach((game) => {
        const tableRow = `
            <tr>
                <td>${game.ID}</td>
                <td>
                    <img class="game-img" src="/src/uploads/1729048490157.jpg" alt="">
                </td>
                <td>
                    <span class="game-name">${game.Name}</span>
                    <div class="game-tags">
                        <span>Disparos</span><span>Multijugador</span><span>Multijugador</span>
                    </div>
                    <div class="game-available-platforms">
                        <img src="/icons/platform-steam-logo.png" alt="">
                        <img src="/icons/platform-epic-games-logo.png" alt="">
                        <img src="/icons/platform-ea-app-logo.png" alt="">
                        <img src="/icons/platform-xbox-logo.png" alt="">
                    </div>
                </td>
                <td>
                    <span class="game-launch-date">${game.LaunchDate}</span>
                    <br>
                    <span class="game-developer">${game.Developer}</span>
                </td>
                <td>
                    <button class="table-btn">
                        <i class="hn hn-eye-solid"></i>
                    </button>
                    <button class="table-btn">
                        <i class="hn hn-pen-solid"></i>
                    </button>
                    <button class="table-btn">
                        <i class="hn hn-trash-alt-solid"></i>
                    </button>
                </td>
            </tr>
        `

        tableBody.innerHTML += tableRow;
    
        // console.log(game)
    })

    // console.log(data)
}

document.addEventListener('DOMContentLoaded', () => {
    showGameList();
})
// const showGames = () => {
//     gameInfo.forEach((game, index) => {
//         const tableRow = `
//             <tr data-id="${game_id}">
//                 <td>${game_id}</td>
//                 <td>
//                     <img class="game-img" src="/src/uploads/1729048490157.jpg" alt="">
//                 </td>
//                 <td>
//                     <span class="game-name">${game_name}</span>
//                     <div class="game-tags">
//                         <span>Disparos</span><span>Multijugador</span><span>Multijugador</span>
//                     </div>
//                     <div class="game-available-platforms">
//                         <img src="/icons/platform-steam-logo.png" alt="">
//                         <img src="/icons/platform-epic-games-logo.png" alt="">
//                         <img src="/icons/platform-ea-app-logo.png" alt="">
//                         <img src="/icons/platform-xbox-logo.png" alt="">
//                     </div>
//                 </td>
//                 <td>
//                     <span class="game-launch-date">99 HHH 9999</span>
//                     <br>
//                     <span class="game-developer">${developer_id}</span>
//                 </td>
//                 <td>
//                     <button class="table-btn">
//                         <i class="hn hn-eye-solid"></i>
//                     </button>
//                     <button class="table-btn">
//                         <i class="hn hn-pen-solid"></i>
//                     </button>
//                     <button class="table-btn">
//                         <i class="hn hn-trash-alt-solid"></i>
//                     </button>
//                 </td>
//             </tr>
//         `

//         gameList.innerHTML += tableRow;
//     });
// }