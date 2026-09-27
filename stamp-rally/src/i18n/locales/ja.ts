// 日本語（アプリの基準・フォールバック言語）。
// デバイスの言語に対応する翻訳が無い場合は、この ja がそのまま使われます。
export const ja = {
  common: {
    start: 'スタート',
    ok: 'OK',
    cancel: 'キャンセル',
    back: '戻る',
    // 旧仕様の名残（現在はテスト用ボタン群に置き換え済み）。他言語ファイルとの
    // 互換性維持のためキー自体は残している。
    resetConfirm:
      '進行状況（スタンプ・登録情報・交換履歴）をすべて消去して最初からやり直しますか？',
    resetButton: '（テスト用）進行状況をリセットして最初からやり直す',
  },
  header: {
    line1: 'お祭り',
    line2: 'スタンプラリー',
  },
  notice: {
    iconAlt: 'お祭りスタンプラリー アイコン',
    title: '注意事項',
    safetyHeading: '安全に関するお願い',
    safetyBody:
      '境内は多くの参拝者で賑わいます。走ったり、他の参拝者にぶつかったりしないよう、周囲に十分ご注意のうえお楽しみください。スマートフォンの画面を見ながらの歩行は大変危険ですので、必ず立ち止まってご利用ください。',
    privacyHeading: '個人情報について',
    privacyBody:
      'ご登録いただいた情報は、本イベントの運営および景品交換の確認のためにのみ使用し、それ以外の目的では使用いたしません。第三者への提供は行いません。',
    otherHeading: 'その他の注意事項',
    otherBody:
      '景品の交換は数に限りがございます。なくなり次第、交換を終了させていただく場合がございますので、あらかじめご了承ください。',
    dataRetentionHeading: '個人情報の保存期間・お問い合わせ',
    dataRetentionBody:
      'ご登録いただいた情報は、イベント終了後、運営が定める期間内に削除いたします。保存内容・削除方法・お問い合わせ先の詳細は、運営までご確認ください。',
  },
  howto: {
    title: '遊び方',
    // 旧仕様の名残（遊び方画面の画像プレースホルダー枠は削除済み・未使用）。
    // 他言語ファイルとの互換性維持のためキー自体は残している。
    imagePlaceholder: '画像プレースホルダー',
    steps: [
      {
        title: '境内のQRコードを探そう！',
        body: '境内のあちこちに、スタンプラリー専用のQRコードがかくれているよ。探してみよう！',
      },
      {
        title: 'カメラで読み取ろう！',
        body: 'アプリのカメラでQRコードをうつすだけ。読み取れたら自動で判定してくれるよ。',
      },
      {
        title: '文字を集めよう！',
        body: '読み取るたびに1文字ずつゲット！7つ集めると、お題の言葉が完成するよ。',
      },
      {
        title: '並べて交換しよう！',
        body: '7つ集めたら、文字を並べよう。正解したら、スタッフに見せて景品と交換してもらおう！',
      },
    ],
  },
  register: {
    title: '参加者登録',
    nicknameLabel: 'ニックネーム（任意）',
    nicknamePlaceholder: '例：まつりびと',
    genderLabel: '性別',
    ageLabel: '年齢',
    agePlaceholder: '例：25',
    required: '必須',
    selectPlaceholder: '選択してください',
    genderError: '性別を選択してください',
    ageError: '年齢は1〜110の数字で入力してください',
    isStudentLabel: '学生ですか？',
    isStudentYes: 'はい（学生です）',
    isStudentNo: 'いいえ（学生ではありません）',
    isStudentError: '学生かどうかを選択してください',
    studentCategoryLabel: '学校区分',
    studentCategoryError: '学校区分を選択してください',
    // 旧仕様の名残（年齢と学校区分の不一致は、確認ダイアログではなく
    // 送信をブロックするエラー表示に変更済み）。他言語ファイルとの互換性維持のため
    // キー自体は残している。
    ageStudentMismatchConfirm:
      '入力された年齢と学校区分が一致していないようです。このまま参加しますか？',
    submit: '参加する',
    // 旧仕様の名残（参加登録はGoogleスプレッドシートへの送信結果を待たず、
    // localStorageだけで即座に完了するよう変更済み。送信はベストエフォートで
    // 失敗しても登録自体には影響しない）。他言語ファイルとの互換性維持のため
    // キー自体は残している。
    submitting: '登録しています…',
    registerError: '登録できませんでした。もう一度お試しください。',
    registerNotConfigured: 'ただいま参加登録を受け付けできません。近くのスタッフにお声がけください。',
    gender: {
      male: '男性',
      female: '女性',
      other: 'その他',
    },
    // 旧「年代」区分（現在は年齢の数値入力に置き換え済み・未使用）。
    // 他言語ファイルとの互換性維持のためキー自体は残している。
    age: {
      student: '学生',
      '10s': '10代',
      '20s': '20代',
      '30s': '30代',
      '40s': '40代',
      '50s': '50代',
      '60plus': '60代以上',
    },
    studentCategory: {
      elementary: '小学生',
      juniorHigh: '中学生',
      highSchool: '高校生',
      university: '大学生',
    },
  },
  rally: {
    participantNumberLabel: '参加者番号',
    countLabel: '獲得したスタンプの数',
    completeBanner1: '7つのスタンプがすべて揃いました！',
    completeBanner2: '正しい並び順を考えて、お題に挑戦してください。',
    phraseSolvedBanner: 'お題が完成しました！本殿で景品と交換してください。',
    exchangedBanner: '景品交換はすでに完了しています',
    challengeCta: '文字を並べる',
    exchangeCta: '景品交換へ進む',
    cameraCta: '📷 カメラを使用する',
  },
  camera: {
    instruction: 'QRコードを枠内に合わせてください',
    permissionDenied: 'カメラを使用できません。ブラウザの設定をご確認ください。',
    duplicate: 'このQRコードはすでに読み取り済みです',
    invalid: 'このQRコードは使用できません',
    demoScanButton: 'デモ用QRを読み込む',
    debugLabel: 'デバッグ用（本番非表示）: カメラなしでスタンプを付与',
  },
  reveal: {
    title: '文字を獲得しました！',
    stampGet: 'スタンプ獲得！',
    close: '閉じる',
    tapHint: '画面をタップするとすぐに戻ります',
  },
  challenge: {
    title: '文字を並べ替えてください',
    instruction: '集めた7つの文字を、正しい順番に並べ替えてください。',
    wrong: '残念、まだ正しくありません。もう一度並べ替えてください。',
    available: '獲得した文字（タップで配置）',
    checkCta: 'この並びで確認する',
    exchangeCta: '景品交換へ進む',
    correctTitle: '正解です！',
    correctBody: 'お題の言葉が完成しました。',
    answersHintLabel: 'ヒント（このいずれかが正解です）',
  },
  exchange: {
    // 参加者が最初に見る案内。景品交換はスタッフ操作のみで行うことを明確に伝える。
    handToStaff: 'スタッフにお見せください',
    phraseLabel: '完成した言葉',
    title1: 'スタンプラリー',
    title2: 'コンプリート賞 交換受付',
    numberLabel: '景品交換番号',
    staffNotice1: '景品交換はスタッフが行います。',
    staffNotice2: '必ずスタッフにお見せください。',
    staffNotice3: '交換の最終操作はスタッフが行います。',
    longPressHint: '（スタッフの方へ：ここを長押しすると確認画面が開きます）',
    // 旧仕様の名残（現在は利用者向けの交換ボタンは表示しない）。他言語ファイルとの
    // 互換性維持のためキー自体は残している。
    exchangeButton: '交換する',
    done: '交換済み',
    confirmQuestion: '本当に交換しますか？',
    confirmButton: '交換する',
    // 旧仕様の名残（スタッフ用パスコード入力は廃止済み。長押しのみで確認画面へ進む）。
    // 他言語ファイルとの互換性維持のためキー自体は残している。
    staffHeading: 'スタッフの方へ',
    staffPasscodePlaceholder: 'スタッフ用パスコード',
    staffPasscodeError: 'パスコードが正しくありません',
    // 旧仕様の名残（景品交換もlocalStorageだけで即座に完了するよう変更済み。
    // Googleスプレッドシートへの送信はベストエフォートで、成否を画面に反映しない）。
    // 他言語ファイルとの互換性維持のためキー自体は残している。
    issuing: 'きろくしています…',
    issueError: '交換の記録に失敗しました。もう一度お試しください。',
    issueRetry: '再試行',
    notConfigured: '記録できません（サーバー未設定）',
  },
};

