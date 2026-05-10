import { memo } from 'react';
import { useChampSelectStore } from '../store';
import { ChampionIcon } from '../../../components/ui/ChampionIcon';

function ChampionPoolInner() {
  const availableChampions = useChampSelectStore(s => s.availableChampions);
  const allChampions = useChampSelectStore(s => s.allChampions);
  const selectedChampionId = useChampSelectStore(s => s.selectedChampionId);
  const hoveredChampionId = useChampSelectStore(s => s.hoveredChampionId);
  const selectChampion = useChampSelectStore(s => s.selectChampion);
  const setHoveredChampion = useChampSelectStore(s => s.setHoveredChampion);

  // Build a lookup map
  const champMap = new Map(allChampions.map(c => [c.id, c]));

  return (
    <div
      className="flex flex-wrap gap-1 p-3"
      style={{
        backgroundColor: 'var(--bg-panel)',
        border: '2px solid var(--gold-dark)',
        clipPath:
          'polygon(8px 0, calc(100% - 8px) 0, 100% 8px, 100% calc(100% - 8px), calc(100% - 8px) 100%, 8px 100%, 0 calc(100% - 8px), 0 8px)',
      }}
    >
      {availableChampions.map(id => {
        const champ = champMap.get(id);
        if (!champ) return null;

        let state: 'default' | 'hover' | 'selected' = 'default';
        if (selectedChampionId === id) state = 'selected';
        else if (hoveredChampionId === id) state = 'hover';

        return (
          <ChampionIcon
            key={id}
            icon={champ.icon}
            name={champ.name}
            size="md"
            state={state}
            onClick={() => selectChampion(id)}
            onMouseEnter={() => setHoveredChampion(id)}
            onMouseLeave={() => setHoveredChampion(null)}
          />
        );
      })}
    </div>
  );
}

export const ChampionPool = memo(ChampionPoolInner);
