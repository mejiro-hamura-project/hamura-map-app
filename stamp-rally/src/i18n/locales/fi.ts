import type { PartialMessages } from '../index';

// Suomi (Finnish). Ratkaistaan kielikoodeista fi, fi-FI.
const fi: PartialMessages = {
  common: {
    start: 'Aloita',
    ok: 'OK',
    cancel: 'Peruuta',
    back: 'Takaisin',
    resetConfirm:
      'Poistetaanko kaikki edistyminen (leimat, rekisteröinti, vaihtohistoria) ja aloitetaanko alusta?',
    resetButton: '(Testi) Nollaa edistyminen ja aloita alusta',
  },
  header: { line1: 'Festivaali', line2: 'Leimaralli' },
  notice: {
    iconAlt: 'Festivaalin leimarallin kuvake',
    title: 'Huomioitavaa',
    safetyHeading: 'Turvallisuuspyyntö',
    safetyBody:
      'Pyhäkköalue on täynnä kävijöitä. Tarkkaile ympäristöäsi, älä juokse äläkä törmää muihin kävijöihin. Kävely puhelinta katsoen on erittäin vaarallista – pysähdy ennen sovelluksen käyttöä.',
    privacyHeading: 'Henkilötiedoista',
    privacyBody:
      'Rekisteröityjä tietoja käytetään vain tapahtuman järjestämiseen, palkintojen vaihdon vahvistamiseen ja tilastointiin. Niitä ei käytetä muihin tarkoituksiin eikä luovuteta kolmansille osapuolille.',
    otherHeading: 'Muuta',
    otherBody:
      'Palkintoja on rajoitetusti, ja vaihto voi päättyä niiden loputtua. Kiitos ymmärryksestä.',
  },
  howto: {
    title: 'Näin pelaat',
    imagePlaceholder: 'Kuva',
    steps: [
      { title: 'Etsi alueen QR-koodit!', body: 'Rallin QR-koodit on piilotettu ympäri pyhäkköaluetta. Lähde etsimään!' },
      { title: 'Skannaa ne kameralla!', body: 'Suuntaa vain sovelluksen kamera QR-koodiin. Luennan jälkeen tarkistus tapahtuu automaattisesti.' },
      { title: 'Kerää merkit!', body: 'Jokainen skannaus antaa yhden merkin. Kerää 7 täydentääksesi salaisen lauseen.' },
      { title: 'Täydennä lause ja vaihda se!', body: 'Kun sinulla on kaikki 7, mene päähalliin. Näytä sovelluksen näyttö henkilökunnalle saadaksesi palkintosi!' },
    ],
  },
  register: {
    title: 'Osallistujan rekisteröinti',
    nicknameLabel: 'Lempinimi (valinnainen)',
    nicknamePlaceholder: 'esim.: Festivaalikävijä',
    genderLabel: 'Sukupuoli',
    ageLabel: 'Ikäryhmä',
    required: 'Pakollinen',
    selectPlaceholder: 'Valitse',
    genderError: 'Valitse sukupuoli',
    ageError: 'Valitse ikäryhmä',
    submit: 'Osallistu',
    gender: { male: 'Mies', female: 'Nainen', other: 'Muu' },
    age: { student: 'Opiskelija', '10s': 'Teini', '20s': '20–29', '30s': '30–39', '40s': '40–49', '50s': '50–59', '60plus': '60 ja yli' },
  },
  rally: {
    countLabel: 'Kerätyt leimat',
    completeBanner1: 'Keräsit kaikki 7 leimaa!',
    completeBanner2: 'Mieti oikea järjestys ja tartu lausehaasteeseen.',
    phraseSolvedBanner: 'Lause on valmis! Vaihda se päähallissa',
    exchangedBanner: 'Palkinnon vaihto on valmis',
    challengeCta: 'Tartu haasteeseen',
    exchangeCta: 'Siirry palkinnon vaihtoon',
    cameraCta: '📷 Käynnistä kamera',
  },
  camera: {
    instruction: 'Aseta QR-koodi kehyksen sisään',
    permissionDenied: 'Kameran käyttöä ei sallittu. Salli kamera selaimen asetuksissa.',
    duplicate: 'Sinulla on jo tämä QR-koodi',
    invalid: 'Tämä QR-koodi ei kuulu ralliin',
    demoScanButton: 'Lataa demo-QR',
    debugLabel: 'Virheenkorjaus (piilotettu tuotannossa): myönnä leima ilman kameraa',
  },
  reveal: { title: 'Sait merkin!', stampGet: 'SAIT LEIMAN!', close: 'Sulje' },
  challenge: {
    title: 'Lausehaaste',
    instruction: 'Järjestä 7 merkkiä uudelleen muodostaaksesi oikean lauseen!',
    wrong: 'Harmi, ei ole oikea vastaus. Yritä uudelleen!',
    available: 'Merkkisi (napauta asettaaksesi)',
    checkCta: 'Tarkista tämä järjestys',
    exchangeCta: 'Siirry palkinnon vaihtoon',
    correctTitle: 'Oikein! Valmis!',
    correctBody: 'Onnittelut! Täydensit lauseen.',
  },
  exchange: {
    phraseLabel: 'Valmis lause',
    title1: 'Leimaralli',
    title2: 'Suorituspalkinto — Vaihtotiski',
    staffNotice1: 'Palkinnon vaihdon suorittaa henkilökunta.',
    staffNotice2: 'Anna puhelimesi henkilökunnan jäsenelle.',
    exchangeButton: 'Vaihda',
    done: 'Vaihdettu',
    confirmQuestion: 'Haluatko varmasti vaihtaa?',
    staffHeading: 'Vain henkilökunnalle',
    staffPasscodePlaceholder: 'Henkilökunnan tunnuskoodi',
    staffPasscodeError: 'Väärä tunnuskoodi',
  },
};

export default fi;
