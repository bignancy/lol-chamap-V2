import type { RoomSnapshot, Player, SummonerSpell, Rune } from '../../features/champ-select/types';
import { getRandomChampionIds } from '../../data/champions-index';

const MOCK_SPELLS: [SummonerSpell, SummonerSpell] = [
  { id: 1, name: '治疗术', icon: 'SummonerHeal' },
  { id: 2, name: '闪现', icon: 'SummonerFlash' },
];

const MOCK_RUNE: Rune = {
  id: 8000, name: '精密', icon: 'perk-images/Styles/7201_Precision.png',
};

function createMockPlayer(
  id: string,
  summonerName: string,
  team: 'BLUE' | 'RED',
  isCurrentUser: boolean,
): Player {
  return {
    id,
    summonerName,
    championId: null,
    spells: [MOCK_SPELLS[0], MOCK_SPELLS[1]],
    rune: MOCK_RUNE,
    isLocked: false,
    team,
    isCurrentUser,
  };
}

export function createMockRoom(): RoomSnapshot {
  const available = getRandomChampionIds(42);
  const bench = getRandomChampionIds(6).filter(id => !available.includes(id));

  return {
    roomId: 'mock-room-001',
    phase: 'PICKING',
    countdown: 60,
    myTeam: [
      createMockPlayer('p1', '当前玩家', 'BLUE', true),
      createMockPlayer('p2', '疾风剑豪本豪', 'BLUE', false),
      createMockPlayer('p3', '叫我大乱斗', 'BLUE', false),
      createMockPlayer('p4', '闪现撞墙选手', 'BLUE', false),
      createMockPlayer('p5', '今晚打老虎', 'BLUE', false),
    ],
    enemyTeam: [
      createMockPlayer('e1', '机械先驱', 'RED', false),
      createMockPlayer('e2', '名字六个字', 'RED', false),
      createMockPlayer('e3', '我是大乱斗', 'RED', false),
      createMockPlayer('e4', '疯狂星期四', 'RED', false),
      createMockPlayer('e5', '玩家名称', 'RED', false),
    ],
    availableChampions: available,
    benchChampions: bench,
    currentUser: createMockPlayer('p1', '当前玩家', 'BLUE', true),
  };
}
