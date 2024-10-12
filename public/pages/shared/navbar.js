const toggleNavBtn = document.querySelector(".toggle-btn")
const sidebar = document.querySelector(".sidebar")
const navSide = document.querySelector(".nav-side")
const navMain = document.querySelector(".nav-main")

toggleNavBtn.addEventListener("click", () => {
    sidebar.classList.toggle("expanded")
    navSide.classList.toggle("expanded")
    navMain.classList.toggle("expanded")
})