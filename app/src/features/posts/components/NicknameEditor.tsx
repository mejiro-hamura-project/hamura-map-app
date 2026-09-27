import { useState } from 'react';

type NicknameEditorProps = {
  nickname: string;
  onChange: (nickname: string) => void;
};

/**
 * 投稿で使うニックネームの表示・変更をする、小さい共通部品。
 * フィード画面・投稿作成画面の両方で使い回す（表示ロジックの二重実装を避けるため）。
 */
export default function NicknameEditor({ nickname, onChange }: NicknameEditorProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(nickname);

  function startEditing() {
    setDraft(nickname);
    setIsEditing(true);
  }

  function handleSave() {
    onChange(draft);
    setIsEditing(false);
  }

  if (isEditing) {
    return (
      <div className="flex items-center gap-2">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="ニックネームを入力（空なら匿名）"
          className="min-w-0 flex-1 rounded-lg border border-line bg-card px-2.5 py-1.5 text-xs outline-none"
          autoFocus
        />
        <button type="button" onClick={handleSave} className="text-xs font-bold text-brand-blue">
          保存
        </button>
        <button type="button" onClick={() => setIsEditing(false)} className="text-xs font-bold text-sub">
          キャンセル
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1.5 text-xs">
      <span className="text-sub">投稿名：</span>
      <span className="font-bold">{nickname || '匿名'}</span>
      <button type="button" onClick={startEditing} className="font-bold text-brand-blue">
        変更
      </button>
    </div>
  );
}
