import type { PartialMessages } from '../index';

// Slovenčina (Slovak). Rieši sa z sk, sk-SK.
const sk: PartialMessages = {
  common: {
    start: 'Začať',
    ok: 'OK',
    cancel: 'Zrušiť',
    back: 'Späť',
    resetConfirm:
      'Vymazať celý postup (pečiatky, registráciu, históriu výmen) a začať odznova?',
    resetButton: '(Test) Obnoviť postup a začať odznova',
  },
  header: { line1: 'Slávnosť', line2: 'Pečiatková rely' },
  notice: {
    iconAlt: 'Ikona pečiatkovej rely slávnosti',
    title: 'Upozornenia',
    safetyHeading: 'Prosba o bezpečnosť',
    safetyBody:
      'Areál svätyne býva plný návštevníkov. Dávajte pozor na okolie, nebehajte a nevrážajte do ostatných návštevníkov. Chôdza s pohľadom do telefónu je veľmi nebezpečná – pred použitím aplikácie sa zastavte.',
    privacyHeading: 'O osobných údajoch',
    privacyBody:
      'Zadané údaje sa používajú iba na usporiadanie podujatia, potvrdenie výmeny cien a na štatistické účely. Nepoužívajú sa na iné účely ani sa neposkytujú tretím stranám.',
    otherHeading: 'Iné',
    otherBody:
      'Počet cien je obmedzený a výmena sa môže skončiť po ich vyčerpaní. Ďakujeme za pochopenie.',
  },
  howto: {
    title: 'Ako hrať',
    imagePlaceholder: 'Obrázok',
    steps: [
      { title: 'Nájdite QR kódy v areáli!', body: 'QR kódy rely sú schované po celom areáli svätyne. Vydajte sa ich hľadať!' },
      { title: 'Naskenujte ich fotoaparátom!', body: 'Stačí namieriť fotoaparát aplikácie na QR kód. Po načítaní prebehne kontrola automaticky.' },
      { title: 'Zbierajte znaky!', body: 'Každé naskenovanie dá jeden znak. Pozbierajte 7, aby ste zložili tajnú frázu.' },
      { title: 'Zložte frázu a vymeňte ju!', body: 'So všetkými 7 choďte do hlavnej haly. Ukážte obrazovku aplikácie personálu a získajte svoju cenu!' },
    ],
  },
  register: {
    title: 'Registrácia účastníka',
    nicknameLabel: 'Prezývka (nepovinné)',
    nicknamePlaceholder: 'napr.: Návštevník slávnosti',
    genderLabel: 'Pohlavie',
    ageLabel: 'Veková skupina',
    required: 'Povinné',
    selectPlaceholder: 'Vyberte',
    genderError: 'Vyberte pohlavie',
    ageError: 'Vyberte vekovú skupinu',
    submit: 'Zúčastniť sa',
    gender: { male: 'Muž', female: 'Žena', other: 'Iné' },
    age: { student: 'Študent', '10s': 'Tínedžer', '20s': '20–29', '30s': '30–39', '40s': '40–49', '50s': '50–59', '60plus': '60 a viac' },
  },
  rally: {
    countLabel: 'Získané pečiatky',
    completeBanner1: 'Získali ste všetkých 7 pečiatok!',
    completeBanner2: 'Vymyslite správne poradie a pustite sa do výzvy s frázou.',
    phraseSolvedBanner: 'Fráza je hotová! Vymeňte ju v hlavnej hale',
    exchangedBanner: 'Výmena ceny je dokončená',
    challengeCta: 'Prijať výzvu',
    exchangeCta: 'Prejsť na výmenu ceny',
    cameraCta: '📷 Zapnúť fotoaparát',
  },
  camera: {
    instruction: 'Umiestnite QR kód do rámčeka',
    permissionDenied: 'Prístup k fotoaparátu nie je povolený. Povoľte fotoaparát v nastaveniach prehliadača.',
    duplicate: 'Tento QR kód už máte',
    invalid: 'Tento QR kód nepatrí do rely',
    demoScanButton: 'Načítať ukážkový QR',
    debugLabel: 'Ladenie (skryté v produkcii): udeliť pečiatku bez fotoaparátu',
  },
  reveal: { title: 'Získaný znak!', stampGet: 'ZÍSKANÁ PEČIATKA!', close: 'Zavrieť' },
  challenge: {
    title: 'Výzva s frázou',
    instruction: 'Preusporiadajte 7 znakov tak, aby vznikla správna fráza!',
    wrong: 'Škoda, nie je to správna odpoveď. Skúste to znova!',
    available: 'Vaše znaky (klepnutím umiestnite)',
    checkCta: 'Skontrolovať toto poradie',
    exchangeCta: 'Prejsť na výmenu ceny',
    correctTitle: 'Správne! Hotovo!',
    correctBody: 'Gratulujeme! Zložili ste frázu.',
  },
  exchange: {
    phraseLabel: 'Zložená fráza',
    title1: 'Pečiatková rely',
    title2: 'Cena za dokončenie — Výmenný pult',
    staffNotice1: 'Výmenu ceny musí vykonať personál.',
    staffNotice2: 'Odovzdajte telefón členovi personálu.',
    exchangeButton: 'Vymeniť',
    done: 'Vymenené',
    confirmQuestion: 'Naozaj chcete vymeniť?',
    staffHeading: 'Len pre personál',
    staffPasscodePlaceholder: 'Kód personálu',
    staffPasscodeError: 'Nesprávny kód',
  },
};

export default sk;
