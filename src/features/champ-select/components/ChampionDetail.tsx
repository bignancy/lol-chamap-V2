import { memo, useState, useEffect } from 'react';
import { useChampSelectStore } from '../store';
import type { SkillInfo } from '../types';

const SKILL_KEYS: Array<'P' | 'Q' | 'W' | 'E' | 'R'> = ['P', 'Q', 'W', 'E', 'R'];

function ChampionDetailInner() {
  const detailChampionId = useChampSelectStore(s => s.detailChampionId);
  const allChampions = useChampSelectStore(s => s.allChampions);
  const [activeSkillKey, setActiveSkillKey] = useState<'P' | 'Q' | 'W' | 'E' | 'R'>('Q');

  // Reset to Q skill when champion changes
  useEffect(() => {
    setActiveSkillKey('Q');
  }, [detailChampionId]);

  const champMap = new Map(allChampions.map(c => [c.id, c]));
  const champion = detailChampionId !== null ? champMap.get(detailChampionId) : null;

  if (!champion) {
    return (
      <div
        className="flex h-full items-center justify-center"
        style={{
          backgroundColor: 'var(--bg-panel)',
          border: '2px solid var(--gold-dark)',
          clipPath:
            'polygon(8px 0, calc(100% - 8px) 0, 100% 8px, 100% calc(100% - 8px), calc(100% - 8px) 100%, 8px 100%, 0 calc(100% - 8px), 0 8px)',
        }}
      >
        <span style={{ color: 'var(--text-disabled)', fontSize: 14 }}>
          点击英雄查看详情
        </span>
      </div>
    );
  }

  const activeSkill: SkillInfo | undefined = champion.skills.find(
    s => s.key === activeSkillKey
  );

  return (
    <div
      className="fade-in flex h-full flex-col overflow-hidden"
      style={{
        backgroundColor: 'var(--bg-panel)',
        border: '2px solid var(--gold-dark)',
        clipPath:
          'polygon(8px 0, calc(100% - 8px) 0, 100% 8px, 100% calc(100% - 8px), calc(100% - 8px) 100%, 8px 100%, 0 calc(100% - 8px), 0 8px)',
      }}
    >
      {/* Splash art */}
      <div
        className="relative w-full overflow-hidden"
        style={{ height: '45%' }}
      >
        <img
          src={champion.splash}
          alt={champion.name}
          className="h-full w-full object-cover"
          draggable={false}
        />
        {/* Gradient fade at bottom */}
        <div
          className="absolute bottom-0 left-0 right-0"
          style={{
            height: '40%',
            background: 'linear-gradient(transparent, var(--bg-panel))',
          }}
        />
      </div>

      {/* Name + Title */}
      <div className="px-4 pb-2">
        <h2
          className="text-2xl font-bold"
          style={{ color: 'var(--gold-primary)' }}
        >
          {champion.name}
        </h2>
        <p
          className="text-sm"
          style={{ color: 'var(--text-secondary)' }}
        >
          {champion.title}
        </p>
      </div>

      {/* Skill icons row */}
      <div className="flex items-center gap-2 px-4 py-2">
        {SKILL_KEYS.map(key => {
          const skill = champion.skills.find(s => s.key === key);
          const isActive = key === activeSkillKey;

          return (
            <button
              key={key}
              type="button"
              className="relative flex cursor-pointer flex-col items-center gap-0.5 border-none bg-transparent p-0"
              onClick={() => setActiveSkillKey(key)}
            >
              <div
                className={`flex items-center justify-center overflow-hidden ${isActive ? 'skill-active' : ''}`}
                style={{
                  width: 36,
                  height: 36,
                  clipPath:
                    'polygon(4px 0, calc(100% - 4px) 0, 100% 4px, 100% calc(100% - 4px), calc(100% - 4px) 100%, 4px 100%, 0 calc(100% - 4px), 0 4px)',
                  border: `2px solid ${isActive ? 'var(--gold-primary)' : 'var(--gold-dark)'}`,
                  backgroundColor: 'var(--bg-secondary)',
                }}
              >
                {skill && skill.icon ? (
                  <img
                    src={skill.icon}
                    alt={skill.name}
                    className="h-full w-full object-cover"
                    draggable={false}
                  />
                ) : (
                  <span
                    className="text-xs font-bold"
                    style={{ color: isActive ? 'var(--gold-primary)' : 'var(--text-secondary)' }}
                  >
                    {key}
                  </span>
                )}
              </div>
              <span
                className="text-[10px] font-bold"
                style={{ color: isActive ? 'var(--gold-primary)' : 'var(--text-secondary)' }}
              >
                {key}
              </span>
            </button>
          );
        })}
      </div>

      {/* Separator */}
      <div
        className="mx-4"
        style={{ height: 1, backgroundColor: 'var(--gold-dark)' }}
      />

      {/* Skill description */}
      <div className="flex-1 overflow-y-auto px-4 py-3">
        {activeSkill && (
          <>
            <h3
              className="mb-1 text-sm font-bold"
              style={{ color: 'var(--gold-primary)' }}
            >
              {activeSkill.name}
            </h3>
            <p
              className="text-xs leading-relaxed"
              style={{ color: 'var(--text-secondary)' }}
            >
              {activeSkill.description}
            </p>
          </>
        )}
      </div>
    </div>
  );
}

export const ChampionDetail = memo(ChampionDetailInner);
