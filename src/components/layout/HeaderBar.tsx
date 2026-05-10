import { memo } from 'react';

function HeaderBarInner() {
  return (
    <header
      className="flex items-center justify-between px-6 py-2"
      style={{
        borderBottom: '2px solid var(--gold-primary)',
        background: 'linear-gradient(180deg, var(--bg-secondary) 0%, var(--bg-primary) 100%)',
      }}
    >
      {/* Left: Title */}
      <div className="flex items-center gap-3">
        <h1
          className="text-lg font-bold tracking-wider"
          style={{ color: 'var(--gold-primary)' }}
        >
          英雄联盟
        </h1>
        <span
          className="text-xs"
          style={{ color: 'var(--text-secondary)' }}
        >
          艾欧尼亚 - 经典模式
        </span>
      </div>

      {/* Right: Window controls placeholder */}
      <div className="flex items-center gap-4">
        <button
          type="button"
          className="cursor-pointer border-none bg-transparent text-xs"
          style={{ color: 'var(--text-secondary)' }}
        >
          ─
        </button>
        <button
          type="button"
          className="cursor-pointer border-none bg-transparent text-xs"
          style={{ color: 'var(--text-secondary)' }}
        >
          □
        </button>
        <button
          type="button"
          className="cursor-pointer border-none bg-transparent text-xs"
          style={{ color: 'var(--text-secondary)' }}
        >
          ✕
        </button>
      </div>
    </header>
  );
}

export const HeaderBar = memo(HeaderBarInner);