export type Messages = typeof ja;

// 自動検出（import.meta.glob, import: 'default'）から参照されるデフォルトエクスポート。
export default ja;

// ───────────────────────────────────────────────────────────────
// 小学生モード（学校区分で「小学生」を選択した参加者）専用の言い換え。
// 登録画面より後（rally〜exchange）でだけ、上のjaの代わりにこちらの表記を
// 使う（useDisplayMessagesが登録情報から判定してマージする）。
// 対象は日本語のみ（他言語はもともと平易な表現のため分ける必要がない）。
// ───────────────────────────────────────────────────────────────
export const jaElementaryOverride = {
  rally: {
    participantNumberLabel: 'あなたの ばんごう',
    countLabel: '今もっている スタンプの数',
    completeBanner1: '7つ あつまったよ！',
    completeBanner2: '正しい 並び順を 考えて、お題に 挑戦しよう。',
    phraseSolvedBanner: 'お題が できたよ！本殿で こうかんしよう',
    exchangedBanner: '景品交換は もう おわっています',
    challengeCta: 'もじを ならべる',
    exchangeCta: '景品交換へ すすむ',
    cameraCta: '📷 カメラを つかう',
  },
  camera: {
    instruction: 'QRコードを 四角の 中に 入れてね',
    permissionDenied: 'カメラが つかえません。ブラウザの せっていを かくにんしてね。',
    duplicate: 'このQRコードは もう とりました',
    invalid: 'このQRコードは つかえません',
  },
  reveal: {
    title: 'もじ ゲット！',
    stampGet: 'スタンプ GET！',
    close: 'とじる',
    tapHint: '画面をタップすると すぐに もどります',
  },
  challenge: {
    title: 'もじを ならべよう',
    instruction: 'あつめた 7つの もじを、正しい 順番に ならべてね！',
    wrong: 'ざんねん、まだ ちがうよ。もう一ど ならべてみよう！',
    available: 'もっている もじ（タップで おく）',
    checkCta: 'これで あっているか たしかめる',
    exchangeCta: '景品交換へ すすむ',
    correctTitle: '正解！',
    correctBody: 'よくできました！ことばが できました。',
    answersHintLabel: 'ヒント（このなかの どれか）',
  },
  exchange: {
    handToStaff: 'スタッフに 見せてね',
    phraseLabel: 'できた ことば',
    staffNotice1: '景品交換は スタッフが おこないます。',
    staffNotice2: 'かならず スタッフに みせてください。',
    staffNotice3: '交換の さいごの そうさは スタッフが おこないます。',
    longPressHint: '（スタッフの方へ：ここを 長押しすると 確認画面が ひらきます）',
    done: '交換ずみ',
  },
};
