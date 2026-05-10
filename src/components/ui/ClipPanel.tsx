import { memo, type ReactNode } from 'react';

interface ClipPanelProps {
  children: ReactNode;
  borderColor?: string;
  backgroundColor?: string;
  className?: string;
}

function ClipPanelInner({
  children,
  borderColor = 'var(--gold-dark)',
  backgroundColor = 'var(--bg-panel)',
  className = '',
}: ClipPanelProps) {
  return (
    <div
      className={`relative ${className}`}
      style={{
        backgroundColor,
        border: `2px solid ${borderColor}`,
        clipPath:
          'polygon(8px 0, calc(100% - 8px) 0, 100% 8px, 100% calc(100% - 8px), calc(100% - 8px) 100%, 8px 100%, 0 calc(100% - 8px), 0 8px)',
      }}
    >
      {children}
    </div>
  );
}

export const ClipPanel = memo(ClipPanelInner);
