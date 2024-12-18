const launchDate = document.querySelector("#launchDate")
const tagsContainer = document.querySelector(".tags-names")
const platformsContainer = document.querySelector(".platforms-names")

const imageInput = document.querySelector("#image")


// funcion que le da un formato a una fecha
const formatDate = (date) => {
    const dateValue = new Date(date);
    const dateFormatter = new Intl.DateTimeFormat("es-ar", {
        dateStyle: "long",
    })
    const formattedDate = dateFormatter.format(dateValue).toUpperCase()

    launchDate.innerHTML = formattedDate;
}

const insertTags = (tagsNames) => {
    if(!tagsNames) return tagsContainer.innerHTML = '<span id="tag">Sin etiquetas</span>';

    const tags = tagsNames.split(',');
    tagsContainer.innerHTML = "";

    tags.forEach((tag) => {
        const tagElement = `
            <span id="tag">${tag.trim()}</span>
        `

        tagsContainer.innerHTML += tagElement;
    })
}
const insertPlatforms = (platformsNames) => {
    if(!platformsNames) return platformsContainer.innerHTML = '<p class="no-platforms">Plataformas no disponibles</p>';

    const platforms = platformsNames.split(',');
    platformsContainer.innerHTML = "<p>Disponible en</p>";

    platforms.forEach((platform) => {
        const platformElement = `
            <a href="#" id="platform">
                <i class="hn hn-external-link"></i>
                <span>${platform.trim()}</span>
            </a>
        `
        
        platformsContainer.innerHTML += platformElement;
    })
}
const formatImage = (image) => {
    if(!image) return imageInput.src = "/imgs/game-default-image.jpg";

    imageInput.src = `/games-images/${image}`;
}

document.addEventListener('DOMContentLoaded', () => {
    const tagsValues = tagsContainer.dataset.tags;
    const platformsValue = platformsContainer.dataset.platforms;
    const launchDateValue = launchDate.dataset.date;
    const imageValue = imageInput.dataset.image;
    insertTags(tagsValues);
    insertPlatforms(platformsValue);
    formatDate(launchDateValue);
    formatImage(imageValue)
})