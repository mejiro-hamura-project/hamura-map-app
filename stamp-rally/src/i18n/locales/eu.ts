import type { PartialMessages } from '../index';

// Euskara (Basque). eu, eu-ES-etik ebazten da.
const eu: PartialMessages = {
  common: {
    start: 'Hasi',
    ok: 'Ados',
    cancel: 'Utzi',
    back: 'Atzera',
    resetConfirm:
      'Aurrerapen guztia (zigiluak, izen-ematea, truke-historia) ezabatu eta hasieratik hasi nahi duzu?',
    resetButton: '(Proba) Berrezarri aurrerapena eta hasi berriro',
  },
  header: { line1: 'Jaia', line2: 'Zigilu rallya' },
  notice: {
    iconAlt: 'Jaiaren zigilu rallyaren ikonoa',
    title: 'Oharrak',
    safetyHeading: 'Segurtasun eskaera',
    safetyBody:
      'Santutegiaren esparrua bisitariz beteta egoten da. Erne ibili inguruarekin, ez korrika egin eta ez talka egin beste bisitariekin. Telefonoari begira ibiltzea oso arriskutsua da: gelditu aplikazioa erabili aurretik.',
    privacyHeading: 'Datu pertsonalei buruz',
    privacyBody:
      'Erregistratutako informazioa ekitaldia antolatzeko, sarien trukea baieztatzeko eta estatistiketarako soilik erabiltzen da. Ez da beste helbururik erabiltzen eta ez zaie hirugarrenei ematen.',
    otherHeading: 'Bestelakoak',
    otherBody:
      'Sariak mugatuak dira eta trukea amaitu daiteke agortzean. Eskerrik asko ulertzeagatik.',
  },
  howto: {
    title: 'Nola jokatu',
    imagePlaceholder: 'Irudia',
    steps: [
      { title: 'Aurkitu esparruko QR kodeak!', body: 'Rallyaren QR kodeak santutegiaren esparru osoan ezkutatuta daude. Zoaz bila!' },
      { title: 'Eskaneatu kamerarekin!', body: 'Zuzendu aplikazioaren kamera QR kodera besterik ez. Irakurri ondoren, egiaztapena automatikoa da.' },
      { title: 'Bildu karaktereak!', body: 'Eskaneo bakoitzak karaktere bat ematen dizu. Bildu 7 esaldi ezkutua osatzeko.' },
      { title: 'Osatu esaldia eta trukatu!', body: '7ak dituzunean, joan areto nagusira. Erakutsi aplikazioaren pantaila langileei zure saria jasotzeko!' },
    ],
  },
  register: {
    title: 'Parte-hartzailearen izen-ematea',
    nicknameLabel: 'Ezizena (aukerakoa)',
    nicknamePlaceholder: 'adib.: Jai-zalea',
    genderLabel: 'Generoa',
    ageLabel: 'Adin-tartea',
    required: 'Nahitaezkoa',
    selectPlaceholder: 'Hautatu',
    genderError: 'Hautatu generoa',
    ageError: 'Hautatu adin-tartea',
    submit: 'Parte hartu',
    gender: { male: 'Gizona', female: 'Emakumea', other: 'Bestelakoa' },
    age: { student: 'Ikaslea', '10s': 'Nerabea', '20s': '20–29', '30s': '30–39', '40s': '40–49', '50s': '50–59', '60plus': '60 edo gehiago' },
  },
  rally: {
    countLabel: 'Bildutako zigiluak',
    completeBanner1: '7 zigiluak bildu dituzu!',
    completeBanner2: 'Pentsatu ordena zuzena eta ekin esaldiaren erronkari.',
    phraseSolvedBanner: 'Esaldia osatuta! Trukatu areto nagusian',
    exchangedBanner: 'Sariaren trukea osatu da',
    challengeCta: 'Ekin erronkari',
    exchangeCta: 'Joan sari-trukera',
    cameraCta: '📷 Piztu kamera',
  },
  camera: {
    instruction: 'Jarri QR kodea markoaren barruan',
    permissionDenied: 'Kamerarako sarbidea ez dago baimenduta. Baimendu kamera arakatzailearen ezarpenetan.',
    duplicate: 'QR kode hau jada baduzu',
    invalid: 'QR kode hau ez da rallyaren parte',
    demoScanButton: 'Kargatu demo QR bat',
    debugLabel: 'Arazketa (ekoizpenean ezkutatuta): eman zigilua kamerarik gabe',
  },
  reveal: { title: 'Karakterea lortuta!', stampGet: 'ZIGILUA LORTUTA!', close: 'Itxi' },
  challenge: {
    title: 'Esaldiaren erronka',
    instruction: 'Berrantolatu 7 karaktereak esaldi zuzena osatzeko!',
    wrong: 'Pena, ez da erantzun zuzena. Saiatu berriro!',
    available: 'Zure karaktereak (sakatu jartzeko)',
    checkCta: 'Egiaztatu ordena hau',
    exchangeCta: 'Joan sari-trukera',
    correctTitle: 'Zuzena! Osatuta!',
    correctBody: 'Zorionak! Esaldia osatu duzu.',
  },
  exchange: {
    phraseLabel: 'Osatutako esaldia',
    title1: 'Zigilu rallya',
    title2: 'Osatze-saria — Truke-leihatila',
    staffNotice1: 'Sariaren trukea langileek egin behar dute.',
    staffNotice2: 'Eman telefonoa langile bati.',
    exchangeButton: 'Trukatu',
    done: 'Trukatuta',
    confirmQuestion: 'Ziur trukatu nahi duzula?',
    staffHeading: 'Langileentzat soilik',
    staffPasscodePlaceholder: 'Langileen pasakodea',
    staffPasscodeError: 'Pasakodea ez da zuzena',
  },
};

export default eu;
