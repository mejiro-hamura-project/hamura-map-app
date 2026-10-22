/**
 * 開発者用操作パネル（開発モード専用）。
 *
 * StampRallyLayout から import.meta.env.DEV のときだけ読み込まれる。本番ビルド（vite build）
 * では import.meta.env.DEV が false に置き換わり、このファイル（と devPanel.css）はバンドルに含まれない。
 *
 * - 通常の画面（本番と同じコンポーネント）の上に重ねて表示するだけで、画面のレイアウトは変えない。
 * - 画面移動は navigate するだけ。各画面の既存の条件（未登録なら注意事項へ戻す等）はそのまま働き、
 *   移動しただけでスタンプ取得・登録・正解・景品交換が成立することはない。
 * - デモ用の操作は useStampRally の devActions（dev/devActions.ts、開発モードのみ）を呼ぶ。対象はこのブラウザ（開発環境の
 *   オリジン）の localStorage だけで、本番の参加者の端末のデータには届かない。
 */
import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import type { UseStampRally } from '../hooks/useStampRally';
import { STAMP_RALLY_ROUTES } from '../routes';
import { TOTAL_STAMPS, getCorrectPhrase, getCourseById } from '../data/checkpoints';
import './devPanel.css';

type ScreenKey = 'notice' | 'howto' | 'register' | 'rally' | 'camera' | 'reveal' | 'challenge' | 'exchange';

/** 通常の進行順。前後移動・直接移動の対象は既存のスタンプラリー画面だけ。 */
const SCREENS: { key: ScreenKey; label: string }[] = [
  { key: 'notice', label: '注意事項' },
  { key: 'howto', label: '遊び方' },
  { key: 'register', label: '参加登録' },
  { key: 'rally', label: 'スタンプ一覧' },
  { key: 'camera', label: 'QR読み取り（カメラ）' },
  { key: 'reveal', label: 'スタンプ取得演出' },
  { key: 'challenge', label: '並べ替え（キーワード）' },
  { key: 'exchange', label: '景品交換' },
];

const SCREEN_LABEL = Object.fromEntries(SCREENS.map((s) => [STAMP_RALLY_ROUTES[s.key], s.label])) as Record<string, string>;

/** その画面を表示するのに既存の処理が求める条件（満たさないと既存の処理で別の画面へ戻される）。 */
function unmetRequirement(key: ScreenKey, s: UseStampRally): string | null {
  const needsRegistration: ScreenKey[] = ['rally', 'camera', 'reveal', 'challenge', 'exchange'];
  if (needsRegistration.includes(key) && !s.registration) return '参加登録が必要です';
  if (key === 'register' && s.registration) return '登録済みのため参加登録画面は表示されません（「デモを最初から」で未登録に戻せます）';
  if (key === 'reveal' && s.collectedIds.length === 0) return 'スタンプが1個以上必要です（「テスト用QRを読み込む」で取得できます）';
  if (key === 'challenge' && !s.isComplete) return 'スタンプが7個そろっている必要があります';
  if (key === 'exchange' && !s.phraseSolved) return 'お題（キーワード）の正解が必要です';
  return null;
}

const SHORTCUT_HINT = 'Shift + D でも開閉できます';

