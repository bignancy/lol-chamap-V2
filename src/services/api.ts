import type { Champion, RoomSnapshot } from '../features/champ-select/types';

export interface IApiService {
  getChampions(): Promise<Champion[]>;
  getRoomSnapshot(roomId: string): Promise<RoomSnapshot>;
}
