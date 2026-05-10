import { memo } from 'react';
import { useChampSelectStore } from '../store';

function CountdownInner() {
  const countdown = useChampSelectStore(s => s.countdown);

  const minutes = Math.floor(countdown / 60);
  const seconds = countdown % 60;
  const formatted = `${minutes}:${seconds.toString().padStart(2, '0')}`;

  return (
    <div className="text-center py-2">
      <span
        className="text-3xl font-bold"
        style={{ color: '#FFFFFF', textShadow: '0 0 10px rgba(255,255,255,0.3)' }}
      >
        {formatted}
      </span>
    </div>
  );
}

export const Countdown = memo(CountdownInner);
