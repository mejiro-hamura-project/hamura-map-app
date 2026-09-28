import type { PartialMessages } from '../index';

// Latviešu (Latvian). Atrisina no lv, lv-LV.
const lv: PartialMessages = {
  common: {
    start: 'Sākt',
    ok: 'Labi',
    cancel: 'Atcelt',
    back: 'Atpakaļ',
    resetConfirm:
      'Dzēst visu progresu (zīmogus, reģistrāciju, apmaiņas vēsturi) un sākt no jauna?',
    resetButton: '(Tests) Atiestatīt progresu un sākt no jauna',
  },
  header: { line1: 'Svētki', line2: 'Zīmogu rallijs' },
  notice: {
    iconAlt: 'Svētku zīmogu rallija ikona',
    title: 'Ievērībai',
    safetyHeading: 'Lūgums par drošību',
    safetyBody:
      'Svētnīcas teritorija ir pilna ar apmeklētājiem. Uzmaniet apkārtni, neskrieniet un nesadurieties ar citiem apmeklētājiem. Iet, skatoties telefonā, ir ļoti bīstami — apstājieties, pirms lietojat lietotni.',
    privacyHeading: 'Par personas datiem',
    privacyBody:
      'Reģistrētā informācija tiek izmantota tikai pasākuma rīkošanai, balvu apmaiņas apstiprināšanai un statistikai. Tā netiek izmantota citiem mērķiem un netiek nodota trešajām personām.',
    otherHeading: 'Cits',
    otherBody:
      'Balvu skaits ir ierobežots, un apmaiņa var beigties, kad tās izsīkst. Paldies par sapratni.',
  },
  howto: {
    title: 'Kā spēlēt',
    imagePlaceholder: 'Attēls',
    steps: [
      { title: 'Atrodi QR kodus teritorijā!', body: 'Rallija QR kodi ir paslēpti visā svētnīcas teritorijā. Dodies tos meklēt!' },
      { title: 'Noskenē tos ar kameru!', body: 'Vienkārši pavērs lietotnes kameru pret QR kodu. Pēc nolasīšanas pārbaude notiek automātiski.' },
      { title: 'Vāc rakstzīmes!', body: 'Katrs skenējums dod vienu rakstzīmi. Savāc 7, lai pabeigtu slēpto frāzi.' },
      { title: 'Pabeidz frāzi un apmaini to!', body: 'Ar visām 7 dodies uz galveno zāli. Parādi lietotnes ekrānu darbiniekam, lai saņemtu balvu!' },
    ],
  },
  register: {
    title: 'Dalībnieka reģistrācija',
    nicknameLabel: 'Iesauka (nav obligāti)',
    nicknamePlaceholder: 'piem.: Svētku apmeklētājs',
    genderLabel: 'Dzimums',
    ageLabel: 'Vecuma grupa',
    required: 'Obligāti',
    selectPlaceholder: 'Izvēlieties',
    genderError: 'Izvēlieties dzimumu',
    ageError: 'Izvēlieties vecuma grupu',
    submit: 'Piedalīties',
    gender: { male: 'Vīrietis', female: 'Sieviete', other: 'Cits' },
    age: { student: 'Skolēns/Students', '10s': 'Pusaudzis', '20s': '20–29', '30s': '30–39', '40s': '40–49', '50s': '50–59', '60plus': '60 un vairāk' },
  },
  rally: {
    countLabel: 'Savāktie zīmogi',
    completeBanner1: 'Tu savāci visus 7 zīmogus!',
    completeBanner2: 'Izdomā pareizo secību un pieņem frāzes izaicinājumu.',
    phraseSolvedBanner: 'Frāze pabeigta! Apmaini to galvenajā zālē',
    exchangedBanner: 'Balvas apmaiņa ir pabeigta',
    challengeCta: 'Pieņemt izaicinājumu',
    exchangeCta: 'Uz balvas apmaiņu',
    cameraCta: '📷 Ieslēgt kameru',
  },
  camera: {
    instruction: 'Novieto QR kodu rāmja iekšpusē',
    permissionDenied: 'Piekļuve kamerai nav atļauta. Atļauj kameru pārlūka iestatījumos.',
    duplicate: 'Šis QR kods tev jau ir',
    invalid: 'Šis QR kods nav rallija daļa',
    demoScanButton: 'Ielādēt demo QR',
    debugLabel: 'Atkļūdošana (paslēpta ražošanā): piešķirt zīmogu bez kameras',
  },
  reveal: { title: 'Iegūta rakstzīme!', stampGet: 'IEGŪTS ZĪMOGS!', close: 'Aizvērt' },
  challenge: {
    title: 'Frāzes izaicinājums',
    instruction: 'Pārkārto 7 rakstzīmes, lai izveidotu pareizo frāzi!',
    wrong: 'Žēl, tā nav pareizā atbilde. Mēģini vēlreiz!',
    available: 'Tavas rakstzīmes (pieskaries, lai novietotu)',
    checkCta: 'Pārbaudīt šo secību',
    exchangeCta: 'Uz balvas apmaiņu',
    correctTitle: 'Pareizi! Pabeigts!',
    correctBody: 'Apsveicam! Tu izveidoji frāzi.',
  },
  exchange: {
    phraseLabel: 'Izveidotā frāze',
    title1: 'Zīmogu rallijs',
    title2: 'Pabeigšanas balva — Apmaiņas lete',
    staffNotice1: 'Balvas apmaiņa jāveic darbiniekam.',
    staffNotice2: 'Lūdzu, nodod telefonu darbiniekam.',
    exchangeButton: 'Apmainīt',
    done: 'Apmainīts',
    confirmQuestion: 'Vai tiešām vēlies apmainīt?',
    staffHeading: 'Tikai darbiniekiem',
    staffPasscodePlaceholder: 'Darbinieka piekļuves kods',
    staffPasscodeError: 'Nepareizs kods',
  },
};

export default lv;
