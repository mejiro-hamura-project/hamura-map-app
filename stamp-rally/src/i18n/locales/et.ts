import type { PartialMessages } from '../index';

// Eesti (Estonian). Lahendatakse koodidest et, et-EE.
const et: PartialMessages = {
  common: {
    start: 'Alusta',
    ok: 'OK',
    cancel: 'Tühista',
    back: 'Tagasi',
    resetConfirm:
      'Kustutada kogu edenemine (templid, registreerimine, vahetuste ajalugu) ja alustada otsast?',
    resetButton: '(Test) Lähtesta edenemine ja alusta otsast',
  },
  header: { line1: 'Pidu', line2: 'Templiralli' },
  notice: {
    iconAlt: 'Peo templiralli ikoon',
    title: 'Tähelepanu',
    safetyHeading: 'Ohutuspalve',
    safetyBody:
      'Pühamu ala on külastajaid täis. Ole tähelepanelik ümbruse suhtes, ära jookse ega põrka teiste külastajatega. Telefoni vaadates kõndimine on väga ohtlik – peatu enne rakenduse kasutamist.',
    privacyHeading: 'Isikuandmete kohta',
    privacyBody:
      'Registreeritud teavet kasutatakse ainult ürituse korraldamiseks, auhindade vahetamise kinnitamiseks ja statistikaks. Seda ei kasutata muul otstarbel ega edastata kolmandatele isikutele.',
    otherHeading: 'Muu',
    otherBody:
      'Auhindade arv on piiratud ja vahetamine võib lõppeda, kui need otsa saavad. Täname mõistmise eest.',
  },
  howto: {
    title: 'Kuidas mängida',
    imagePlaceholder: 'Pilt',
    steps: [
      { title: 'Leia alalt QR-koodid!', body: 'Ralli QR-koodid on peidetud üle kogu pühamu ala. Mine neid otsima!' },
      { title: 'Skaneeri need kaameraga!', body: 'Suuna lihtsalt rakenduse kaamera QR-koodile. Pärast lugemist toimub kontroll automaatselt.' },
      { title: 'Kogu märke!', body: 'Iga skaneerimine annab ühe märgi. Kogu 7, et täita salajane fraas.' },
      { title: 'Täida fraas ja vaheta see!', body: 'Kõigi 7-ga mine peasaali. Näita töötajale rakenduse ekraani, et saada oma auhind!' },
    ],
  },
  register: {
    title: 'Osaleja registreerimine',
    nicknameLabel: 'Hüüdnimi (valikuline)',
    nicknamePlaceholder: 'nt: Peokülaline',
    genderLabel: 'Sugu',
    ageLabel: 'Vanuserühm',
    required: 'Kohustuslik',
    selectPlaceholder: 'Vali',
    genderError: 'Vali sugu',
    ageError: 'Vali vanuserühm',
    submit: 'Osale',
    gender: { male: 'Mees', female: 'Naine', other: 'Muu' },
    age: { student: 'Õpilane/Tudeng', '10s': 'Teismeline', '20s': '20–29', '30s': '30–39', '40s': '40–49', '50s': '50–59', '60plus': '60 ja vanem' },
  },
  rally: {
    countLabel: 'Kogutud templid',
    completeBanner1: 'Kogusid kõik 7 templit!',
    completeBanner2: 'Mõtle õige järjekord välja ja võta fraasi väljakutse vastu.',
    phraseSolvedBanner: 'Fraas on valmis! Vaheta see peasaalis',
    exchangedBanner: 'Auhinna vahetamine on lõpetatud',
    challengeCta: 'Võta väljakutse vastu',
    exchangeCta: 'Auhinna vahetamise juurde',
    cameraCta: '📷 Lülita kaamera sisse',
  },
  camera: {
    instruction: 'Aseta QR-kood raami sisse',
    permissionDenied: 'Kaamera juurdepääs pole lubatud. Luba kaamera brauseri seadetes.',
    duplicate: 'See QR-kood on sul juba olemas',
    invalid: 'See QR-kood ei kuulu rallile',
    demoScanButton: 'Laadi demo-QR',
    debugLabel: 'Silumine (tootmises peidetud): anna tempel ilma kaamerata',
  },
  reveal: { title: 'Said märgi!', stampGet: 'SAID TEMPLI!', close: 'Sulge' },
  challenge: {
    title: 'Fraasi väljakutse',
    instruction: 'Järjesta 7 märki ümber, et moodustada õige fraas!',
    wrong: 'Kahju, see pole õige vastus. Proovi uuesti!',
    available: 'Sinu märgid (koputa asetamiseks)',
    checkCta: 'Kontrolli seda järjekorda',
    exchangeCta: 'Auhinna vahetamise juurde',
    correctTitle: 'Õige! Valmis!',
    correctBody: 'Palju õnne! Täitsid fraasi.',
  },
  exchange: {
    phraseLabel: 'Täidetud fraas',
    title1: 'Templiralli',
    title2: 'Lõpetamisauhind — Vahetuslett',
    staffNotice1: 'Auhinna vahetamise peab tegema töötaja.',
    staffNotice2: 'Anna telefon töötajale.',
    exchangeButton: 'Vaheta',
    done: 'Vahetatud',
    confirmQuestion: 'Kas soovid kindlasti vahetada?',
    staffHeading: 'Ainult töötajatele',
    staffPasscodePlaceholder: 'Töötaja pääsukood',
    staffPasscodeError: 'Vale pääsukood',
  },
};

export default et;
