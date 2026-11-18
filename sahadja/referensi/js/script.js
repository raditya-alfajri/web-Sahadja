/* ==========================================================
   KEDAI KOPI SAHADJA – script.js
   ========================================================== */

// Menandai bahwa JavaScript aktif (dipakai CSS untuk animasi .muncul)
document.documentElement.classList.add("js");

/* ---------- 1. PENGATURAN UTAMA (ubah di sini) ---------- */
// Nomor WhatsApp pemilik: pakai format 62, tanpa 0 di depan, tanpa spasi/tanda strip
const NOMOR_WA = "6281234567890";
const PESAN_AWAL = "Halo Kedai Kopi Sahadja, saya mau pesan";

// Jam buka: 0 = Minggu, 5 = Jumat, 6 = Sabtu
const HARI_BUKA = [5, 6, 0];
const JAM_BUKA = 16.5;   // 16.30
const JAM_TUTUP = 22.5;  // 22.30

// Data menu, sesuai papan menu Sahadja. Harga dalam ribuan.
const DATA_MENU = [
  { kategori: "Coffee Classic", item: [
    ["Tubruk Robusta", 8], ["Tubruk Blend", 8], ["Vietnam Drip", 13],
    ["Manual Brew V60", 25], ["Japanese", 25],
  ]},
  { kategori: "Non Coffee", item: [
    ["Matcha Latte", 15], ["Redvelvet Latte", 15], ["Tarolatte", 15], ["Chocolatte", 15],
  ]},
  { kategori: "Kopi Susu", item: [
    ["Kopsu Original", 13], ["Kopsu Gula Aren", 15], ["Kopsu Butterscotch", 15],
    ["Kopsu Hazelnut", 15], ["Kopsu Vanilla", 15],
  ]},
  { kategori: "Americano", item: [
    ["Hot Americano", 13], ["Ice Americano", 13], ["Coffeela", 18],
    ["Brewberry", 18], ["Cranoffee", 18],
  ]},
  { kategori: "Snack", item: [] },   // kosong = tampil "Segera hadir"
  { kategori: "Others", item: [
    ["Ice Tea Jasmine", 8], ["Ice Tea Lychee", 12], ["Air Mineral", 5], ["Extra Shoot Coffee", 3],
  ]},
];

/* ---------- 2. SEMUA LINK WHATSAPP ---------- */
// Setiap elemen dengan class "link-wa" diarahkan ke chat WhatsApp.
// Kalau ada data-pesan="Nama Menu", nama menu ikut masuk ke teks chat.
document.querySelectorAll(".link-wa").forEach((link) => {
  const menu = link.dataset.pesan;
  const teks = menu ? `${PESAN_AWAL} ${menu}` : PESAN_AWAL;
  link.href = `https://wa.me/${NOMOR_WA}?text=${encodeURIComponent(teks)}`;
});

/* ---------- 3. MEMBUAT PAPAN MENU DARI DATA ---------- */
const papan = document.getElementById("menuPapan");

DATA_MENU.forEach((grup) => {
  const kolom = document.createElement("div");
  kolom.className = "menu-kategori muncul";

  let isi = `<h3 class="kategori-judul"><span>${grup.kategori}</span></h3>`;

  if (grup.item.length === 0) {
    isi += `<p class="menu-kosong">Segera hadir</p>`;
  } else {
    isi += grup.item
      .map(([nama, harga]) => `
        <div class="menu-item">
          <span>${nama}</span>
          <span class="titik-titik"></span>
          <span class="harga">${harga}K</span>
        </div>`)
      .join("");
  }

  kolom.innerHTML = isi;
  papan.appendChild(kolom);
});

/* ---------- 4. STATUS BUKA / TUTUP ---------- */
function cekStatus() {
  const sekarang = new Date();
  const jam = sekarang.getHours() + sekarang.getMinutes() / 60;
  const hariIni = HARI_BUKA.includes(sekarang.getDay());
  const buka = hariIni && jam >= JAM_BUKA && jam < JAM_TUTUP;

  const teks = buka
    ? "Sedang buka, tutup pukul 22.30"
    : "Sedang tutup · buka Jumat – Minggu, 16.30";
  const html = `<span class="titik ${buka ? "buka" : "tutup"}"></span>${teks}`;

  document.getElementById("statusHero").innerHTML = html;
  document.getElementById("statusInfo").innerHTML = html;
}
cekStatus();
setInterval(cekStatus, 60 * 1000); // cek ulang tiap menit

