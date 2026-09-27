import { useEffect, useMemo, useRef, useState } from 'react';
import { useSpots, useTimetable } from '../../../api';
import { useClock } from '../../../shared/context/DevClockContext';
import { getCurrentProgramStatus, getStageStatusText, toMinutes } from '../../../shared/utils/timetable';
import type { StageKey, StageProgram } from '../../../shared/types';
import DevTimeSlider from './DevTimeSlider';

const STAGE_NAMES: Record<StageKey, string> = { main: 'メインステージ', sub: 'サブステージ' };
const DAY_ACTIVE_CLASS = ['bg-brand-blue text-white', 'bg-brand-red text-white'];

// 会場の開催時間に合わせた固定の時間軸（10:00〜16:00）。データの範囲ではなく常にこの幅で表示する。
const TIMELINE_START_MIN = 10 * 60;
const TIMELINE_END_MIN = 16 * 60;
const TICK_STEP_MIN = 30;
const PX_PER_MIN = 2.3;
const MIN_CARD_HEIGHT_PX = 26;

const LANE_COLOR: Record<StageKey, string> = { main: '#5b8dd6', sub: '#e08a2c' };
const NOW_COLOR = '#e0524a';

function minutesToLabel(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h}:${m === 0 ? '00' : String(m).padStart(2, '0')}`;
}

export default function StageTimetable() {
  const { timetable, isLoading: isLoadingTimetable } = useTimetable();
  const { spots, isLoading: isLoadingSpots } = useSpots();
  const { now, devOverrideMinutes, setDevOverrideMinutes } = useClock();
  const [dayIndex, setDayIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const hasAutoScrolled = useRef(false);

  // 「第2会場 メインステージ」のように、地図側のスポットデータから会場番号を引いてラベルに添える
  const stageVenueLabels = useMemo(() => {
    const labels: Record<StageKey, string> = { main: STAGE_NAMES.main, sub: STAGE_NAMES.sub };
    for (const spot of spots) {
      if (spot.stageKey && spot.venueId != null) {
        labels[spot.stageKey] = `第${spot.venueId}会場 ${STAGE_NAMES[spot.stageKey]}`;
      }
    }
    return labels;
  }, [spots]);

  const day = timetable[dayIndex];
  const mainPrograms = day?.stages.main ?? [];
  const subPrograms = day?.stages.sub ?? [];

  const currentMain = getCurrentProgramStatus(mainPrograms, now).current;
  const currentSub = getCurrentProgramStatus(subPrograms, now).current;

  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  const showNowLine = nowMinutes >= TIMELINE_START_MIN && nowMinutes <= TIMELINE_END_MIN;

  useEffect(() => {
    if (hasAutoScrolled.current || !scrollRef.current) return;
    hasAutoScrolled.current = true;
    const target = Math.max(0, (nowMinutes - TIMELINE_START_MIN) * PX_PER_MIN - 160);
    scrollRef.current.scrollTop = target;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isLoadingTimetable || isLoadingSpots) {
    return <p className="p-6 text-center text-sm text-sub">読み込み中...</p>;
  }
  if (!day) {
    return <p className="p-6 text-center text-sm text-sub">タイムテーブルはまだありません</p>;
  }

  const ticks: number[] = [];
  for (let m = TIMELINE_START_MIN; m <= TIMELINE_END_MIN; m += TICK_STEP_MIN) ticks.push(m);
  const totalHeight = (TIMELINE_END_MIN - TIMELINE_START_MIN) * PX_PER_MIN;

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <div className="mx-4 mt-3 flex overflow-hidden rounded-full border border-line">
        {timetable.map((d, i) => (
          <button
            key={d.date}
            type="button"
            onClick={() => setDayIndex(i)}
            className={`flex-1 py-2 text-center text-sm font-bold ${
              i === dayIndex ? DAY_ACTIVE_CLASS[i % DAY_ACTIVE_CLASS.length] : 'bg-card text-ink'
            }`}
          >
            {d.dateLabel}
          </button>
        ))}
      </div>

      <div className="mx-3 mt-2.5 flex gap-2 text-[11px] font-extrabold">
        <div className="flex-1 rounded-lg py-1.5 text-center text-white" style={{ background: LANE_COLOR.main }}>
          {stageVenueLabels.main}
        </div>
        <div className="flex-1 rounded-lg py-1.5 text-center text-white" style={{ background: LANE_COLOR.sub }}>
          {stageVenueLabels.sub}
        </div>
      </div>

      <div className="mt-1.5 flex justify-center gap-6 text-[11px] font-extrabold">
        <span style={{ color: LANE_COLOR.main }}>●メイン：{getStageStatusText(mainPrograms, now)}</span>
        <span style={{ color: LANE_COLOR.sub }}>●サブ：{getStageStatusText(subPrograms, now)}</span>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto overflow-x-hidden px-2">
        <div className="relative mx-2 mt-2" style={{ height: totalHeight }}>
          <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-line" />

          {ticks.map((minutes) => (
            <div
              key={minutes}
              className="absolute left-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center gap-1 bg-bg px-1"
              style={{ top: (minutes - TIMELINE_START_MIN) * PX_PER_MIN }}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-[#cdd3da]" />
              <span className="text-[10px] font-bold text-[#aeb4bc]">{minutesToLabel(minutes)}</span>
            </div>
          ))}

          <Lane stageKey="main" programs={mainPrograms} current={currentMain} side="left" />
          <Lane stageKey="sub" programs={subPrograms} current={currentSub} side="right" />

          {showNowLine && (
            <div
              className="absolute -left-2 -right-2 z-10 h-0.5"
              style={{ top: (nowMinutes - TIMELINE_START_MIN) * PX_PER_MIN, background: NOW_COLOR }}
            >
              <span
                className="absolute left-1/2 -translate-x-1/2 -translate-y-full whitespace-nowrap rounded-full px-1.5 py-0.5 text-[9px] font-extrabold text-white"
                style={{ background: NOW_COLOR }}
              >
                現在 {minutesToLabel(nowMinutes)}
              </span>
            </div>
          )}
        </div>
      </div>

      {import.meta.env.DEV && (
        <DevTimeSlider
          minMinutes={TIMELINE_START_MIN}
          maxMinutes={TIMELINE_END_MIN}
          value={devOverrideMinutes ?? nowMinutes}
          onChange={setDevOverrideMinutes}
        />
      )}
    </div>
  );
}

type LaneProps = {
  stageKey: StageKey;
  programs: StageProgram[];
  current: StageProgram | null;
  side: 'left' | 'right';
};

function Lane({ stageKey, programs, current, side }: LaneProps) {
  const sideStyle = side === 'left' ? { right: 'calc(50% + 4px)' } : { left: 'calc(50% + 4px)' };

  return (
    <div className="absolute inset-y-0" style={{ width: 'calc(50% - 8px)', ...sideStyle }}>
      {programs.map((program) => {
        const isCurrent = program === current;
        const top = (toMinutes(program.start) - TIMELINE_START_MIN) * PX_PER_MIN;
        const height = Math.max((toMinutes(program.end) - toMinutes(program.start)) * PX_PER_MIN - 3, MIN_CARD_HEIGHT_PX);
        return (
          <div
            key={program.start}
            className="absolute inset-x-0 overflow-hidden rounded-lg border bg-card px-1.5 py-1 shadow-sm"
            style={{
              top,
              height,
              borderLeftWidth: 4,
              borderColor: isCurrent ? NOW_COLOR : '#dfe3ea',
              borderLeftColor: isCurrent ? NOW_COLOR : LANE_COLOR[stageKey],
              background: isCurrent ? '#fff5f4' : undefined,
            }}
          >
            {isCurrent && (
              <span
                className="mb-0.5 inline-block rounded-full px-1.5 py-px text-[8.5px] font-extrabold text-white"
                style={{ background: NOW_COLOR }}
              >
                上演中
              </span>
            )}
            <div className="line-clamp-2 text-[11px] font-extrabold leading-tight">{program.title}</div>
            <div className="mt-0.5 text-[9.5px] font-bold text-sub">
              {program.start}〜{program.end}
            </div>
          </div>
        );
      })}
    </div>
  );
}
