import type { IWebSocketService, MessageHandler } from '../websocket';
import type { WSAction, WSResponse, RoomSnapshot } from '../../features/champ-select/types';
import { getRandomChampionIds } from '../../data/champions-index';

export function createMockWsService(initialSnapshot: RoomSnapshot): IWebSocketService {
  let handlers: MessageHandler[] = [];
  let timer: ReturnType<typeof setInterval> | null = null;
  let enemyPickTimer: ReturnType<typeof setInterval> | null = null;
  let remaining = initialSnapshot.countdown;
  let currentSnapshot = { ...initialSnapshot };

  function emit(response: WSResponse): void {
    handlers.forEach(handler => handler(response));
  }

  return {
    async connect(_roomId: string): Promise<void> {
      // Push initial snapshot after short delay
      setTimeout(() => {
        emit({ type: 'ROOM_SNAPSHOT', payload: currentSnapshot });
      }, 100);

      // Backend ticks countdown every second
      timer = setInterval(() => {
        remaining -= 1;
        if (remaining <= 0) {
          emit({ type: 'PHASE_CHANGE', phase: 'LOCKED' });
          if (timer) clearInterval(timer);
          if (enemyPickTimer) clearInterval(enemyPickTimer);
          return;
        }
        emit({ type: 'TICK', time: remaining });
      }, 1000);

      // Simulate enemy picks every 5 seconds
      let enemyIdx = 0;
      enemyPickTimer = setInterval(() => {
        if (enemyIdx >= currentSnapshot.enemyTeam.length) {
          if (enemyPickTimer) clearInterval(enemyPickTimer);
          return;
        }
        const enemy = currentSnapshot.enemyTeam[enemyIdx];
        const randomChamp = currentSnapshot.availableChampions[
          Math.floor(Math.random() * currentSnapshot.availableChampions.length)
        ];
        if (randomChamp !== undefined) {
          emit({ type: 'PLAYER_PICK', playerId: enemy.id, championId: randomChamp });
        }
        enemyIdx++;
      }, 5000);
    },

    disconnect(): void {
      if (timer) clearInterval(timer);
      if (enemyPickTimer) clearInterval(enemyPickTimer);
      handlers = [];
    },

    send(action: WSAction): void {
      switch (action.type) {
        case 'SELECT_CHAMPION':
          emit({
            type: 'PLAYER_PICK',
            playerId: currentSnapshot.currentUser.id,
            championId: action.championId,
          });
          break;

        case 'LOCK_IN':
          emit({
            type: 'PLAYER_LOCK',
            playerId: currentSnapshot.currentUser.id,
          });
          break;

        case 'REROLL': {
          const newAvailable = getRandomChampionIds(42);
          const newBench = [...currentSnapshot.benchChampions, ...getRandomChampionIds(2)];
          currentSnapshot = {
            ...currentSnapshot,
            availableChampions: newAvailable,
            benchChampions: newBench,
          };
          emit({
            type: 'POOL_UPDATE',
            available: newAvailable,
            bench: newBench,
          });
          break;
        }

        case 'SWAP_BENCH': {
          const newAvailable = getRandomChampionIds(42);
          const newBench = [...currentSnapshot.benchChampions];
          currentSnapshot = {
            ...currentSnapshot,
            availableChampions: newAvailable,
            benchChampions: newBench,
          };
          emit({
            type: 'POOL_UPDATE',
            available: newAvailable,
            bench: newBench,
          });
          break;
        }
      }
    },

    subscribe(handler: MessageHandler): () => void {
      handlers.push(handler);
      return () => {
        handlers = handlers.filter(h => h !== handler);
      };
    },
  };
}
