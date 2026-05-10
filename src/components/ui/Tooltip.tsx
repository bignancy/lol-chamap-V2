import { memo, type ReactNode } from 'react';

interface TooltipProps {
  content: string;
  children: ReactNode;
}

function TooltipInner({ content, children }: TooltipProps) {
  return (
    <div className="group relative inline-block">
      {children}
      <div
        className="pointer-events-none absolute bottom-full left-1/2 z-50 mb-2 -translate-x-1/2 opacity-0 transition-opacity duration-150 group-hover:opacity-100"
      >
        <div
          className="whitespace-nowrap rounded px-3 py-1.5 text-xs"
          style={{
            backgroundColor: 'var(--bg-secondary)',
            border: '1px solid var(--gold-dark)',
            color: 'var(--text-primary)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
          }}
        >
          {content}
        </div>
      </div>
    </div>
  );
}

export const Tooltip = memo(TooltipInner);