export default function DevPanel({ stampRally }: { stampRally: UseStampRally }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [selected, setSelected] = useState<ScreenKey>('notice');
  const pendingRef = useRef<{ target: string; key: ScreenKey } | null>(null);

  const path = pathname.replace(/\/+$/, '');
  const currentIndex = SCREENS.findIndex((s) => STAMP_RALLY_ROUTES[s.key] === path);
  const checkpoints = stampRally.courseId !== null ? (getCourseById(stampRally.courseId)?.checkpoints ?? []) : [];
  const nextUncollected = checkpoints.find((c) => !stampRally.collectedIds.includes(c.id));
  const sheetConfigured = Boolean(import.meta.env.VITE_SHEET_WEBHOOK_URL);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.shiftKey && (e.key === 'D' || e.key === 'd') && !(e.target instanceof HTMLInputElement)) {
        setOpen((o) => !o);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // 直接移動した先が既存の条件で別の画面へ戻された場合は、理由を表示する。
  useEffect(() => {
    const pending = pendingRef.current;
    if (!pending) return;
    const timer = window.setTimeout(() => {
      const now = window.location.pathname.replace(/\/+$/, '');
      if (now !== pending.target && pending.key !== 'reveal') {
        setMessage(`「${SCREEN_LABEL[pending.target]}」は既存の条件により表示されず、「${SCREEN_LABEL[now] ?? now}」に戻りました。`);
      }
      pendingRef.current = null;
    }, 150);
    return () => window.clearTimeout(timer);
  }, [pathname]);

  const goTo = (key: ScreenKey) => {
    const reason = unmetRequirement(key, stampRally);
    const label = SCREENS.find((s) => s.key === key)?.label ?? key;
    if (reason) {
      setMessage(`「${label}」へは移動できません：${reason}`);
      return;
    }
    setMessage(null);
    const target = STAMP_RALLY_ROUTES[key];
    pendingRef.current = { target, key };
    if (key === 'reveal') {
      // 取得演出は「どのスタンプか」が必要。取得済みの最後のスタンプを表示するだけ（新たに取得はしない）。
      const lastId = stampRally.collectedIds[stampRally.collectedIds.length - 1];
      navigate(target, { state: { checkpointId: lastId } });
      return;
    }
    navigate(target);
  };

  const step = (delta: -1 | 1) => {
    const base = currentIndex === -1 ? 0 : currentIndex;
    const next = SCREENS[base + delta];
    if (next) goTo(next.key);
  };

  // 既存の「テスト用QRを読み込む」と同じ処理（未取得のものを1つ addStamp して取得演出へ）。
  const loadTestQr = () => {
    if (!nextUncollected) return;
    stampRally.addStamp(nextUncollected.id);
    navigate(STAMP_RALLY_ROUTES.reveal, { state: { checkpointId: nextUncollected.id } });
  };

  const restartDemo = () => {
    if (!window.confirm('このブラウザの開発用データ（登録・スタンプ・お題・景品交換）を消して、デモを注意事項からやり直しますか？')) return;
    stampRally.devActions?.resetAll();
    setMessage('デモを最初からやり直しました。');
    navigate(STAMP_RALLY_ROUTES.notice, { replace: true });
  };

  const resetTestProgress = () => {
    if (!window.confirm('このブラウザの開発用データのうち、スタンプ・お題・景品交換の進捗を初期化しますか？（登録情報は残ります）')) return;
    stampRally.devActions?.resetProgress();
    setMessage('テスト用の進捗を初期化しました。');
    if (stampRally.registration) navigate(STAMP_RALLY_ROUTES.rally);
  };

  if (!open) {
    return (
      <button type="button" className="sr-dev-handle" onClick={() => setOpen(true)} title={SHORTCUT_HINT}>
        DEV
      </button>
    );
  }

  return (
    <aside className="sr-dev-panel" aria-label="開発者用操作パネル">
      <div className="sr-dev-head">
        <strong>開発モード</strong>
        <button type="button" className="sr-dev-close" onClick={() => setOpen(false)} aria-label="閉じる">
          ✕
        </button>
      </div>
      <p className="sr-dev-note">本番ビルドには含まれません。{SHORTCUT_HINT}</p>
      {sheetConfigured && (
        <p className="sr-dev-warn">
          スプレッドシートの送信先（VITE_SHEET_WEBHOOK_URL）が設定されています。デモで登録・正解・交換を行うと、既存の処理どおりその送信先へ送られます。
        </p>
      )}

      <section className="sr-dev-section">
        <h3>画面移動</h3>
        <p className="sr-dev-current">
          現在：{currentIndex === -1 ? path : `${currentIndex + 1}. ${SCREENS[currentIndex].label}`}
        </p>
        <div className="sr-dev-row">
          <button type="button" onClick={() => step(-1)} disabled={currentIndex <= 0}>
            ◀ 前の画面
          </button>
          <button type="button" onClick={() => step(1)} disabled={currentIndex >= SCREENS.length - 1}>
            次の画面 ▶
          </button>
        </div>
        <div className="sr-dev-row">
          <select value={selected} onChange={(e) => setSelected(e.target.value as ScreenKey)} aria-label="移動先の画面">
            {SCREENS.map((s, i) => (
              <option key={s.key} value={s.key}>
                {i + 1}. {s.label}
              </option>
            ))}
          </select>
          <button type="button" onClick={() => goTo(selected)}>
            移動
          </button>
        </div>
        <p className="sr-dev-note">移動しても登録・スタンプ取得・正解・景品交換は成立しません。</p>
      </section>

      <section className="sr-dev-section">
        <h3>デモプレイ</h3>
        <div className="sr-dev-col">
          <button type="button" onClick={loadTestQr} disabled={!stampRally.registration || !nextUncollected}>
            テスト用QRを読み込む（カメラなしで1個取得）
          </button>
          <button
            type="button"
            onClick={() => stampRally.devActions?.testCompleteAllStamps()}
            disabled={!stampRally.registration || stampRally.isComplete}
          >
            テスト用：スタンプを7個そろえる
          </button>
        </div>
        {stampRally.courseId !== null && (
          <p className="sr-dev-note">
            正解の並び：<strong>{getCorrectPhrase(stampRally.courseId)}</strong>（並べ替え画面で入力して確認）
          </p>
        )}
        <p className="sr-dev-note">
          実際のQR読み取りは、通常どおり「QRコードを読み取る」からカメラ画面で確認してください。
        </p>
      </section>

      <section className="sr-dev-section">
        <h3>リセット（このブラウザの開発用データのみ）</h3>
        <div className="sr-dev-col">
          <button type="button" className="sr-dev-danger" onClick={restartDemo}>
            デモを最初からやり直す
          </button>
          <button type="button" className="sr-dev-danger" onClick={resetTestProgress} disabled={!stampRally.registration}>
            テスト用進捗をリセット
          </button>
        </div>
      </section>

      <section className="sr-dev-section">
        <h3>現在の状態（既存の保存データ）</h3>
        <ul className="sr-dev-state">
          <li>参加登録：{stampRally.registration ? `済（No.${stampRally.participantNumber ?? '-'}）` : '未'}</li>
          <li>
            スタンプ：{stampRally.collectedCount} / {TOTAL_STAMPS}
          </li>
          <li>お題の正解：{stampRally.phraseSolved ? '済' : '未'}</li>
          <li>景品交換：{stampRally.prizeExchanged ? '済' : '未'}</li>
        </ul>
      </section>

      {message && (
        <p className="sr-dev-message" role="status">
          {message}
        </p>
      )}
    </aside>
  );
}
