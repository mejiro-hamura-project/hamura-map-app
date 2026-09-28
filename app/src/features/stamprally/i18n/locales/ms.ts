import type { PartialMessages } from '../index';

// Bahasa Melayu (Malay). Diselesaikan daripada ms, ms-MY, ms-SG, ms-BN.
const ms: PartialMessages = {
  common: {
    start: 'Mula',
    ok: 'OK',
    cancel: 'Batal',
    back: 'Kembali',
    resetConfirm:
      'Padamkan semua kemajuan (cop, pendaftaran, sejarah tukaran) dan mula semula dari awal?',
    resetButton: '(Ujian) Set semula kemajuan dan mula semula',
  },
  header: { line1: 'Festival', line2: 'Rali Cop' },
  notice: {
    iconAlt: 'Ikon Rali Cop Festival',
    title: 'Perhatian',
    safetyHeading: 'Permintaan keselamatan',
    safetyBody:
      'Kawasan kuil sesak dengan pengunjung. Beri perhatian kepada sekeliling, jangan berlari dan jangan berlanggar dengan pengunjung lain. Berjalan sambil melihat telefon amat berbahaya, jadi berhentilah sebelum menggunakan apl.',
    privacyHeading: 'Tentang maklumat peribadi',
    privacyBody:
      'Maklumat yang didaftarkan hanya digunakan untuk pengendalian acara, pengesahan tukaran hadiah dan tujuan statistik. Ia tidak digunakan untuk tujuan lain dan tidak diberikan kepada pihak ketiga.',
    otherHeading: 'Lain-lain',
    otherBody:
      'Bilangan hadiah adalah terhad dan tukaran mungkin tamat sebaik sahaja habis. Terima kasih atas kefahaman anda.',
  },
  howto: {
    title: 'Cara bermain',
    imagePlaceholder: 'Imej',
    steps: [
      { title: 'Cari kod QR di kawasan ini!', body: 'Kod QR rali disembunyikan di seluruh kawasan kuil. Ayuh cari!' },
      { title: 'Imbas dengan kamera!', body: 'Hala sahaja kamera apl ke kod QR. Selepas dibaca, pengesahan dibuat secara automatik.' },
      { title: 'Kumpul aksara!', body: 'Setiap imbasan memberi satu aksara. Kumpul 7 untuk melengkapkan frasa rahsia.' },
      { title: 'Lengkapkan frasa dan tukarkannya!', body: 'Setelah ada kesemua 7, pergi ke dewan utama. Tunjukkan skrin apl kepada kakitangan untuk mendapatkan hadiah anda!' },
    ],
  },
  register: {
    title: 'Pendaftaran peserta',
    nicknameLabel: 'Nama panggilan (pilihan)',
    nicknamePlaceholder: 'cth.: Peminat Festival',
    genderLabel: 'Jantina',
    ageLabel: 'Kumpulan umur',
    required: 'Wajib',
    selectPlaceholder: 'Sila pilih',
    genderError: 'Sila pilih jantina',
    ageError: 'Sila pilih kumpulan umur',
    submit: 'Sertai',
    gender: { male: 'Lelaki', female: 'Perempuan', other: 'Lain-lain' },
    age: { student: 'Pelajar', '10s': 'Remaja', '20s': '20–29', '30s': '30–39', '40s': '40–49', '50s': '50–59', '60plus': '60 ke atas' },
  },
  rally: {
    countLabel: 'Cop terkumpul',
    completeBanner1: 'Anda telah mengumpul kesemua 7 cop!',
    completeBanner2: 'Fikirkan susunan yang betul dan hadapi cabaran frasa.',
    phraseSolvedBanner: 'Frasa selesai! Tukarkannya di dewan utama',
    exchangedBanner: 'Tukaran hadiah telah selesai',
    challengeCta: 'Hadapi cabaran',
    exchangeCta: 'Ke tukaran hadiah',
    cameraCta: '📷 Hidupkan kamera',
  },
  camera: {
    instruction: 'Letakkan kod QR di dalam bingkai',
    permissionDenied: 'Akses kamera tidak dibenarkan. Benarkan kamera dalam tetapan pelayar.',
    duplicate: 'Anda sudah mempunyai kod QR ini',
    invalid: 'Kod QR ini bukan sebahagian daripada rali',
    demoScanButton: 'Muatkan QR demo',
    debugLabel: 'Nyahpepijat (disembunyikan dalam pengeluaran): beri cop tanpa kamera',
  },
  reveal: { title: 'Dapat aksara!', stampGet: 'DAPAT COP!', close: 'Tutup' },
  challenge: {
    title: 'Cabaran frasa',
    instruction: 'Susun semula 7 aksara untuk membentuk frasa yang betul!',
    wrong: 'Malangnya, bukan jawapan yang betul. Cuba lagi!',
    available: 'Aksara anda (ketik untuk letak)',
    checkCta: 'Semak susunan ini',
    exchangeCta: 'Ke tukaran hadiah',
    correctTitle: 'Betul! Selesai!',
    correctBody: 'Tahniah! Anda telah melengkapkan frasa.',
  },
  exchange: {
    phraseLabel: 'Frasa yang selesai',
    title1: 'Rali Cop',
    title2: 'Hadiah Penamat — Kaunter Tukaran',
    staffNotice1: 'Tukaran hadiah mesti dikendalikan oleh kakitangan.',
    staffNotice2: 'Sila serahkan telefon anda kepada kakitangan.',
    exchangeButton: 'Tukar',
    done: 'Ditukar',
    confirmQuestion: 'Anda pasti mahu menukar?',
    staffHeading: 'Untuk kakitangan sahaja',
    staffPasscodePlaceholder: 'Kod laluan kakitangan',
    staffPasscodeError: 'Kod laluan salah',
  },
};

export default ms;
