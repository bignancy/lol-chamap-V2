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
      className="flex items-center justify-between px-4 py-2.5"
      style={{
        borderTop: '2px solid var(--gold-dark)',
        backgroundColor: 'var(--bg-panel)',
      }}
    >
      {/* Left buttons */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          className="btn-press cursor-pointer border-none px-5 py-2 text-xs font-medium transition-colors duration-150"
          style={{
            backgroundColor: 'var(--btn-hover)',
            color: 'var(--text-secondary)',
            clipPath:
              'polygon(4px 0, calc(100% - 4px) 0, 100% 4px, 100% calc(100% - 4px), calc(100% - 4px) 100%, 4px 100%, 0 calc(100% - 4px), 0 4px)',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.color = 'var(--text-primary)';
            (e.currentTarget as HTMLElement).style.backgroundColor = '#2a3038';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)';
            (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--btn-hover)';
          }}
        >
          菜单
        </button>
        <button
          type="button"
          className="btn-press cursor-pointer border-none px-5 py-2 text-xs font-medium transition-colors duration-150"
          style={{
            backgroundColor: 'var(--btn-hover)',
            color: 'var(--text-secondary)',
            clipPath:
              'polygon(4px 0, calc(100% - 4px) 0, 100% 4px, 100% calc(100% - 4px), calc(100% - 4px) 100%, 4px 100%, 0 calc(100% - 4px), 0 4px)',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.color = 'var(--text-primary)';
            (e.currentTarget as HTMLElement).style.backgroundColor = '#2a3038';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)';
            (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--btn-hover)';
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
