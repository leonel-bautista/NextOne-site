const toggleNavBtn = document.querySelector(".toggle-nav-btn");
const navbar = document.querySelector(".navbar");
const navbar_main = document.querySelector(".nav-main");
const navbar_background = document.querySelector(".blackout-content");

toggleNavBtn.addEventListener('click', () => {
    navbar.classList.toggle("expanded-nav");
    navbar_main.classList.toggle("expanded-nav");
    navbar_background.classList.toggle("expanded-nav");
})
navbar_background.addEventListener('click', () => {
    navbar.classList.remove("expanded-nav");
    navbar_main.classList.remove("expanded-nav");
    navbar_background.classList.remove("expanded-nav");
})