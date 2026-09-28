import type { PartialMessages } from '../index';

// Bosanski (Bosnian, Latin). Razrješava se iz bs, bs-BA.
const bs: PartialMessages = {
  common: {
    start: 'Počni',
    ok: 'U redu',
    cancel: 'Otkaži',
    back: 'Nazad',
    resetConfirm:
      'Obrisati sav napredak (pečate, registraciju, historiju razmjena) i početi ispočetka?',
    resetButton: '(Test) Poništi napredak i počni ispočetka',
  },
  header: { line1: 'Svečanost', line2: 'Reli pečata' },
  notice: {
    iconAlt: 'Ikona relija pečata svečanosti',
    title: 'Napomene',
    safetyHeading: 'Molba za sigurnost',
    safetyBody:
      'Prostor svetišta pun je posjetilaca. Pazite na okolinu, ne trčite i ne sudarajte se s drugim posjetiocima. Hodanje uz gledanje u telefon vrlo je opasno – zaustavite se prije korištenja aplikacije.',
    privacyHeading: 'O ličnim podacima',
    privacyBody:
      'Uneseni podaci koriste se isključivo za organizaciju događaja, potvrdu razmjene nagrada i u statističke svrhe. Ne koriste se u druge svrhe niti se daju trećim stranama.',
    otherHeading: 'Ostalo',
    otherBody:
      'Broj nagrada je ograničen i razmjena može završiti kada se potroše. Hvala na razumijevanju.',
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
    title: 'Registracija učesnika',
    nicknameLabel: 'Nadimak (nije obavezno)',
    nicknamePlaceholder: 'npr.: Posjetilac svečanosti',
    genderLabel: 'Spol',
    ageLabel: 'Dobna skupina',
    required: 'Obavezno',
    selectPlaceholder: 'Odaberite',
    genderError: 'Odaberite spol',
    ageError: 'Odaberite dobnu skupinu',
    submit: 'Učestvuj',
    gender: { male: 'Muško', female: 'Žensko', other: 'Ostalo' },
    age: { student: 'Učenik/Student', '10s': 'Tinejdžer', '20s': '20–29', '30s': '30–39', '40s': '40–49', '50s': '50–59', '60plus': '60 i više' },
  },
  rally: {
    countLabel: 'Skupljeni pečati',
    completeBanner1: 'Skupio si svih 7 pečata!',
    completeBanner2: 'Smisli tačan redoslijed i prihvati izazov fraze.',
    phraseSolvedBanner: 'Fraza je gotova! Zamijeni je u glavnoj dvorani',
    exchangedBanner: 'Razmjena nagrade je završena',
    challengeCta: 'Prihvati izazov',
    exchangeCta: 'Idi na razmjenu nagrade',
    cameraCta: '📷 Uključi kameru',
  },
  camera: {
    instruction: 'Stavi QR kod unutar okvira',
    permissionDenied: 'Pristup kameri nije dozvoljen. Dozvoli kameru u postavkama preglednika.',
    duplicate: 'Već imaš ovaj QR kod',
    invalid: 'Ovaj QR kod nije dio relija',
    demoScanButton: 'Učitaj demo QR',
    debugLabel: 'Otklanjanje grešaka (skriveno u produkciji): dodijeli pečat bez kamere',
  },
  reveal: { title: 'Dobijen znak!', stampGet: 'DOBIJEN PEČAT!', close: 'Zatvori' },
  challenge: {
    title: 'Izazov fraze',
    instruction: 'Presloži 7 znakova da složiš tačnu frazu!',
    wrong: 'Šteta, nije tačan odgovor. Pokušaj ponovo!',
    available: 'Tvoji znakovi (dodirni za postavljanje)',
    checkCta: 'Provjeri ovaj redoslijed',
    exchangeCta: 'Idi na razmjenu nagrade',
    correctTitle: 'Tačno! Gotovo!',
    correctBody: 'Čestitamo! Složio si frazu.',
  },
  exchange: {
    phraseLabel: 'Složena fraza',
    title1: 'Reli pečata',
    title2: 'Nagrada za završetak — Šalter za razmjenu',
    staffNotice1: 'Razmjenu nagrade mora obaviti osoblje.',
    staffNotice2: 'Predaj telefon članu osoblja.',
    exchangeButton: 'Zamijeni',
    done: 'Zamijenjeno',
    confirmQuestion: 'Sigurno želiš zamijeniti?',
    staffHeading: 'Samo za osoblje',
    staffPasscodePlaceholder: 'Šifra osoblja',
    staffPasscodeError: 'Neispravna šifra',
  },
};

export default bs;
