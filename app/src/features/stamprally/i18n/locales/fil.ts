import type { PartialMessages } from '../index';

// Filipino. Nire-resolve mula sa fil, fil-PH (at tl sa pamamagitan ng alias).
const fil: PartialMessages = {
  common: {
    start: 'Simulan',
    ok: 'OK',
    cancel: 'Kanselahin',
    back: 'Bumalik',
    resetConfirm:
      'Burahin ang lahat ng progreso (mga stamp, rehistrasyon, kasaysayan ng palitan) at magsimulang muli?',
    resetButton: '(Pagsubok) I-reset ang progreso at magsimulang muli',
  },
  header: { line1: 'Pista', line2: 'Stamp Rally' },
  notice: {
    iconAlt: 'Icon ng Stamp Rally ng Pista',
    title: 'Paalala',
    safetyHeading: 'Kahilingan sa kaligtasan',
    safetyBody:
      'Punong-puno ng bisita ang lugar ng dambana. Mag-ingat sa paligid, huwag tumakbo at huwag mabunggo ang ibang bisita. Delikado ang maglakad habang nakatingin sa telepono, kaya huminto muna bago gamitin ang app.',
    privacyHeading: 'Tungkol sa personal na impormasyon',
    privacyBody:
      'Ang naitalang impormasyon ay ginagamit lamang para sa pagpapatakbo ng kaganapan, pagkumpirma ng palitan ng premyo, at para sa estadistika. Hindi ito ginagamit sa ibang layunin at hindi ibinibigay sa mga third party.',
    otherHeading: 'Iba pa',
    otherBody:
      'Limitado ang bilang ng mga premyo at maaaring matapos ang palitan kapag naubos na. Salamat sa iyong pag-unawa.',
  },
  howto: {
    title: 'Paano laruin',
    imagePlaceholder: 'Larawan',
    steps: [
      { title: 'Hanapin ang mga QR code sa lugar!', body: 'Nakatago ang mga QR code ng rally sa buong lugar ng dambana. Hanapin mo sila!' },
      { title: 'I-scan gamit ang camera!', body: 'Itutok lang ang camera ng app sa QR code. Kapag nabasa na, awtomatiko ang pagsusuri.' },
      { title: 'Kolektahin ang mga karakter!', body: 'Bawat scan ay isang karakter. Kumolekta ng 7 para makumpleto ang lihim na parirala.' },
      { title: 'Kumpletuhin ang parirala at ipagpalit!', body: 'Kapag kumpleto na ang 7, pumunta sa pangunahing bulwagan. Ipakita ang screen ng app sa staff para makuha ang iyong premyo!' },
    ],
  },
  register: {
    title: 'Rehistrasyon ng kalahok',
    nicknameLabel: 'Palayaw (opsyonal)',
    nicknamePlaceholder: 'hal.: Pistahero',
    genderLabel: 'Kasarian',
    ageLabel: 'Pangkat ng edad',
    required: 'Kailangan',
    selectPlaceholder: 'Pumili',
    genderError: 'Pumili ng kasarian',
    ageError: 'Pumili ng pangkat ng edad',
    submit: 'Sumali',
    gender: { male: 'Lalaki', female: 'Babae', other: 'Iba pa' },
    age: { student: 'Estudyante', '10s': 'Tinedyer', '20s': '20–29', '30s': '30–39', '40s': '40–49', '50s': '50–59', '60plus': '60 pataas' },
  },
  rally: {
    countLabel: 'Nakolektang stamp',
    completeBanner1: 'Nakolekta mo na ang lahat ng 7 stamp!',
    completeBanner2: 'Isipin ang tamang pagkakasunod-sunod at harapin ang hamon ng parirala.',
    phraseSolvedBanner: 'Kumpleto na ang parirala! Ipagpalit ito sa pangunahing bulwagan',
    exchangedBanner: 'Kumpleto na ang palitan ng premyo',
    challengeCta: 'Harapin ang hamon',
    exchangeCta: 'Pumunta sa palitan ng premyo',
    cameraCta: '📷 Buksan ang camera',
  },
  camera: {
    instruction: 'Ilagay ang QR code sa loob ng frame',
    permissionDenied: 'Hindi pinapayagan ang access sa camera. Payagan ang camera sa mga setting ng browser.',
    duplicate: 'Mayroon ka na ng QR code na ito',
    invalid: 'Hindi bahagi ng rally ang QR code na ito',
    demoScanButton: 'Mag-load ng demo QR',
    debugLabel: 'Debug (nakatago sa production): magbigay ng stamp nang walang camera',
  },
  reveal: { title: 'Nakakuha ng karakter!', stampGet: 'NAKAKUHA NG STAMP!', close: 'Isara' },
  challenge: {
    title: 'Hamon ng parirala',
    instruction: 'Ayusin muli ang 7 karakter para mabuo ang tamang parirala!',
    wrong: 'Sayang, hindi iyon ang tamang sagot. Subukan muli!',
    available: 'Ang iyong mga karakter (i-tap para ilagay)',
    checkCta: 'Suriin ang pagkakasunod na ito',
    exchangeCta: 'Pumunta sa palitan ng premyo',
    correctTitle: 'Tama! Kumpleto!',
    correctBody: 'Binabati kita! Nakumpleto mo ang parirala.',
  },
  exchange: {
    phraseLabel: 'Nakumpletong parirala',
    title1: 'Stamp Rally',
    title2: 'Gantimpala sa Pagkumpleto — Counter ng Palitan',
    staffNotice1: 'Ang palitan ng premyo ay dapat gawin ng staff.',
    staffNotice2: 'Pakiabot ang iyong telepono sa isang staff.',
    exchangeButton: 'Ipagpalit',
    done: 'Naipagpalit na',
    confirmQuestion: 'Sigurado ka bang ipagpapalit?',
    staffHeading: 'Para sa staff lamang',
    staffPasscodePlaceholder: 'Passcode ng staff',
    staffPasscodeError: 'Mali ang passcode',
  },
};

export default fil;
