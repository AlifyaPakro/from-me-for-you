// Background decorations (stars + leaves) for both pages
const starsEl = document.getElementById('stars');
if (starsEl) {
  for (let i = 0; i < 80; i++) {
    const s = document.createElement('div');
    s.className = 'star';
    const size = Math.random() * 3 + 1;
    s.style.cssText = `
      width:${size}px; height:${size}px;
      top:${Math.random() * 100}%;
      left:${Math.random() * 100}%;
      --d:${(Math.random() * 3 + 1).toFixed(1)}s;
      animation-delay:${(Math.random() * 4).toFixed(1)}s;
    `;
    starsEl.appendChild(s);
  }
}

const leafPaths = [
  'M10,0 C16,4 18,12 10,20 C2,12 4,4 10,0Z',
  'M0,10 C4,2 12,0 16,8 C12,16 4,16 0,10Z',
];
for (let i = 0; i < 14; i++) {
  const leaf = document.createElement('div');
  leaf.className = 'leaf';
  const size = 12 + Math.random() * 16;
  const dur = 8 + Math.random() * 10;
  const delay = Math.random() * 15;
  const left = Math.random() * 100;
  const green = Math.floor(Math.random() * 60 + 60);
  leaf.style.cssText = `
    left:${left}%;
    width:${size}px; height:${size}px;
    animation-duration:${dur.toFixed(1)}s;
    animation-delay:-${delay.toFixed(1)}s;
  `;
  leaf.innerHTML = `<svg width="${size}" height="${size}" viewBox="0 0 20 20">
    <path d="${leafPaths[i % 2]}" fill="rgb(30,${green},30)"/>
  </svg>`;
  document.body.appendChild(leaf);
}

// Index page: input nama -> tampil "selamat datang" -> redirect ke dashboard
const namaInput = document.getElementById('nama');
const confirmBtn = document.getElementById('confirm');
const welcomeText = document.getElementById('welcomeText');

if (namaInput && confirmBtn) {
  const form = confirmBtn.closest('form');
  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    const nama = (namaInput.value || '').trim();
    if (!nama) {
      alert('Nama tidak boleh kosong!');
      return;
    }
    localStorage.setItem('nama', nama);
    if (welcomeText) {
      welcomeText.textContent = `Selamat datang, ${nama}`;
      welcomeText.classList.add('is-visible');
    }
    setTimeout(() => {
      window.location.href = 'dashboard.html';
    }, 900);
  };

  if (form) form.addEventListener('submit', handleSubmit);
  confirmBtn.addEventListener('click', handleSubmit);
}

// Dashboard: tombol kirim balik -> WhatsApp; tombol jangan pencet -> modal QR DANA + "adakah THR"
const dashboardWelcome = document.getElementById('dashboardWelcome');
if (dashboardWelcome) {
  const nama = (localStorage.getItem('nama') || '').trim();
  if (nama) dashboardWelcome.textContent = `Selamat datang, ${nama}`;
}

const btnKirimBalik = document.getElementById('btnKirimBalik');
if (btnKirimBalik) {
  btnKirimBalik.addEventListener('click', () => {
    const phone = '6281238182279';
    const text =
      'oke pastinya dimaafkan, dan مِنَ الْعَائِدِيْنَ وَالْفَائِزِيْنَ juga mohon maaf lahir batin';
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  });
}

const thrModal = document.getElementById('thrModal');
const btnJanganPencet = document.getElementById('btnJanganPencet');
const thrClose = document.getElementById('thrClose');

function openThrModal() {
  if (!thrModal) return;
  thrModal.classList.add('is-open');
  thrModal.setAttribute('aria-hidden', 'false');
}
function closeThrModal() {
  if (!thrModal) return;
  thrModal.classList.remove('is-open');
  thrModal.setAttribute('aria-hidden', 'true');
}

if (btnJanganPencet) btnJanganPencet.addEventListener('click', openThrModal);
if (thrClose) thrClose.addEventListener('click', closeThrModal);
if (thrModal) {
  thrModal.addEventListener('click', (e) => {
    const target = e.target;
    if (target && target.dataset && target.dataset.close === 'true') closeThrModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeThrModal();
  });
}

// (Existing) custom element, kept as-is (only registers if used in HTML)
class mysound extends HTMLElement {
  async connectedCallback() {
    const res = await fetch("audio.html");
    this.innerHTML = await res.text();
  }
}
customElements.define("my-sound", mysound);