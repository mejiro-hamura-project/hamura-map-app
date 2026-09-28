import type { PartialMessages } from '../index';

// Català (Catalan). Es resol des de ca, ca-ES.
const ca: PartialMessages = {
  common: {
    start: 'Comença',
    ok: "D'acord",
    cancel: 'Cancel·la',
    back: 'Enrere',
    resetConfirm:
      'Vols esborrar tot el progrés (segells, registre, historial d’intercanvis) i començar de nou?',
    resetButton: '(Prova) Restableix el progrés i comença de nou',
  },
  header: { line1: 'Festa', line2: 'Ral·li de segells' },
  notice: {
    iconAlt: 'Icona del ral·li de segells de la festa',
    title: 'Avisos',
    safetyHeading: 'Recomanació de seguretat',
    safetyBody:
      'El recinte del santuari sol estar ple de visitants. Para atenció al voltant, no corris ni xoquis amb altres visitants. Caminar mirant el telèfon és molt perillós: atura’t abans d’utilitzar l’aplicació.',
    privacyHeading: 'Sobre les dades personals',
    privacyBody:
      'La informació registrada només s’utilitza per a l’organització de l’esdeveniment, la confirmació de l’intercanvi de premis i amb finalitats estadístiques. No s’utilitza per a altres finalitats ni es cedeix a tercers.',
    otherHeading: 'Altres',
    otherBody:
      'Els premis són limitats i l’intercanvi pot finalitzar en exhaurir-se. Gràcies per la comprensió.',
  },
  howto: {
    title: 'Com jugar',
    imagePlaceholder: 'Imatge',
    steps: [
      { title: 'Troba els codis QR del recinte!', body: 'Els codis QR del ral·li estan amagats per tot el recinte del santuari. Ves a buscar-los!' },
      { title: 'Escaneja’ls amb la càmera!', body: 'Només cal apuntar la càmera de l’aplicació al codi QR. Un cop llegit, la verificació és automàtica.' },
      { title: 'Recull els caràcters!', body: 'Cada escaneig et dóna un caràcter. Reuneix-ne 7 per completar la frase amagada.' },
      { title: 'Completa la frase i bescanvia-la!', body: 'Amb els 7, ves a la sala principal. Mostra la pantalla de l’aplicació al personal per obtenir el premi!' },
    ],
  },
  register: {
    title: 'Registre de participant',
    nicknameLabel: 'Sobrenom (opcional)',
    nicknamePlaceholder: 'p. ex.: Festiu',
    genderLabel: 'Gènere',
    ageLabel: "Franja d'edat",
    required: 'Obligatori',
    selectPlaceholder: 'Selecciona',
    genderError: 'Selecciona el gènere',
    ageError: "Selecciona la franja d'edat",
    submit: 'Participa',
    gender: { male: 'Home', female: 'Dona', other: 'Altre' },
    age: { student: 'Estudiant', '10s': 'Adolescent', '20s': '20–29', '30s': '30–39', '40s': '40–49', '50s': '50–59', '60plus': '60 o més' },
  },
  rally: {
    countLabel: 'Segells aconseguits',
    completeBanner1: 'Has reunit els 7 segells!',
    completeBanner2: 'Pensa l’ordre correcte i afronta el repte de la frase.',
    phraseSolvedBanner: 'Frase completada! Bescanvia-la a la sala principal',
    exchangedBanner: "L'intercanvi del premi s'ha completat",
    challengeCta: 'Afronta el repte',
    exchangeCta: "Ves a l'intercanvi de premi",
    cameraCta: '📷 Activa la càmera',
  },
  camera: {
    instruction: 'Col·loca el codi QR dins del marc',
    permissionDenied: "No hi ha accés a la càmera. Permet la càmera a la configuració del navegador.",
    duplicate: 'Ja tens aquest codi QR',
    invalid: 'Aquest codi QR no forma part del ral·li',
    demoScanButton: 'Carrega un QR de demostració',
    debugLabel: 'Depuració (amagat en producció): atorga un segell sense càmera',
  },
  reveal: { title: 'Caràcter aconseguit!', stampGet: 'SEGELL ACONSEGUIT!', close: 'Tanca' },
  challenge: {
    title: 'El repte de la frase',
    instruction: 'Reordena els 7 caràcters per formar la frase correcta!',
    wrong: 'Llàstima, no és la resposta correcta. Torna-ho a provar!',
    available: 'Els teus caràcters (toca per col·locar)',
    checkCta: 'Comprova aquest ordre',
    exchangeCta: "Ves a l'intercanvi de premi",
    correctTitle: 'Correcte! Completat!',
    correctBody: 'Enhorabona! Has completat la frase.',
  },
  exchange: {
    phraseLabel: 'Frase completada',
    title1: 'Ral·li de segells',
    title2: 'Premi per completar — Taulell d’intercanvi',
    staffNotice1: "L'intercanvi del premi l'ha de fer el personal.",
    staffNotice2: 'Lliura el telèfon a un membre del personal.',
    exchangeButton: 'Bescanvia',
    done: 'Bescanviat',
    confirmQuestion: 'Segur que vols bescanviar-ho?',
    staffHeading: 'Només per al personal',
    staffPasscodePlaceholder: 'Codi del personal',
    staffPasscodeError: 'El codi no és correcte',
  },
};

export default ca;
