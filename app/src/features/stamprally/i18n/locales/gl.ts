import type { PartialMessages } from '../index';

// Galego (Galician). Resólvese desde gl, gl-ES.
const gl: PartialMessages = {
  common: {
    start: 'Comezar',
    ok: 'Aceptar',
    cancel: 'Cancelar',
    back: 'Atrás',
    resetConfirm:
      'Queres borrar todo o progreso (selos, rexistro, historial de intercambios) e comezar de novo?',
    resetButton: '(Proba) Restablecer o progreso e comezar de novo',
  },
  header: { line1: 'Festa', line2: 'Rally de selos' },
  notice: {
    iconAlt: 'Icona do rally de selos da festa',
    title: 'Avisos',
    safetyHeading: 'Recomendación de seguridade',
    safetyBody:
      'O recinto do santuario adoita estar cheo de visitantes. Presta atención ao teu redor, non corras nin choques con outros visitantes. Camiñar mirando o teléfono é moi perigoso: detente antes de usar a aplicación.',
    privacyHeading: 'Sobre os datos persoais',
    privacyBody:
      'A información rexistrada úsase só para a organización do evento, a confirmación do intercambio de premios e con fins estatísticos. Non se usa para outros fins nin se cede a terceiros.',
    otherHeading: 'Outros',
    otherBody:
      'Os premios son limitados e o intercambio pode rematar ao esgotarse. Grazas pola túa comprensión.',
  },
  howto: {
    title: 'Como xogar',
    imagePlaceholder: 'Imaxe',
    steps: [
      { title: 'Atopa os códigos QR do recinto!', body: 'Os códigos QR do rally están agochados por todo o recinto do santuario. Vai buscalos!' },
      { title: 'Escanéaos coa cámara!', body: 'Só tes que apuntar coa cámara da aplicación ao código QR. Ao lelo, a verificación é automática.' },
      { title: 'Recolle os caracteres!', body: 'Cada escaneo dache un carácter. Reúne 7 para completar a frase agochada.' },
      { title: 'Completa a frase e cámbiaa!', body: 'Cos 7, vai á sala principal. Amosa a pantalla da aplicación ao persoal para conseguir o teu premio!' },
    ],
  },
  register: {
    title: 'Rexistro de participante',
    nicknameLabel: 'Alcume (opcional)',
    nicknamePlaceholder: 'p. ex.: Festeiro',
    genderLabel: 'Xénero',
    ageLabel: 'Franxa de idade',
    required: 'Obrigatorio',
    selectPlaceholder: 'Selecciona',
    genderError: 'Selecciona o xénero',
    ageError: 'Selecciona a franxa de idade',
    submit: 'Participar',
    gender: { male: 'Home', female: 'Muller', other: 'Outro' },
    age: { student: 'Estudante', '10s': 'Adolescente', '20s': '20–29', '30s': '30–39', '40s': '40–49', '50s': '50–59', '60plus': '60 ou máis' },
  },
  rally: {
    countLabel: 'Selos conseguidos',
    completeBanner1: 'Reuniches os 7 selos!',
    completeBanner2: 'Pensa a orde correcta e afronta o reto da frase.',
    phraseSolvedBanner: 'Frase completada! Cámbiaa na sala principal',
    exchangedBanner: 'O intercambio do premio está completado',
    challengeCta: 'Afronta o reto',
    exchangeCta: 'Ir ao intercambio de premio',
    cameraCta: '📷 Activar a cámara',
  },
  camera: {
    instruction: 'Coloca o código QR dentro do marco',
    permissionDenied: 'Non hai acceso á cámara. Permite a cámara na configuración do navegador.',
    duplicate: 'Xa tes este código QR',
    invalid: 'Este código QR non forma parte do rally',
    demoScanButton: 'Cargar un QR de demostración',
    debugLabel: 'Depuración (agochado en produción): outorgar un selo sen cámara',
  },
  reveal: { title: 'Carácter conseguido!', stampGet: 'SELO CONSEGUIDO!', close: 'Pechar' },
  challenge: {
    title: 'O reto da frase',
    instruction: 'Reordena os 7 caracteres para formar a frase correcta!',
    wrong: 'Mágoa, non é a resposta correcta. Téntao de novo!',
    available: 'Os teus caracteres (toca para colocar)',
    checkCta: 'Comprobar esta orde',
    exchangeCta: 'Ir ao intercambio de premio',
    correctTitle: 'Correcto! Completado!',
    correctBody: 'Parabéns! Completaches a frase.',
  },
  exchange: {
    phraseLabel: 'Frase completada',
    title1: 'Rally de selos',
    title2: 'Premio por completar — Mostrador de intercambio',
    staffNotice1: 'O intercambio do premio debe facelo o persoal.',
    staffNotice2: 'Entrega o teléfono a un membro do persoal.',
    exchangeButton: 'Cambiar',
    done: 'Cambiado',
    confirmQuestion: 'Seguro que queres cambialo?',
    staffHeading: 'Só para o persoal',
    staffPasscodePlaceholder: 'Código do persoal',
    staffPasscodeError: 'O código non é correcto',
  },
};

export default gl;
