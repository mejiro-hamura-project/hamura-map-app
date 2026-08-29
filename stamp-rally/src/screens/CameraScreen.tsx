import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { Html5Qrcode } from 'html5-qrcode';
import Header from '../components/Header';
import PageContainer from '../components/PageContainer';
import type { UseStampRally } from '../hooks/useStampRally';
import { CHECKPOINTS, findCheckpointByQrValue } from '../data/checkpoints';

const SCANNER_ELEMENT_ID = 'qr-scanner-region';

type ScanStatus =
  | { type: 'idle' }
  | { type: 'duplicate' }
  | { type: 'invalid' }
  | { type: 'permission-denied' };

export default function CameraScreen() {
  const navigate = useNavigate();
  const { addStamp, isCollected } = useOutletContext<UseStampRally>();
  const [status, setStatus] = useState<ScanStatus>({ type: 'idle' });
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const handledRef = useRef(false);

  const handleDecoded = useCallback(
    (decodedText: string) => {
      if (handledRef.current) return;

      const checkpoint = findCheckpointByQrValue(decodedText);
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
    [addStamp, isCollected, navigate],
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
        setStatus({ type: 'permission-denied' });
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

  const simulateScan = (qrValue: string) => {
    handleDecoded(qrValue);
  };

  return (
    <PageContainer dark>
      <Header dark />
      <main className="flex flex-1 flex-col items-center gap-6 overflow-y-auto px-6 pb-8 text-white">
        <p className="text-center text-sm">QRコードを枠内に収めてください</p>

        <div className="relative aspect-square w-full max-w-[280px] overflow-hidden rounded-2xl border-4 border-white bg-[#111]">
          <div id={SCANNER_ELEMENT_ID} className="h-full w-full" />
        </div>

        {status.type === 'permission-denied' && (
          <div className="rounded-xl bg-notice px-4 py-3 text-center text-sm font-bold">
            カメラへのアクセスが許可されていません。ブラウザの設定でカメラ権限を許可してください。
          </div>
        )}
        {status.type === 'duplicate' && (
          <div className="rounded-xl bg-[#555] px-4 py-3 text-center text-sm font-bold">
            このQRコードはすでに取得済みです
          </div>
        )}
        {status.type === 'invalid' && (
          <div className="rounded-xl bg-notice px-4 py-3 text-center text-sm font-bold">
            対象外のQRコードです
          </div>
        )}

        <button
          type="button"
          onClick={() => navigate('/rally')}
          className="min-h-[44px] rounded-full border border-white/40 px-6 text-sm font-bold text-white"
        >
          戻る
        </button>

        {import.meta.env.DEV && (
          <div className="mt-4 w-full rounded-xl border border-white/20 p-3">
            <p className="mb-2 text-xs text-white/60">
              デバッグ用（本番非表示）: カメラなしでスタンプを付与
            </p>
            <div className="flex flex-wrap gap-2">
              {CHECKPOINTS.map((cp) => (
                <button
                  key={cp.id}
                  type="button"
                  onClick={() => simulateScan(cp.qrValue)}
                  className="min-h-[44px] rounded-lg bg-white/10 px-3 text-xs text-white"
                >
                  {cp.qrValue}
                </button>
              ))}
            </div>
          </div>
        )}
      </main>
    </PageContainer>
  );
}
