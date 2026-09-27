import type { PartialMessages } from '../index';

// Dansk (Danish). Løses fra da, da-DK.
const da: PartialMessages = {
  common: {
    start: 'Start',
    ok: 'OK',
    cancel: 'Annuller',
    back: 'Tilbage',
    resetConfirm:
      'Slet al fremgang (stempler, registrering, bytteoversigt) og start forfra?',
    resetButton: '(Test) Nulstil fremgang og start forfra',
  },
  header: { line1: 'Festival', line2: 'Stempelrally' },
  notice: {
    iconAlt: 'Ikon for festivalens stempelrally',
    title: 'Bemærk',
    safetyHeading: 'Sikkerhedsopfordring',
    safetyBody:
      'Helligdomsområdet er fyldt med besøgende. Vær opmærksom på dine omgivelser, lad være med at løbe og stød ikke ind i andre besøgende. Det er meget farligt at gå og kigge på telefonen – stå stille, før du bruger appen.',
    privacyHeading: 'Om personoplysninger',
    privacyBody:
      'De registrerede oplysninger bruges kun til afvikling af arrangementet, bekræftelse af præmiebytte og statistik. De bruges ikke til andre formål og videregives ikke til tredjeparter.',
    otherHeading: 'Andet',
    otherBody:
      'Antallet af præmier er begrænset, og byttet kan slutte, når de er brugt op. Tak for din forståelse.',
  },
  howto: {
    title: 'Sådan spiller du',
    imagePlaceholder: 'Billede',
    steps: [
      { title: 'Find QR-koderne på området!', body: 'Rallyets QR-koder er gemt rundt omkring på helligdomsområdet. Tag ud og find dem!' },
      { title: 'Scan dem med kameraet!', body: 'Ret blot appens kamera mod QR-koden. Når den er læst, kontrolleres den automatisk.' },
      { title: 'Saml tegnene!', body: 'Hver scanning giver ét tegn. Saml 7 for at fuldføre den skjulte sætning.' },
      { title: 'Fuldfør sætningen, og byt den!', body: 'Med alle 7 skal du gå til hovedhallen. Vis appskærmen til personalet for at få din præmie!' },
    ],
  },
  register: {
    title: 'Deltagerregistrering',
    nicknameLabel: 'Kaldenavn (valgfrit)',
    nicknamePlaceholder: 'f.eks.: Festivalgænger',
    genderLabel: 'Køn',
    ageLabel: 'Aldersgruppe',
    required: 'Påkrævet',
    selectPlaceholder: 'Vælg',
    genderError: 'Vælg køn',
    ageError: 'Vælg aldersgruppe',
    submit: 'Deltag',
    gender: { male: 'Mand', female: 'Kvinde', other: 'Andet' },
    age: { student: 'Studerende', '10s': 'Teenager', '20s': '20–29', '30s': '30–39', '40s': '40–49', '50s': '50–59', '60plus': '60 og derover' },
  },
  rally: {
    countLabel: 'Indsamlede stempler',
    completeBanner1: 'Du har samlet alle 7 stempler!',
    completeBanner2: 'Tænk over den rigtige rækkefølge, og tag sætningsudfordringen.',
    phraseSolvedBanner: 'Sætningen er fuldført! Byt den i hovedhallen',
    exchangedBanner: 'Præmiebyttet er gennemført',
    challengeCta: 'Tag udfordringen',
    exchangeCta: 'Gå til præmiebytte',
    cameraCta: '📷 Tænd kameraet',
  },
  camera: {
    instruction: 'Placer QR-koden inden for rammen',
    permissionDenied: 'Ingen kameraadgang. Tillad kameraet i browserens indstillinger.',
    duplicate: 'Du har allerede denne QR-kode',
    invalid: 'Denne QR-kode hører ikke til rallyet',
    demoScanButton: 'Indlæs demo-QR',
    debugLabel: 'Fejlfinding (skjult i produktion): tildel stempel uden kamera',
  },
  reveal: { title: 'Tegn opnået!', stampGet: 'STEMPEL OPNÅET!', close: 'Luk' },
  challenge: {
    title: 'Sætningsudfordringen',
    instruction: 'Omarranger de 7 tegn for at danne den rigtige sætning!',
    wrong: 'Ærgerligt, det er ikke det rigtige svar. Prøv igen!',
    available: 'Dine tegn (tryk for at placere)',
    checkCta: 'Tjek denne rækkefølge',
    exchangeCta: 'Gå til præmiebytte',
    correctTitle: 'Rigtigt! Fuldført!',
    correctBody: 'Tillykke! Du har fuldført sætningen.',
  },
  exchange: {
    phraseLabel: 'Fuldført sætning',
    title1: 'Stempelrally',
    title2: 'Gennemførelsespræmie — Bytteskranke',
    staffNotice1: 'Præmiebyttet skal håndteres af personalet.',
    staffNotice2: 'Aflever din telefon til en medarbejder.',
    exchangeButton: 'Byt',
    done: 'Byttet',
    confirmQuestion: 'Vil du virkelig bytte?',
    staffHeading: 'Kun for personale',
    staffPasscodePlaceholder: 'Personalekode',
    staffPasscodeError: 'Forkert kode',
  },
};

export default da;
