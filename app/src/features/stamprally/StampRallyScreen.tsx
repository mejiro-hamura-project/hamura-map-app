import PlaceholderScreen from '../../shared/ui/PlaceholderScreen';

/**
 * スタンプラリー本体はこのプロジェクト（app/担当）では作り込まない。
 * ここは①担当の実装を後から差し込むための空きスロット。
 * 現状の連携可否は docs/integration-notes.md を参照。
 */
export default function StampRallyScreen() {
  return (
    <PlaceholderScreen
      title="スタンプラリー"
      description="このタブは、既存のスタンプラリー機能を後から差し込むための空きスロットです。"
      note="現時点ではスタンプラリーは別アプリのため、ここには接続していません。接続方法は docs/integration-notes.md にまとめています。"
    />
  );
}
