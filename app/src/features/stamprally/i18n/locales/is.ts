import type { PartialMessages } from '../index';

// Íslenska (Icelandic). Leyst úr is, is-IS.
const is: PartialMessages = {
  common: {
    start: 'Byrja',
    ok: 'Í lagi',
    cancel: 'Hætta við',
    back: 'Til baka',
    resetConfirm:
      'Eyða öllum framförum (stimplum, skráningu, skiptasögu) og byrja upp á nýtt?',
    resetButton: '(Prófun) Endurstilla framfarir og byrja upp á nýtt',
  },
  header: { line1: 'Hátíð', line2: 'Stimplarall' },
  notice: {
    iconAlt: 'Táknmynd stimplaralls hátíðar',
    title: 'Athugið',
    safetyHeading: 'Öryggisbeiðni',
    safetyBody:
      'Svæði helgidómsins er fullt af gestum. Fylgstu með umhverfinu, hlauptu ekki og rekstu ekki í aðra gesti. Að ganga á meðan horft er á símann er mjög hættulegt – stöðvaðu áður en þú notar forritið.',
    privacyHeading: 'Um persónuupplýsingar',
    privacyBody:
      'Skráðar upplýsingar eru aðeins notaðar til að halda viðburðinn, staðfesta verðlaunaskipti og til tölfræði. Þær eru ekki notaðar í öðrum tilgangi og ekki afhentar þriðja aðila.',
    otherHeading: 'Annað',
    otherBody:
      'Verðlaun eru takmörkuð og skiptum getur lokið þegar þau klárast. Takk fyrir skilninginn.',
  },
  howto: {
    title: 'Hvernig á að spila',
    imagePlaceholder: 'Mynd',
    steps: [
      { title: 'Finndu QR-kóðana á svæðinu!', body: 'QR-kóðar rallsins eru faldir um allt svæði helgidómsins. Farðu og finndu þá!' },
      { title: 'Skannaðu þá með myndavélinni!', body: 'Beindu bara myndavél forritsins að QR-kóðanum. Eftir lestur fer staðfesting fram sjálfkrafa.' },
      { title: 'Safnaðu stöfunum!', body: 'Hver skönnun gefur einn staf. Safnaðu 7 til að klára leynisetninguna.' },
      { title: 'Kláraðu setninguna og skiptu!', body: 'Með öll 7 skaltu fara í aðalsalinn. Sýndu starfsfólki skjá forritsins til að fá verðlaunin!' },
    ],
  },
  register: {
    title: 'Skráning þátttakanda',
    nicknameLabel: 'Gælunafn (valfrjálst)',
    nicknamePlaceholder: 't.d.: Hátíðargestur',
    genderLabel: 'Kyn',
    ageLabel: 'Aldurshópur',
    required: 'Nauðsynlegt',
    selectPlaceholder: 'Veldu',
    genderError: 'Veldu kyn',
    ageError: 'Veldu aldurshóp',
    submit: 'Taka þátt',
    gender: { male: 'Karl', female: 'Kona', other: 'Annað' },
    age: { student: 'Nemandi', '10s': 'Unglingur', '20s': '20–29', '30s': '30–39', '40s': '40–49', '50s': '50–59', '60plus': '60 og eldri' },
  },
  rally: {
    countLabel: 'Söfnuðu stimplar',
    completeBanner1: 'Þú safnaðir öllum 7 stimplunum!',
    completeBanner2: 'Hugsaðu um réttu röðina og taktu setningaáskoruninni.',
    phraseSolvedBanner: 'Setningin er tilbúin! Skiptu henni í aðalsalnum',
    exchangedBanner: 'Verðlaunaskiptum er lokið',
    challengeCta: 'Taka áskoruninni',
    exchangeCta: 'Fara í verðlaunaskipti',
    cameraCta: '📷 Kveikja á myndavél',
  },
  camera: {
    instruction: 'Settu QR-kóðann innan rammans',
    permissionDenied: 'Aðgangur að myndavél er ekki leyfður. Leyfðu myndavélina í stillingum vafrans.',
    duplicate: 'Þú átt þennan QR-kóða nú þegar',
    invalid: 'Þessi QR-kóði tilheyrir ekki rallinu',
    demoScanButton: 'Hlaða kynningar-QR',
    debugLabel: 'Villuleit (falið í framleiðslu): veita stimpil án myndavélar',
  },
  reveal: { title: 'Fékkst staf!', stampGet: 'FÉKKST STIMPIL!', close: 'Loka' },
  challenge: {
    title: 'Setningaáskorunin',
    instruction: 'Raðaðu 7 stöfunum upp á nýtt til að mynda réttu setninguna!',
    wrong: 'Því miður, þetta er ekki rétt svar. Reyndu aftur!',
    available: 'Stafirnir þínir (ýttu til að setja)',
    checkCta: 'Athuga þessa röð',
    exchangeCta: 'Fara í verðlaunaskipti',
    correctTitle: 'Rétt! Lokið!',
    correctBody: 'Til hamingju! Þú kláraðir setninguna.',
  },
  exchange: {
    phraseLabel: 'Kláruð setning',
    title1: 'Stimplarall',
    title2: 'Verðlaun fyrir að ljúka — Skiptaborð',
    staffNotice1: 'Verðlaunaskipti verða að vera framkvæmd af starfsfólki.',
    staffNotice2: 'Réttu starfsmanni símann þinn.',
    exchangeButton: 'Skipta',
    done: 'Skipt',
    confirmQuestion: 'Viltu örugglega skipta?',
    staffHeading: 'Aðeins fyrir starfsfólk',
    staffPasscodePlaceholder: 'Aðgangskóði starfsfólks',
    staffPasscodeError: 'Rangur aðgangskóði',
  },
};

export default is;
