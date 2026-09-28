import type { PartialMessages } from '../index';

// Azərbaycan (Azerbaijani, Latin). az, az-AZ, az-Latn üzərindən həll edilir.
const az: PartialMessages = {
  common: {
    start: 'Başla',
    ok: 'OK',
    cancel: 'Ləğv et',
    back: 'Geri',
    resetConfirm:
      'Bütün irəliləyiş (möhürlər, qeydiyyat, dəyişmə tarixçəsi) silinsin və yenidən başlansın?',
    resetButton: '(Test) İrəliləyişi sıfırla və yenidən başla',
  },
  header: { line1: 'Bayram', line2: 'Möhür rallisi' },
  notice: {
    iconAlt: 'Bayram möhür rallisi nişanı',
    title: 'Qeydlər',
    safetyHeading: 'Təhlükəsizlik xahişi',
    safetyBody:
      'Məbəd ərazisi ziyarətçilərlə doludur. Ətrafa diqqət yetirin, qaçmayın və digər ziyarətçilərlə toqquşmayın. Telefona baxa-baxa yerimək çox təhlükəlidir – tətbiqi işlətməzdən əvvəl dayanın.',
    privacyHeading: 'Şəxsi məlumatlar haqqında',
    privacyBody:
      'Qeyd olunan məlumat yalnız tədbirin keçirilməsi, mükafat dəyişməsinin təsdiqi və statistika üçün istifadə olunur. Başqa məqsədlə istifadə edilmir və üçüncü tərəflərə verilmir.',
    otherHeading: 'Digər',
    otherBody:
      'Mükafatların sayı məhduddur və qurtardıqda dəyişmə başa çata bilər. Anlayışınız üçün təşəkkür edirik.',
  },
  howto: {
    title: 'Necə oynamalı',
    imagePlaceholder: 'Şəkil',
    steps: [
      { title: 'Ərazidəki QR kodları tapın!', body: 'Rallinin QR kodları məbəd ərazisinin hər yerində gizlədilib. Gedin tapın!' },
      { title: 'Kamera ilə skan edin!', body: 'Sadəcə tətbiqin kamerasını QR koda tutun. Oxunduqdan sonra yoxlama avtomatik aparılır.' },
      { title: 'Simvolları toplayın!', body: 'Hər skan bir simvol verir. Gizli ifadəni tamamlamaq üçün 7 toplayın.' },
      { title: 'İfadəni tamamlayın və dəyişin!', body: 'Hamısı 7 olduqda əsas zala gedin. Mükafatınızı almaq üçün işçiyə tətbiqin ekranını göstərin!' },
    ],
  },
  register: {
    title: 'İştirakçı qeydiyyatı',
    nicknameLabel: 'Ləqəb (istəyə bağlı)',
    nicknamePlaceholder: 'məs.: Bayram həvəskarı',
    genderLabel: 'Cins',
    ageLabel: 'Yaş qrupu',
    required: 'Vacib',
    selectPlaceholder: 'Seçin',
    genderError: 'Cinsi seçin',
    ageError: 'Yaş qrupunu seçin',
    submit: 'İştirak et',
    gender: { male: 'Kişi', female: 'Qadın', other: 'Digər' },
    age: { student: 'Şagird/Tələbə', '10s': 'Yeniyetmə', '20s': '20–29', '30s': '30–39', '40s': '40–49', '50s': '50–59', '60plus': '60 və yuxarı' },
  },
  rally: {
    countLabel: 'Toplanmış möhürlər',
    completeBanner1: 'Bütün 7 möhürü topladınız!',
    completeBanner2: 'Düzgün ardıcıllığı fikirləşin və ifadə çağırışını qəbul edin.',
    phraseSolvedBanner: 'İfadə tamamlandı! Onu əsas zalda dəyişin',
    exchangedBanner: 'Mükafat dəyişməsi tamamlandı',
    challengeCta: 'Çağırışı qəbul et',
    exchangeCta: 'Mükafat dəyişməsinə keç',
    cameraCta: '📷 Kameranı aç',
  },
  camera: {
    instruction: 'QR kodu çərçivənin içinə yerləşdirin',
    permissionDenied: 'Kameraya giriş icazə verilməyib. Brauzer parametrlərində kameraya icazə verin.',
    duplicate: 'Bu QR kod artıq sizdədir',
    invalid: 'Bu QR kod rallinin bir hissəsi deyil',
    demoScanButton: 'Demo QR yüklə',
    debugLabel: 'Sazlama (istehsalda gizli): kamerasız möhür ver',
  },
  reveal: { title: 'Simvol qazandınız!', stampGet: 'MÖHÜR QAZANDINIZ!', close: 'Bağla' },
  challenge: {
    title: 'İfadə çağırışı',
    instruction: '7 simvolu yenidən düzərək düzgün ifadəni yaradın!',
    wrong: 'Təəssüf, düzgün cavab deyil. Yenidən cəhd edin!',
    available: 'Sizin simvollarınız (yerləşdirmək üçün toxunun)',
    checkCta: 'Bu ardıcıllığı yoxla',
    exchangeCta: 'Mükafat dəyişməsinə keç',
    correctTitle: 'Düzgün! Tamamlandı!',
    correctBody: 'Təbriklər! İfadəni tamamladınız.',
  },
  exchange: {
    phraseLabel: 'Tamamlanmış ifadə',
    title1: 'Möhür rallisi',
    title2: 'Tamamlama mükafatı — Dəyişmə pəncərəsi',
    staffNotice1: 'Mükafat dəyişməsini işçi aparmalıdır.',
    staffNotice2: 'Zəhmət olmasa telefonunuzu işçiyə verin.',
    exchangeButton: 'Dəyiş',
    done: 'Dəyişdirildi',
    confirmQuestion: 'Həqiqətən dəyişmək istəyirsiniz?',
    staffHeading: 'Yalnız işçilər üçün',
    staffPasscodePlaceholder: 'İşçi parolu',
    staffPasscodeError: 'Parol yanlışdır',
  },
};

export default az;
