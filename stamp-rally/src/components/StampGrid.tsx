import { CHECKPOINTS } from '../data/checkpoints';

interface StampGridProps {
  collectedIds: number[];
}

export default function StampGrid({ collectedIds }: StampGridProps) {
  return (
    <div className="grid grid-cols-3 justify-items-center gap-4">
      {CHECKPOINTS.map((checkpoint) => {
        const collected = collectedIds.includes(checkpoint.id);
        return (
          <div
            key={checkpoint.id}
            className={`flex h-16 w-16 items-center justify-center rounded-full border-2 text-xl font-bold ${
              collected
                ? 'border-collected bg-[#fff3e0] text-collected'
                : 'border-[#ddd] bg-[#f3f3f3] text-[#ccc]'
            }`}
          >
            {collected ? checkpoint.char : '?'}
          </div>
        );
      })}
    </div>
  );
}
