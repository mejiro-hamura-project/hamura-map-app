import type { PartialMessages } from '../index';

// Bahasa Indonesia (Indonesian). Diselesaikan dari id, id-ID.
const id: PartialMessages = {
  common: {
    start: 'Mulai',
    ok: 'OK',
    cancel: 'Batal',
    back: 'Kembali',
    resetConfirm:
      'Hapus semua progres (stempel, pendaftaran, riwayat penukaran) dan mulai dari awal?',
    resetButton: '(Uji) Setel ulang progres dan mulai dari awal',
  },
  header: { line1: 'Festival', line2: 'Rali Stempel' },
  notice: {
    iconAlt: 'Ikon Rali Stempel Festival',
    title: 'Perhatian',
    safetyHeading: 'Imbauan keselamatan',
    safetyBody:
      'Area kuil ramai pengunjung. Perhatikan sekeliling, jangan berlari atau menabrak pengunjung lain. Berjalan sambil melihat ponsel sangat berbahaya, jadi berhentilah sebelum menggunakan aplikasi.',
    privacyHeading: 'Tentang data pribadi',
    privacyBody:
      'Informasi yang didaftarkan hanya digunakan untuk penyelenggaraan acara, konfirmasi penukaran hadiah, dan tujuan statistik. Tidak digunakan untuk tujuan lain dan tidak dibagikan ke pihak ketiga.',
    otherHeading: 'Lainnya',
    otherBody:
      'Jumlah hadiah terbatas dan penukaran dapat berakhir setelah habis. Terima kasih atas pengertiannya.',
  },
  howto: {
    title: 'Cara bermain',
    imagePlaceholder: 'Gambar',
    steps: [
      { title: 'Temukan kode QR di area!', body: 'Kode QR rali tersembunyi di seluruh area kuil. Ayo cari!' },
      { title: 'Pindai dengan kamera!', body: 'Cukup arahkan kamera aplikasi ke kode QR. Setelah terbaca, verifikasi otomatis.' },
      { title: 'Kumpulkan huruf!', body: 'Setiap pindaian memberi satu huruf. Kumpulkan 7 untuk melengkapi frasa rahasia.' },
      { title: 'Lengkapi frasa dan tukarkan!', body: 'Setelah punya 7, pergilah ke aula utama. Tunjukkan layar aplikasi ke staf untuk mengambil hadiahmu!' },
    ],
  },
  register: {
    title: 'Pendaftaran peserta',
    nicknameLabel: 'Nama panggilan (opsional)',
    nicknamePlaceholder: 'mis.: Peserta Festival',
    genderLabel: 'Jenis kelamin',
    ageLabel: 'Kelompok usia',
    required: 'Wajib',
    selectPlaceholder: 'Silakan pilih',
    genderError: 'Silakan pilih jenis kelamin',
    ageError: 'Silakan pilih kelompok usia',
    submit: 'Ikut serta',
    gender: { male: 'Laki-laki', female: 'Perempuan', other: 'Lainnya' },
    age: { student: 'Pelajar', '10s': 'Remaja', '20s': '20–29', '30s': '30–39', '40s': '40–49', '50s': '50–59', '60plus': '60 ke atas' },
  },
  rally: {
    countLabel: 'Stempel terkumpul',
    completeBanner1: 'Kamu sudah mengumpulkan 7 stempel!',
    completeBanner2: 'Pikirkan urutan yang benar dan hadapi tantangan frasa.',
    phraseSolvedBanner: 'Frasa selesai! Tukarkan di aula utama',
    exchangedBanner: 'Penukaran hadiah telah selesai',
    challengeCta: 'Hadapi tantangan',
    exchangeCta: 'Ke penukaran hadiah',
    cameraCta: '📷 Aktifkan kamera',
  },
  camera: {
    instruction: 'Tempatkan kode QR di dalam bingkai',
    permissionDenied: 'Akses kamera tidak diizinkan. Izinkan kamera di pengaturan browser.',
    duplicate: 'Kamu sudah memiliki kode QR ini',
    invalid: 'Kode QR ini bukan bagian dari rali',
    demoScanButton: 'Muat QR demo',
    debugLabel: 'Debug (disembunyikan di produksi): beri stempel tanpa kamera',
  },
  reveal: { title: 'Dapat huruf!', stampGet: 'DAPAT STEMPEL!', close: 'Tutup' },
  challenge: {
    title: 'Tantangan frasa',
    instruction: 'Susun ulang 7 huruf untuk membentuk frasa yang benar!',
    wrong: 'Sayang sekali, jawabannya belum tepat. Coba lagi!',
    available: 'Huruf milikmu (ketuk untuk menempatkan)',
    checkCta: 'Periksa urutan ini',
    exchangeCta: 'Ke penukaran hadiah',
    correctTitle: 'Benar! Selesai!',
    correctBody: 'Selamat! Kamu menyelesaikan frasa.',
  },
  exchange: {
    phraseLabel: 'Frasa yang selesai',
    title1: 'Rali Stempel',
    title2: 'Hadiah Penyelesaian — Meja Penukaran',
    staffNotice1: 'Penukaran hadiah harus dilakukan oleh staf.',
    staffNotice2: 'Serahkan ponselmu kepada staf.',
    exchangeButton: 'Tukar',
    done: 'Sudah ditukar',
    confirmQuestion: 'Yakin ingin menukar?',
    staffHeading: 'Khusus staf',
    staffPasscodePlaceholder: 'Kode sandi staf',
    staffPasscodeError: 'Kode sandi salah',
  },
};

export default id;
