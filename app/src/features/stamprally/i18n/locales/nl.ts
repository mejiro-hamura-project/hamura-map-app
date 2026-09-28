import type { PartialMessages } from '../index';

// Nederlands (Dutch). Opgelost vanuit nl, nl-NL, nl-BE.
const nl: PartialMessages = {
  common: {
    start: 'Starten',
    ok: 'Oké',
    cancel: 'Annuleren',
    back: 'Terug',
    resetConfirm:
      'Alle voortgang (stempels, registratie, ruilgeschiedenis) wissen en opnieuw beginnen?',
    resetButton: '(Test) Voortgang resetten en opnieuw beginnen',
  },
  header: { line1: 'Festival', line2: 'Stempelrally' },
  notice: {
    iconAlt: 'Pictogram van de festivalstempelrally',
    title: 'Let op',
    safetyHeading: 'Veiligheidsverzoek',
    safetyBody:
      'Het schrijnterrein is druk met bezoekers. Let op je omgeving, ren niet en bots niet tegen andere bezoekers. Lopen terwijl je op je telefoon kijkt is erg gevaarlijk; sta stil voordat je de app gebruikt.',
    privacyHeading: 'Over persoonsgegevens',
    privacyBody:
      'De geregistreerde gegevens worden alleen gebruikt voor de organisatie van dit evenement, de bevestiging van prijsruil en statistieken. Ze worden niet voor andere doeleinden gebruikt en niet aan derden verstrekt.',
    otherHeading: 'Overig',
    otherBody:
      'Het aantal prijzen is beperkt en het ruilen kan stoppen zodra ze op zijn. Bedankt voor je begrip.',
  },
  howto: {
    title: 'Hoe te spelen',
    imagePlaceholder: 'Afbeelding',
    steps: [
      { title: 'Zoek de QR-codes op het terrein!', body: 'De QR-codes van de rally liggen verspreid over het hele schrijnterrein. Ga ze zoeken!' },
      { title: 'Scan ze met de camera!', body: 'Richt de camera van de app gewoon op de QR-code. Na het lezen wordt automatisch gecontroleerd.' },
      { title: 'Verzamel de tekens!', body: 'Elke scan levert één teken op. Verzamel er 7 om de verborgen zin te voltooien.' },
      { title: 'Voltooi de zin en ruil hem in!', body: 'Ga met alle 7 naar de hoofdhal. Toon het app-scherm aan het personeel om je prijs te krijgen!' },
    ],
  },
  register: {
    title: 'Deelnemersregistratie',
    nicknameLabel: 'Bijnaam (optioneel)',
    nicknamePlaceholder: 'bijv.: Festivalganger',
    genderLabel: 'Geslacht',
    ageLabel: 'Leeftijdsgroep',
    required: 'Verplicht',
    selectPlaceholder: 'Maak een keuze',
    genderError: 'Kies je geslacht',
    ageError: 'Kies je leeftijdsgroep',
    submit: 'Meedoen',
    gender: { male: 'Man', female: 'Vrouw', other: 'Anders' },
    age: { student: 'Student', '10s': 'Tiener', '20s': '20–29', '30s': '30–39', '40s': '40–49', '50s': '50–59', '60plus': '60 en ouder' },
  },
  rally: {
    countLabel: 'Verzamelde stempels',
    completeBanner1: 'Je hebt alle 7 stempels verzameld!',
    completeBanner2: 'Bedenk de juiste volgorde en ga de zinuitdaging aan.',
    phraseSolvedBanner: 'Zin voltooid! Ruil hem in bij de hoofdhal',
    exchangedBanner: 'Het inruilen van de prijs is voltooid',
    challengeCta: 'Ga de uitdaging aan',
    exchangeCta: 'Naar prijsruil',
    cameraCta: '📷 Camera inschakelen',
  },
  camera: {
    instruction: 'Plaats de QR-code in het kader',
    permissionDenied: 'Geen cameratoegang. Sta de camera toe in de browserinstellingen.',
    duplicate: 'Je hebt deze QR-code al',
    invalid: 'Deze QR-code hoort niet bij de rally',
    demoScanButton: 'Demo-QR laden',
    debugLabel: 'Debug (verborgen in productie): stempel toekennen zonder camera',
  },
  reveal: { title: 'Teken verkregen!', stampGet: 'STEMPEL VERKREGEN!', close: 'Sluiten' },
  challenge: {
    title: 'De zinuitdaging',
    instruction: 'Herschik de 7 tekens om de juiste zin te vormen!',
    wrong: 'Jammer, dat is niet het juiste antwoord. Probeer het opnieuw!',
    available: 'Jouw tekens (tik om te plaatsen)',
    checkCta: 'Controleer deze volgorde',
    exchangeCta: 'Naar prijsruil',
    correctTitle: 'Juist! Voltooid!',
    correctBody: 'Gefeliciteerd! Je hebt de zin voltooid.',
  },
  exchange: {
    phraseLabel: 'Voltooide zin',
    title1: 'Stempelrally',
    title2: 'Voltooiingsprijs — Ruilbalie',
    staffNotice1: 'Het inruilen van de prijs moet door het personeel worden gedaan.',
    staffNotice2: 'Geef je telefoon aan een medewerker.',
    exchangeButton: 'Inruilen',
    done: 'Ingeruild',
    confirmQuestion: 'Weet je zeker dat je wilt inruilen?',
    staffHeading: 'Alleen voor personeel',
    staffPasscodePlaceholder: 'Personeelscode',
    staffPasscodeError: 'Code is onjuist',
  },
};

export default nl;
