import type { PartialMessages } from '../index';

// Čeština (Czech). Řeší se z cs, cs-CZ.
const cs: PartialMessages = {
  common: {
    start: 'Začít',
    ok: 'OK',
    cancel: 'Zrušit',
    back: 'Zpět',
    resetConfirm:
      'Vymazat veškerý postup (razítka, registraci, historii výměn) a začít od začátku?',
    resetButton: '(Test) Obnovit postup a začít znovu',
  },
  header: { line1: 'Slavnost', line2: 'Razítková rallye' },
  notice: {
    iconAlt: 'Ikona razítkové rallye slavnosti',
    title: 'Upozornění',
    safetyHeading: 'Prosba o bezpečnost',
    safetyBody:
      'Areál svatyně bývá plný návštěvníků. Dávejte pozor na okolí, neběhejte a nevrážejte do ostatních návštěvníků. Chůze s pohledem do telefonu je velmi nebezpečná – před použitím aplikace se zastavte.',
    privacyHeading: 'O osobních údajích',
    privacyBody:
      'Zadané údaje se používají pouze k pořádání akce, potvrzení výměny cen a ke statistickým účelům. Nepoužívají se k jiným účelům ani se nepředávají třetím stranám.',
    otherHeading: 'Ostatní',
    otherBody:
      'Počet cen je omezený a výměna může skončit po jejich vyčerpání. Děkujeme za pochopení.',
  },
  howto: {
    title: 'Jak hrát',
    imagePlaceholder: 'Obrázek',
    steps: [
      { title: 'Najděte QR kódy v areálu!', body: 'QR kódy rallye jsou schované po celém areálu svatyně. Vydejte se je hledat!' },
      { title: 'Naskenujte je fotoaparátem!', body: 'Stačí namířit fotoaparát aplikace na QR kód. Po načtení proběhne kontrola automaticky.' },
      { title: 'Sbírejte znaky!', body: 'Každé naskenování dá jeden znak. Sesbírejte 7, abyste složili tajnou frázi.' },
      { title: 'Složte frázi a vyměňte ji!', body: 'Se všemi 7 jděte do hlavní haly. Ukažte obrazovku aplikace personálu a získejte svou cenu!' },
    ],
  },
  register: {
    title: 'Registrace účastníka',
    nicknameLabel: 'Přezdívka (nepovinné)',
    nicknamePlaceholder: 'např.: Slavnostní návštěvník',
    genderLabel: 'Pohlaví',
    ageLabel: 'Věková skupina',
    required: 'Povinné',
    selectPlaceholder: 'Vyberte',
    genderError: 'Vyberte pohlaví',
    ageError: 'Vyberte věkovou skupinu',
    submit: 'Zúčastnit se',
    gender: { male: 'Muž', female: 'Žena', other: 'Jiné' },
    age: { student: 'Student', '10s': 'Teenager', '20s': '20–29', '30s': '30–39', '40s': '40–49', '50s': '50–59', '60plus': '60 a více' },
  },
  rally: {
    countLabel: 'Získaná razítka',
    completeBanner1: 'Získali jste všech 7 razítek!',
    completeBanner2: 'Vymyslete správné pořadí a pusťte se do výzvy s frází.',
    phraseSolvedBanner: 'Fráze je hotová! Vyměňte ji v hlavní hale',
    exchangedBanner: 'Výměna ceny je dokončena',
    challengeCta: 'Přijmout výzvu',
    exchangeCta: 'Přejít k výměně ceny',
    cameraCta: '📷 Zapnout fotoaparát',
  },
  camera: {
    instruction: 'Umístěte QR kód do rámečku',
    permissionDenied: 'Přístup k fotoaparátu není povolen. Povolte fotoaparát v nastavení prohlížeče.',
    duplicate: 'Tento QR kód už máte',
    invalid: 'Tento QR kód nepatří do rallye',
    demoScanButton: 'Načíst ukázkový QR',
    debugLabel: 'Ladění (skryté v produkci): udělit razítko bez fotoaparátu',
  },
  reveal: { title: 'Získán znak!', stampGet: 'ZÍSKÁNO RAZÍTKO!', close: 'Zavřít' },
  challenge: {
    title: 'Výzva s frází',
    instruction: 'Přeuspořádejte 7 znaků tak, aby vznikla správná fráze!',
    wrong: 'Škoda, není to správná odpověď. Zkuste to znovu!',
    available: 'Vaše znaky (klepnutím umístíte)',
    checkCta: 'Zkontrolovat toto pořadí',
    exchangeCta: 'Přejít k výměně ceny',
    correctTitle: 'Správně! Hotovo!',
    correctBody: 'Gratulujeme! Složili jste frázi.',
  },
  exchange: {
    phraseLabel: 'Složená fráze',
    title1: 'Razítková rallye',
    title2: 'Cena za dokončení — Výměnný pult',
    staffNotice1: 'Výměnu ceny musí provést personál.',
    staffNotice2: 'Předejte telefon členovi personálu.',
    exchangeButton: 'Vyměnit',
    done: 'Vyměněno',
    confirmQuestion: 'Opravdu chcete provést výměnu?',
    staffHeading: 'Pouze pro personál',
    staffPasscodePlaceholder: 'Kód personálu',
    staffPasscodeError: 'Nesprávný kód',
  },
};

export default cs;
