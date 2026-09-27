import type { PartialMessages } from '../index';

// Kiswahili (Swahili). Hutatuliwa kutoka sw, sw-KE, sw-TZ, sw-UG.
const sw: PartialMessages = {
  common: {
    start: 'Anza',
    ok: 'Sawa',
    cancel: 'Ghairi',
    back: 'Rudi',
    resetConfirm:
      'Ufute maendeleo yote (mihuri, usajili, historia ya kubadilishana) na uanze upya?',
    resetButton: '(Jaribio) Weka upya maendeleo na uanze upya',
  },
  header: { line1: 'Tamasha', line2: 'Mashindano ya Mihuri' },
  notice: {
    iconAlt: 'Aikoni ya Mashindano ya Mihuri ya Tamasha',
    title: 'Angalizo',
    safetyHeading: 'Ombi la usalama',
    safetyBody:
      'Eneo la hekalu limejaa wageni. Zingatia mazingira, usikimbie na usigongane na wageni wengine. Kutembea huku ukiangalia simu ni hatari sana, hivyo simama kabla ya kutumia programu.',
    privacyHeading: 'Kuhusu taarifa binafsi',
    privacyBody:
      'Taarifa uliyosajili hutumika tu kwa uendeshaji wa tukio, uthibitisho wa kubadilishana zawadi na kwa takwimu. Haitumiki kwa madhumuni mengine wala haitolewi kwa wahusika wengine.',
    otherHeading: 'Nyingine',
    otherBody:
      'Idadi ya zawadi ni ndogo na kubadilishana kunaweza kuisha zikimalizika. Asante kwa ufahamu wako.',
  },
  howto: {
    title: 'Jinsi ya kucheza',
    imagePlaceholder: 'Picha',
    steps: [
      { title: 'Tafuta misimbo ya QR eneoni!', body: 'Misimbo ya QR ya mashindano imefichwa kote katika eneo la hekalu. Nenda uitafute!' },
      { title: 'Skani kwa kamera!', body: 'Elekeza tu kamera ya programu kwenye msimbo wa QR. Baada ya kusomwa, uthibitisho hufanyika kiotomatiki.' },
      { title: 'Kusanya herufi!', body: 'Kila uskanaji hutoa herufi moja. Kusanya 7 ili kukamilisha kifungu cha siri.' },
      { title: 'Kamilisha kifungu na ukibadilishe!', body: 'Ukishakuwa na zote 7, nenda kwenye ukumbi mkuu. Onyesha skrini ya programu kwa wafanyakazi ili upate zawadi yako!' },
    ],
  },
  register: {
    title: 'Usajili wa mshiriki',
    nicknameLabel: 'Jina la utani (si lazima)',
    nicknamePlaceholder: 'mf.: Mpenzi wa Tamasha',
    genderLabel: 'Jinsia',
    ageLabel: 'Kundi la umri',
    required: 'Lazima',
    selectPlaceholder: 'Tafadhali chagua',
    genderError: 'Tafadhali chagua jinsia',
    ageError: 'Tafadhali chagua kundi la umri',
    submit: 'Shiriki',
    gender: { male: 'Mwanaume', female: 'Mwanawake', other: 'Nyingine' },
    age: { student: 'Mwanafunzi', '10s': 'Kijana', '20s': '20–29', '30s': '30–39', '40s': '40–49', '50s': '50–59', '60plus': '60 na zaidi' },
  },
  rally: {
    countLabel: 'Mihuri iliyokusanywa',
    completeBanner1: 'Umekusanya mihuri yote 7!',
    completeBanner2: 'Fikiria mpangilio sahihi na ukabiliane na changamoto ya kifungu.',
    phraseSolvedBanner: 'Kifungu kimekamilika! Kibadilishe kwenye ukumbi mkuu',
    exchangedBanner: 'Kubadilishana zawadi kumekamilika',
    challengeCta: 'Kabiliana na changamoto',
    exchangeCta: 'Nenda kwenye kubadilishana zawadi',
    cameraCta: '📷 Washa kamera',
  },
  camera: {
    instruction: 'Weka msimbo wa QR ndani ya fremu',
    permissionDenied: 'Ufikiaji wa kamera hauruhusiwi. Ruhusu kamera katika mipangilio ya kivinjari.',
    duplicate: 'Tayari una msimbo huu wa QR',
    invalid: 'Msimbo huu wa QR si sehemu ya mashindano',
    demoScanButton: 'Pakia QR ya onyesho',
    debugLabel: 'Utatuzi (imefichwa katika toleo halisi): toa muhuri bila kamera',
  },
  reveal: { title: 'Umepata herufi!', stampGet: 'UMEPATA MUHURI!', close: 'Funga' },
  challenge: {
    title: 'Changamoto ya kifungu',
    instruction: 'Panga upya herufi 7 ili kuunda kifungu sahihi!',
    wrong: 'Pole, si jibu sahihi. Jaribu tena!',
    available: 'Herufi zako (gusa ili kuweka)',
    checkCta: 'Angalia mpangilio huu',
    exchangeCta: 'Nenda kwenye kubadilishana zawadi',
    correctTitle: 'Sahihi! Imekamilika!',
    correctBody: 'Hongera! Umekamilisha kifungu.',
  },
  exchange: {
    phraseLabel: 'Kifungu kilichokamilika',
    title1: 'Mashindano ya Mihuri',
    title2: 'Zawadi ya Kukamilisha — Kaunta ya Kubadilishana',
    staffNotice1: 'Kubadilishana zawadi lazima kufanywe na wafanyakazi.',
    staffNotice2: 'Tafadhali mkabidhi simu yako mfanyakazi.',
    exchangeButton: 'Badilisha',
    done: 'Imebadilishwa',
    confirmQuestion: 'Una uhakika unataka kubadilisha?',
    staffHeading: 'Kwa wafanyakazi pekee',
    staffPasscodePlaceholder: 'Nenosiri la wafanyakazi',
    staffPasscodeError: 'Nenosiri si sahihi',
  },
};

export default sw;
