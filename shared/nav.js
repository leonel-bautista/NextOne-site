const navbar = document.querySelector(".nav");
const navBackgrounds = document.querySelectorAll("#background");
const logo = document.querySelector(".home-logo");
const accountBackground = document.querySelector(".account-background");
const homeLinkContainer = document.querySelector(".home-link-container");


window.addEventListener("scroll", () => {
    if(window.scrollY >= 250){
        navbar.classList.add("nav--scrollMode");
        logo.classList.add("logo--scrollMode");
        homeLinkContainer.classList.add("homeLinkContainer--scrollMode");
        accountBackground.classList.add("accountBackground--scrollMode");

        navBackgrounds.forEach((arrayElement, elem) => {
            navBackgrounds[elem].classList.add("background--hidden");
        });

    }
    else{
        navbar.classList.remove("nav--scrollMode");
        logo.classList.remove("logo--scrollMode");
        homeLinkContainer.classList.remove("homeLinkContainer--scrollMode");
        accountBackground.classList.remove("accountBackground--scrollMode");

        navBackgrounds.forEach((arrayElement, elem) => {
            navBackgrounds[elem].classList.remove("background--hidden");
        });

    }
})