import { useMemo, useState } from 'react';
import { useEvents, useSpots } from '../../api';
import { CATEGORIES } from '../../shared/taxonomy';
import CategoryTabs from './components/CategoryTabs';
import EventListItem from './components/EventListItem';

// イベント一覧のタブには、店舗・催し物のカテゴリだけを出す（スタンプQRは対象外）
const EVENT_CATEGORIES = CATEGORIES.filter((category) => category.id !== 'stamp-qr');

export default function EventsScreen() {
  const { events } = useEvents();
  const { spots, isLoading } = useSpots();
  const [activeCategoryId, setActiveCategoryId] = useState(EVENT_CATEGORIES[0].id);
  const currentEvent = events[0];

  const items = useMemo(
    () => spots.filter((spot) => spot.categoryId === activeCategoryId),
    [spots, activeCategoryId],
  );

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <div className="px-[18px] pb-2 pt-5 text-center">
        <h1 className="text-lg font-extrabold">イベント一覧</h1>
        {currentEvent && <p className="mt-0.5 text-[11px] text-sub">{currentEvent.name}</p>}
      </div>
      <CategoryTabs categories={EVENT_CATEGORIES} activeCategoryId={activeCategoryId} onSelect={setActiveCategoryId} />
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <p className="p-6 text-center text-sm text-sub">読み込み中...</p>
        ) : items.length === 0 ? (
          <p className="p-6 text-center text-sm text-sub">このカテゴリの情報はまだありません</p>
        ) : (
          items.map((spot, index) => <EventListItem key={spot.id} index={index + 1} spot={spot} />)
        )}
      </div>
    </div>
  );
}
