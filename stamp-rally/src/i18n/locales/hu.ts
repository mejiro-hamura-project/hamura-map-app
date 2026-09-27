import type { PartialMessages } from '../index';

// Magyar (Hungarian). Feloldás: hu, hu-HU.
const hu: PartialMessages = {
  common: {
    start: 'Kezdés',
    ok: 'OK',
    cancel: 'Mégse',
    back: 'Vissza',
    resetConfirm:
      'Törlöd az összes haladást (bélyegzők, regisztráció, beváltási előzmények), és elölről kezded?',
    resetButton: '(Teszt) Haladás visszaállítása és újrakezdés',
  },
  header: { line1: 'Fesztivál', line2: 'Bélyegzőrali' },
  notice: {
    iconAlt: 'A fesztiváli bélyegzőrali ikonja',
    title: 'Tudnivalók',
    safetyHeading: 'Biztonsági kérés',
    safetyBody:
      'A szentély területe zsúfolt a látogatóktól. Figyelj a környezetedre, ne szaladj, és ne ütközz másokba. Telefont nézve gyalogolni nagyon veszélyes – állj meg, mielőtt az alkalmazást használod.',
    privacyHeading: 'A személyes adatokról',
    privacyBody:
      'A megadott adatokat kizárólag a rendezvény lebonyolítására, a nyereménybeváltás igazolására és statisztikai célra használjuk. Más célra nem használjuk, és harmadik félnek nem adjuk ki.',
    otherHeading: 'Egyéb',
    otherBody:
      'A nyeremények száma korlátozott, és a beváltás a készlet erejéig tart. Köszönjük a megértést.',
  },
  howto: {
    title: 'Hogyan játssz',
    imagePlaceholder: 'Kép',
    steps: [
      { title: 'Keresd meg a QR-kódokat a területen!', body: 'A rali QR-kódjai a szentély egész területén el vannak rejtve. Indulj, és keresd meg őket!' },
      { title: 'Olvasd be őket a kamerával!', body: 'Csak irányítsd az alkalmazás kameráját a QR-kódra. Beolvasás után az ellenőrzés automatikus.' },
      { title: 'Gyűjtsd a karaktereket!', body: 'Minden beolvasás egy karaktert ad. Gyűjts 7-et a rejtett kifejezés kirakásához.' },
      { title: 'Rakd ki a kifejezést, és váltsd be!', body: 'Ha mind a 7 megvan, menj a főcsarnokba. Mutasd meg az alkalmazás képernyőjét a személyzetnek a nyereményedért!' },
    ],
  },
  register: {
    title: 'Résztvevő regisztrációja',
    nicknameLabel: 'Becenév (nem kötelező)',
    nicknamePlaceholder: 'pl.: Fesztiválozó',
    genderLabel: 'Nem',
    ageLabel: 'Korcsoport',
    required: 'Kötelező',
    selectPlaceholder: 'Válassz',
    genderError: 'Válaszd ki a nemet',
    ageError: 'Válaszd ki a korcsoportot',
    submit: 'Részvétel',
    gender: { male: 'Férfi', female: 'Nő', other: 'Egyéb' },
    age: { student: 'Diák', '10s': 'Tizenéves', '20s': '20–29', '30s': '30–39', '40s': '40–49', '50s': '50–59', '60plus': '60 és felette' },
  },
  rally: {
    countLabel: 'Összegyűjtött bélyegzők',
    completeBanner1: 'Összegyűjtötted mind a 7 bélyegzőt!',
    completeBanner2: 'Találd ki a helyes sorrendet, és vágj bele a kifejezés kihívásába.',
    phraseSolvedBanner: 'A kifejezés kész! Váltsd be a főcsarnokban',
    exchangedBanner: 'A nyereménybeváltás befejeződött',
    challengeCta: 'Vágj bele a kihívásba',
    exchangeCta: 'Tovább a nyereménybeváltáshoz',
    cameraCta: '📷 Kamera bekapcsolása',
  },
  camera: {
    instruction: 'Helyezd a QR-kódot a kereten belülre',
    permissionDenied: 'Nincs kamerahozzáférés. Engedélyezd a kamerát a böngésző beállításaiban.',
    duplicate: 'Ez a QR-kód már megvan',
    invalid: 'Ez a QR-kód nem része a ralinak',
    demoScanButton: 'Demo QR betöltése',
    debugLabel: 'Hibakeresés (élesben rejtve): bélyegző adása kamera nélkül',
  },
  reveal: { title: 'Karaktert szereztél!', stampGet: 'BÉLYEGZŐT SZEREZTÉL!', close: 'Bezárás' },
  challenge: {
    title: 'A kifejezés kihívása',
    instruction: 'Rendezd át a 7 karaktert a helyes kifejezés kirakásához!',
    wrong: 'Kár, ez nem a helyes válasz. Próbáld újra!',
    available: 'A karaktereid (koppints a lerakáshoz)',
    checkCta: 'Ennek a sorrendnek az ellenőrzése',
    exchangeCta: 'Tovább a nyereménybeváltáshoz',
    correctTitle: 'Helyes! Kész!',
    correctBody: 'Gratulálunk! Kiraktad a kifejezést.',
  },
  exchange: {
    phraseLabel: 'A kirakott kifejezés',
    title1: 'Bélyegzőrali',
    title2: 'Teljesítési jutalom — Beváltópult',
    staffNotice1: 'A nyereménybeváltást a személyzetnek kell elvégeznie.',
    staffNotice2: 'Add át a telefonodat a személyzet egy tagjának.',
    exchangeButton: 'Beváltás',
    done: 'Beváltva',
    confirmQuestion: 'Biztosan beváltod?',
    staffHeading: 'Csak a személyzetnek',
    staffPasscodePlaceholder: 'Személyzeti kód',
    staffPasscodeError: 'Helytelen kód',
  },
};

export default hu;
