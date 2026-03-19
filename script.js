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

// Storage helpers
const ADMIN_NAME = 'admin alifya';
const STORAGE_KEYS = {
  currentName: 'nama',
  userEntries: 'userEntries', // array of { name: string, at: string }
};

function safeJsonParse(value, fallback) {
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

function getUserEntries() {
  const raw = localStorage.getItem(STORAGE_KEYS.userEntries);
  const parsed = safeJsonParse(raw, []);
  return Array.isArray(parsed) ? parsed : [];
}

function addUserEntry(name) {
  const entries = getUserEntries();
  entries.push({ name, at: new Date().toISOString() });
  localStorage.setItem(STORAGE_KEYS.userEntries, JSON.stringify(entries));
}

function getCurrentName() {
  return (localStorage.getItem(STORAGE_KEYS.currentName) || '').trim();
}

function isAdminName(name) {
  return (name || '').trim().toLowerCase() === ADMIN_NAME;
}

function escapeHtml(str) {
  return String(str)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
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
    localStorage.setItem(STORAGE_KEYS.currentName, nama);
    addUserEntry(nama);
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
  const nama = getCurrentName();
  if (nama) dashboardWelcome.textContent = `Selamat datang, ${nama}`;
}

// Admin-only: show button to user list
const btnUserList = document.getElementById('btnUserList');
if (btnUserList) {
  const nama = getCurrentName();
  if (isAdminName(nama)) {
    btnUserList.hidden = false;
    btnUserList.addEventListener('click', () => {
      window.location.href = 'users.html';
    });
  } else {
    btnUserList.hidden = true;
  }
}

// Admin page: render user entries
const userEntriesList = document.getElementById('userEntriesList');
if (userEntriesList) {
  const nama = getCurrentName();
  if (!isAdminName(nama)) {
    window.location.replace('dashboard.html');
  } else {
    const entries = getUserEntries().slice().reverse();
    if (!entries.length) {
      userEntriesList.innerHTML = '<div class="empty-state">Belum ada user yang masuk.</div>';
    } else {
      userEntriesList.innerHTML = entries
        .map((e) => {
          const when = new Date(e.at);
          const whenText = Number.isNaN(when.getTime()) ? e.at : when.toLocaleString('id-ID');
          const safeName = escapeHtml(e.name || '');
          return `
            <div class="user-entry">
              <div class="user-entry__name">${safeName}</div>
              <div class="user-entry__time">${whenText}</div>
            </div>
          `;
        })
        .join('');
    }
  }
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