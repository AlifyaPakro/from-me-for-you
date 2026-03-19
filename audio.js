// ─────────────────────────────────────────────────────────────
//  audio.js — Satu file dipanggil di semua halaman
//  Teknik: sessionStorage untuk menyimpan posisi audio
// ─────────────────────────────────────────────────────────────

// ── 1. BUAT OBJEK AUDIO ──────────────────────────────────────
//
// Ganti URL di bawah dengan file musik kamu.
// Bisa pakai: MP3, OGG, WAV, AAC
// Contoh: const audio = new Audio('/musik/background.mp3');
//
// Untuk demo ini kita gunakan audio publik dari internet:
const audio = new Audio(
  'audio/instrumen.mp3'
);

audio.loop   = true;  // ulangi terus
audio.volume = 0.7;   // volume awal

// ── 2. AMBIL POSISI TERAKHIR ─────────────────────────────────
//
// Sebelum halaman di-reload / pindah halaman, posisi audio
// disimpan ke sessionStorage. Di sini kita baca kembali.
//
const posisiTersimpan = sessionStorage.getItem('audioPos');
if (posisiTersimpan) {
  audio.currentTime = parseFloat(posisiTersimpan);
}

// ── 3. AUTOPLAY SETELAH INTERAKSI ───────────────────────────
//
// Browser modern memblokir autoplay bersuara.
// Solusi: coba play() langsung, kalau gagal tunggu klik pertama.
//
let sudahPlay = false;

function cobaPlay() {
  if (sudahPlay) return;
  audio.play()
    .then(() => {
      sudahPlay = true;
      updatePlayBtn(true);
      updateStatus('Diputar');
    })
    .catch(() => {
      // Autoplay diblokir — tunggu interaksi user
      updateStatus('Klik di mana saja untuk memulai');
    });
}

// Coba langsung saat halaman dimuat
cobaPlay();

// Fallback: putar saat klik pertama di mana saja
document.addEventListener('click', () => {
  if (!sudahPlay) cobaPlay();
}, { once: true });

// ── 4. SIMPAN POSISI SECARA BERKALA ─────────────────────────
//
// Simpan setiap 500ms agar tidak kehilangan banyak progress
// kalau user tiba-tiba menutup halaman.
//
setInterval(() => {
  if (!audio.paused) {
    sessionStorage.setItem('audioPos', audio.currentTime);
  }
}, 500);

// ── 5. SIMPAN POSISI TEPAT SEBELUM PINDAH HALAMAN ───────────
//
// Event 'beforeunload' dipicu saat halaman akan ditutup/reload.
// Ini momen paling penting untuk menyimpan posisi.
//
window.addEventListener('beforeunload', () => {
  sessionStorage.setItem('audioPos', audio.currentTime);
});

// ── 6. UPDATE UI PLAYER DI NAV ───────────────────────────────
function pad(n) { return String(Math.floor(n)).padStart(2, '0'); }

function formatWaktu(detik) {
  const m = Math.floor(detik / 60);
  const s = Math.floor(detik % 60);
  return `${m}:${pad(s)}`;
}

function updatePlayBtn(isPlaying) {
  const btn = document.getElementById('playBtn');
  if (btn) btn.textContent = isPlaying ? '⏸' : '▶';
}

function updateStatus(teks) {
  const el = document.getElementById('statusVal');
  if (el) el.textContent = teks;
}

// Update waktu & progress bar setiap detik
audio.addEventListener('timeupdate', () => {
  const label = document.getElementById('timeLabel');
  const fill  = document.getElementById('progressFill');

  if (label) label.textContent = formatWaktu(audio.currentTime);
  if (fill && audio.duration) {
    fill.style.width = (audio.currentTime / audio.duration * 100) + '%';
  }
});

audio.addEventListener('play',  () => { updatePlayBtn(true);  updateStatus('Diputar'); sudahPlay = true; });
audio.addEventListener('pause', () => { updatePlayBtn(false); updateStatus('Dijeda'); });

// ── 7. TOMBOL PLAY / PAUSE ───────────────────────────────────
const playBtn = document.getElementById('playBtn');
if (playBtn) {
  playBtn.addEventListener('click', () => {
    if (audio.paused) {
      audio.play();
    } else {
      audio.pause();
      sessionStorage.setItem('audioPos', audio.currentTime);
    }
  });
}

// ── 8. TOMBOL MUTE ───────────────────────────────────────────
const muteBtn = document.getElementById('muteBtn');
if (muteBtn) {
  muteBtn.addEventListener('click', () => {
    audio.muted = !audio.muted;
    muteBtn.textContent = audio.muted ? '🔇' : '🔊';
  });
}

// ── 9. SLIDER VOLUME ─────────────────────────────────────────
const volSlider = document.getElementById('volSlider');
if (volSlider) {
  volSlider.value = audio.volume;
  volSlider.addEventListener('input', () => {
    audio.volume = volSlider.value;
    sessionStorage.setItem('audioVol', audio.volume);
  });

  // Kembalikan volume terakhir
  const volTersimpan = sessionStorage.getItem('audioVol');
  if (volTersimpan) {
    audio.volume  = parseFloat(volTersimpan);
    volSlider.value = volTersimpan;
  }
}