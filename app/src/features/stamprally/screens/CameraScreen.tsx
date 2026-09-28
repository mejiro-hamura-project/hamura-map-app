import { STAMP_RALLY_ROUTES } from '../routes';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { Html5Qrcode } from 'html5-qrcode';
import Header from '../components/Header';
import PageContainer from '../components/PageContainer';
import type { UseStampRally } from '../hooks/useStampRally';
import { findCheckpointByQrValue } from '../data/checkpoints';
import { useDisplayMessages } from '../i18n/useDisplayMessages';

const SCANNER_ELEMENT_ID = 'qr-scanner-region';

type ScanStatus =
  | { type: 'idle' }
  | { type: 'duplicate' }
  | { type: 'invalid' }
  | { type: 'permission-denied' };

export default function CameraScreen() {
  const navigate = useNavigate();
  const { registration, courseId, addStamp, isCollected } = useOutletContext<UseStampRally>();
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

  return (
    <PageContainer dark>
      <Header dark />
      <main className="flex min-h-0 flex-1 flex-col items-center gap-6 overflow-y-auto px-6 pb-8 text-white">
        <p className="text-center text-sm">{m.camera.instruction}</p>

        <div className="relative aspect-square w-full max-w-[280px] overflow-hidden rounded-2xl border-4 border-white bg-[#111]">
          <div id={SCANNER_ELEMENT_ID} className="h-full w-full" />
        </div>

        {status.type === 'permission-denied' && (
          <div className="rounded-xl bg-stamprally-notice px-4 py-3 text-center text-sm font-bold">
            {m.camera.permissionDenied}
          </div>
        )}
        {status.type === 'duplicate' && (
          <div className="rounded-xl bg-[#555] px-4 py-3 text-center text-sm font-bold">
            {m.camera.duplicate}
          </div>
        )}
        {status.type === 'invalid' && (
          <div className="rounded-xl bg-stamprally-notice px-4 py-3 text-center text-sm font-bold">
            {m.camera.invalid}
          </div>
        )}

        <button
          type="button"
          onClick={() => navigate(STAMP_RALLY_ROUTES.rally)}
          className="min-h-[44px] rounded-full border border-white/40 px-6 text-sm font-bold text-white"
        >
          {m.common.back}
        </button>
      </main>
    </PageContainer>
  );
}
