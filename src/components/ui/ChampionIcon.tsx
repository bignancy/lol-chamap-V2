import { memo } from 'react';

type IconSize = 'sm' | 'md' | 'lg';

type IconState = 'default' | 'hover' | 'selected' | 'disabled' | 'locked';

interface ChampionIconProps {
  icon: string;
  name?: string;
  size?: IconSize;
  state?: IconState;
  onClick?: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

const SIZE_MAP: Record<IconSize, { px: number; fontSize: string }> = {
  sm: { px: 40, fontSize: '10px' },
  md: { px: 48, fontSize: '11px' },
  lg: { px: 64, fontSize: '12px' },
};

const CLIP_SM = 'polygon(4px 0, calc(100% - 4px) 0, 100% 4px, 100% calc(100% - 4px), calc(100% - 4px) 100%, 4px 100%, 0 calc(100% - 4px), 0 4px)';
const CLIP_MD = 'polygon(6px 0, calc(100% - 6px) 0, 100% 6px, 100% calc(100% - 6px), calc(100% - 6px) 100%, 6px 100%, 0 calc(100% - 6px), 0 6px)';
const CLIP_LG = 'polygon(8px 0, calc(100% - 8px) 0, 100% 8px, 100% calc(100% - 8px), calc(100% - 8px) 100%, 8px 100%, 0 calc(100% - 8px), 0 8px)';

const CLIP_MAP: Record<IconSize, string> = {
  sm: CLIP_SM,
  md: CLIP_MD,
  lg: CLIP_LG,
};

function ChampionIconInner({
  icon,
  name,
  size = 'md',
  state = 'default',
  onClick,
  onMouseEnter,
  onMouseLeave,
}: ChampionIconProps) {
  const { px, fontSize } = SIZE_MAP[size];
  const clipPath = CLIP_MAP[size];

  const borderColor = state === 'selected'
    ? 'var(--gold-primary)'
    : state === 'hover'
      ? 'var(--gold-dark)'
      : 'transparent';

  const showOverlay = state === 'disabled' || state === 'locked';

  const wrapperClass = [
    'relative cursor-pointer select-none champ-icon-glow',
    state === 'selected' ? 'selected-pulse' : '',
  ].filter(Boolean).join(' ');

  return (
    <div
      className={wrapperClass}
      style={{ width: px, height: px }}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {/* Border frame */}
      <div
        className="absolute inset-0 transition-colors duration-150"
        style={{
          clipPath,
          border: `2px solid ${borderColor}`,
        }}
      />

      {/* Icon image */}
      <img
        src={icon}
        alt={name ?? ''}
        className="absolute inset-0 object-cover"
        style={{
          width: px,
          height: px,
          clipPath,
        }}
        draggable={false}
      />

      {/* Overlay for disabled/locked */}
      {showOverlay && (
        <div
          className="absolute inset-0"
          style={{
            clipPath,
            backgroundColor: state === 'locked'
              ? 'rgba(0, 0, 0, 0.3)'
              : 'rgba(0, 0, 0, 0.6)',
          }}
        />
      )}

      {/* Name label */}
      {name && (
        <div
          className="absolute bottom-0 left-0 right-0 truncate text-center leading-none"
          style={{
            fontSize,
            color: state === 'disabled' ? 'var(--text-disabled)' : 'var(--text-primary)',
            textShadow: '0 1px 2px rgba(0,0,0,0.8)',
            padding: '0 2px 2px',
          }}
        >
          {name}
        </div>
      )}
    </div>
  );
}

export const ChampionIcon = memo(ChampionIconInner);
