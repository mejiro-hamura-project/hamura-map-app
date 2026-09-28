import type { PartialMessages } from '../index';

// Norsk bokmål (Norwegian Bokmål). Løses fra nb, nb-NO og (via basiskode) no.
const nb: PartialMessages = {
  common: {
    start: 'Start',
    ok: 'OK',
    cancel: 'Avbryt',
    back: 'Tilbake',
    resetConfirm:
      'Slette all fremgang (stempler, registrering, byttehistorikk) og starte på nytt?',
    resetButton: '(Test) Nullstill fremgang og start på nytt',
  },
  header: { line1: 'Festival', line2: 'Stempelrally' },
  notice: {
    iconAlt: 'Ikon for festivalens stempelrally',
    title: 'Merk',
    safetyHeading: 'Sikkerhetsoppfordring',
    safetyBody:
      'Helligdomsområdet er fullt av besøkende. Vær oppmerksom på omgivelsene, ikke løp og ikke kolliderer med andre besøkende. Å gå mens du ser på telefonen er svært farlig – stå stille før du bruker appen.',
    privacyHeading: 'Om personopplysninger',
    privacyBody:
      'De registrerte opplysningene brukes bare til å gjennomføre arrangementet, bekrefte premiebytte og til statistikk. De brukes ikke til andre formål og deles ikke med tredjeparter.',
    otherHeading: 'Annet',
    otherBody:
      'Antall premier er begrenset, og byttet kan avsluttes når de er tomme. Takk for forståelsen.',
  },
  howto: {
    title: 'Slik spiller du',
    imagePlaceholder: 'Bilde',
    steps: [
      { title: 'Finn QR-kodene på området!', body: 'Rallyets QR-koder er gjemt rundt om på helligdomsområdet. Dra ut og let!' },
      { title: 'Skann dem med kameraet!', body: 'Bare rett appens kamera mot QR-koden. Når den er lest, kontrolleres den automatisk.' },
      { title: 'Samle tegnene!', body: 'Hver skanning gir ett tegn. Samle 7 for å fullføre den skjulte frasen.' },
      { title: 'Fullfør frasen og bytt den inn!', body: 'Med alle 7 går du til hovedhallen. Vis appskjermen til personalet for å få premien din!' },
    ],
  },
  register: {
    title: 'Deltakerregistrering',
    nicknameLabel: 'Kallenavn (valgfritt)',
    nicknamePlaceholder: 'f.eks.: Festivalgjenger',
    genderLabel: 'Kjønn',
    ageLabel: 'Aldersgruppe',
    required: 'Påkrevd',
    selectPlaceholder: 'Velg',
    genderError: 'Velg kjønn',
    ageError: 'Velg aldersgruppe',
    submit: 'Delta',
    gender: { male: 'Mann', female: 'Kvinne', other: 'Annet' },
    age: { student: 'Student', '10s': 'Tenåring', '20s': '20–29', '30s': '30–39', '40s': '40–49', '50s': '50–59', '60plus': '60 og eldre' },
  },
  rally: {
    countLabel: 'Innsamlede stempler',
    completeBanner1: 'Du har samlet alle 7 stemplene!',
    completeBanner2: 'Tenk ut riktig rekkefølge og ta fraseutfordringen.',
    phraseSolvedBanner: 'Frasen er fullført! Bytt den inn i hovedhallen',
    exchangedBanner: 'Premiebyttet er fullført',
    challengeCta: 'Ta utfordringen',
    exchangeCta: 'Gå til premiebytte',
    cameraCta: '📷 Slå på kameraet',
  },
  camera: {
    instruction: 'Plasser QR-koden innenfor rammen',
    permissionDenied: 'Ingen kameratilgang. Tillat kameraet i nettleserinnstillingene.',
    duplicate: 'Du har allerede denne QR-koden',
    invalid: 'Denne QR-koden hører ikke til rallyet',
    demoScanButton: 'Last inn demo-QR',
    debugLabel: 'Feilsøking (skjult i produksjon): tildel stempel uten kamera',
  },
  reveal: { title: 'Tegn oppnådd!', stampGet: 'STEMPEL OPPNÅDD!', close: 'Lukk' },
  challenge: {
    title: 'Fraseutfordringen',
    instruction: 'Omorganiser de 7 tegnene for å danne riktig frase!',
    wrong: 'Så synd, det er ikke riktig svar. Prøv igjen!',
    available: 'Tegnene dine (trykk for å plassere)',
    checkCta: 'Sjekk denne rekkefølgen',
    exchangeCta: 'Gå til premiebytte',
    correctTitle: 'Riktig! Fullført!',
    correctBody: 'Gratulerer! Du har fullført frasen.',
  },
  exchange: {
    phraseLabel: 'Fullført frase',
    title1: 'Stempelrally',
    title2: 'Fullføringspremie — Bytteskranke',
    staffNotice1: 'Premiebyttet må utføres av personalet.',
    staffNotice2: 'Lever telefonen din til en av personalet.',
    exchangeButton: 'Bytt inn',
    done: 'Byttet inn',
    confirmQuestion: 'Vil du virkelig bytte inn?',
    staffHeading: 'Kun for personale',
    staffPasscodePlaceholder: 'Personalkode',
    staffPasscodeError: 'Feil kode',
  },
};

export default nb;
