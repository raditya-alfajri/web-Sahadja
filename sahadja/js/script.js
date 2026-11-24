/* ==========================================================
   KEDAI KOPI SAHADJA – script.js
   ========================================================== */

// Tanda bahwa JavaScript aktif. CSS memakai class ini untuk animasi .muncul,
// jadi kalau JavaScript mati, semua konten tetap terlihat.
document.documentElement.classList.add("js");

/* ---------- 1. PENGATURAN UTAMA (ubah di sini) ---------- */
// GANTI: nomor WhatsApp pemilik. Format 62, tanpa 0 di depan, tanpa spasi/strip.
const NOMOR_WA = "6287752673197";
const PESAN_AWAL = "Halo Kedai Kopi Sahadja, saya mau pesan";

// Jam buka. Hari: 0 = Minggu, 5 = Jumat, 6 = Sabtu. Jam memakai desimal: 16.5 = 16.30
const HARI_BUKA = [5, 6, 0];
const JAM_BUKA = 16.5;
const JAM_TUTUP = 22.5;

// Data papan menu. Harga dalam ribuan rupiah.
// Kategori dengan item kosong akan tampil "Segera hadir".
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
  { kategori: "Snack", item: [] },
  { kategori: "Others", item: [
    ["Ice Tea Jasmine", 8], ["Ice Tea Lychee", 12], ["Air Mineral", 5], ["Extra Shoot Coffee", 3],
  ]},
];

/* ---------- 2. SEMUA LINK WHATSAPP ---------- */
// Setiap elemen ber-class "link-wa" diarahkan ke chat WhatsApp NOMOR_WA.
// Kalau ada data-pesan="Nama Menu", nama menu ikut masuk ke teks chat.
document.querySelectorAll(".link-wa").forEach((link) => {
  const menu = link.dataset.pesan;
  const teks = menu ? `${PESAN_AWAL} ${menu}` : PESAN_AWAL;
  link.href = `https://wa.me/${NOMOR_WA}?text=${encodeURIComponent(teks)}`;
});

// Nomor yang tampil di bagian Kontak dibuat dari NOMOR_WA juga,
// jadi cukup ganti nomor di satu tempat. Contoh: 6281234567890 -> 0812-3456-7890
function formatNomor(nomor) {
  const lokal = "0" + nomor.slice(2);
  return lokal.replace(/^(\d{4})(\d{4})(\d+)$/, "$1-$2-$3");
}
document.getElementById("teksNomorWa").textContent = formatNomor(NOMOR_WA);

/* ---------- 3. PAPAN MENU DIBUAT DARI DATA_MENU ---------- */
const menuPapan = document.getElementById("menuPapan");

DATA_MENU.forEach((grup) => {
  const kolom = document.createElement("div");
  kolom.className = "menu-kategori muncul";

  let isi = `<h3 class="kategori-judul"><span>${grup.kategori}</span></h3>`;

  if (grup.item.length === 0) {
    isi += `<p class="menu-kosong">Segera hadir</p>`;
  } else {
    // Setiap item jadi satu baris: nama ........ harga
    isi += grup.item.map(([nama, harga]) => `
      <div class="menu-item">
        <span>${nama}</span>
        <span class="titik-titik" aria-hidden="true"></span>
        <span class="harga">${harga}K</span>
      </div>`).join("");
  }

  kolom.innerHTML = isi;
  menuPapan.appendChild(kolom);
});

/* ---------- 4. STATUS SEDANG BUKA / TUTUP ---------- */
// Mengubah angka desimal jadi teks jam. Contoh: 16.5 -> "16.30"
function formatJam(angka) {
  const jam = Math.floor(angka);
  const menit = Math.round((angka - jam) * 60);
  return `${jam}.${String(menit).padStart(2, "0")}`;
}

function cekStatus() {
  // Pakai jam WIB (UTC+7), bukan jam HP pengunjung,
  // supaya status tetap benar walau dibuka dari zona waktu lain.
  const wib = new Date(Date.now() + 7 * 60 * 60 * 1000);
  const hari = wib.getUTCDay();
  const jam = wib.getUTCHours() + wib.getUTCMinutes() / 60;

  const hariBuka = HARI_BUKA.includes(hari);
  const buka = hariBuka && jam >= JAM_BUKA && jam < JAM_TUTUP;

  let teks;
  if (buka) {
    teks = `Sedang buka, tutup pukul ${formatJam(JAM_TUTUP)}`;
  } else if (hariBuka && jam < JAM_BUKA) {
    teks = `Sedang tutup · buka hari ini pukul ${formatJam(JAM_BUKA)}`;
  } else {
    teks = `Sedang tutup · buka Jumat – Minggu, ${formatJam(JAM_BUKA)}`;
  }

  const html = `<span class="titik ${buka ? "buka" : "tutup"}" aria-hidden="true"></span>${teks}`;
  document.getElementById("statusHero").innerHTML = html;
  document.getElementById("statusInfo").innerHTML = html;
}
cekStatus();
setInterval(cekStatus, 60 * 1000); // cek ulang setiap 1 menit