/* ---------- 5. NAVBAR BERUBAH SAAT SCROLL + TOMBOL KE ATAS ---------- */
const navbar = document.getElementById("navbar");
const keAtas = document.getElementById("keAtas");

function saatScroll() {
  const sudahScroll = window.scrollY > 60;
  navbar.classList.toggle("sudah-scroll", sudahScroll);
  document.body.classList.toggle("sudah-scroll", sudahScroll);
  keAtas.classList.toggle("tampil", window.scrollY > 600);
}
window.addEventListener("scroll", saatScroll, { passive: true });
saatScroll();

keAtas.addEventListener("click", () => window.scrollTo({ top: 0 }));

/* ---------- 6. MENU HAMBURGER (HP) ---------- */
const hamburger = document.getElementById("hamburger");
const navLinks = document.getElementById("navLinks");

function tutupNav() {
  navLinks.classList.remove("terbuka");
  hamburger.setAttribute("aria-expanded", "false");
}
hamburger.addEventListener("click", () => {
  const terbuka = navLinks.classList.toggle("terbuka");
  hamburger.setAttribute("aria-expanded", String(terbuka));
});
navLinks.querySelectorAll("a").forEach((a) => a.addEventListener("click", tutupNav));

/* ---------- 7. ANIMASI MUNCUL SAAT DI-SCROLL ---------- */
// IntersectionObserver memberi tahu kapan elemen masuk ke layar
const pengamat = new IntersectionObserver((entri) => {
  entri.forEach((e) => {
    if (e.isIntersecting) {
      e.target.classList.add("terlihat");
      pengamat.unobserve(e.target); // cukup sekali
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll(".muncul").forEach((el, i) => {
  el.style.transitionDelay = `${(i % 3) * 0.1}s`; // jeda kecil antar kartu sejajar
  pengamat.observe(el);
});

/* ---------- 8. LIGHTBOX GALERI ---------- */
const fotoGaleri = [...document.querySelectorAll("#galeriGrid img")];
const lightbox = document.getElementById("lightbox");
const gambarBesar = document.getElementById("lightboxGambar");
let posisi = 0;

function tampilkanFoto(i) {
  posisi = (i + fotoGaleri.length) % fotoGaleri.length; // memutar ke awal/akhir
  gambarBesar.src = fotoGaleri[posisi].src;
  gambarBesar.alt = fotoGaleri[posisi].alt;
}
function bukaLightbox(i) {
  tampilkanFoto(i);
  lightbox.hidden = false;
  document.body.style.overflow = "hidden";
  document.getElementById("lightboxTutup").focus();
}
function tutupLightbox() {
  lightbox.hidden = true;
  document.body.style.overflow = "";
  fotoGaleri[posisi].parentElement.focus();
}

fotoGaleri.forEach((img, i) => img.parentElement.addEventListener("click", () => bukaLightbox(i)));
document.getElementById("lightboxTutup").addEventListener("click", tutupLightbox);
document.getElementById("lightboxKiri").addEventListener("click", () => tampilkanFoto(posisi - 1));
document.getElementById("lightboxKanan").addEventListener("click", () => tampilkanFoto(posisi + 1));
lightbox.addEventListener("click", (e) => { if (e.target === lightbox) tutupLightbox(); });

document.addEventListener("keydown", (e) => {
  if (lightbox.hidden) return;
  if (e.key === "Escape") tutupLightbox();
  if (e.key === "ArrowLeft") tampilkanFoto(posisi - 1);
  if (e.key === "ArrowRight") tampilkanFoto(posisi + 1);
});

/* ---------- 9. TAHUN OTOMATIS DI FOOTER ---------- */
document.getElementById("tahun").textContent = new Date().getFullYear();
