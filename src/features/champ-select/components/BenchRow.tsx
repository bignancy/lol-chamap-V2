import { memo } from 'react';
import { useChampSelectStore } from '../store';
import { ChampionIcon } from '../../../components/ui/ChampionIcon';

function BenchRowInner() {
  const benchChampions = useChampSelectStore(s => s.benchChampions);
  const allChampions = useChampSelectStore(s => s.allChampions);
  const swapFromBench = useChampSelectStore(s => s.swapFromBench);

  const champMap = new Map(allChampions.map(c => [c.id, c]));

  if (benchChampions.length === 0) return null;

  return (
    <div className="flex items-center gap-2 px-3 py-2">
      <span
        className="mr-2 text-xs font-medium whitespace-nowrap"
        style={{ color: 'var(--text-secondary)' }}
      >
        板凳席
      </span>
      <div className="flex gap-1">
        {benchChampions.map(id => {
          const champ = champMap.get(id);
          if (!champ) return null;

          return (
            <ChampionIcon
              key={id}
              icon={champ.icon}
              size="sm"
              state="default"
              onClick={() => swapFromBench(id)}
            />
          );
        })}
      </div>
    </div>
  );
}

export const BenchRow = memo(BenchRowInner);
