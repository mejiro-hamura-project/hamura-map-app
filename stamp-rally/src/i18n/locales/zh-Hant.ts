import type { PartialMessages } from '../index';

// 繁體中文 (Traditional Chinese)。zh-TW / zh-HK / zh-MO / zh-Hant などから解決される。
const zhHant: PartialMessages = {
  common: {
    start: '開始',
    ok: '確定',
    cancel: '取消',
    back: '返回',
    resetConfirm: '將清除全部進度（印章、登記資訊、兌換紀錄）並從頭開始，確定嗎？',
    resetButton: '（測試用）重設進度並從頭開始',
  },
  header: {
    line1: '祭典',
    line2: '集章活動',
  },
  notice: {
    iconAlt: '祭典集章活動圖示',
    title: '注意事項',
    safetyHeading: '安全提醒',
    safetyBody:
      '神社內人潮眾多。請留意周遭，勿奔跑或碰撞其他參拜者。邊看手機邊走非常危險，請停下腳步再使用。',
    privacyHeading: '關於個人資料',
    privacyBody:
      '您登記的資料僅用於本次活動的營運、獎品兌換確認及統計，不會用於其他目的，也不會提供給第三方。',
    otherHeading: '其他',
    otherBody: '獎品數量有限，兌換完畢後可能提前結束，敬請見諒。',
  },
  howto: {
    title: '玩法',
    imagePlaceholder: '圖片佔位',
    steps: [
      {
        title: '尋找神社內的 QR Code！',
        body: '集章活動專用的 QR Code 就藏在神社各處，快去找找看吧！',
      },
      {
        title: '用相機掃描！',
        body: '只要用 App 的相機對準 QR Code，辨識成功後會自動判定。',
      },
      {
        title: '收集文字！',
        body: '每掃描一次就獲得一個文字。集滿 7 個即可拼出題目詞語。',
      },
      {
        title: '完成題目並兌換！',
        body: '集滿 7 個後前往正殿，向工作人員出示 App 畫面即可兌換獎品！',
      },
    ],
  },
  register: {
    title: '參加者登記',
    nicknameLabel: '暱稱（非必填）',
    nicknamePlaceholder: '例：祭典達人',
    genderLabel: '性別',
    ageLabel: '年齡層',
    required: '必填',
    selectPlaceholder: '請選擇',
    genderError: '請選擇性別',
    ageError: '請選擇年齡層',
    submit: '參加',
    gender: { male: '男性', female: '女性', other: '其他' },
    age: {
      student: '學生',
      '10s': '10 多歲',
      '20s': '20 多歲',
      '30s': '30 多歲',
      '40s': '40 多歲',
      '50s': '50 多歲',
      '60plus': '60 歲以上',
    },
  },
  rally: {
    countLabel: '目前印章數',
    completeBanner1: '已集滿 7 枚印章！',
    completeBanner2: '想想正確的順序，來挑戰題目吧。',
    phraseSolvedBanner: '題目已完成！去正殿兌換吧',
    exchangedBanner: '獎品兌換已完成',
    challengeCta: '挑戰題目',
    exchangeCta: '前往獎品兌換',
    cameraCta: '📷 啟動相機',
  },
  camera: {
    instruction: '請將 QR Code 對準取景框內',
    permissionDenied: '未取得相機權限。請在瀏覽器設定中允許使用相機。',
    duplicate: '這個 QR Code 已經取得過了',
    invalid: '非本活動的 QR Code',
    demoScanButton: '讀取示範用 QR Code',
    debugLabel: '除錯用（正式環境隱藏）：不使用相機直接發放印章',
  },
  reveal: {
    title: '獲得文字！',
    stampGet: '獲得印章！',
    close: '關閉',
  },
  challenge: {
    title: '挑戰題目',
    instruction: '將 7 個文字重新排列，拼出正確的題目！',
    wrong: '很可惜，不是正確答案。再排一次看看吧！',
    available: '擁有的文字（點擊放置）',
    checkCta: '以此順序判定',
    exchangeCta: '前往獎品兌換',
    correctTitle: '正確！全部完成！',
    correctBody: '恭喜！你完成了題目。',
  },
  exchange: {
    phraseLabel: '完成的題目',
    title1: '集章活動',
    title2: '全清獎 兌換受理',
    staffNotice1: '獎品兌換請由工作人員操作。',
    staffNotice2: '請務必交給工作人員。',
    exchangeButton: '兌換',
    done: '已兌換',
    confirmQuestion: '確定要兌換嗎？',
    staffHeading: '工作人員專用',
    staffPasscodePlaceholder: '工作人員密碼',
    staffPasscodeError: '密碼不正確',
  },
};

export default zhHant;
