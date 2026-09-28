import type { PartialMessages } from '../index';

// Română (Romanian). Se rezolvă din ro, ro-RO, ro-MD.
const ro: PartialMessages = {
  common: {
    start: 'Începe',
    ok: 'OK',
    cancel: 'Anulează',
    back: 'Înapoi',
    resetConfirm:
      'Ștergi tot progresul (ștampile, înregistrare, istoric schimburi) și o iei de la capăt?',
    resetButton: '(Test) Resetează progresul și începe din nou',
  },
  header: { line1: 'Festival', line2: 'Raliul ștampilelor' },
  notice: {
    iconAlt: 'Pictograma raliului de ștampile al festivalului',
    title: 'De reținut',
    safetyHeading: 'Recomandare de siguranță',
    safetyBody:
      'Incinta sanctuarului este aglomerată. Fii atent la cei din jur, nu alerga și nu te ciocni de alți vizitatori. Mersul cu privirea în telefon este foarte periculos — oprește-te înainte de a folosi aplicația.',
    privacyHeading: 'Despre datele personale',
    privacyBody:
      'Informațiile înregistrate sunt folosite doar pentru organizarea evenimentului, confirmarea schimbului de premii și în scopuri statistice. Nu sunt folosite în alte scopuri și nu sunt furnizate terților.',
    otherHeading: 'Altele',
    otherBody:
      'Numărul premiilor este limitat, iar schimbul se poate încheia la epuizarea lor. Îți mulțumim pentru înțelegere.',
  },
  howto: {
    title: 'Cum se joacă',
    imagePlaceholder: 'Imagine',
    steps: [
      { title: 'Găsește codurile QR din incintă!', body: 'Codurile QR ale raliului sunt ascunse peste tot în incinta sanctuarului. Pornește să le cauți!' },
      { title: 'Scanează-le cu camera!', body: 'Doar îndreaptă camera aplicației spre codul QR. După citire, verificarea se face automat.' },
      { title: 'Adună caracterele!', body: 'Fiecare scanare îți dă un caracter. Adună 7 pentru a completa fraza secretă.' },
      { title: 'Completează fraza și schimb-o!', body: 'Cu toate 7, mergi la sala principală. Arată ecranul aplicației personalului pentru a-ți primi premiul!' },
    ],
  },
  register: {
    title: 'Înregistrarea participantului',
    nicknameLabel: 'Poreclă (opțional)',
    nicknamePlaceholder: 'ex.: Petrecăreț',
    genderLabel: 'Gen',
    ageLabel: 'Grupă de vârstă',
    required: 'Obligatoriu',
    selectPlaceholder: 'Selectează',
    genderError: 'Selectează genul',
    ageError: 'Selectează grupa de vârstă',
    submit: 'Participă',
    gender: { male: 'Bărbat', female: 'Femeie', other: 'Altul' },
    age: { student: 'Elev/Student', '10s': 'Adolescent', '20s': '20–29', '30s': '30–39', '40s': '40–49', '50s': '50–59', '60plus': '60 și peste' },
  },
  rally: {
    countLabel: 'Ștampile adunate',
    completeBanner1: 'Ai adunat toate cele 7 ștampile!',
    completeBanner2: 'Gândește-te la ordinea corectă și înfruntă provocarea frazei.',
    phraseSolvedBanner: 'Fraza este completă! Schimb-o la sala principală',
    exchangedBanner: 'Schimbul premiului este finalizat',
    challengeCta: 'Înfruntă provocarea',
    exchangeCta: 'Mergi la schimbul de premiu',
    cameraCta: '📷 Pornește camera',
  },
  camera: {
    instruction: 'Așază codul QR în cadru',
    permissionDenied: 'Accesul la cameră nu este permis. Permite camera în setările browserului.',
    duplicate: 'Ai deja acest cod QR',
    invalid: 'Acest cod QR nu face parte din raliu',
    demoScanButton: 'Încarcă un QR demo',
    debugLabel: 'Depanare (ascuns în producție): acordă o ștampilă fără cameră',
  },
  reveal: { title: 'Caracter obținut!', stampGet: 'ȘTAMPILĂ OBȚINUTĂ!', close: 'Închide' },
  challenge: {
    title: 'Provocarea frazei',
    instruction: 'Rearanjează cele 7 caractere pentru a forma fraza corectă!',
    wrong: 'Păcat, nu este răspunsul corect. Încearcă din nou!',
    available: 'Caracterele tale (atinge pentru a plasa)',
    checkCta: 'Verifică această ordine',
    exchangeCta: 'Mergi la schimbul de premiu',
    correctTitle: 'Corect! Finalizat!',
    correctBody: 'Felicitări! Ai completat fraza.',
  },
  exchange: {
    phraseLabel: 'Fraza completată',
    title1: 'Raliul ștampilelor',
    title2: 'Premiu de finalizare — Ghișeu de schimb',
    staffNotice1: 'Schimbul premiului trebuie efectuat de personal.',
    staffNotice2: 'Predă-ți telefonul unui membru al personalului.',
    exchangeButton: 'Schimbă',
    done: 'Schimbat',
    confirmQuestion: 'Sigur vrei să schimbi?',
    staffHeading: 'Doar pentru personal',
    staffPasscodePlaceholder: 'Cod personal',
    staffPasscodeError: 'Cod incorect',
  },
};

export default ro;
