import type { IWebSocketService, MessageHandler } from '../websocket';
import type { WSAction, WSResponse, RoomSnapshot } from '../../features/champ-select/types';
import { getRandomChampionIds } from '../../data/champions-index';

export function createMockWsService(initialSnapshot: RoomSnapshot): IWebSocketService {
  let handlers: MessageHandler[] = [];
  let timer: ReturnType<typeof setInterval> | null = null;
  let remaining = initialSnapshot.countdown;
  let currentSnapshot = { ...initialSnapshot };

  function emit(response: WSResponse): void {
    handlers.forEach(handler => handler(response));
  }

  return {
    async connect(_roomId: string): Promise<void> {
      // 模拟连接延迟后推送初始快照
      setTimeout(() => {
        emit({ type: 'ROOM_SNAPSHOT', payload: currentSnapshot });
      }, 100);

      // 模拟后端每秒广播倒计时
      timer = setInterval(() => {
        remaining -= 1;
        if (remaining <= 0) {
          emit({ type: 'PHASE_CHANGE', phase: 'LOCKED' });
          if (timer) clearInterval(timer);
          return;
        }
        emit({ type: 'TICK', time: remaining });
      }, 1000);
    },

    disconnect(): void {
      if (timer) clearInterval(timer);
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

        case 'SWAP_BENCH':
          emit({
            type: 'POOL_UPDATE',
            available: currentSnapshot.availableChampions,
            bench: currentSnapshot.benchChampions,
          });
          break;
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
