import { memo, type ReactNode } from 'react';

interface GoldButtonProps {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const SIZE_MAP = {
  sm: { padding: '6px 16px', fontSize: '12px' },
  md: { padding: '10px 28px', fontSize: '14px' },
  lg: { padding: '14px 40px', fontSize: '16px' },
};

function GoldButtonInner({
  children,
  onClick,
  disabled = false,
  size = 'md',
}: GoldButtonProps) {
  const { padding, fontSize } = SIZE_MAP[size];

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className="btn-press relative cursor-pointer select-none border-none outline-none transition-all duration-150"
      style={{
        padding,
        fontSize,
        fontWeight: 600,
        color: disabled ? 'var(--text-disabled)' : 'var(--bg-primary)',
        background: disabled
          ? 'var(--gold-dark)'
          : 'linear-gradient(180deg, #C8AA6E 0%, #917438 50%, #7A5C2E 100%)',
        clipPath:
          'polygon(8px 0, calc(100% - 8px) 0, 100% 8px, 100% calc(100% - 8px), calc(100% - 8px) 100%, 8px 100%, 0 calc(100% - 8px), 0 8px)',
      }}
      onMouseEnter={(e) => {
        if (!disabled) {
          (e.currentTarget as HTMLElement).style.background =
            'linear-gradient(180deg, #F0E6D2 0%, #C8AA6E 50%, #917438 100%)';
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled) {
          (e.currentTarget as HTMLElement).style.background =
            'linear-gradient(180deg, #C8AA6E 0%, #917438 50%, #7A5C2E 100%)';
        }
      }}
    >
      {children}
    </button>
  );
}

export const GoldButton = memo(GoldButtonInner);
