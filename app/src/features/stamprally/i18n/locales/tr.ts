import type { PartialMessages } from '../index';

// Türkçe (Turkish). tr, tr-TR, tr-CY üzerinden çözülür.
const tr: PartialMessages = {
  common: {
    start: 'Başla',
    ok: 'Tamam',
    cancel: 'İptal',
    back: 'Geri',
    resetConfirm:
      'Tüm ilerleme (damgalar, kayıt, takas geçmişi) silinip baştan başlansın mı?',
    resetButton: '(Test) İlerlemeyi sıfırla ve baştan başla',
  },
  header: { line1: 'Festival', line2: 'Damga Rallisi' },
  notice: {
    iconAlt: 'Festival Damga Rallisi simgesi',
    title: 'Uyarılar',
    safetyHeading: 'Güvenlik ricası',
    safetyBody:
      'Tapınak alanı ziyaretçilerle kalabalıktır. Çevrenize dikkat edin, koşmayın ve diğer ziyaretçilere çarpmayın. Telefona bakarak yürümek çok tehlikelidir; uygulamayı kullanmadan önce durun.',
    privacyHeading: 'Kişisel veriler hakkında',
    privacyBody:
      'Kaydettiğiniz bilgiler yalnızca bu etkinliğin yürütülmesi, ödül takasının doğrulanması ve istatistik amacıyla kullanılır. Başka amaçla kullanılmaz ve üçüncü taraflarla paylaşılmaz.',
    otherHeading: 'Diğer',
    otherBody:
      'Ödüller sınırlıdır ve tükendiğinde takas sona erebilir. Anlayışınız için teşekkürler.',
  },
  howto: {
    title: 'Nasıl oynanır',
    imagePlaceholder: 'Görsel',
    steps: [
      { title: 'Alandaki QR kodlarını bul!', body: 'Ralli QR kodları tapınak alanının her yerine gizlenmiştir. Haydi bul!' },
      { title: 'Kamerayla tara!', body: 'Uygulamanın kamerasını QR koda doğrultman yeterli. Okununca doğrulama otomatik yapılır.' },
      { title: 'Karakterleri topla!', body: 'Her tarama bir karakter verir. Gizli ifadeyi tamamlamak için 7 tane topla.' },
      { title: 'İfadeyi tamamla ve takas et!', body: '7 tanesini toplayınca ana salona git. Ödülünü almak için uygulama ekranını görevliye göster!' },
    ],
  },
  register: {
    title: 'Katılımcı kaydı',
    nicknameLabel: 'Takma ad (isteğe bağlı)',
    nicknamePlaceholder: 'ör.: Festivalci',
    genderLabel: 'Cinsiyet',
    ageLabel: 'Yaş grubu',
    required: 'Zorunlu',
    selectPlaceholder: 'Lütfen seçin',
    genderError: 'Lütfen cinsiyet seçin',
    ageError: 'Lütfen yaş grubu seçin',
    submit: 'Katıl',
    gender: { male: 'Erkek', female: 'Kadın', other: 'Diğer' },
    age: { student: 'Öğrenci', '10s': 'Genç', '20s': '20–29', '30s': '30–39', '40s': '40–49', '50s': '50–59', '60plus': '60 ve üzeri' },
  },
  rally: {
    countLabel: 'Toplanan damgalar',
    completeBanner1: '7 damganın hepsini topladın!',
    completeBanner2: 'Doğru sırayı düşün ve ifade meydan okumasına giriş.',
    phraseSolvedBanner: 'İfade tamamlandı! Ana salonda takas et',
    exchangedBanner: 'Ödül takası tamamlandı',
    challengeCta: 'Meydan okumaya başla',
    exchangeCta: 'Ödül takasına git',
    cameraCta: '📷 Kamerayı aç',
  },
  camera: {
    instruction: 'QR kodu çerçevenin içine getir',
    permissionDenied: 'Kamera erişimine izin verilmedi. Tarayıcı ayarlarından kameraya izin verin.',
    duplicate: 'Bu QR kod zaten sende var',
    invalid: 'Bu QR kod ralliye ait değil',
    demoScanButton: 'Demo QR yükle',
    debugLabel: 'Hata ayıklama (üretimde gizli): kamerasız damga ver',
  },
  reveal: { title: 'Karakter kazandın!', stampGet: 'DAMGA KAZANDIN!', close: 'Kapat' },
  challenge: {
    title: 'İfade meydan okuması',
    instruction: '7 karakteri yeniden dizerek doğru ifadeyi oluştur!',
    wrong: 'Ne yazık ki doğru cevap değil. Tekrar dene!',
    available: 'Karakterlerin (yerleştirmek için dokun)',
    checkCta: 'Bu sırayı kontrol et',
    exchangeCta: 'Ödül takasına git',
    correctTitle: 'Doğru! Tamamlandı!',
    correctBody: 'Tebrikler! İfadeyi tamamladın.',
  },
  exchange: {
    phraseLabel: 'Tamamlanan ifade',
    title1: 'Damga Rallisi',
    title2: 'Tamamlama Ödülü — Takas Bankosu',
    staffNotice1: 'Ödül takası görevli tarafından yapılmalıdır.',
    staffNotice2: 'Lütfen telefonunu bir görevliye ver.',
    exchangeButton: 'Takas et',
    done: 'Takas edildi',
    confirmQuestion: 'Takas etmek istediğine emin misin?',
    staffHeading: 'Yalnızca görevliler için',
    staffPasscodePlaceholder: 'Görevli şifresi',
    staffPasscodeError: 'Şifre yanlış',
  },
};

export default tr;
