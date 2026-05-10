import { memo } from 'react';
import type { Player } from '../types';
import { PlayerSlot } from './PlayerSlot';

interface TeamPanelProps {
  team: Player[];
  side: 'BLUE' | 'RED';
}

function TeamPanelInner({ team, side }: TeamPanelProps) {
  const isBlue = side === 'BLUE';
  const teamColor = isBlue ? 'var(--blue-team)' : 'var(--red-team)';
  const teamName = isBlue ? '蓝色方' : '红色方';

  return (
    <div
      className="flex flex-col gap-0.5"
      style={{
        flex: 1,
      }}
    >
      {/* Team header */}
      <div
        className="flex items-center gap-2 px-3 py-1.5"
        style={{
          borderBottom: `2px solid ${teamColor}`,
        }}
      >
        <div
          className="h-2 w-2 rounded-full"
          style={{ backgroundColor: teamColor }}
        />
        <span
          className="text-xs font-bold tracking-wide"
          style={{ color: teamColor }}
        >
          {teamName}
        </span>
      </div>

      {/* Player list */}
      <div className="flex flex-col gap-0.5 py-1">
        {team.map(player => (
          <PlayerSlot key={player.id} player={player} />
        ))}
      </div>
    </div>
  );
}

export const TeamPanel = memo(TeamPanelInner);
