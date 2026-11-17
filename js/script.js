const navbar = document.getElementById("navbar");

function saatScroll() {
    const sudahScroll = window.scrollY > 60;
    navbar.classList.toggle("sudah-scroll", sudahScroll);
}
window.addEventListener("scroll", saatScroll, { passive: true });
saatScroll()

const hamburger = document.getElementById("hamburger");
const navLinks = document.getElementById("navLinks");

hamburger.addEventListener("click", () => {
    const terbuka = navLinks.classList.toggle("terbuka");
    hamburger.setAttribute("aria-expanded", String(terbuka));
});

navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
        navLinks.classList.remove("terbuka");
        hamburger.setAttribute("aria-expanded", "false");
    });
});

