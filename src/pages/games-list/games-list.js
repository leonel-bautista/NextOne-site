const slideshow = document.querySelector(".slideshow");
const searchInput = document.querySelector("search input[type='text']");
const dropdown = document.querySelector(".dropdown");
const gamesList = document.querySelector(".games-list");

const url = "https://c95s12k5-3080.brs.devtunnels.ms";


// LÓGICA DEL SLIDESHOW
let amount = 5;
let autoSlideInterval;
let slideIndex = 1; // valor inicial
let slideDuration = 5000; // en milisegundos

const slideshowGames = async () => {
  const res = await fetch(`${url}/api/games/latest?amount=${amount}`);
  const gameInfo = await res.json();

  slideshow.innerHTML = `
    <button class="arrow-left"><i class="hn hn-angle-left-solid"></i></button>
    <button class="arrow-right"><i class="hn hn-angle-right-solid"></i></button>

    <div class="slider"></div>
  `
  
  const slider = slideshow.querySelector(".slider");

  gameInfo.forEach((game, index) => {
    const slideBtn = document.createElement("button");
    slideBtn.className = `slide-btn ${index + 1}`;
    slider.appendChild(slideBtn);

    if(!game.image){
      fileFolder = "/imgs/"
      gameImage = 'game-default-image.jpg';
    }else{
      fileFolder = "/games-images/"
      gameImage = game.image;
    }

    const sliderItem = `
      <div class="slider-item">
          <h1 class="item-title">${game.name}</h1>
          <div class="item-info">
              <span>${game.developer}</span>
              <span>Clasificación: +12 Años</span>
          </div>
          <a href="/games/app/${game.id}" class="item-more-btn">Ver Detalles</a>
          <img src="${fileFolder+gameImage}" alt="Portada de ${game.name}" class="item-image">
      </div>
    `

    // slideshow.innerHTML += sliderItem;
    slideshow.insertAdjacentHTML('beforeend', sliderItem);
  })

  const slideBtns = slideshow.querySelectorAll(".slide-btn");
  const slides = slideshow.querySelectorAll(".slider-item");

  // FUNCIONES DE CONTROL DEL SLIDESHOW
  const plusSlides = (n) => showSlides(slideIndex += n);
  const currentSlide = (n) => showSlides(slideIndex = n);

  const showSlides = (n) => {
    if(n > slides.length) slideIndex = 1;
    if(n < 1) slideIndex = slides.length;

    slides.forEach(slide => slide.classList.remove("current-slide"));
    slideBtns.forEach(btn => btn.classList.remove("current-slide"));

    slides[slideIndex-1].classList.add("current-slide");
    slideBtns[slideIndex-1].classList.add("current-slide");
  }

  const startAutoSlide = () => autoSlideInterval = setInterval(() => plusSlides(1), slideDuration);
  const stopAutoSlide = () => clearInterval(autoSlideInterval);

  // EVENTOS DEL SLIDESHOW
  slider.addEventListener('click', (e) => {
    if(e.target.classList.contains("slide-btn")){
      const index = Array.from(slideBtns).indexOf(e.target) + 1;
      currentSlide(index);
    };
  })
  slideshow.addEventListener('click', (e) => {
    if(e.target.classList.contains("arrow-left")) plusSlides(-1);
    if(e.target.classList.contains("arrow-right")) plusSlides(1);
  })

  slideshow.addEventListener('mouseenter', stopAutoSlide);
  slideshow.addEventListener('mouseleave', startAutoSlide);

  showSlides(slideIndex);
  startAutoSlide();
}


// BUSCADOR
const searchGames = async (name) => {
  const res = await fetch(`${url}/api/games/search-active?name=${name}`);
  const gamesInfo = await res.json();

  dropdown.innerHTML = '';

  gamesInfo.forEach((game) => {
    if(!game.game_image){
      fileFolder = "/imgs/"
      gameImage = 'game-default-image.jpg';
    } else{
      fileFolder = "/games-images/"
      gameImage = game.game_image;
    }

    const item = `
      <a href="/games/app/${game.game_id}" class="dropdown-item">
          <img src="${fileFolder+gameImage}"
          alt="Portada de ${game.game_name}" class="dropdown-item-img">
          <span class="dropdown-item-name">${game.game_name}</span>
      </a>
    `

    dropdown.innerHTML += item;

    const dropdownItem = dropdown.querySelector(".dropdown-item");
    dropdownItem.addEventListener('click', () => {
      dropdown.innerHTML = '';
    })
  })
}


// LISTADO DE JUEGOS
let offset = 0; // por defecto
let limit = 4;
let loading = false;

const placeGames = async () => {
  if(loading) return;
  loading = true;

  const res = await fetch(`${url}/api/games/fixed?limit=${limit}&offset=${offset}`)
  const gamesInfo = await res.json();

  gamesInfo.forEach((game) => {
    if(!game.image){
      fileFolder = "/imgs/"
      gameImage = 'game-default-image.jpg';
    } else{
      fileFolder = "/games-images/"
      gameImage = game.image;
    }

    const info = `
      <a href="/games/app/${game.id}" class="listed-game">
          <img src="${fileFolder+gameImage}"
          alt="Portada de ${game.name}" class="game-img">
          <span class="game-name">${game.name}</span>
      </a>
    `

    gamesList.innerHTML += info;
  })

  offset += limit;
  loading = false;
}


// EVENTOS GENERALES
document.addEventListener('DOMContentLoaded', () => {
    slideshowGames(5);
    placeGames();
})

document.addEventListener('click', (e) => {
    if (!searchInput.contains(e.target)){
        dropdown.innerHTML = '';
    }
});

searchInput.addEventListener('input', () => {
    const searchTerm = searchInput.value;
    if(searchTerm.trim() === ''){
        dropdown.innerHTML = '';
        return;
    }

    searchGames(searchTerm)
})

window.addEventListener('scroll', () => {
  if(window.innerHeight + window.scrollY >= document.body.offsetHeight - 2){
    placeGames();
  }
})