import type { PartialMessages } from '../index';

// Oʻzbek (Uzbek, Latin). uz, uz-UZ, uz-Latn asosida aniqlanadi.
const uz: PartialMessages = {
  common: {
    start: 'Boshlash',
    ok: 'OK',
    cancel: 'Bekor qilish',
    back: 'Orqaga',
    resetConfirm:
      'Barcha jarayon (muhrlar, roʻyxatdan oʻtish, almashuv tarixi) oʻchirilib, boshidan boshlansinmi?',
    resetButton: '(Test) Jarayonni tiklab, boshidan boshlash',
  },
  header: { line1: 'Bayram', line2: 'Muhr ralli' },
  notice: {
    iconAlt: 'Bayram muhr ralli belgisi',
    title: 'Eslatmalar',
    safetyHeading: 'Xavfsizlik iltimosi',
    safetyBody:
      'Ibodatxona hududi tashrifchilarga toʻla. Atrofga eʼtibor bering, yugurmang va boshqa tashrifchilarga urilmang. Telefonга qarab yurish juda xavfli, shuning uchun ilovadan foydalanishdan oldin toʻxtang.',
    privacyHeading: 'Shaxsiy maʼlumotlar haqida',
    privacyBody:
      'Kiritilgan maʼlumotlar faqat tadbirni oʻtkazish, sovrin almashinuvini tasdiqlash va statistika uchun ishlatiladi. Boshqa maqsadlarda ishlatilmaydi va uchinchi shaxslarga berilmaydi.',
    otherHeading: 'Boshqa',
    otherBody:
      'Sovrinlar soni cheklangan va tugagach almashinuv tugashi mumkin. Tushunganingiz uchun rahmat.',
  },
  howto: {
    title: 'Qanday oʻynash kerak',
    imagePlaceholder: 'Rasm',
    steps: [
      { title: 'Hududdagi QR kodlarni toping!', body: 'Ralli QR kodlari ibodatxona hududining hamma joyida yashiringan. Borib toping!' },
      { title: 'Kamera bilan skanerlang!', body: 'Ilova kamerasini QR kodga qarating, xolos. Oʻqilgach, tekshiruv avtomatik amalga oshadi.' },
      { title: 'Belgilarni toʻplang!', body: 'Har skanerlash bitta belgi beradi. Yashirin iborani toʻldirish uchun 7 ta toʻplang.' },
      { title: 'Iborani toʻldiring va almashtiring!', body: 'Barcha 7 tasi boʻlgach, asosiy zalga boring. Sovringizni olish uchun xodimga ilova ekranini koʻrsating!' },
    ],
  },
  register: {
    title: 'Ishtirokchini roʻyxatga olish',
    nicknameLabel: 'Taxallus (ixtiyoriy)',
    nicknamePlaceholder: 'mas.: Bayram ishqibozi',
    genderLabel: 'Jinsi',
    ageLabel: 'Yosh guruhi',
    required: 'Majburiy',
    selectPlaceholder: 'Tanlang',
    genderError: 'Jinsni tanlang',
    ageError: 'Yosh guruhini tanlang',
    submit: 'Ishtirok etish',
    gender: { male: 'Erkak', female: 'Ayol', other: 'Boshqa' },
    age: { student: 'Oʻquvchi/Talaba', '10s': 'Oʻsmir', '20s': '20–29', '30s': '30–39', '40s': '40–49', '50s': '50–59', '60plus': '60 va undan katta' },
  },
  rally: {
    countLabel: 'Toʻplangan muhrlar',
    completeBanner1: 'Barcha 7 ta muhrni toʻpladingiz!',
    completeBanner2: 'Toʻgʻri tartibni oʻylab, ibora sinovini qabul qiling.',
    phraseSolvedBanner: 'Ibora toʻldirildi! Uni asosiy zalda almashtiring',
    exchangedBanner: 'Sovrin almashinuvi yakunlandi',
    challengeCta: 'Sinovni qabul qilish',
    exchangeCta: 'Sovrin almashinuviga oʻtish',
    cameraCta: '📷 Kamerani yoqish',
  },
  camera: {
    instruction: 'QR kodni ramka ichiga joylashtiring',
    permissionDenied: 'Kameraga ruxsat berilmagan. Brauzer sozlamalarida kameraga ruxsat bering.',
    duplicate: 'Bu QR kod sizda allaqachon bor',
    invalid: 'Bu QR kod ralliga tegishli emas',
    demoScanButton: 'Demo QR yuklash',
    debugLabel: 'Nosozliklarni tuzatish (ishlab chiqarishda yashirin): kamerasiz muhr berish',
  },
  reveal: { title: 'Belgi oldingiz!', stampGet: 'MUHR OLDINGIZ!', close: 'Yopish' },
  challenge: {
    title: 'Ibora sinovi',
    instruction: '7 ta belgini qayta tartiblab, toʻgʻri iborani tuzing!',
    wrong: 'Afsuski, bu toʻgʻri javob emas. Yana urinib koʻring!',
    available: 'Sizning belgilaringiz (joylashtirish uchun bosing)',
    checkCta: 'Bu tartibni tekshirish',
    exchangeCta: 'Sovrin almashinuviga oʻtish',
    correctTitle: 'Toʻgʻri! Tugadi!',
    correctBody: 'Tabriklaymiz! Iborani tuzdingiz.',
  },
  exchange: {
    phraseLabel: 'Tuzilgan ibora',
    title1: 'Muhr ralli',
    title2: 'Yakunlash sovrini — Almashinuv oynasi',
    staffNotice1: 'Sovrin almashinuvini xodim amalga oshirishi kerak.',
    staffNotice2: 'Iltimos, telefoningizni xodimga bering.',
    exchangeButton: 'Almashtirish',
    done: 'Almashtirildi',
    confirmQuestion: 'Haqiqatan almashtirmoqchimisiz?',
    staffHeading: 'Faqat xodimlar uchun',
    staffPasscodePlaceholder: 'Xodim paroli',
    staffPasscodeError: 'Parol notoʻgʻri',
  },
};

export default uz;
