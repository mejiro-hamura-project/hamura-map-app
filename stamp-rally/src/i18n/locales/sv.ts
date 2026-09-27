import type { PartialMessages } from '../index';

// Svenska (Swedish). Löses från sv, sv-SE, sv-FI.
const sv: PartialMessages = {
  common: {
    start: 'Börja',
    ok: 'OK',
    cancel: 'Avbryt',
    back: 'Tillbaka',
    resetConfirm:
      'Radera alla framsteg (stämplar, registrering, byteshistorik) och börja om från början?',
    resetButton: '(Test) Återställ framsteg och börja om',
  },
  header: { line1: 'Festival', line2: 'Stämpelrally' },
  notice: {
    iconAlt: 'Ikon för festivalens stämpelrally',
    title: 'Observera',
    safetyHeading: 'Säkerhetsuppmaning',
    safetyBody:
      'Helgedomsområdet är fullt av besökare. Var uppmärksam på omgivningen, spring inte och krocka inte med andra besökare. Att gå och titta på mobilen är mycket farligt – stanna upp innan du använder appen.',
    privacyHeading: 'Om personuppgifter',
    privacyBody:
      'De registrerade uppgifterna används endast för att arrangera evenemanget, bekräfta prisbyten och för statistik. De används inte för andra ändamål och lämnas inte till tredje part.',
    otherHeading: 'Övrigt',
    otherBody:
      'Antalet priser är begränsat och bytet kan avslutas när de tar slut. Tack för din förståelse.',
  },
  howto: {
    title: 'Så spelar du',
    imagePlaceholder: 'Bild',
    steps: [
      { title: 'Hitta QR-koderna på området!', body: 'Rallyts QR-koder är gömda runt om på helgedomsområdet. Ge dig ut och leta!' },
      { title: 'Skanna dem med kameran!', body: 'Rikta bara appens kamera mot QR-koden. När den lästs sker kontrollen automatiskt.' },
      { title: 'Samla tecknen!', body: 'Varje skanning ger ett tecken. Samla 7 för att fullborda den dolda frasen.' },
      { title: 'Fullborda frasen och byt in den!', body: 'Med alla 7, gå till huvudhallen. Visa appskärmen för personalen för att få ditt pris!' },
    ],
  },
  register: {
    title: 'Deltagarregistrering',
    nicknameLabel: 'Smeknamn (valfritt)',
    nicknamePlaceholder: 't.ex.: Festivalbesökare',
    genderLabel: 'Kön',
    ageLabel: 'Åldersgrupp',
    required: 'Obligatoriskt',
    selectPlaceholder: 'Välj',
    genderError: 'Välj kön',
    ageError: 'Välj åldersgrupp',
    submit: 'Delta',
    gender: { male: 'Man', female: 'Kvinna', other: 'Annat' },
    age: { student: 'Student', '10s': 'Tonåring', '20s': '20–29', '30s': '30–39', '40s': '40–49', '50s': '50–59', '60plus': '60 och äldre' },
  },
  rally: {
    countLabel: 'Insamlade stämplar',
    completeBanner1: 'Du har samlat alla 7 stämplar!',
    completeBanner2: 'Tänk ut rätt ordning och anta frasutmaningen.',
    phraseSolvedBanner: 'Frasen är klar! Byt in den i huvudhallen',
    exchangedBanner: 'Prisbytet är slutfört',
    challengeCta: 'Anta utmaningen',
    exchangeCta: 'Gå till prisbyte',
    cameraCta: '📷 Slå på kameran',
  },
  camera: {
    instruction: 'Placera QR-koden inom ramen',
    permissionDenied: 'Kameraåtkomst nekas. Tillåt kameran i webbläsarens inställningar.',
    duplicate: 'Du har redan den här QR-koden',
    invalid: 'Den här QR-koden hör inte till rallyt',
    demoScanButton: 'Ladda demo-QR',
    debugLabel: 'Felsökning (dold i produktion): tilldela stämpel utan kamera',
  },
  reveal: { title: 'Tecken erhållet!', stampGet: 'STÄMPEL ERHÅLLEN!', close: 'Stäng' },
  challenge: {
    title: 'Frasutmaningen',
    instruction: 'Ordna om de 7 tecknen för att bilda rätt fras!',
    wrong: 'Tyvärr, det är inte rätt svar. Försök igen!',
    available: 'Dina tecken (tryck för att placera)',
    checkCta: 'Kontrollera den här ordningen',
    exchangeCta: 'Gå till prisbyte',
    correctTitle: 'Rätt! Klart!',
    correctBody: 'Grattis! Du har fullbordat frasen.',
  },
  exchange: {
    phraseLabel: 'Fullbordad fras',
    title1: 'Stämpelrally',
    title2: 'Slutförandepris — Bytesdisk',
    staffNotice1: 'Prisbytet måste skötas av personalen.',
    staffNotice2: 'Lämna din telefon till en i personalen.',
    exchangeButton: 'Byt in',
    done: 'Inbytt',
    confirmQuestion: 'Vill du verkligen byta in?',
    staffHeading: 'Endast för personal',
    staffPasscodePlaceholder: 'Personalkod',
    staffPasscodeError: 'Fel kod',
  },
};

export default sv;
