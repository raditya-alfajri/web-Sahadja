const NOMOR_WA = "6281234567890";
const PESAN_AWAL = "Halo Kedai Kopi Sahadja, saya mau pesan";

document.querySelectorAll(".link-wa").forEach((link) => {
    const menu = link.dataset.pesan;
    const teks = menu ? `${PESAN_AWAL} ${menu}`: PESAN_AWAL;
    link.href = `https://wa.me/${NOMOR_WA}?text=${encodeURIComponent(teks)}`;
})


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

