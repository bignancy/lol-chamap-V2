import { memo } from 'react';
import { useChampSelectStore } from '../store';
import { GoldButton } from '../../../components/ui/GoldButton';

function RerollBarInner() {
  const reroll = useChampSelectStore(s => s.reroll);

  return (
    <div className="flex items-center justify-between px-3 py-2">
      {/* Reroll button */}
      <div className="flex items-center gap-3">
        <GoldButton size="sm" onClick={reroll}>
          掷骰子 REROLL
        </GoldButton>
        <span
          className="text-xs"
          style={{ color: 'var(--text-secondary)' }}
        >
          消耗 250 蓝色精粹
        </span>
      </div>

      {/* Essence + Reroll count */}
      <div className="flex items-center gap-3">
        <span
          className="text-xs"
          style={{ color: 'var(--text-secondary)' }}
        >
          253 蓝色精萃
        </span>
        <span
          className="text-xs font-medium"
          style={{ color: 'var(--gold-primary)' }}
        >
          2/2
        </span>
      </div>
    </div>
  );
}

export const RerollBar = memo(RerollBarInner);
