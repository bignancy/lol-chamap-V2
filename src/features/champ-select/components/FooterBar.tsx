import { memo } from 'react';
import { useChampSelectStore } from '../store';
import { GoldButton } from '../../../components/ui/GoldButton';

function FooterBarInner() {
  const phase = useChampSelectStore(s => s.phase);
  const selectedChampionId = useChampSelectStore(s => s.selectedChampionId);
  const lockIn = useChampSelectStore(s => s.lockIn);

  const isLocked = phase === 'LOCKED' || phase === 'STARTING';
  const canConfirm = selectedChampionId !== null && !isLocked;
  const buttonText = isLocked ? '确认锁定' : '确认选择';

  return (
    <div
      className="flex items-center justify-between px-4 py-2"
      style={{
        borderTop: '2px solid var(--gold-dark)',
        backgroundColor: 'var(--bg-panel)',
      }}
    >
      {/* Left buttons */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          className="cursor-pointer border-none px-4 py-1.5 text-xs font-medium"
          style={{
            backgroundColor: 'var(--btn-hover)',
            color: 'var(--text-secondary)',
            clipPath:
              'polygon(4px 0, calc(100% - 4px) 0, 100% 4px, 100% calc(100% - 4px), calc(100% - 4px) 100%, 4px 100%, 0 calc(100% - 4px), 0 4px)',
          }}
        >
          菜单
        </button>
        <button
          type="button"
          className="cursor-pointer border-none px-4 py-1.5 text-xs font-medium"
          style={{
            backgroundColor: 'var(--btn-hover)',
            color: 'var(--text-secondary)',
            clipPath:
              'polygon(4px 0, calc(100% - 4px) 0, 100% 4px, 100% calc(100% - 4px), calc(100% - 4px) 100%, 4px 100%, 0 calc(100% - 4px), 0 4px)',
          }}
        >
          交换请求
        </button>
      </div>

      {/* Right confirm button */}
      <GoldButton
        size="md"
        disabled={!canConfirm}
        onClick={lockIn}
      >
        {buttonText}
      </GoldButton>
    </div>
  );
}

export const FooterBar = memo(FooterBarInner);
