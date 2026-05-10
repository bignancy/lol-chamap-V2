import type { IApiService } from '../api';
import type { Champion, RoomSnapshot } from '../../features/champ-select/types';
import { CHAMPION_INDEX } from '../../data/champions-index';
import { ddragon } from '../../config/ddragon';
import { createMockRoom } from './mock-room';

function indexToChampion(id: number): Champion | null {
  const info = CHAMPION_INDEX[id];
  if (!info) return null;

  return {
    id,
    key: info.key,
    name: info.name,
    title: info.title,
    icon: ddragon.championIcon(info.key),
    splash: ddragon.championSplash(info.key),
    skills: [
      { key: 'P', name: '被动技能', description: `${info.name}的被动技能描述。`, icon: '' },
      { key: 'Q', name: 'Q技能', description: `${info.name}的Q技能描述。`, icon: ddragon.spellIcon(`${info.key}Q`) },
      { key: 'W', name: 'W技能', description: `${info.name}的W技能描述。`, icon: ddragon.spellIcon(`${info.key}W`) },
      { key: 'E', name: 'E技能', description: `${info.name}的E技能描述。`, icon: ddragon.spellIcon(`${info.key}E`) },
      { key: 'R', name: 'R技能', description: `${info.name}的R技能描述。`, icon: ddragon.spellIcon(`${info.key}R`) },
    ],
  };
}

export function createMockApiService(): IApiService {
  return {
    async getChampions(): Promise<Champion[]> {
      return Object.keys(CHAMPION_INDEX)
        .map(Number)
        .map(indexToChampion)
        .filter((c): c is Champion => c !== null);
    },

    async getRoomSnapshot(_roomId: string): Promise<RoomSnapshot> {
      return createMockRoom();
    },
  };
}
