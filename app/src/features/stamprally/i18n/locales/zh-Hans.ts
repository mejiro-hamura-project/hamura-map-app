import type { PartialMessages } from '../index';

// 简体中文 (Simplified Chinese)。zh / zh-CN / zh-SG / zh-Hans などから解決される。
const zhHans: PartialMessages = {
  common: {
    start: '开始',
    ok: '确定',
    cancel: '取消',
    back: '返回',
    resetConfirm: '将清除全部进度（印章、登记信息、兑换记录）并从头开始，确定吗？',
    resetButton: '（测试用）重置进度并从头开始',
  },
  header: {
    line1: '祭典',
    line2: '集章活动',
  },
  notice: {
    iconAlt: '祭典集章活动图标',
    title: '注意事项',
    safetyHeading: '安全提示',
    safetyBody:
      '神社内人流较多。请注意周围，不要奔跑或碰撞其他参拜者。边看手机边走非常危险，请停下脚步再使用。',
    privacyHeading: '关于个人信息',
    privacyBody:
      '您登记的信息仅用于本次活动的运营、奖品兑换确认及统计，不会用于其他目的，也不会提供给第三方。',
    otherHeading: '其他',
    otherBody: '奖品数量有限，兑换完毕后可能提前结束，敬请谅解。',
  },
  howto: {
    title: '玩法',
    imagePlaceholder: '图片占位',
    steps: [
      {
        title: '寻找神社内的二维码！',
        body: '集章活动专用的二维码就藏在神社各处，快去找找看吧！',
      },
      {
        title: '用相机扫描！',
        body: '只需用应用的相机对准二维码，识别成功后会自动判定。',
      },
      {
        title: '收集文字！',
        body: '每扫描一次就获得一个文字。集齐 7 个即可拼出题目词语。',
      },
      {
        title: '完成题目并兑换！',
        body: '集齐 7 个后前往正殿，向工作人员出示应用画面即可兑换奖品！',
      },
    ],
  },
  register: {
    title: '参加者登记',
    nicknameLabel: '昵称（选填）',
    nicknamePlaceholder: '例：祭典达人',
    genderLabel: '性别',
    ageLabel: '年龄段',
    required: '必填',
    selectPlaceholder: '请选择',
    genderError: '请选择性别',
    ageError: '请选择年龄段',
    submit: '参加',
    gender: { male: '男性', female: '女性', other: '其他' },
    age: {
      student: '学生',
      '10s': '10 多岁',
      '20s': '20 多岁',
      '30s': '30 多岁',
      '40s': '40 多岁',
      '50s': '50 多岁',
      '60plus': '60 岁以上',
    },
  },
  rally: {
    countLabel: '当前印章数',
    completeBanner1: '已集齐 7 枚印章！',
    completeBanner2: '想想正确的顺序，来挑战题目吧。',
    phraseSolvedBanner: '题目已完成！去正殿兑换吧',
    exchangedBanner: '奖品兑换已完成',
    challengeCta: '挑战题目',
    exchangeCta: '前往奖品兑换',
    cameraCta: '📷 启动相机',
  },
  camera: {
    instruction: '请将二维码放入取景框内',
    permissionDenied: '未获得相机权限。请在浏览器设置中允许使用相机。',
    duplicate: '这个二维码已经获取过了',
    invalid: '非本活动的二维码',
    demoScanButton: '读取演示用二维码',
    debugLabel: '调试用（正式环境隐藏）：不使用相机直接发放印章',
  },
  reveal: {
    title: '获得文字！',
    stampGet: '获得印章！',
    close: '关闭',
  },
  challenge: {
    title: '挑战题目',
    instruction: '将 7 个文字重新排列，拼出正确的题目！',
    wrong: '很遗憾，不是正确答案。再排一次看看吧！',
    available: '拥有的文字（点击放置）',
    checkCta: '按此顺序判定',
    exchangeCta: '前往奖品兑换',
    correctTitle: '正确！全部完成！',
    correctBody: '恭喜！你完成了题目。',
  },
  exchange: {
    phraseLabel: '完成的题目',
    title1: '集章活动',
    title2: '全清奖 兑换受理',
    staffNotice1: '奖品兑换请由工作人员操作。',
    staffNotice2: '请务必交给工作人员。',
    exchangeButton: '兑换',
    done: '已兑换',
    confirmQuestion: '确定要兑换吗？',
    staffHeading: '工作人员专用',
    staffPasscodePlaceholder: '工作人员密码',
    staffPasscodeError: '密码不正确',
  },
};

export default zhHans;
