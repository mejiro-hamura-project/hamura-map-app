import type { PartialMessages } from '../index';

// isiZulu (Zulu). Ixazululwa kusuka ku zu, zu-ZA.
const zu: PartialMessages = {
  common: {
    start: 'Qala',
    ok: 'KULUNGILE',
    cancel: 'Khansela',
    back: 'Emuva',
    resetConfirm:
      'Sula yonke inqubekela phambili (izitembu, ukubhalisa, umlando wokushintshana) uqale phansi?',
    resetButton: '(Ukuhlola) Setha kabusha inqubekela phambili uqale phansi',
  },
  header: { line1: 'Umkhosi', line2: 'Umjaho wezitembu' },
  notice: {
    iconAlt: 'Isithonjana somjaho wezitembu womkhosi',
    title: 'Amanothi',
    safetyHeading: 'Isicelo sokuphepha',
    safetyBody:
      'Indawo yendlu yesonto igcwele izivakashi. Qaphela indawo ozungezile, ungagijimi futhi ungashayisani nezinye izivakashi. Ukuhamba ubuka ifoni kuyingozi kakhulu, ngakho-ke yima ngaphambi kokusebenzisa uhlelo lokusebenza.',
    privacyHeading: 'Mayelana nolwazi lomuntu siqu',
    privacyBody:
      'Ulwazi olubhalisiwe lusetshenziselwa kuphela ukuqhuba lo mcimbi, ukuqinisekisa ukushintshaniswa kwemiklomelo, nezibalo. Alusetshenziswa ezinye izinjongo futhi alunikezwa abantu besithathu.',
    otherHeading: 'Okunye',
    otherBody:
      'Imiklomelo inqunyelwe futhi ukushintshana kungaphela lapho iphela. Siyabonga ngokuqonda kwakho.',
  },
  howto: {
    title: 'Indlela yokudlala',
    imagePlaceholder: 'Isithombe',
    steps: [
      { title: 'Thola amakhodi e-QR endaweni!', body: 'Amakhodi e-QR omjaho afihlwe kuyo yonke indawo yendlu yesonto. Hamba uwathole!' },
      { title: 'Waskene ngekhamera!', body: 'Vele ukhombise ikhamera yohlelo lokusebenza ekhodini le-QR. Emva kokufundwa, ukuqinisekisa kwenzeka ngokuzenzakalelayo.' },
      { title: 'Qoqa izinhlamvu!', body: 'Ukuskena ngakunye kukunika uhlamvu olulodwa. Qoqa ezi-7 ukuqedela umusho oyimfihlo.' },
      { title: 'Qedela umusho uwushintshanise!', body: 'Uma usunazo zonke ezi-7, iya ehholo eliyinhloko. Khombisa isikrini sohlelo lokusebenza kubasebenzi ukuze uthole umklomelo wakho!' },
    ],
  },
  register: {
    title: 'Ukubhaliswa komhlanganyeli',
    nicknameLabel: 'Isidlaliso (okukhethwa kukho)',
    nicknamePlaceholder: 'isb.: Othanda umkhosi',
    genderLabel: 'Ubulili',
    ageLabel: 'Iqembu leminyaka',
    required: 'Kuyadingeka',
    selectPlaceholder: 'Sicela ukhethe',
    genderError: 'Sicela ukhethe ubulili',
    ageError: 'Sicela ukhethe iqembu leminyaka',
    submit: 'Bamba iqhaza',
    gender: { male: 'Owesilisa', female: 'Owesifazane', other: 'Okunye' },
    age: { student: 'Umfundi', '10s': 'Intsha', '20s': '20–29', '30s': '30–39', '40s': '40–49', '50s': '50–59', '60plus': '60 nangaphezulu' },
  },
  rally: {
    countLabel: 'Izitembu eziqoqiwe',
    completeBanner1: 'Uqoqe zonke izitembu ezi-7!',
    completeBanner2: 'Cabanga ngokulandelana okufanele bese uphonsela inselele yomusho.',
    phraseSolvedBanner: 'Umusho uqediwe! Wushintshanise ehholo eliyinhloko',
    exchangedBanner: 'Ukushintshaniswa komklomelo kuqediwe',
    challengeCta: 'Phonsela inselele',
    exchangeCta: 'Iya ekushintshaniseni umklomelo',
    cameraCta: '📷 Vula ikhamera',
  },
  camera: {
    instruction: 'Faka ikhodi ye-QR ngaphakathi kohlaka',
    permissionDenied: 'Ukufinyelela ikhamera akuvunyelwe. Vumela ikhamera kuzilungiselelo zesiphequluli.',
    duplicate: 'Usunayo le khodi ye-QR',
    invalid: 'Le khodi ye-QR ayiyona ingxenye yomjaho',
    demoScanButton: 'Layisha i-QR yedemo',
    debugLabel: 'Ukususa amaphutha (kufihliwe ekukhiqizeni): nikeza isitembu ngaphandle kwekhamera',
  },
  reveal: { title: 'Uthole uhlamvu!', stampGet: 'UTHOLE ISITEMBU!', close: 'Vala' },
  challenge: {
    title: 'Inselele yomusho',
    instruction: 'Hlela kabusha izinhlamvu ezi-7 ukuze wakhe umusho ofanele!',
    wrong: 'Kuyadabukisa, akuyona impendulo efanele. Zama futhi!',
    available: 'Izinhlamvu zakho (thepha ukuze ubeke)',
    checkCta: 'Hlola lokhu kulandelana',
    exchangeCta: 'Iya ekushintshaniseni umklomelo',
    correctTitle: 'Kulungile! Kuqediwe!',
    correctBody: 'Halala! Uwuqedile umusho.',
  },
  exchange: {
    phraseLabel: 'Umusho oqediwe',
    title1: 'Umjaho wezitembu',
    title2: 'Umklomelo wokuqeda — Ikhawunta yokushintshana',
    staffNotice1: 'Ukushintshaniswa komklomelo kufanele kwenziwe abasebenzi.',
    staffNotice2: 'Sicela unikeze ifoni yakho kumsebenzi.',
    exchangeButton: 'Shintshanisa',
    done: 'Kushintshanisiwe',
    confirmQuestion: 'Uqinisekile ukuthi ufuna ukushintshanisa?',
    staffHeading: 'Kwabasebenzi kuphela',
    staffPasscodePlaceholder: 'Ikhodi yokungena yabasebenzi',
    staffPasscodeError: 'Ikhodi yokungena ayilungile',
  },
};

export default zu;
