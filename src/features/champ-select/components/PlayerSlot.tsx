import { memo } from 'react';
import type { Player } from '../types';
import { useChampSelectStore } from '../store';

interface PlayerSlotProps {
  player: Player;
}

function PlayerSlotInner({ player }: PlayerSlotProps) {
  const allChampions = useChampSelectStore(s => s.allChampions);
  const champMap = new Map(allChampions.map(c => [c.id, c]));
  const champion = player.championId !== null ? champMap.get(player.championId) : null;

  const isBlue = player.team === 'BLUE';
  const highlightColor = isBlue ? 'var(--blue-team)' : 'var(--red-team)';

  return (
    <div
      className="flex items-center gap-3 px-3 py-2 rounded-sm transition-colors duration-150"
      style={{
        backgroundColor: player.isCurrentUser
          ? 'rgba(255,255,255,0.05)'
          : 'transparent',
        borderLeft: player.isCurrentUser
          ? `3px solid ${highlightColor}`
          : '3px solid transparent',
      }}
    >
      {/* Champion portrait */}
      <div
        className="relative shrink-0 overflow-hidden"
        style={{
          width: 48,
          height: 48,
          clipPath:
            'polygon(6px 0, calc(100% - 6px) 0, 100% 6px, 100% calc(100% - 6px), calc(100% - 6px) 100%, 6px 100%, 0 calc(100% - 6px), 0 6px)',
          backgroundColor: 'var(--bg-secondary)',
        }}
      >
        {champion ? (
          <img
            src={champion.icon}
            alt={champion.name}
            className="h-full w-full object-cover"
            draggable={false}
          />
        ) : (
          <div
            className="flex h-full w-full items-center justify-center"
            style={{ color: 'var(--text-disabled)', fontSize: 10 }}
          >
            ?
          </div>
        )}

        {/* Locked overlay */}
        {player.isLocked && (
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
          >
            <span style={{ color: 'var(--gold-primary)', fontSize: 14, fontWeight: 700 }}>
              ✓
            </span>
          </div>
        )}
      </div>

      {/* Player info */}
      <div className="flex flex-col gap-1 min-w-0 flex-1">
        {/* Name */}
        <span
          className="truncate text-sm font-medium leading-tight"
          style={{
            color: player.isCurrentUser ? 'var(--gold-light)' : 'var(--text-primary)',
          }}
        >
          {player.summonerName}
        </span>

        {/* Spells + Rune row */}
        <div className="flex items-center gap-1">
          {/* Summoner spells */}
          {player.spells.map((spell, idx) => (
            <div
              key={idx}
              className="overflow-hidden rounded-sm"
              style={{
                width: 18,
                height: 18,
                backgroundColor: 'var(--bg-secondary)',
                border: '1px solid var(--gold-dark)',
              }}
            >
              {spell && (
                <div
                  className="h-full w-full"
                  style={{
                    backgroundColor: 'var(--bg-secondary)',
                  }}
                  title={spell.name}
                />
              )}
            </div>
          ))}

          {/* Rune */}
          <div
            className="overflow-hidden rounded-sm"
            style={{
              width: 18,
              height: 18,
              backgroundColor: 'var(--bg-secondary)',
              border: '1px solid var(--gold-dark)',
            }}
          >
            {player.rune && (
              <div
                className="h-full w-full"
                style={{ backgroundColor: 'var(--bg-secondary)' }}
                title={player.rune.name}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export const PlayerSlot = memo(PlayerSlotInner);
