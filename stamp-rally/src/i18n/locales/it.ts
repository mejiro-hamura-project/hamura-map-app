import type { PartialMessages } from '../index';

// Italiano (Italian). Risolto da it, it-IT, it-CH, ecc.
const it: PartialMessages = {
  common: {
    start: 'Inizia',
    ok: 'OK',
    cancel: 'Annulla',
    back: 'Indietro',
    resetConfirm:
      'Cancellare tutti i progressi (timbri, registrazione, cronologia scambi) e ricominciare da capo?',
    resetButton: '(Test) Reimposta i progressi e ricomincia',
  },
  header: { line1: 'Festa', line2: 'Caccia ai timbri' },
  notice: {
    iconAlt: 'Icona della caccia ai timbri della festa',
    title: 'Avvisi',
    safetyHeading: 'Raccomandazione di sicurezza',
    safetyBody:
      "L'area del santuario è molto affollata. Fai attenzione a chi ti circonda, non correre e non urtare gli altri visitatori. Camminare guardando il telefono è molto pericoloso: fermati prima di usare l'app.",
    privacyHeading: 'Dati personali',
    privacyBody:
      "Le informazioni registrate sono usate solo per l'organizzazione dell'evento, la conferma dello scambio premi e a fini statistici. Non sono usate per altri scopi né cedute a terzi.",
    otherHeading: 'Altro',
    otherBody:
      'I premi sono in numero limitato e lo scambio può terminare a esaurimento. Grazie per la comprensione.',
  },
  howto: {
    title: 'Come si gioca',
    imagePlaceholder: 'Immagine',
    steps: [
      {
        title: 'Trova i codici QR nell’area!',
        body: "I codici QR della caccia sono nascosti in giro per l'area del santuario. Vai a cercarli!",
      },
      {
        title: 'Scansionali con la fotocamera!',
        body: "Basta inquadrare il codice QR con la fotocamera dell'app. Dopo la lettura la verifica è automatica.",
      },
      {
        title: 'Raccogli i caratteri!',
        body: 'Ogni scansione ti dà un carattere. Raccogline 7 per completare la frase nascosta.',
      },
      {
        title: 'Completa la frase e scambiala!',
        body: "Con tutti e 7, vai al padiglione principale. Mostra lo schermo dell'app allo staff per ricevere il premio!",
      },
    ],
  },
  register: {
    title: 'Registrazione partecipante',
    nicknameLabel: 'Soprannome (facoltativo)',
    nicknamePlaceholder: 'es.: Festaiolo',
    genderLabel: 'Genere',
    ageLabel: "Fascia d'età",
    required: 'Obbligatorio',
    selectPlaceholder: 'Seleziona',
    genderError: 'Seleziona il genere',
    ageError: "Seleziona la fascia d'età",
    submit: 'Partecipa',
    gender: { male: 'Uomo', female: 'Donna', other: 'Altro' },
    age: {
      student: 'Studente',
      '10s': 'Adolescente',
      '20s': '20-29',
      '30s': '30-39',
      '40s': '40-49',
      '50s': '50-59',
      '60plus': '60 e oltre',
    },
  },
  rally: {
    countLabel: 'Timbri raccolti',
    completeBanner1: 'Hai raccolto tutti e 7 i timbri!',
    completeBanner2: "Pensa all'ordine giusto e affronta la sfida della frase.",
    phraseSolvedBanner: 'Frase completata! Scambiala al padiglione principale',
    exchangedBanner: 'Lo scambio del premio è completato',
    challengeCta: 'Affronta la sfida',
    exchangeCta: 'Vai allo scambio premi',
    cameraCta: '📷 Attiva la fotocamera',
  },
  camera: {
    instruction: 'Inquadra il codice QR nel riquadro',
    permissionDenied:
      "Accesso alla fotocamera non consentito. Consenti la fotocamera nelle impostazioni del browser.",
    duplicate: 'Hai già questo codice QR',
    invalid: 'Questo codice QR non fa parte della caccia',
    demoScanButton: 'Carica un QR demo',
    debugLabel: 'Debug (nascosto in produzione): assegna un timbro senza fotocamera',
  },
  reveal: { title: 'Carattere ottenuto!', stampGet: 'TIMBRO OTTENUTO!', close: 'Chiudi' },
  challenge: {
    title: 'La sfida della frase',
    instruction: 'Riordina i 7 caratteri per formare la frase corretta!',
    wrong: 'Peccato, non è la risposta giusta. Riprova!',
    available: 'I tuoi caratteri (tocca per posizionare)',
    checkCta: 'Verifica questo ordine',
    exchangeCta: 'Vai allo scambio premi',
    correctTitle: 'Corretto! Completato!',
    correctBody: 'Complimenti! Hai completato la frase.',
  },
  exchange: {
    phraseLabel: 'Frase completata',
    title1: 'Caccia ai timbri',
    title2: 'Premio di completamento — Banco scambi',
    staffNotice1: 'Lo scambio del premio deve essere gestito dallo staff.',
    staffNotice2: 'Consegna il telefono a un membro dello staff.',
    exchangeButton: 'Scambia',
    done: 'Scambiato',
    confirmQuestion: 'Vuoi davvero effettuare lo scambio?',
    staffHeading: 'Riservato allo staff',
    staffPasscodePlaceholder: 'Codice staff',
    staffPasscodeError: 'Codice non corretto',
  },
};

export default it;
