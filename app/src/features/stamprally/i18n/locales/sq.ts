import type { PartialMessages } from '../index';

// Shqip (Albanian). Zgjidhet nga sq, sq-AL, sq-MK, sq-XK.
const sq: PartialMessages = {
  common: {
    start: 'Fillo',
    ok: 'Në rregull',
    cancel: 'Anulo',
    back: 'Prapa',
    resetConfirm:
      'Të fshihet i gjithë progresi (vulat, regjistrimi, historiku i shkëmbimeve) dhe të fillohet nga e para?',
    resetButton: '(Test) Rivendos progresin dhe fillo nga e para',
  },
  header: { line1: 'Festë', line2: 'Ral me vula' },
  notice: {
    iconAlt: 'Ikona e ralit me vula të festës',
    title: 'Shënime',
    safetyHeading: 'Kërkesë për siguri',
    safetyBody:
      'Oborri i faltores është plot me vizitorë. Ki kujdes rrethinën, mos vrapo dhe mos u përplas me vizitorë të tjerë. Të ecësh duke parë telefonin është shumë e rrezikshme – ndalo para se ta përdorësh aplikacionin.',
    privacyHeading: 'Rreth të dhënave personale',
    privacyBody:
      'Informacioni i regjistruar përdoret vetëm për organizimin e ngjarjes, konfirmimin e shkëmbimit të çmimeve dhe për statistika. Nuk përdoret për qëllime të tjera dhe nuk u jepet palëve të treta.',
    otherHeading: 'Të tjera',
    otherBody:
      'Çmimet janë të kufizuara dhe shkëmbimi mund të mbarojë sapo të përfundojnë. Faleminderit për mirëkuptimin.',
  },
  howto: {
    title: 'Si të luash',
    imagePlaceholder: 'Imazh',
    steps: [
      { title: 'Gjej kodet QR në oborr!', body: 'Kodet QR të ralit janë fshehur në të gjithë oborrin e faltores. Shko dhe gjeji!' },
      { title: 'Skanoji me kamerën!', body: 'Vetëm drejto kamerën e aplikacionit nga kodi QR. Pas leximit, verifikimi bëhet automatikisht.' },
      { title: 'Mblidh karakteret!', body: 'Çdo skanim jep një karakter. Mblidh 7 për të plotësuar frazën e fshehtë.' },
      { title: 'Plotëso frazën dhe shkëmbeje!', body: 'Me të 7-tat, shko në sallën kryesore. Tregoji stafit ekranin e aplikacionit për të marrë çmimin!' },
    ],
  },
  register: {
    title: 'Regjistrimi i pjesëmarrësit',
    nicknameLabel: 'Nofkë (opsionale)',
    nicknamePlaceholder: 'p.sh.: Festues',
    genderLabel: 'Gjinia',
    ageLabel: 'Grupmosha',
    required: 'E detyrueshme',
    selectPlaceholder: 'Zgjidh',
    genderError: 'Zgjidh gjininë',
    ageError: 'Zgjidh grupmoshën',
    submit: 'Merr pjesë',
    gender: { male: 'Mashkull', female: 'Femër', other: 'Tjetër' },
    age: { student: 'Nxënës/Student', '10s': 'Adoleshent', '20s': '20–29', '30s': '30–39', '40s': '40–49', '50s': '50–59', '60plus': '60 e lart' },
  },
  rally: {
    countLabel: 'Vula të mbledhura',
    completeBanner1: 'I mblodhe të 7 vulat!',
    completeBanner2: 'Mendo rendin e saktë dhe përballu me sfidën e frazës.',
    phraseSolvedBanner: 'Fraza u plotësua! Shkëmbeje në sallën kryesore',
    exchangedBanner: 'Shkëmbimi i çmimit ka përfunduar',
    challengeCta: 'Përballu me sfidën',
    exchangeCta: 'Shko te shkëmbimi i çmimit',
    cameraCta: '📷 Ndiz kamerën',
  },
  camera: {
    instruction: 'Vendos kodin QR brenda kornizës',
    permissionDenied: 'Qasja në kamerë nuk lejohet. Lejo kamerën në cilësimet e shfletuesit.',
    duplicate: 'E ke tashmë këtë kod QR',
    invalid: 'Ky kod QR nuk është pjesë e ralit',
    demoScanButton: 'Ngarko QR demo',
    debugLabel: 'Korrigjim (i fshehur në prodhim): jep vulë pa kamerë',
  },
  reveal: { title: 'Fitove një karakter!', stampGet: 'FITOVE NJË VULË!', close: 'Mbyll' },
  challenge: {
    title: 'Sfida e frazës',
    instruction: 'Rirendit 7 karakteret për të formuar frazën e saktë!',
    wrong: 'Keq, nuk është përgjigjja e saktë. Provo përsëri!',
    available: 'Karakteret e tua (prek për t’i vendosur)',
    checkCta: 'Kontrollo këtë rend',
    exchangeCta: 'Shko te shkëmbimi i çmimit',
    correctTitle: 'Saktë! Përfunduar!',
    correctBody: 'Urime! E plotësove frazën.',
  },
  exchange: {
    phraseLabel: 'Fraza e plotësuar',
    title1: 'Ral me vula',
    title2: 'Çmim përfundimi — Sporteli i shkëmbimit',
    staffNotice1: 'Shkëmbimi i çmimit duhet të bëhet nga stafi.',
    staffNotice2: 'Të lutem, jepja telefonin një anëtari të stafit.',
    exchangeButton: 'Shkëmbe',
    done: 'Shkëmbyer',
    confirmQuestion: 'Je i sigurt që do të shkëmbesh?',
    staffHeading: 'Vetëm për stafin',
    staffPasscodePlaceholder: 'Kodi i stafit',
    staffPasscodeError: 'Kodi është i pasaktë',
  },
};

export default sq;
