import type { PartialMessages } from '../index';

// Français (French). Résolu depuis fr, fr-FR, fr-CA, fr-BE, etc.
const fr: PartialMessages = {
  common: {
    start: 'Commencer',
    ok: 'OK',
    cancel: 'Annuler',
    back: 'Retour',
    resetConfirm:
      'Effacer toute la progression (tampons, inscription, historique d’échange) et tout recommencer ?',
    resetButton: '(Test) Réinitialiser la progression et recommencer',
  },
  header: {
    line1: 'Festival',
    line2: 'Rallye de tampons',
  },
  notice: {
    iconAlt: 'Icône du rallye de tampons du festival',
    title: 'À noter',
    safetyHeading: 'Consigne de sécurité',
    safetyBody:
      "L’enceinte du sanctuaire est très fréquentée. Faites attention autour de vous, ne courez pas et ne bousculez pas les autres visiteurs. Marcher en regardant son téléphone est très dangereux : arrêtez-vous avant d’utiliser l’application.",
    privacyHeading: 'Données personnelles',
    privacyBody:
      "Les informations enregistrées servent uniquement à l’organisation de l’événement, à la vérification des échanges de lots et aux statistiques. Elles ne sont utilisées à aucune autre fin et ne sont jamais transmises à des tiers.",
    otherHeading: 'Divers',
    otherBody:
      'Les lots sont en quantité limitée ; l’échange peut prendre fin dès leur épuisement. Merci de votre compréhension.',
  },
  howto: {
    title: 'Comment jouer',
    imagePlaceholder: 'Image',
    steps: [
      {
        title: 'Trouvez les QR codes dans l’enceinte !',
        body: 'Des QR codes dédiés au rallye sont cachés un peu partout dans l’enceinte. À vous de les trouver !',
      },
      {
        title: 'Scannez-les avec la caméra !',
        body: 'Visez simplement le QR code avec la caméra de l’application. La validation est automatique une fois le code lu.',
      },
      {
        title: 'Collectez les caractères !',
        body: 'Chaque scan vous donne un caractère. Réunissez-en 7 pour compléter la phrase mystère.',
      },
      {
        title: 'Complétez la phrase et échangez !',
        body: 'Une fois les 7 réunis, rendez-vous au pavillon principal. Montrez l’écran de l’application au personnel pour obtenir votre lot !',
      },
    ],
  },
  register: {
    title: 'Inscription du participant',
    nicknameLabel: 'Pseudo (facultatif)',
    nicknamePlaceholder: 'ex. : Festivalier',
    genderLabel: 'Genre',
    ageLabel: 'Tranche d’âge',
    required: 'Obligatoire',
    selectPlaceholder: 'Veuillez choisir',
    genderError: 'Veuillez choisir votre genre',
    ageError: 'Veuillez choisir votre tranche d’âge',
    submit: 'Participer',
    gender: { male: 'Homme', female: 'Femme', other: 'Autre' },
    age: {
      student: 'Étudiant',
      '10s': 'Adolescent',
      '20s': '20-29 ans',
      '30s': '30-39 ans',
      '40s': '40-49 ans',
      '50s': '50-59 ans',
      '60plus': '60 ans et plus',
    },
  },
  rally: {
    countLabel: 'Tampons obtenus',
    completeBanner1: 'Vous avez réuni les 7 tampons !',
    completeBanner2: 'Trouvez le bon ordre et relevez le défi de la phrase.',
    phraseSolvedBanner: 'Phrase complétée ! Échangez-la au pavillon principal',
    exchangedBanner: 'L’échange de lot est terminé',
    challengeCta: 'Relever le défi',
    exchangeCta: 'Aller à l’échange de lot',
    cameraCta: '📷 Activer la caméra',
  },
  camera: {
    instruction: 'Placez le QR code dans le cadre',
    permissionDenied:
      "L’accès à la caméra n’est pas autorisé. Autorisez la caméra dans les réglages du navigateur.",
    duplicate: 'Vous avez déjà ce QR code',
    invalid: 'Ce QR code ne fait pas partie du rallye',
    demoScanButton: 'Charger un QR de démo',
    debugLabel: 'Débogage (masqué en production) : attribuer un tampon sans la caméra',
  },
  reveal: {
    title: 'Caractère obtenu !',
    stampGet: 'TAMPON OBTENU !',
    close: 'Fermer',
  },
  challenge: {
    title: 'Défi de la phrase',
    instruction: 'Réorganisez les 7 caractères pour former la bonne phrase !',
    wrong: 'Dommage, ce n’est pas la bonne réponse. Réessayez !',
    available: 'Vos caractères (touchez pour placer)',
    checkCta: 'Vérifier cet ordre',
    exchangeCta: 'Aller à l’échange de lot',
    correctTitle: 'Correct ! Terminé !',
    correctBody: 'Félicitations ! Vous avez complété la phrase.',
  },
  exchange: {
    phraseLabel: 'Phrase complétée',
    title1: 'Rallye de tampons',
    title2: 'Récompense de complétion — Comptoir d’échange',
    staffNotice1: 'L’échange de lot doit être effectué par un membre du personnel.',
    staffNotice2: 'Veuillez remettre votre téléphone à un membre du personnel.',
    exchangeButton: 'Échanger',
    done: 'Échangé',
    confirmQuestion: 'Confirmer l’échange ?',
    staffHeading: 'Réservé au personnel',
    staffPasscodePlaceholder: 'Code du personnel',
    staffPasscodeError: 'Code incorrect',
  },
};

export default fr;
