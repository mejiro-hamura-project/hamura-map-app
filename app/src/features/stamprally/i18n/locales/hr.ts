import type { PartialMessages } from '../index';

// Hrvatski (Croatian). Razrješava se iz hr, hr-HR, hr-BA.
const hr: PartialMessages = {
  common: {
    start: 'Počni',
    ok: 'U redu',
    cancel: 'Odustani',
    back: 'Natrag',
    resetConfirm:
      'Izbrisati sav napredak (žigove, registraciju, povijest zamjena) i početi iznova?',
    resetButton: '(Test) Poništi napredak i počni iznova',
  },
  header: { line1: 'Svečanost', line2: 'Reli žigova' },
  notice: {
    iconAlt: 'Ikona relija žigova svečanosti',
    title: 'Napomene',
    safetyHeading: 'Molba za sigurnost',
    safetyBody:
      'Prostor svetišta pun je posjetitelja. Pazite na okolinu, ne trčite i ne sudarajte se s drugim posjetiteljima. Hodanje uz gledanje u telefon vrlo je opasno – zaustavite se prije korištenja aplikacije.',
    privacyHeading: 'O osobnim podacima',
    privacyBody:
      'Uneseni se podaci koriste isključivo za organizaciju događaja, potvrdu zamjene nagrada i u statističke svrhe. Ne koriste se u druge svrhe niti se daju trećim stranama.',
    otherHeading: 'Ostalo',
    otherBody:
      'Broj nagrada je ograničen i zamjena može završiti kad se potroše. Hvala na razumijevanju.',
  },
  howto: {
    title: 'Kako igrati',
    imagePlaceholder: 'Slika',
    steps: [
      { title: 'Pronađi QR kodove u prostoru!', body: 'QR kodovi relija skriveni su po cijelom prostoru svetišta. Kreni u potragu!' },
      { title: 'Skeniraj ih kamerom!', body: 'Samo usmjeri kameru aplikacije na QR kod. Nakon očitanja provjera je automatska.' },
      { title: 'Skupljaj znakove!', body: 'Svako skeniranje daje jedan znak. Skupi 7 da dovršiš skrivenu frazu.' },
      { title: 'Dovrši frazu i zamijeni je!', body: 'Kad imaš svih 7, idi u glavnu dvoranu. Pokaži zaslon aplikacije osoblju da dobiješ nagradu!' },
    ],
  },
  register: {
    title: 'Registracija sudionika',
    nicknameLabel: 'Nadimak (nije obavezno)',
    nicknamePlaceholder: 'npr.: Posjetitelj svečanosti',
    genderLabel: 'Spol',
    ageLabel: 'Dobna skupina',
    required: 'Obavezno',
    selectPlaceholder: 'Odaberite',
    genderError: 'Odaberite spol',
    ageError: 'Odaberite dobnu skupinu',
    submit: 'Sudjeluj',
    gender: { male: 'Muško', female: 'Žensko', other: 'Ostalo' },
    age: { student: 'Učenik/Student', '10s': 'Tinejdžer', '20s': '20–29', '30s': '30–39', '40s': '40–49', '50s': '50–59', '60plus': '60 i više' },
  },
  rally: {
    countLabel: 'Skupljeni žigovi',
    completeBanner1: 'Skupio si svih 7 žigova!',
    completeBanner2: 'Smisli točan redoslijed i prihvati izazov fraze.',
    phraseSolvedBanner: 'Fraza je gotova! Zamijeni je u glavnoj dvorani',
    exchangedBanner: 'Zamjena nagrade je dovršena',
    challengeCta: 'Prihvati izazov',
    exchangeCta: 'Idi na zamjenu nagrade',
    cameraCta: '📷 Uključi kameru',
  },
  camera: {
    instruction: 'Stavi QR kod unutar okvira',
    permissionDenied: 'Pristup kameri nije dopušten. Dopusti kameru u postavkama preglednika.',
    duplicate: 'Već imaš ovaj QR kod',
    invalid: 'Ovaj QR kod nije dio relija',
    demoScanButton: 'Učitaj demo QR',
    debugLabel: 'Otklanjanje pogrešaka (skriveno u produkciji): dodijeli žig bez kamere',
  },
  reveal: { title: 'Dobiven znak!', stampGet: 'DOBIVEN ŽIG!', close: 'Zatvori' },
  challenge: {
    title: 'Izazov fraze',
    instruction: 'Presloži 7 znakova da složiš točnu frazu!',
    wrong: 'Šteta, nije točan odgovor. Pokušaj ponovno!',
    available: 'Tvoji znakovi (dodirni za postavljanje)',
    checkCta: 'Provjeri ovaj redoslijed',
    exchangeCta: 'Idi na zamjenu nagrade',
    correctTitle: 'Točno! Gotovo!',
    correctBody: 'Čestitamo! Složio si frazu.',
  },
  exchange: {
    phraseLabel: 'Složena fraza',
    title1: 'Reli žigova',
    title2: 'Nagrada za dovršetak — Pult za zamjenu',
    staffNotice1: 'Zamjenu nagrade mora obaviti osoblje.',
    staffNotice2: 'Predaj telefon članu osoblja.',
    exchangeButton: 'Zamijeni',
    done: 'Zamijenjeno',
    confirmQuestion: 'Sigurno želiš zamijeniti?',
    staffHeading: 'Samo za osoblje',
    staffPasscodePlaceholder: 'Šifra osoblja',
    staffPasscodeError: 'Neispravna šifra',
  },
};

export default hr;
