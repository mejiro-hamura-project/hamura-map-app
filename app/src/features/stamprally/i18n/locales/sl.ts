import type { PartialMessages } from '../index';

// Slovenščina (Slovenian). Razreši se iz sl, sl-SI.
const sl: PartialMessages = {
  common: {
    start: 'Začni',
    ok: 'V redu',
    cancel: 'Prekliči',
    back: 'Nazaj',
    resetConfirm:
      'Izbrišem ves napredek (žige, registracijo, zgodovino menjav) in začnem znova?',
    resetButton: '(Test) Ponastavi napredek in začni znova',
  },
  header: { line1: 'Praznovanje', line2: 'Reli žigov' },
  notice: {
    iconAlt: 'Ikona relija žigov praznovanja',
    title: 'Opombe',
    safetyHeading: 'Prošnja za varnost',
    safetyBody:
      'Območje svetišča je polno obiskovalcev. Pazite na okolico, ne tecite in ne zaletavajte se v druge obiskovalce. Hoja z gledanjem v telefon je zelo nevarna – ustavite se, preden uporabite aplikacijo.',
    privacyHeading: 'O osebnih podatkih',
    privacyBody:
      'Vneseni podatki se uporabljajo le za izvedbo dogodka, potrditev menjave nagrad in za statistiko. Ne uporabljajo se za druge namene in se ne posredujejo tretjim osebam.',
    otherHeading: 'Drugo',
    otherBody:
      'Število nagrad je omejeno in menjava se lahko konča, ko poidejo. Hvala za razumevanje.',
  },
  howto: {
    title: 'Kako igrati',
    imagePlaceholder: 'Slika',
    steps: [
      { title: 'Poišči kode QR na območju!', body: 'Kode QR relija so skrite po vsem območju svetišča. Pojdi jih iskat!' },
      { title: 'Skeniraj jih s kamero!', body: 'Kamero aplikacije le usmeri v kodo QR. Po branju se preverjanje izvede samodejno.' },
      { title: 'Zbiraj znake!', body: 'Vsako skeniranje da en znak. Zberi 7, da dokončaš skrito frazo.' },
      { title: 'Dokončaj frazo in jo zamenjaj!', body: 'Z vsemi 7 pojdi v glavno dvorano. Osebju pokaži zaslon aplikacije, da dobiš nagrado!' },
    ],
  },
  register: {
    title: 'Registracija udeleženca',
    nicknameLabel: 'Vzdevek (izbirno)',
    nicknamePlaceholder: 'npr.: Obiskovalec praznovanja',
    genderLabel: 'Spol',
    ageLabel: 'Starostna skupina',
    required: 'Obvezno',
    selectPlaceholder: 'Izberite',
    genderError: 'Izberite spol',
    ageError: 'Izberite starostno skupino',
    submit: 'Sodeluj',
    gender: { male: 'Moški', female: 'Ženska', other: 'Drugo' },
    age: { student: 'Dijak/Študent', '10s': 'Najstnik', '20s': '20–29', '30s': '30–39', '40s': '40–49', '50s': '50–59', '60plus': '60 in več' },
  },
  rally: {
    countLabel: 'Zbrani žigi',
    completeBanner1: 'Zbral si vseh 7 žigov!',
    completeBanner2: 'Premisli pravilni vrstni red in sprejmi izziv fraze.',
    phraseSolvedBanner: 'Fraza je dokončana! Zamenjaj jo v glavni dvorani',
    exchangedBanner: 'Menjava nagrade je zaključena',
    challengeCta: 'Sprejmi izziv',
    exchangeCta: 'Na menjavo nagrade',
    cameraCta: '📷 Vklopi kamero',
  },
  camera: {
    instruction: 'Kodo QR postavi znotraj okvirja',
    permissionDenied: 'Dostop do kamere ni dovoljen. Dovoli kamero v nastavitvah brskalnika.',
    duplicate: 'To kodo QR že imaš',
    invalid: 'Ta koda QR ni del relija',
    demoScanButton: 'Naloži demo QR',
    debugLabel: 'Razhroščevanje (skrito v produkciji): dodeli žig brez kamere',
  },
  reveal: { title: 'Pridobljen znak!', stampGet: 'PRIDOBLJEN ŽIG!', close: 'Zapri' },
  challenge: {
    title: 'Izziv fraze',
    instruction: 'Preuredi 7 znakov, da sestaviš pravilno frazo!',
    wrong: 'Škoda, ni pravilni odgovor. Poskusi znova!',
    available: 'Tvoji znaki (tapni za postavitev)',
    checkCta: 'Preveri ta vrstni red',
    exchangeCta: 'Na menjavo nagrade',
    correctTitle: 'Pravilno! Končano!',
    correctBody: 'Čestitke! Sestavil si frazo.',
  },
  exchange: {
    phraseLabel: 'Sestavljena fraza',
    title1: 'Reli žigov',
    title2: 'Nagrada za dokončanje — Menjalno okence',
    staffNotice1: 'Menjavo nagrade mora opraviti osebje.',
    staffNotice2: 'Telefon izročite članu osebja.',
    exchangeButton: 'Zamenjaj',
    done: 'Zamenjano',
    confirmQuestion: 'Ali res želiš zamenjati?',
    staffHeading: 'Samo za osebje',
    staffPasscodePlaceholder: 'Koda osebja',
    staffPasscodeError: 'Napačna koda',
  },
};

export default sl;
