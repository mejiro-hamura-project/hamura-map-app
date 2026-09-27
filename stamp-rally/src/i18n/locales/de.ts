import type { PartialMessages } from '../index';

// Deutsch (German). Aufgelöst aus de, de-DE, de-AT, de-CH usw.
const de: PartialMessages = {
  common: {
    start: 'Start',
    ok: 'OK',
    cancel: 'Abbrechen',
    back: 'Zurück',
    resetConfirm:
      'Gesamten Fortschritt (Stempel, Registrierung, Einlöseverlauf) löschen und von vorn beginnen?',
    resetButton: '(Test) Fortschritt zurücksetzen und neu beginnen',
  },
  header: {
    line1: 'Fest',
    line2: 'Stempel-Rallye',
  },
  notice: {
    iconAlt: 'Symbol der Fest-Stempel-Rallye',
    title: 'Hinweise',
    safetyHeading: 'Bitte zur Sicherheit',
    safetyBody:
      'Auf dem Schreingelände ist viel Betrieb. Achten Sie auf Ihre Umgebung, rennen Sie nicht und stoßen Sie nicht mit anderen Besuchern zusammen. Gehen und gleichzeitig aufs Handy schauen ist sehr gefährlich – bleiben Sie zum Bedienen stehen.',
    privacyHeading: 'Zu personenbezogenen Daten',
    privacyBody:
      'Die angegebenen Daten werden ausschließlich für die Durchführung dieser Veranstaltung, die Bestätigung des Preistauschs und für Statistiken verwendet. Eine andere Nutzung oder Weitergabe an Dritte erfolgt nicht.',
    otherHeading: 'Sonstiges',
    otherBody:
      'Die Preise sind begrenzt; der Tausch kann bei Erschöpfung vorzeitig enden. Wir bitten um Ihr Verständnis.',
  },
  howto: {
    title: 'So funktioniert’s',
    imagePlaceholder: 'Bild',
    steps: [
      {
        title: 'Finde die QR-Codes auf dem Gelände!',
        body: 'Überall auf dem Schreingelände sind QR-Codes für die Stempel-Rallye versteckt. Finde sie!',
      },
      {
        title: 'Mit der Kamera scannen!',
        body: 'Halte die Kamera der App einfach auf den QR-Code. Nach dem Erkennen wird automatisch geprüft.',
      },
      {
        title: 'Sammle die Zeichen!',
        body: 'Jeder Scan bringt ein Zeichen. Sammle 7, um den Lösungssatz zu vervollständigen.',
      },
      {
        title: 'Satz vervollständigen und eintauschen!',
        body: 'Mit allen 7 gehst du zur Haupthalle. Zeige dem Personal den App-Bildschirm und erhalte deinen Preis!',
      },
    ],
  },
  register: {
    title: 'Teilnehmer-Registrierung',
    nicknameLabel: 'Spitzname (optional)',
    nicknamePlaceholder: 'z. B. Festbesucher',
    genderLabel: 'Geschlecht',
    ageLabel: 'Altersgruppe',
    required: 'Pflicht',
    selectPlaceholder: 'Bitte auswählen',
    genderError: 'Bitte Geschlecht auswählen',
    ageError: 'Bitte Altersgruppe auswählen',
    submit: 'Teilnehmen',
    gender: { male: 'Männlich', female: 'Weiblich', other: 'Divers' },
    age: {
      student: 'Schüler/Student',
      '10s': 'Teenager',
      '20s': '20-29',
      '30s': '30-39',
      '40s': '40-49',
      '50s': '50-59',
      '60plus': '60 und älter',
    },
  },
  rally: {
    countLabel: 'Gesammelte Stempel',
    completeBanner1: 'Du hast alle 7 Stempel gesammelt!',
    completeBanner2: 'Überlege die richtige Reihenfolge und stell dich der Aufgabe.',
    phraseSolvedBanner: 'Satz vervollständigt! Tausche ihn in der Haupthalle ein',
    exchangedBanner: 'Der Preistausch ist abgeschlossen',
    challengeCta: 'Aufgabe annehmen',
    exchangeCta: 'Zum Preistausch',
    cameraCta: '📷 Kamera starten',
  },
  camera: {
    instruction: 'Bring den QR-Code in den Rahmen',
    permissionDenied:
      'Kein Kamerazugriff. Bitte erlaube die Kamera in den Browsereinstellungen.',
    duplicate: 'Diesen QR-Code hast du bereits',
    invalid: 'Dieser QR-Code gehört nicht zur Rallye',
    demoScanButton: 'Demo-QR laden',
    debugLabel: 'Debug (in Produktion ausgeblendet): Stempel ohne Kamera vergeben',
  },
  reveal: {
    title: 'Zeichen erhalten!',
    stampGet: 'STEMPEL ERHALTEN!',
    close: 'Schließen',
  },
  challenge: {
    title: 'Die Aufgabe',
    instruction: 'Ordne die 7 Zeichen neu, um den richtigen Satz zu bilden!',
    wrong: 'Schade, das ist nicht richtig. Versuch es noch einmal!',
    available: 'Deine Zeichen (zum Platzieren tippen)',
    checkCta: 'Diese Reihenfolge prüfen',
    exchangeCta: 'Zum Preistausch',
    correctTitle: 'Richtig! Komplett!',
    correctBody: 'Glückwunsch! Du hast den Satz vervollständigt.',
  },
  exchange: {
    phraseLabel: 'Vervollständigter Satz',
    title1: 'Stempel-Rallye',
    title2: 'Abschlusspreis – Tauschstelle',
    staffNotice1: 'Der Preistausch muss vom Personal durchgeführt werden.',
    staffNotice2: 'Bitte übergib dein Telefon einem Mitarbeiter.',
    exchangeButton: 'Eintauschen',
    done: 'Eingetauscht',
    confirmQuestion: 'Wirklich eintauschen?',
    staffHeading: 'Für das Personal',
    staffPasscodePlaceholder: 'Personal-Passcode',
    staffPasscodeError: 'Passcode ist falsch',
  },
};

export default de;
