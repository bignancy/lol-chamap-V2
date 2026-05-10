import { memo } from 'react';
import { useChampSelectStore } from '../store';

function CountdownInner() {
  const countdown = useChampSelectStore(s => s.countdown);
  const phase = useChampSelectStore(s => s.phase);

  const minutes = Math.floor(countdown / 60);
  const seconds = countdown % 60;
  const formatted = `${minutes}:${seconds.toString().padStart(2, '0')}`;

  const isLow = countdown <= 10 && phase === 'PICKING';

  return (
    <div className="py-1 text-center">
      <span
        className={`text-3xl font-bold ${isLow ? 'countdown-low' : ''}`}
        style={{
          color: isLow ? undefined : '#FFFFFF',
          textShadow: isLow ? undefined : '0 0 10px rgba(255,255,255,0.3)',
        }}
      >
        {formatted}
      </span>
      {phase === 'LOCKED' && (
        <span
          className="ml-3 text-sm font-bold"
          style={{ color: 'var(--gold-primary)' }}
        >
          已锁定
        </span>
      )}
    </div>
  );
}

export const Countdown = memo(CountdownInner);
