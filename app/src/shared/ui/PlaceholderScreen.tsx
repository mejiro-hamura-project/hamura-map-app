type PlaceholderScreenProps = {
  title: string;
  description: string;
  note?: string;
};

/**
 * まだ中身を作っていない画面用の仮表示。
 * 各マイルストーンで本物の画面に差し替えていく。
 */
export default function PlaceholderScreen({ title, description, note }: PlaceholderScreenProps) {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
      <h1 className="text-lg font-bold">{title}</h1>
      <p className="text-sm text-sub">{description}</p>
      {note && (
        <p className="mt-4 rounded-xl bg-brand-blue-soft px-4 py-3 text-xs text-ink/70">{note}</p>
      )}
    </main>
  );
}
