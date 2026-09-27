import PlaceholderScreen from '../../shared/ui/PlaceholderScreen';
import { externalUrl } from '../../shared/utils/externalUrl';

export default function StampRallyScreen() {
  const stampRallyUrl = externalUrl(import.meta.env.VITE_STAMP_RALLY_URL);

  if (!stampRallyUrl) {
    return (
      <PlaceholderScreen
        title="スタンプラリー"
        description="スタンプラリーへのリンクを準備中です。"
        note="VITE_STAMP_RALLY_URL が未設定、または有効なURLではありません。"
      />
    );
  }

  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
      <h1 className="text-lg font-bold">スタンプラリー</h1>
      <a href={stampRallyUrl} className="rounded-full bg-brand-blue px-6 py-3 text-sm font-bold text-white">
        スタンプラリーを開く
      </a>
    </main>
  );
}
