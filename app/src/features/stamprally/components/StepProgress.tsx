import { useI18n } from '../i18n/useI18n';
import { formatStepInstruction, type FlowStepNumber, type StepStatus } from '../howtoSteps';

interface StepProgressProps {
  /** 今の画面の手順番号。null＝手順より前の画面（全体の流れとして表示し、操作指示は出さない） */
  current: FlowStepNumber | null;
  /** 各手順の状態（howtoSteps.ts の getStepStatuses で求めたもの） */
  statuses: StepStatus[];
  dark?: boolean;
}

/**
 * 画面上部の進捗バー（番号の丸・つなぐ線）と、その直下の操作指示。
 * 横スクロールなしで1行に収めるため、手順名と「いまここ」は今の手順にだけ付ける
 * （今の手順が無い画面では、全体の流れとして全手順の名前を出す）。
 * 完了＝✓、未着手＝番号（灰色）、今の手順＝赤い丸と輪で区別する。
 */
export default function StepProgress({ current, statuses, dark = false }: StepProgressProps) {
  const { m } = useI18n();
  const allDone = statuses.every((s) => s === 'done');
  const instruction = current !== null ? (m.flow.steps[current - 1]?.instruction ?? '') : '';
  const statusLabel: Record<StepStatus, string> = {
    done: m.flow.statusDone,
    current: m.flow.statusCurrent,
    todo: m.flow.statusTodo,
  };
  // 手順 i と i+1 をつなぐ線：完了済みの範囲だけ完了色、それ以外は灰色。
  const lineDone = (i: number) => statuses[i] === 'done' && statuses[i + 1] !== 'todo';
  // 端の手順では、上下のラベルが画面の外へはみ出さないよう寄せる。
  const edgeAlign = (i: number) =>
    i === 0 ? 'left-0' : i === statuses.length - 1 ? 'right-0' : 'left-1/2 -translate-x-1/2';
  const overview = current === null;

  return (
    <div className="@container w-full text-left font-normal">
      <ol aria-label={m.flow.progressLabel} className="flex px-3">
        {statuses.map((status, i) => {
          const step = i + 1;
          const short = m.flow.steps[i]?.short ?? '';
          const isCurrent = status === 'current';
          return (
            <li
              key={step}
              aria-current={isCurrent ? 'step' : undefined}
              aria-label={`${step} ${short}：${statusLabel[status]}`}
              className="relative flex min-w-0 flex-1 flex-col items-center"
            >
              {/* 今の手順の上だけに「いまここ」（高さの低い画面・今の手順が無い画面では省く） */}
              {!overview && (
                <span className="relative h-6 w-full [@media(max-height:480px)]:hidden" aria-hidden="true">
                  {isCurrent && (
                    <span
                      className={`absolute top-0 whitespace-nowrap rounded-full bg-stamprally-step-current px-2 py-px text-xs leading-5 font-extrabold text-white ${edgeAlign(i)}`}
                    >
                      {m.flow.here}
                    </span>
                  )}
                </span>
              )}
              <span className="relative flex h-9 w-full items-center justify-center [@media(max-height:480px)]:h-8" aria-hidden="true">
                {i > 0 && (
                  <span
                    className={`absolute left-0 right-1/2 top-1/2 h-[2px] -translate-y-1/2 ${
                      lineDone(i - 1) ? 'bg-stamprally-step-done' : 'bg-stamprally-step-line'
                    }`}
                  />
                )}
                {i < statuses.length - 1 && (
                  <span
                    className={`absolute left-1/2 right-0 top-1/2 h-[2px] -translate-y-1/2 ${
                      lineDone(i) ? 'bg-stamprally-step-done' : 'bg-stamprally-step-line'
                    }`}
                  />
                )}
                <span
                  className={`relative flex shrink-0 items-center justify-center rounded-full font-extrabold ${
                    isCurrent
                      ? 'h-8 w-8 bg-stamprally-step-current text-[1rem] text-white ring-4 ring-stamprally-step-current-soft'
                      : status === 'done'
                        ? 'h-7 w-7 bg-stamprally-step-done text-[0.875rem] text-white'
                        : 'h-7 w-7 border border-stamprally-step-line bg-stamprally-step-todo text-[0.875rem] font-bold text-stamprally-step-todo-ink'
                  }`}
                >
                  {status === 'done' ? '✓' : step}
                </span>
              </span>
              {/* 手順名：今の手順の下だけ（全体の流れの表示では全手順） */}
              <span className="relative h-5 w-full" aria-hidden="true">
                {(isCurrent || overview) && (
                  <span
                    className={`absolute top-0 whitespace-nowrap font-extrabold leading-5 ${
                      overview ? 'text-[0.8125rem]' : 'text-xs'
                    } ${
                      isCurrent ? (dark ? 'text-[#f4a3a9]' : 'text-stamprally-step-current') : dark ? 'text-white/85' : 'text-sr-ink'
                    } ${overview ? 'left-1/2 -translate-x-1/2' : edgeAlign(i)}`}
                  >
                    {short}
                  </span>
                )}
              </span>
            </li>
          );
        })}
      </ol>

      {/* 進捗バー直下の操作指示（遊び方画面の各見出しと同じ文言・番号）。A案に合わせ、中央寄せの見出しで表示する。 */}
      {!overview && current !== null && (
        <p
          className={`mx-4 mt-1.5 px-2 py-1 text-center text-[clamp(1rem,calc((100cqw-40px)/15),1.125rem)] leading-snug text-balance font-extrabold [@media(max-height:480px)]:mt-0.5 [@media(max-height:480px)]:py-0.5 [@media(max-height:480px)]:text-[1rem] ${
            dark ? 'text-white' : allDone ? 'text-sr-green-strong' : 'text-sr-ink'
          }`}
        >
          {formatStepInstruction(current, instruction)}
          {allDone && (
            <span className={`ml-2 whitespace-nowrap ${dark ? 'text-[#8fd3bd]' : 'text-stamprally-step-done'}`}>
              ✓ {m.flow.statusDone}
            </span>
          )}
        </p>
      )}
    </div>
  );
}
