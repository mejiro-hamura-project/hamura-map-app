import type { PartialMessages } from '../index';

// Polski (Polish). Rozwiązywane z pl, pl-PL.
const pl: PartialMessages = {
  common: {
    start: 'Start',
    ok: 'OK',
    cancel: 'Anuluj',
    back: 'Wstecz',
    resetConfirm:
      'Usunąć cały postęp (pieczątki, rejestrację, historię wymiany) i zacząć od nowa?',
    resetButton: '(Test) Zresetuj postęp i zacznij od nowa',
  },
  header: { line1: 'Festiwal', line2: 'Rajd pieczątek' },
  notice: {
    iconAlt: 'Ikona rajdu pieczątek festiwalu',
    title: 'Uwagi',
    safetyHeading: 'Prośba o bezpieczeństwo',
    safetyBody:
      'Teren świątyni bywa zatłoczony. Uważaj na otoczenie, nie biegaj i nie wpadaj na innych zwiedzających. Chodzenie z wzrokiem w telefonie jest bardzo niebezpieczne — zatrzymaj się przed użyciem aplikacji.',
    privacyHeading: 'O danych osobowych',
    privacyBody:
      'Podane dane są używane wyłącznie do organizacji wydarzenia, potwierdzenia wymiany nagród i celów statystycznych. Nie są wykorzystywane w innych celach ani przekazywane osobom trzecim.',
    otherHeading: 'Inne',
    otherBody:
      'Liczba nagród jest ograniczona, a wymiana może się zakończyć po ich wyczerpaniu. Dziękujemy za wyrozumiałość.',
  },
  howto: {
    title: 'Jak grać',
    imagePlaceholder: 'Obraz',
    steps: [
      { title: 'Znajdź kody QR na terenie!', body: 'Kody QR rajdu są ukryte na całym terenie świątyni. Ruszaj na poszukiwania!' },
      { title: 'Zeskanuj je aparatem!', body: 'Wystarczy skierować aparat aplikacji na kod QR. Po odczytaniu weryfikacja jest automatyczna.' },
      { title: 'Zbieraj znaki!', body: 'Każde skanowanie daje jeden znak. Zbierz 7, aby ułożyć ukryte hasło.' },
      { title: 'Ułóż hasło i wymień!', body: 'Mając wszystkie 7, idź do głównej hali. Pokaż ekran aplikacji obsłudze, aby odebrać nagrodę!' },
    ],
  },
  register: {
    title: 'Rejestracja uczestnika',
    nicknameLabel: 'Pseudonim (opcjonalnie)',
    nicknamePlaceholder: 'np.: Festiwalowicz',
    genderLabel: 'Płeć',
    ageLabel: 'Grupa wiekowa',
    required: 'Wymagane',
    selectPlaceholder: 'Wybierz',
    genderError: 'Wybierz płeć',
    ageError: 'Wybierz grupę wiekową',
    submit: 'Weź udział',
    gender: { male: 'Mężczyzna', female: 'Kobieta', other: 'Inna' },
    age: { student: 'Uczeń/Student', '10s': 'Nastolatek', '20s': '20–29', '30s': '30–39', '40s': '40–49', '50s': '50–59', '60plus': '60 i więcej' },
  },
  rally: {
    countLabel: 'Zebrane pieczątki',
    completeBanner1: 'Zebrano wszystkie 7 pieczątek!',
    completeBanner2: 'Pomyśl o właściwej kolejności i podejmij wyzwanie z hasłem.',
    phraseSolvedBanner: 'Hasło ułożone! Wymień je w głównej hali',
    exchangedBanner: 'Wymiana nagrody została zakończona',
    challengeCta: 'Podejmij wyzwanie',
    exchangeCta: 'Przejdź do wymiany nagrody',
    cameraCta: '📷 Włącz aparat',
  },
  camera: {
    instruction: 'Umieść kod QR w ramce',
    permissionDenied: 'Brak dostępu do aparatu. Zezwól na aparat w ustawieniach przeglądarki.',
    duplicate: 'Masz już ten kod QR',
    invalid: 'Ten kod QR nie należy do rajdu',
    demoScanButton: 'Wczytaj demonstracyjny kod QR',
    debugLabel: 'Debugowanie (ukryte w produkcji): przyznaj pieczątkę bez aparatu',
  },
  reveal: { title: 'Zdobyto znak!', stampGet: 'ZDOBYTO PIECZĄTKĘ!', close: 'Zamknij' },
  challenge: {
    title: 'Wyzwanie z hasłem',
    instruction: 'Ułóż 7 znaków w odpowiedniej kolejności, aby utworzyć poprawne hasło!',
    wrong: 'Niestety, to nie jest poprawna odpowiedź. Spróbuj ponownie!',
    available: 'Twoje znaki (dotknij, aby umieścić)',
    checkCta: 'Sprawdź tę kolejność',
    exchangeCta: 'Przejdź do wymiany nagrody',
    correctTitle: 'Poprawnie! Ukończono!',
    correctBody: 'Gratulacje! Ułożono hasło.',
  },
  exchange: {
    phraseLabel: 'Ułożone hasło',
    title1: 'Rajd pieczątek',
    title2: 'Nagroda za ukończenie — Punkt wymiany',
    staffNotice1: 'Wymiana nagrody musi zostać przeprowadzona przez obsługę.',
    staffNotice2: 'Przekaż telefon członkowi obsługi.',
    exchangeButton: 'Wymień',
    done: 'Wymieniono',
    confirmQuestion: 'Na pewno wymienić?',
    staffHeading: 'Tylko dla obsługi',
    staffPasscodePlaceholder: 'Kod obsługi',
    staffPasscodeError: 'Nieprawidłowy kod',
  },
};

export default pl;
