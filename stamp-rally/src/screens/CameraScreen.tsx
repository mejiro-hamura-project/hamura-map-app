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
  const scannerRef = useRef<Html5Qrcode | null>(null);
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
      navigate('/reveal', { state: { checkpointId: checkpoint.id } });
    },
    [addStamp, courseId, isCollected, navigate],
  );

  useEffect(() => {
    const scanner = new Html5Qrcode(SCANNER_ELEMENT_ID);
    scannerRef.current = scanner;

    // start() is async; React (StrictMode) can invoke the cleanup before it
    // settles, and stop() throws synchronously if called while not yet
    // running. Chain the teardown off the start promise so stop() is only
    // attempted once scanning has actually begun.
    const startPromise = scanner
      .start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: { width: 240, height: 240 } },
        (decodedText) => handleDecoded(decodedText),
        () => {
          // per-frame decode failures are expected while scanning; ignore
        },
      )
      .catch(() => {
        // start() 失敗の通知は非同期に確定するため、その間にQR操作で duplicate・invalid
        // 等のステータスが既に表示されていた場合はそれを上書きしない。
        // まだ何も起きていない（idle）ときだけ permission-denied にする。
        setStatus((prev) => (prev.type === 'idle' ? { type: 'permission-denied' } : prev));
        throw new Error('camera-start-failed');
      });

    return () => {
      startPromise
        .then(() => scanner.stop())
        .catch(() => {})
        .finally(() => {
          try {
            scanner.clear();
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
      <main className="flex flex-1 flex-col items-center gap-6 overflow-y-auto px-6 pb-8 text-white">
        <p className="text-center text-sm">{m.camera.instruction}</p>

        <div className="relative aspect-square w-full max-w-[280px] overflow-hidden rounded-2xl border-4 border-white bg-[#111]">
          <div id={SCANNER_ELEMENT_ID} className="h-full w-full" />
        </div>

        {status.type === 'permission-denied' && (
          <div className="rounded-xl bg-notice px-4 py-3 text-center text-sm font-bold">
            {m.camera.permissionDenied}
          </div>
        )}
        {status.type === 'duplicate' && (
          <div className="rounded-xl bg-[#555] px-4 py-3 text-center text-sm font-bold">
            {m.camera.duplicate}
          </div>
        )}
        {status.type === 'invalid' && (
          <div className="rounded-xl bg-notice px-4 py-3 text-center text-sm font-bold">
            {m.camera.invalid}
          </div>
        )}

        <button
          type="button"
          onClick={() => navigate('/rally')}
          className="min-h-[44px] rounded-full border border-white/40 px-6 text-sm font-bold text-white"
        >
          {m.common.back}
        </button>
      </main>
    </PageContainer>
  );
}
