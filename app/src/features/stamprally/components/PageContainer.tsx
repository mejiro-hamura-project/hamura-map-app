import type { ReactNode } from 'react';
import CornerSprig from './CornerSprig';

interface PageContainerProps {
  children: ReactNode;
  dark?: boolean;
  className?: string;
}

/**
 * スタンプラリー画面の外枠（スタンプラリー専用）。デザインA案：アイボリーの背景のまま、
 * 枠線や影は付けず、操作コンテンツを表示領域の中央・幅90％・高さ90％の範囲に置く
 * （外側の上下左右5％ずつが余白）。入りきらない内容は各画面の本文の中でスクロールする。
 * 幅は最小272px（QR読み取り枠256pxが入る幅）。アドレスバー等で高さが変わっても、
 * 親の高さ（dvh基準）に対する割合なので追従する。セーフエリアは外側の余白に含める。
 * コンテンツ領域の四隅のすぐ外（上下の余白）に、細い線の花・葉の装飾（CornerSprig）を置く。
 * 装飾は領域の外枠（同じ大きさの入れ物）に付けるため、領域の大きさと中の配置は変わらない。
 */
export default function PageContainer({ children, dark = false, className = '' }: PageContainerProps) {
  return (
    <div className={`flex h-full min-h-0 flex-1 items-center justify-center pb-[env(safe-area-inset-bottom)] pt-[env(safe-area-inset-top)] ${dark ? 'bg-black' : 'bg-sr-bg'}`}>
      <div className="relative flex h-[90%] min-h-0 w-[max(90%,272px)] max-w-full self-center">
        <div className={`flex h-full min-h-0 w-full flex-col overflow-hidden ${dark ? 'bg-black' : 'bg-sr-bg'} ${className}`}>
          {children}
        </div>
        {!dark && (
          <>
            <CornerSprig position="top-left" />
            <CornerSprig position="top-right" />
            <CornerSprig position="bottom-left" />
            <CornerSprig position="bottom-right" />
          </>
        )}
      </div>
    </div>
  );
}
