import type { PartialMessages } from '../index';

// አማርኛ (Amharic). ከ am, am-ET ይፈታል።
const am: PartialMessages = {
  common: {
    start: 'ጀምር',
    ok: 'እሺ',
    cancel: 'ሰርዝ',
    back: 'ተመለስ',
    resetConfirm: 'ሁሉንም እድገት (ማህተሞች፣ ምዝገባ፣ የልውውጥ ታሪክ) አጥፍቶ ከመጀመሪያ ይጀመር?',
    resetButton: '(ሙከራ) እድገትን ዳግም አስጀምር እና ከመጀመሪያ ጀምር',
  },
  header: { line1: 'በዓል', line2: 'የማህተም ውድድር' },
  notice: {
    iconAlt: 'የበዓል የማህተም ውድድር አዶ',
    title: 'ማስታወሻዎች',
    safetyHeading: 'የደህንነት ጥያቄ',
    safetyBody:
      'የቤተ መቅደሱ ግቢ በጎብኝዎች የተሞላ ነው። ዙሪያዎን ይጠንቀቁ፣ አይሩጡ እና ከሌሎች ጎብኝዎች ጋር አይጋጩ። ስልክ እያዩ መሄድ በጣም አደገኛ ስለሆነ መተግበሪያውን ከመጠቀምዎ በፊት ይቁሙ።',
    privacyHeading: 'ስለ የግል መረጃ',
    privacyBody:
      'የተመዘገበው መረጃ ለዚህ ዝግጅት አዘጋጅ፣ ለሽልማት ልውውጥ ማረጋገጫ እና ለስታቲስቲክስ ብቻ ይውላል። ለሌላ ዓላማ አይውልም እና ለሦስተኛ ወገን አይሰጥም።',
    otherHeading: 'ሌላ',
    otherBody: 'ሽልማቶቹ ውስን ናቸው፣ ሲያልቁም ልውውጡ ሊያበቃ ይችላል። ስለ መረዳታችሁ እናመሰግናለን።',
  },
  howto: {
    title: 'እንዴት እንደሚጫወት',
    imagePlaceholder: 'ምስል',
    steps: [
      { title: 'በግቢው ውስጥ የ QR ኮዶችን ፈልጉ!', body: 'የውድድሩ QR ኮዶች በቤተ መቅደሱ ግቢ ውስጥ በሁሉም ቦታ ተደብቀዋል። ሂዱ ፈልጓቸው!' },
      { title: 'በካሜራ ስካን አድርጓቸው!', body: 'የመተግበሪያውን ካሜራ ወደ QR ኮዱ ብቻ አቅኑ። ከተነበበ በኋላ ማረጋገጫው በራስ-ሰር ይከናወናል።' },
      { title: 'ፊደላትን ሰብስቡ!', body: 'እያንዳንዱ ስካን አንድ ፊደል ይሰጣል። ሚስጥራዊውን ሐረግ ለማጠናቀቅ 7 ሰብስቡ።' },
      { title: 'ሐረጉን አጠናቅቁ እና ለውጡ!', body: 'ሁሉንም 7 ካገኛችሁ ወደ ዋናው አዳራሽ ሂዱ። ሽልማታችሁን ለማግኘት ለሠራተኞቹ የመተግበሪያውን ማያ ገጽ አሳዩ!' },
    ],
  },
  register: {
    title: 'የተሳታፊ ምዝገባ',
    nicknameLabel: 'ቅጽል ስም (አማራጭ)',
    nicknamePlaceholder: 'ለምሳሌ፦ በዓል ወዳጅ',
    genderLabel: 'ጾታ',
    ageLabel: 'የዕድሜ ክልል',
    required: 'ያስፈልጋል',
    selectPlaceholder: 'እባክዎ ይምረጡ',
    genderError: 'እባክዎ ጾታ ይምረጡ',
    ageError: 'እባክዎ የዕድሜ ክልል ይምረጡ',
    submit: 'ተሳተፍ',
    gender: { male: 'ወንድ', female: 'ሴት', other: 'ሌላ' },
    age: { student: 'ተማሪ', '10s': 'ታዳጊ', '20s': '20–29', '30s': '30–39', '40s': '40–49', '50s': '50–59', '60plus': '60 እና ከዚያ በላይ' },
  },
  rally: {
    countLabel: 'የተሰበሰቡ ማህተሞች',
    completeBanner1: 'ሁሉንም 7 ማህተሞች ሰብስበሃል!',
    completeBanner2: 'ትክክለኛውን ቅደም ተከተል አስብ እና የሐረግ ፈተናውን ተጋፈጥ።',
    phraseSolvedBanner: 'ሐረጉ ተጠናቅቋል! በዋናው አዳራሽ ለውጠው',
    exchangedBanner: 'የሽልማት ልውውጡ ተጠናቅቋል',
    challengeCta: 'ፈተናውን ተጋፈጥ',
    exchangeCta: 'ወደ ሽልማት ልውውጥ ሂድ',
    cameraCta: '📷 ካሜራን አብራ',
  },
  camera: {
    instruction: 'የ QR ኮዱን በክፈፉ ውስጥ አስቀምጥ',
    permissionDenied: 'የካሜራ መዳረሻ አልተፈቀደም። በአሳሽ ቅንብሮች ውስጥ ካሜራን ፍቀድ።',
    duplicate: 'ይህ QR ኮድ አስቀድሞ አለህ',
    invalid: 'ይህ QR ኮድ የውድድሩ አካል አይደለም',
    demoScanButton: 'የማሳያ QR ጫን',
    debugLabel: 'debug (በምርት ውስጥ ተደብቋል)፦ ያለ ካሜራ ማህተም ስጥ',
  },
  reveal: { title: 'ፊደል አገኘህ!', stampGet: 'ማህተም አገኘህ!', close: 'ዝጋ' },
  challenge: {
    title: 'የሐረግ ፈተና',
    instruction: '7ቱን ፊደላት እንደገና በማስተካከል ትክክለኛውን ሐረግ ፍጠር!',
    wrong: 'አዝናለሁ፣ ትክክለኛ መልስ አይደለም። እንደገና ሞክር!',
    available: 'ፊደሎችህ (ለማስቀመጥ ንካ)',
    checkCta: 'ይህን ቅደም ተከተል አረጋግጥ',
    exchangeCta: 'ወደ ሽልማት ልውውጥ ሂድ',
    correctTitle: 'ትክክል! ተጠናቀቀ!',
    correctBody: 'እንኳን ደስ አለህ! ሐረጉን አጠናቅቀሃል።',
  },
  exchange: {
    phraseLabel: 'የተጠናቀቀ ሐረግ',
    title1: 'የማህተም ውድድር',
    title2: 'የማጠናቀቂያ ሽልማት — የልውውጥ ጠረጴዛ',
    staffNotice1: 'የሽልማት ልውውጡ በሠራተኞች መከናወን አለበት።',
    staffNotice2: 'እባክህ ስልክህን ለሠራተኛ ስጥ።',
    exchangeButton: 'ለውጥ',
    done: 'ተለውጧል',
    confirmQuestion: 'በእርግጥ መለወጥ ትፈልጋለህ?',
    staffHeading: 'ለሠራተኞች ብቻ',
    staffPasscodePlaceholder: 'የሠራተኛ የይለፍ ኮድ',
    staffPasscodeError: 'የይለፍ ኮዱ ትክክል አይደለም',
  },
};

export default am;
