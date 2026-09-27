import { useNavigate } from 'react-router-dom';

interface DemoResetButtonProps {
  /** 既存の全状態リセット処理（useStampRally.resetAll）を再利用する。 */
  onReset: () => void;
}

/**
 * デモ・動作確認専用。どの画面からでも 1 タップでデモ開始時の初期状態へ戻す
 * （参加者情報も含めてすべて消去し、お知らせ画面へ戻る）。
 * デモ用アプリのため常時表示。位置は呼び出し側（AppLayout）がまとめて管理する。
 */
export default function DemoResetButton({ onReset }: DemoResetButtonProps) {
  const navigate = useNavigate();

  const handleReset = () => {
    onReset(); // スタンプ・回答・交換・登録・年齢区分などの状態すべて
    navigate('/notice', { replace: true }); // デモ開始時の最初の画面へ
  };

  return (
    <button
      type="button"
      onClick={handleReset}
      className="pointer-events-auto rounded-full border border-[#c9a3a3] bg-white/90 px-3 py-1.5 text-xs font-bold text-[#a13b3b] shadow-sm backdrop-blur active:scale-95"
    >
      デモ用:初めに戻る
    </button>
  );
}
