import type { PartialMessages } from '../index';

// 한국어 (Korean). ja.ts の全キーに対応する完全な翻訳。
// 端末が ko / ko-KR のとき、i18n の getMessages('ko') 経由でアプリ全体に使われる。
const ko: PartialMessages = {
  common: {
    start: '시작',
    ok: '확인',
    cancel: '취소',
    back: '뒤로',
    resetConfirm:
      '진행 상황(스탬프·등록 정보·교환 내역)을 모두 지우고 처음부터 다시 시작할까요?',
    resetButton: '(테스트용) 진행 상황을 초기화하고 처음부터 다시 시작',
  },
  header: {
    line1: '축제',
    line2: '스탬프 랠리',
  },
  notice: {
    iconAlt: '축제 스탬프 랠리 아이콘',
    title: '주의 사항',
    safetyHeading: '안전을 위한 당부',
    safetyBody:
      '경내는 많은 참배객으로 붐빕니다. 뛰거나 다른 참배객과 부딪치지 않도록 주위를 살피며 즐겨 주세요. 스마트폰을 보면서 걷는 것은 매우 위험하므로 멈춰 서서 이용해 주세요.',
    privacyHeading: '개인정보에 대하여',
    privacyBody:
      '등록하신 정보는 본 이벤트 운영·경품 교환 확인·통계 목적으로만 사용하며, 그 외의 목적으로는 사용하지 않습니다. 제3자에게 제공하지 않습니다.',
    otherHeading: '기타',
    otherBody:
      '경품은 수량이 한정되어 있어 소진되는 대로 종료될 수 있습니다. 미리 양해 부탁드립니다.',
  },
  howto: {
    title: '이용 방법',
    imagePlaceholder: '이미지 자리표시자',
    steps: [
      {
        title: '경내의 QR 코드를 찾아보세요!',
        body: '경내 곳곳에 스탬프 랠리 전용 QR 코드가 숨어 있어요. 찾아보세요!',
      },
      {
        title: '카메라로 스캔하세요!',
        body: '앱 카메라로 QR 코드를 비추기만 하면 돼요. 인식되면 자동으로 확인해 줘요.',
      },
      {
        title: '글자를 모으세요!',
        body: '스캔할 때마다 글자를 하나씩 획득! 7개를 모으면 제시어가 완성돼요.',
      },
      {
        title: '제시어를 완성하고 교환하세요!',
        body: '7개를 모으면 본전으로. 스태프에게 앱 화면을 보여주고 경품으로 교환하세요!',
      },
    ],
  },
  register: {
    title: '참가자 등록',
    nicknameLabel: '닉네임 (선택)',
    nicknamePlaceholder: '예: 축제참가자',
    genderLabel: '성별',
    ageLabel: '연령대',
    required: '필수',
    selectPlaceholder: '선택해 주세요',
    genderError: '성별을 선택해 주세요',
    ageError: '연령대를 선택해 주세요',
    submit: '참가하기',
    gender: {
      male: '남성',
      female: '여성',
      other: '기타',
    },
    age: {
      student: '학생',
      '10s': '10대',
      '20s': '20대',
      '30s': '30대',
      '40s': '40대',
      '50s': '50대',
      '60plus': '60대 이상',
    },
  },
  rally: {
    countLabel: '현재 스탬프 수',
    completeBanner1: '스탬프 7개를 모았어요!',
    completeBanner2: '올바른 순서를 생각해서 제시어에 도전하세요.',
    phraseSolvedBanner: '제시어를 완성했어요! 본전에서 교환하세요',
    exchangedBanner: '경품 교환이 완료되었습니다',
    challengeCta: '제시어에 도전하기',
    exchangeCta: '경품 교환으로 이동',
    cameraCta: '📷 카메라 켜기',
  },
  camera: {
    instruction: 'QR 코드를 테두리 안에 맞춰 주세요',
    permissionDenied:
      '카메라 접근이 허용되지 않았습니다. 브라우저 설정에서 카메라 권한을 허용해 주세요.',
    duplicate: '이 QR 코드는 이미 획득했습니다',
    invalid: '대상이 아닌 QR 코드입니다',
    demoScanButton: '데모용 QR 불러오기',
    debugLabel: '디버그용(운영 환경 숨김): 카메라 없이 스탬프 부여',
  },
  reveal: {
    title: '글자 획득!',
    stampGet: '스탬프 GET!',
    close: '닫기',
  },
  challenge: {
    title: '제시어 도전',
    instruction: '7개의 글자를 배열해서 올바른 제시어를 완성하세요!',
    wrong: '아쉽지만 정답이 아니에요. 다시 배열해 보세요!',
    available: '보유한 글자 (탭하여 배치)',
    checkCta: '이 배열로 확인하기',
    exchangeCta: '경품 교환으로 이동',
    correctTitle: '정답! 완료!',
    correctBody: '축하합니다! 제시어를 완성했습니다.',
  },
  exchange: {
    phraseLabel: '완성한 제시어',
    title1: '스탬프 랠리',
    title2: '컴플리트상 교환 접수',
    staffNotice1: '경품 교환은 스태프가 조작해 주세요.',
    staffNotice2: '반드시 스태프에게 전달해 주세요.',
    exchangeButton: '교환하기',
    done: '교환 완료',
    confirmQuestion: '정말로 교환하시겠습니까?',
    staffHeading: '스태프용',
    staffPasscodePlaceholder: '스태프용 패스코드',
    staffPasscodeError: '패스코드가 올바르지 않습니다',
  },
};

export default ko;
