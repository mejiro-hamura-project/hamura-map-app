import type { PartialMessages } from '../index';

// Lietuvių (Lithuanian). Sprendžiama iš lt, lt-LT.
const lt: PartialMessages = {
  common: {
    start: 'Pradėti',
    ok: 'Gerai',
    cancel: 'Atšaukti',
    back: 'Atgal',
    resetConfirm:
      'Ištrinti visą pažangą (antspaudus, registraciją, mainų istoriją) ir pradėti iš naujo?',
    resetButton: '(Bandymas) Iš naujo nustatyti pažangą ir pradėti iš naujo',
  },
  header: { line1: 'Šventė', line2: 'Antspaudų ralis' },
  notice: {
    iconAlt: 'Šventės antspaudų ralio piktograma',
    title: 'Pastabos',
    safetyHeading: 'Prašymas dėl saugumo',
    safetyBody:
      'Šventyklos teritorijoje daug lankytojų. Stebėkite aplinką, nebėkite ir nesusidurkite su kitais lankytojais. Eiti žiūrint į telefoną labai pavojinga – sustokite prieš naudodami programėlę.',
    privacyHeading: 'Apie asmens duomenis',
    privacyBody:
      'Įvesti duomenys naudojami tik renginio organizavimui, prizų mainų patvirtinimui ir statistikai. Jie nenaudojami kitiems tikslams ir neperduodami trečiosioms šalims.',
    otherHeading: 'Kita',
    otherBody:
      'Prizų skaičius ribotas, mainai gali baigtis jiems pasibaigus. Ačiū už supratimą.',
  },
  howto: {
    title: 'Kaip žaisti',
    imagePlaceholder: 'Vaizdas',
    steps: [
      { title: 'Suraskite QR kodus teritorijoje!', body: 'Ralio QR kodai paslėpti visoje šventyklos teritorijoje. Eikite jų ieškoti!' },
      { title: 'Nuskaitykite juos kamera!', body: 'Tiesiog nukreipkite programėlės kamerą į QR kodą. Nuskaičius patikrinimas atliekamas automatiškai.' },
      { title: 'Rinkite simbolius!', body: 'Kiekvienas nuskaitymas duoda vieną simbolį. Surinkite 7, kad užbaigtumėte slaptą frazę.' },
      { title: 'Užbaikite frazę ir iškeiskite!', body: 'Turėdami visus 7, eikite į pagrindinę salę. Parodykite programėlės ekraną darbuotojui, kad gautumėte prizą!' },
    ],
  },
  register: {
    title: 'Dalyvio registracija',
    nicknameLabel: 'Slapyvardis (nebūtina)',
    nicknamePlaceholder: 'pvz.: Šventės lankytojas',
    genderLabel: 'Lytis',
    ageLabel: 'Amžiaus grupė',
    required: 'Privaloma',
    selectPlaceholder: 'Pasirinkite',
    genderError: 'Pasirinkite lytį',
    ageError: 'Pasirinkite amžiaus grupę',
    submit: 'Dalyvauti',
    gender: { male: 'Vyras', female: 'Moteris', other: 'Kita' },
    age: { student: 'Mokinys/Studentas', '10s': 'Paauglys', '20s': '20–29', '30s': '30–39', '40s': '40–49', '50s': '50–59', '60plus': '60 ir daugiau' },
  },
  rally: {
    countLabel: 'Surinkti antspaudai',
    completeBanner1: 'Surinkote visus 7 antspaudus!',
    completeBanner2: 'Sugalvokite teisingą tvarką ir priimkite frazės iššūkį.',
    phraseSolvedBanner: 'Frazė užbaigta! Iškeiskite ją pagrindinėje salėje',
    exchangedBanner: 'Prizo iškeitimas baigtas',
    challengeCta: 'Priimti iššūkį',
    exchangeCta: 'Į prizų iškeitimą',
    cameraCta: '📷 Įjungti kamerą',
  },
  camera: {
    instruction: 'Įdėkite QR kodą į rėmelį',
    permissionDenied: 'Prieiga prie kameros neleista. Leiskite kamerą naršyklės nustatymuose.',
    duplicate: 'Šį QR kodą jau turite',
    invalid: 'Šis QR kodas nepriklauso raliui',
    demoScanButton: 'Įkelti demonstracinį QR',
    debugLabel: 'Derinimas (paslėpta gamyboje): suteikti antspaudą be kameros',
  },
  reveal: { title: 'Gautas simbolis!', stampGet: 'GAUTAS ANTSPAUDAS!', close: 'Uždaryti' },
  challenge: {
    title: 'Frazės iššūkis',
    instruction: 'Pertvarkykite 7 simbolius, kad sudarytumėte teisingą frazę!',
    wrong: 'Gaila, tai neteisingas atsakymas. Bandykite dar kartą!',
    available: 'Jūsų simboliai (bakstelėkite norėdami padėti)',
    checkCta: 'Patikrinti šią tvarką',
    exchangeCta: 'Į prizų iškeitimą',
    correctTitle: 'Teisingai! Baigta!',
    correctBody: 'Sveikiname! Sudarėte frazę.',
  },
  exchange: {
    phraseLabel: 'Sudaryta frazė',
    title1: 'Antspaudų ralis',
    title2: 'Užbaigimo prizas — Iškeitimo langelis',
    staffNotice1: 'Prizo iškeitimą turi atlikti darbuotojas.',
    staffNotice2: 'Perduokite telefoną darbuotojui.',
    exchangeButton: 'Iškeisti',
    done: 'Iškeista',
    confirmQuestion: 'Ar tikrai norite iškeisti?',
    staffHeading: 'Tik darbuotojams',
    staffPasscodePlaceholder: 'Darbuotojo slaptažodis',
    staffPasscodeError: 'Neteisingas slaptažodis',
  },
};

export default lt;