/* ---------- 5. NAVBAR BERUBAH SAAT SCROLL + TOMBOL KE ATAS ---------- */
const navbar = document.getElementById("navbar");
const keAtas = document.getElementById("keAtas");

function saatScroll() {
  const sudahScroll = window.scrollY > 60;
  navbar.classList.toggle("sudah-scroll", sudahScroll);
  keAtas.classList.toggle("tampil", window.scrollY > 600); // muncul setelah 600px
}
window.addEventListener("scroll", saatScroll, { passive: true });
saatScroll();

// Tanpa "behavior", browser ikut aturan CSS: halus biasanya,
// langsung lompat kalau pengguna memilih reduced motion.
keAtas.addEventListener("click", () => window.scrollTo({ top: 0 }));

/* ---------- 6. MENU HAMBURGER (HP) ---------- */
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

/* ---------- 7. ANIMASI MUNCUL SAAT DI-SCROLL ---------- */
// IntersectionObserver memberi tahu saat elemen masuk ke layar,
// tanpa perlu menghitung posisi scroll sendiri.
const pengamat = new IntersectionObserver((daftar) => {
  daftar.forEach((entri) => {
    if (entri.isIntersecting) {
      entri.target.classList.add("terlihat");
      pengamat.unobserve(entri.target); // cukup sekali
    }
  });
}, { threshold: 0.15 });

// Dijalankan setelah papan menu dibuat, supaya kolom menu ikut teramati
document.querySelectorAll(".muncul").forEach((el, i) => {
  el.style.animationDelay = `${(i % 3) * 0.1}s`; // jeda kecil antar kartu yang sejajar
  pengamat.observe(el);
});

/* ---------- 8. LIGHTBOX GALERI ---------- */
const fotoGaleri = [...document.querySelectorAll("#galeriGrid img")];
const lightbox = document.getElementById("lightbox");
const gambarBesar = document.getElementById("lightboxGambar");
const tombolTutup = document.getElementById("lightboxTutup");
let posisi = 0;

function tampilkanFoto(i) {
  // Sisa bagi membuat foto berputar: setelah foto terakhir kembali ke foto pertama
  posisi = (i + fotoGaleri.length) % fotoGaleri.length;
  gambarBesar.src = fotoGaleri[posisi].src;
  gambarBesar.alt = fotoGaleri[posisi].alt;
}

function bukaLightbox(i) {
  tampilkanFoto(i);
  lightbox.hidden = false;
  document.body.style.overflow = "hidden"; // halaman di belakang tidak ikut ter-scroll
  tombolTutup.focus();
}

function tutupLightbox() {
  lightbox.hidden = true;
  document.body.style.overflow = "";
  fotoGaleri[posisi].parentElement.focus(); // fokus kembali ke foto yang tadi dibuka
}

fotoGaleri.forEach((img, i) => {
  img.parentElement.addEventListener("click", () => bukaLightbox(i));
});
tombolTutup.addEventListener("click", tutupLightbox);
document.getElementById("lightboxKiri").addEventListener("click", () => tampilkanFoto(posisi - 1));
document.getElementById("lightboxKanan").addEventListener("click", () => tampilkanFoto(posisi + 1));

// Klik di area gelap (di luar foto) menutup lightbox
lightbox.addEventListener("click", (e) => {
  if (e.target === lightbox) tutupLightbox();
});

// Keyboard: Esc menutup, panah kiri/kanan berpindah foto
document.addEventListener("keydown", (e) => {
  if (lightbox.hidden) return;
  if (e.key === "Escape") tutupLightbox();
  if (e.key === "ArrowLeft") tampilkanFoto(posisi - 1);
  if (e.key === "ArrowRight") tampilkanFoto(posisi + 1);
});

/* ---------- 9. TAHUN OTOMATIS DI FOOTER ---------- */
document.getElementById("tahun").textContent = new Date().getFullYear();
