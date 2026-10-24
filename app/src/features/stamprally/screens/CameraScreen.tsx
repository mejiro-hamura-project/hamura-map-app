import { STAMP_RALLY_ROUTES } from '../routes';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { Html5Qrcode } from 'html5-qrcode';
import Header from '../components/Header';
import PageContainer from '../components/PageContainer';
import type { UseStampRally } from '../hooks/useStampRally';
import { TOTAL_STAMPS, findCheckpointByQrValue } from '../data/checkpoints';
import { useDisplayMessages } from '../i18n/useDisplayMessages';
import { FLOW_STEP_BY_SCREEN } from '../howtoSteps';
import { BUTTON_ICONS } from '../buttonIcons';
import { STAMP_RALLY_DISPLAY } from '../displayConfig';

const SCANNER_ELEMENT_ID = 'qr-scanner-region';

type ScanStatus =
  | { type: 'idle' }
  | { type: 'duplicate' }
  | { type: 'invalid' }
  | { type: 'permission-denied' };

export default function CameraScreen() {
  const navigate = useNavigate();
  const { registration, courseId, addStamp, isCollected, collectedCount } = useOutletContext<UseStampRally>();
  const m = useDisplayMessages(registration);
  const [status, setStatus] = useState<ScanStatus>({ type: 'idle' });
  const cleanupRef = useRef<Promise<void>>(Promise.resolve());
  const handledRef = useRef(false);

  const handleDecoded = useCallback(
    (decodedText: string) => {
      if (handledRef.current) return;
      if (courseId === null) return;

      const checkpoint = findCheckpointByQrValue(courseId, decodedText);
      if (!checkpoint) {
        setStatus({ type: 'invalid' });
        return;
      }
      if (isCollected(checkpoint.id)) {
        setStatus({ type: 'duplicate' });
        return;
      }

      handledRef.current = true;
      addStamp(checkpoint.id);
      navigate(STAMP_RALLY_ROUTES.reveal, { state: { checkpointId: checkpoint.id } });
    },
    [addStamp, courseId, isCollected, navigate],
  );

  useEffect(() => {
    let active = true;
    let scanner: Html5Qrcode | null = null;
    const scannerElement = document.getElementById(SCANNER_ELEMENT_ID);

    // StrictModeの再実行は前のstop/clearが終わってから開始する。
    // 非同期start中に退出しても、成功が確定してから停止する。
    const startPromise = cleanupRef.current.then(async () => {
      if (!active) return false;
      scanner = new Html5Qrcode(SCANNER_ELEMENT_ID);
      await scanner.start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: { width: 240, height: 240 } },
        (decodedText) => { if (active) handleDecoded(decodedText); },
        () => {
          // per-frame decode failures are expected while scanning; ignore
        },
      );
      return true;
    })
      .catch(() => {
        // start() 失敗の通知は非同期に確定するため、その間にQR操作で duplicate・invalid
        // 等のステータスが既に表示されていた場合はそれを上書きしない。
        // まだ何も起きていない（idle）ときだけ permission-denied にする。
        if (active) {
          setStatus((prev) => (prev.type === 'idle' ? { type: 'permission-denied' } : prev));
        }
        return false;
      });

    return () => {
      active = false;
      cleanupRef.current = startPromise
        .then(async (started) => {
          if (!started || !scanner) return;
          // html5-qrcodeのstartはvideo.playの完了前に解決する。
          // 再生の確定を待ち、stopによる未処理のAbortErrorを避ける。
          const video = scannerElement?.querySelector('video');
          if (video) await video.play().catch(() => {});
          await scanner.stop();
        })
        .catch(() => {})
        .finally(() => {
          try {
            // clearはIDで要素を再検索するため、別の再入場先を消さない。
            if (document.getElementById(SCANNER_ELEMENT_ID) === scannerElement) scanner?.clear();
          } catch {
            // element may already be unmounted
          }
        });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 取得数の文言（例「いまのスタンプ {n} / {total}」）を、説明の部分と数値の部分に分けて表示する。
  const progressText = m.camera.progress.replace('{total}', String(TOTAL_STAMPS));
  const countAt = progressText.indexOf('{n}');
  const progressLabel = countAt >= 0 ? progressText.slice(0, countAt).trim() : '';
  const progressCount = countAt >= 0 ? progressText.slice(countAt).replace('{n}', String(collectedCount)) : progressText;

  return (
    // デザインA案：明るい背景に、読み取り枠を青緑の太枠で囲む（映像部分は従来どおり暗い背景）。
    <PageContainer>
      <Header step={FLOW_STEP_BY_SCREEN.camera} />
      {/* 1画面に収める配置（表示だけ。読み取り枠の要素・カメラの処理は変えない）。
          読み取り枠は既存の読み取り範囲（qrbox 240px）より小さくならないよう 256px 以上を保つ。
          高さの低い横向きも縦に並べる（文字を大きくしたため、横に並べると案内の欄が狭すぎて読めない）。 */}
      <main className="flex min-h-0 flex-1 flex-col overflow-y-auto px-5 pb-2 text-sr-ink max-[359px]:px-1 [@media(max-height:480px)]:px-3 before:grow-[7] before:content-[''] after:grow-[13] after:content-['']">
        <div className="grid justify-items-center gap-4 py-2 [@media(481px<=height<=700px)]:gap-3 [@media(481px<=height<=700px)]:py-1 [@media(max-height:480px)]:py-1 [@media(max-height:480px)]:gap-y-2">
          <div className="text-center">
            <p className="text-base font-extrabold [@media(max-height:480px)]:text-sm">{m.camera.instruction}</p>
            {/* 取得数：説明（「いまのスタンプ」）は小さく、「3 / 7」の数値は約1.5倍・太字・濃い緑で目立たせる。 */}
            <p className="mt-1.5 flex items-baseline justify-center gap-1.5 text-sm text-sr-sub [@media(max-height:480px)]:mt-0.5 [@media(max-height:480px)]:text-xs">
              <span>{progressLabel}</span>
              <span className="text-[1.5rem] leading-none font-extrabold text-sr-green-strong [@media(max-height:480px)]:text-lg">
                {progressCount}
              </span>
            </p>
          </div>

          <div className="relative aspect-square w-[min(280px,100%)] min-w-[256px] [@media(max-height:700px)]:w-[256px] overflow-hidden rounded-2xl border-4 border-sr-teal-strong bg-[#111] shadow-[0_0_0_4px_rgba(76,174,176,0.18)] [@media(max-height:480px)]:w-[256px]">
            <div id={SCANNER_ELEMENT_ID} className="h-full w-full" />
          </div>

          <div className="flex w-full flex-col gap-2">
            {status.type === 'permission-denied' && (
              <div role="alert" className="w-full rounded-xl [overflow-wrap:anywhere] border border-sr-red bg-sr-red-soft px-3 py-2 text-center text-sm font-bold text-sr-red-strong [@media(max-height:480px)]:px-2 [@media(max-height:480px)]:py-1.5 [@media(max-height:480px)]:text-xs">
                {m.camera.permissionDenied}
              </div>
            )}
            {status.type === 'duplicate' && (
              <div role="alert" className="w-full rounded-xl [overflow-wrap:anywhere] border border-sr-line bg-sr-muted px-3 py-2 text-center text-sm font-bold text-sr-ink [@media(max-height:480px)]:px-2 [@media(max-height:480px)]:py-1.5 [@media(max-height:480px)]:text-xs">
                {m.camera.duplicate}
              </div>
            )}
            {status.type === 'invalid' && (
              <div role="alert" className="w-full rounded-xl [overflow-wrap:anywhere] border border-sr-red bg-sr-red-soft px-3 py-2 text-center text-sm font-bold text-sr-red-strong [@media(max-height:480px)]:px-2 [@media(max-height:480px)]:py-1.5 [@media(max-height:480px)]:text-xs">
                {m.camera.invalid}
              </div>
            )}

            <p className="text-center text-sm leading-snug text-sr-sub [@media(max-height:480px)]:text-xs">{m.camera.help}</p>
          </div>

          {/* 本番運用では使わないため非表示（displayConfig.ts）。処理はそのまま残している。 */}
          {STAMP_RALLY_DISPLAY.showCameraBackButton && (
            <button
              type="button"
              onClick={() => navigate(STAMP_RALLY_ROUTES.rally)}
              className="min-h-[48px] rounded-full border border-sr-line bg-white px-8 text-[1rem] font-semibold text-sr-ink"
            >
              <span className="inline-flex items-center justify-center gap-1.5 whitespace-nowrap">
                <span className="text-[1.05em] leading-none" aria-hidden="true">
                  {BUTTON_ICONS.back}
                </span>
                <span>{m.common.back}</span>
              </span>
            </button>
          )}
        </div>
      </main>
    </PageContainer>
  );
}
