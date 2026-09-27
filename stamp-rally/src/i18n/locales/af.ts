import type { PartialMessages } from '../index';

// Afrikaans. Opgelos vanaf af, af-ZA.
const af: PartialMessages = {
  common: {
    start: 'Begin',
    ok: 'OK',
    cancel: 'Kanselleer',
    back: 'Terug',
    resetConfirm:
      'Vee alle vordering uit (stempels, registrasie, ruilgeskiedenis) en begin van voor af?',
    resetButton: '(Toets) Stel vordering terug en begin van voor af',
  },
  header: { line1: 'Fees', line2: 'Stempeljaag' },
  notice: {
    iconAlt: 'Ikoon van die feesstempeljaag',
    title: 'Let wel',
    safetyHeading: 'Veiligheidsversoek',
    safetyBody:
      'Die heiligdomterrein is vol besoekers. Let op jou omgewing, moenie hardloop nie en moenie teen ander besoekers vasloop nie. Om te loop terwyl jy na jou foon kyk, is baie gevaarlik – staan stil voordat jy die toepassing gebruik.',
    privacyHeading: 'Oor persoonlike inligting',
    privacyBody:
      'Die geregistreerde inligting word slegs gebruik vir die bestuur van hierdie geleentheid, bevestiging van prysruiling en vir statistiek. Dit word nie vir ander doeleindes gebruik nie en nie aan derde partye verskaf nie.',
    otherHeading: 'Ander',
    otherBody:
      'Pryse is beperk en ruiling kan eindig sodra hulle op is. Dankie vir jou begrip.',
  },
  howto: {
    title: 'Hoe om te speel',
    imagePlaceholder: 'Beeld',
    steps: [
      { title: 'Vind die QR-kodes op die terrein!', body: 'Die jaag se QR-kodes is regoor die heiligdomterrein weggesteek. Gaan soek hulle!' },
      { title: 'Skandeer hulle met die kamera!', body: 'Rig net die toepassing se kamera op die QR-kode. Nadat dit gelees is, geskied verifikasie outomaties.' },
      { title: 'Versamel die karakters!', body: 'Elke skandering gee een karakter. Versamel 7 om die verborge frase te voltooi.' },
      { title: 'Voltooi die frase en ruil dit!', body: 'Met al 7, gaan na die hoofsaal. Wys die toepassing se skerm aan die personeel om jou prys te kry!' },
    ],
  },
  register: {
    title: 'Deelnemerregistrasie',
    nicknameLabel: 'Bynaam (opsioneel)',
    nicknamePlaceholder: 'bv.: Feesganger',
    genderLabel: 'Geslag',
    ageLabel: 'Ouderdomsgroep',
    required: 'Verpligtend',
    selectPlaceholder: 'Kies asseblief',
    genderError: 'Kies asseblief jou geslag',
    ageError: 'Kies asseblief jou ouderdomsgroep',
    submit: 'Neem deel',
    gender: { male: 'Man', female: 'Vrou', other: 'Ander' },
    age: { student: 'Student', '10s': 'Tiener', '20s': '20–29', '30s': '30–39', '40s': '40–49', '50s': '50–59', '60plus': '60 en ouer' },
  },
  rally: {
    countLabel: 'Versamelde stempels',
    completeBanner1: 'Jy het al 7 stempels versamel!',
    completeBanner2: 'Dink aan die regte volgorde en pak die frase-uitdaging aan.',
    phraseSolvedBanner: 'Frase voltooi! Ruil dit by die hoofsaal',
    exchangedBanner: 'Die prysruiling is voltooi',
    challengeCta: 'Pak die uitdaging aan',
    exchangeCta: 'Na prysruiling',
    cameraCta: '📷 Skakel kamera aan',
  },
  camera: {
    instruction: 'Plaas die QR-kode binne die raam',
    permissionDenied: 'Kameratoegang is nie toegelaat nie. Laat die kamera in die blaaierinstellings toe.',
    duplicate: 'Jy het reeds hierdie QR-kode',
    invalid: 'Hierdie QR-kode is nie deel van die jaag nie',
    demoScanButton: 'Laai demo-QR',
    debugLabel: 'Ontfouting (versteek in produksie): ken stempel toe sonder kamera',
  },
  reveal: { title: 'Karakter gekry!', stampGet: 'STEMPEL GEKRY!', close: 'Maak toe' },
  challenge: {
    title: 'Die frase-uitdaging',
    instruction: 'Herrangskik die 7 karakters om die regte frase te vorm!',
    wrong: 'Jammer, dis nie die regte antwoord nie. Probeer weer!',
    available: 'Jou karakters (tik om te plaas)',
    checkCta: 'Kontroleer hierdie volgorde',
    exchangeCta: 'Na prysruiling',
    correctTitle: 'Reg! Voltooi!',
    correctBody: 'Geluk! Jy het die frase voltooi.',
  },
  exchange: {
    phraseLabel: 'Voltooide frase',
    title1: 'Stempeljaag',
    title2: 'Voltooiingsprys — Ruiltoonbank',
    staffNotice1: 'Die prysruiling moet deur die personeel gedoen word.',
    staffNotice2: 'Gee asseblief jou foon vir ’n personeellid.',
    exchangeButton: 'Ruil',
    done: 'Geruil',
    confirmQuestion: 'Wil jy regtig ruil?',
    staffHeading: 'Slegs vir personeel',
    staffPasscodePlaceholder: 'Personeelkode',
    staffPasscodeError: 'Kode is verkeerd',
  },
};

export default af;
