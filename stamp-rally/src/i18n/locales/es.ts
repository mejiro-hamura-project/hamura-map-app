import type { PartialMessages } from '../index';

// Español (Spanish). Se resuelve desde es, es-ES, es-MX, es-AR, etc.
const es: PartialMessages = {
  common: {
    start: 'Empezar',
    ok: 'Aceptar',
    cancel: 'Cancelar',
    back: 'Atrás',
    resetConfirm:
      '¿Borrar todo el progreso (sellos, registro, historial de canjes) y empezar de nuevo?',
    resetButton: '(Prueba) Restablecer el progreso y empezar de nuevo',
  },
  header: {
    line1: 'Festival',
    line2: 'Rally de sellos',
  },
  notice: {
    iconAlt: 'Icono del rally de sellos del festival',
    title: 'Avisos',
    safetyHeading: 'Recomendación de seguridad',
    safetyBody:
      'El recinto del santuario suele estar muy concurrido. Presta atención a tu alrededor, no corras ni choques con otros visitantes. Caminar mirando el móvil es muy peligroso: detente antes de usar la aplicación.',
    privacyHeading: 'Sobre los datos personales',
    privacyBody:
      'La información registrada se usa únicamente para la organización de este evento, la comprobación del canje de premios y con fines estadísticos. No se usa para otros fines ni se cede a terceros.',
    otherHeading: 'Otros',
    otherBody:
      'Los premios son limitados y el canje puede finalizar al agotarse. Gracias por tu comprensión.',
  },
  howto: {
    title: 'Cómo jugar',
    imagePlaceholder: 'Imagen',
    steps: [
      {
        title: '¡Busca los códigos QR del recinto!',
        body: 'Hay códigos QR del rally escondidos por todo el recinto del santuario. ¡A buscarlos!',
      },
      {
        title: '¡Escanéalos con la cámara!',
        body: 'Solo tienes que apuntar con la cámara de la app al código QR. Al leerlo, se comprueba automáticamente.',
      },
      {
        title: '¡Reúne los caracteres!',
        body: 'Cada escaneo te da un carácter. Reúne 7 para completar la frase oculta.',
      },
      {
        title: '¡Completa la frase y canjéala!',
        body: 'Con los 7, ve al pabellón principal. Muestra la pantalla de la app al personal para conseguir tu premio.',
      },
    ],
  },
  register: {
    title: 'Registro de participante',
    nicknameLabel: 'Apodo (opcional)',
    nicknamePlaceholder: 'ej.: Festivalero',
    genderLabel: 'Género',
    ageLabel: 'Rango de edad',
    required: 'Obligatorio',
    selectPlaceholder: 'Selecciona una opción',
    genderError: 'Selecciona tu género',
    ageError: 'Selecciona tu rango de edad',
    submit: 'Participar',
    gender: { male: 'Hombre', female: 'Mujer', other: 'Otro' },
    age: {
      student: 'Estudiante',
      '10s': 'Adolescente',
      '20s': '20-29',
      '30s': '30-39',
      '40s': '40-49',
      '50s': '50-59',
      '60plus': '60 o más',
    },
  },
  rally: {
    countLabel: 'Sellos conseguidos',
    completeBanner1: '¡Has reunido los 7 sellos!',
    completeBanner2: 'Piensa el orden correcto y afronta el reto de la frase.',
    phraseSolvedBanner: '¡Frase completada! Canjéala en el pabellón principal',
    exchangedBanner: 'El canje del premio está completado',
    challengeCta: 'Afrontar el reto',
    exchangeCta: 'Ir al canje de premio',
    cameraCta: '📷 Activar la cámara',
  },
  camera: {
    instruction: 'Coloca el código QR dentro del marco',
    permissionDenied:
      'No hay acceso a la cámara. Permite la cámara en los ajustes del navegador.',
    duplicate: 'Ya tienes este código QR',
    invalid: 'Este código QR no es del rally',
    demoScanButton: 'Cargar QR de demostración',
    debugLabel: 'Depuración (oculto en producción): otorgar un sello sin cámara',
  },
  reveal: {
    title: '¡Carácter conseguido!',
    stampGet: '¡SELLO CONSEGUIDO!',
    close: 'Cerrar',
  },
  challenge: {
    title: 'El reto de la frase',
    instruction: '¡Reordena los 7 caracteres para formar la frase correcta!',
    wrong: 'Lástima, no es la respuesta correcta. ¡Inténtalo otra vez!',
    available: 'Tus caracteres (toca para colocar)',
    checkCta: 'Comprobar este orden',
    exchangeCta: 'Ir al canje de premio',
    correctTitle: '¡Correcto! ¡Completado!',
    correctBody: '¡Enhorabuena! Has completado la frase.',
  },
  exchange: {
    phraseLabel: 'Frase completada',
    title1: 'Rally de sellos',
    title2: 'Premio por completar — Mostrador de canje',
    staffNotice1: 'El canje del premio debe realizarlo el personal.',
    staffNotice2: 'Entrega tu teléfono a un miembro del personal.',
    exchangeButton: 'Canjear',
    done: 'Canjeado',
    confirmQuestion: '¿Seguro que quieres canjearlo?',
    staffHeading: 'Solo para el personal',
    staffPasscodePlaceholder: 'Código del personal',
    staffPasscodeError: 'El código no es correcto',
  },
};

export default es;
