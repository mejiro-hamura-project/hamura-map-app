import type { PartialMessages } from '../index';

// עברית (Hebrew). נפתר מ-he, he-IL (וגם הקוד הישן iw דרך alias).
const he: PartialMessages = {
  common: {
    start: 'התחלה',
    ok: 'אישור',
    cancel: 'ביטול',
    back: 'חזרה',
    resetConfirm: 'למחוק את כל ההתקדמות (חותמות, הרשמה, היסטוריית החלפות) ולהתחיל מחדש?',
    resetButton: '(בדיקה) איפוס ההתקדמות והתחלה מחדש',
  },
  header: { line1: 'פסטיבל', line2: 'ראלי חותמות' },
  notice: {
    iconAlt: 'סמל ראלי החותמות של הפסטיבל',
    title: 'לתשומת לבכם',
    safetyHeading: 'בקשת בטיחות',
    safetyBody:
      'שטח המקדש הומה מבקרים. שימו לב לסביבה, אל תרוצו ואל תתנגשו במבקרים אחרים. הליכה תוך הסתכלות בטלפון מסוכנת מאוד, לכן עצרו לפני השימוש באפליקציה.',
    privacyHeading: 'על מידע אישי',
    privacyBody:
      'המידע שנרשם משמש רק לניהול האירוע, לאישור החלפת הפרסים ולמטרות סטטיסטיות. הוא אינו משמש למטרות אחרות ואינו נמסר לצדדים שלישיים.',
    otherHeading: 'שונות',
    otherBody: 'מספר הפרסים מוגבל וההחלפה עשויה להסתיים עם אזילת המלאי. תודה על ההבנה.',
  },
  howto: {
    title: 'איך משחקים',
    imagePlaceholder: 'תמונה',
    steps: [
      { title: 'מצאו את קודי ה-QR בשטח!', body: 'קודי ה-QR של הראלי מוסתרים בכל רחבי שטח המקדש. צאו לחפש אותם!' },
      { title: 'סרקו אותם עם המצלמה!', body: 'פשוט כוונו את מצלמת האפליקציה אל קוד ה-QR. לאחר הקריאה הבדיקה מתבצעת אוטומטית.' },
      { title: 'אספו את התווים!', body: 'כל סריקה מעניקה תו אחד. אספו 7 כדי להשלים את הביטוי הסודי.' },
      { title: 'השלימו את הביטוי והחליפו!', body: 'עם כל ה-7, גשו לאולם הראשי. הציגו את מסך האפליקציה לצוות כדי לקבל את הפרס!' },
    ],
  },
  register: {
    title: 'רישום משתתף',
    nicknameLabel: 'כינוי (רשות)',
    nicknamePlaceholder: 'לדוגמה: חוגג הפסטיבל',
    genderLabel: 'מגדר',
    ageLabel: 'קבוצת גיל',
    required: 'חובה',
    selectPlaceholder: 'נא לבחור',
    genderError: 'נא לבחור מגדר',
    ageError: 'נא לבחור קבוצת גיל',
    submit: 'להשתתף',
    gender: { male: 'זכר', female: 'נקבה', other: 'אחר' },
    age: { student: 'תלמיד/סטודנט', '10s': 'נער/ה', '20s': '20–29', '30s': '30–39', '40s': '40–49', '50s': '50–59', '60plus': '60 ומעלה' },
  },
  rally: {
    countLabel: 'חותמות שנאספו',
    completeBanner1: 'אספתם את כל 7 החותמות!',
    completeBanner2: 'חשבו על הסדר הנכון והתמודדו עם אתגר הביטוי.',
    phraseSolvedBanner: 'הביטוי הושלם! החליפו אותו באולם הראשי',
    exchangedBanner: 'החלפת הפרס הושלמה',
    challengeCta: 'להתמודד עם האתגר',
    exchangeCta: 'מעבר להחלפת פרס',
    cameraCta: '📷 הפעלת מצלמה',
  },
  camera: {
    instruction: 'מקמו את קוד ה-QR בתוך המסגרת',
    permissionDenied: 'הגישה למצלמה אינה מאושרת. אשרו את המצלמה בהגדרות הדפדפן.',
    duplicate: 'קוד ה-QR הזה כבר ברשותכם',
    invalid: 'קוד ה-QR הזה אינו חלק מהראלי',
    demoScanButton: 'טעינת QR לדוגמה',
    debugLabel: 'ניפוי באגים (מוסתר בסביבת ייצור): הענקת חותמת ללא מצלמה',
  },
  reveal: { title: 'קיבלתם תו!', stampGet: 'קיבלתם חותמת!', close: 'סגירה' },
  challenge: {
    title: 'אתגר הביטוי',
    instruction: 'סדרו מחדש את 7 התווים כדי ליצור את הביטוי הנכון!',
    wrong: 'חבל, זו אינה התשובה הנכונה. נסו שוב!',
    available: 'התווים שלכם (הקישו כדי למקם)',
    checkCta: 'בדיקת הסדר הזה',
    exchangeCta: 'מעבר להחלפת פרס',
    correctTitle: 'נכון! הושלם!',
    correctBody: 'מזל טוב! השלמתם את הביטוי.',
  },
  exchange: {
    phraseLabel: 'הביטוי שהושלם',
    title1: 'ראלי חותמות',
    title2: 'פרס השלמה — עמדת החלפה',
    staffNotice1: 'החלפת הפרס חייבת להתבצע על ידי הצוות.',
    staffNotice2: 'נא למסור את הטלפון לאיש צוות.',
    exchangeButton: 'החלפה',
    done: 'הוחלף',
    confirmQuestion: 'להחליף בוודאות?',
    staffHeading: 'לצוות בלבד',
    staffPasscodePlaceholder: 'קוד צוות',
    staffPasscodeError: 'הקוד שגוי',
  },
};

export default he;
