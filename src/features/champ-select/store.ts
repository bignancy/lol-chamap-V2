import { create } from 'zustand';
import type {
  Champion,
  Player,
  RoomPhase,
  ChatMessage,
  WSResponse,
  RoomSnapshot,
} from './types';
import type { IWebSocketService } from '../../services/websocket';

interface ChampSelectState {
  // 房间基础
  roomId: string;
  phase: RoomPhase;
  countdown: number;

  // 玩家
  myTeam: Player[];
  enemyTeam: Player[];
  currentUser: Player | null;

  // 英雄池
  availableChampions: number[];
  benchChampions: number[];
  allChampions: Champion[];
  selectedChampionId: number | null;

  // 聊天（预留）
  messages: ChatMessage[];

  // UI 状态
  hoveredChampionId: number | null;
  detailChampionId: number | null;

  // WS 引用
  wsService: IWebSocketService | null;

  // Actions
  initWs: (ws: IWebSocketService, roomId: string) => void;
  setAllChampions: (champions: Champion[]) => void;
  setCountdown: (time: number) => void;
  setPhase: (phase: RoomPhase) => void;
  selectChampion: (id: number) => void;
  setHoveredChampion: (id: number | null) => void;
  setDetailChampion: (id: number | null) => void;
  updatePlayerPick: (playerId: string, championId: number) => void;
  lockIn: () => void;
  reroll: () => void;
  swapFromBench: (championId: number) => void;
  addChatMessage: (msg: ChatMessage) => void;
  handleWsResponse: (response: WSResponse) => void;
  dispose: () => void;
}

export const useChampSelectStore = create<ChampSelectState>((set, get) => ({
  // 初始状态
  roomId: '',
  phase: 'WAITING',
  countdown: 60,
  myTeam: [],
  enemyTeam: [],
  currentUser: null,
  availableChampions: [],
  benchChampions: [],
  allChampions: [],
  selectedChampionId: null,
  messages: [],
  hoveredChampionId: null,
  detailChampionId: null,
  wsService: null,

  // 初始化 WS 连接
  initWs: (ws, roomId) => {
    const prev = get().wsService;
    if (prev) prev.disconnect();

    set({ wsService: ws, roomId });

    ws.subscribe((response) => {
      get().handleWsResponse(response);
    });

    ws.connect(roomId);
  },

  setAllChampions: (champions) => set({ allChampions: champions }),

  setCountdown: (time) => set({ countdown: time }),

  setPhase: (phase) => set({ phase }),

  selectChampion: (id) => {
    const { wsService, currentUser } = get();
    set({ selectedChampionId: id, detailChampionId: id });
    if (wsService && currentUser) {
      wsService.send({ type: 'SELECT_CHAMPION', championId: id });
    }
  },

  setHoveredChampion: (id) => set({ hoveredChampionId: id }),

  setDetailChampion: (id) => set({ detailChampionId: id }),

  updatePlayerPick: (playerId, championId) => {
    const updateTeam = (team: Player[]): Player[] =>
      team.map(p => (p.id === playerId ? { ...p, championId } : p));

    set(state => ({
      myTeam: updateTeam(state.myTeam),
      enemyTeam: updateTeam(state.enemyTeam),
    }));
  },

  lockIn: () => {
    const { wsService, currentUser } = get();
    if (wsService && currentUser) {
      wsService.send({ type: 'LOCK_IN' });
    }
  },

  reroll: () => {
    const { wsService } = get();
    if (wsService) {
      wsService.send({ type: 'REROLL' });
    }
  },

  swapFromBench: (championId) => {
    const { wsService } = get();
    if (wsService) {
      wsService.send({ type: 'SWAP_BENCH', championId });
    }
  },

  addChatMessage: (msg) => {
    set(state => ({ messages: [...state.messages, msg] }));
  },

  // 统一处理 WS 服务端推送
  handleWsResponse: (response) => {
    switch (response.type) {
      case 'ROOM_SNAPSHOT': {
        const snap: RoomSnapshot = response.payload;
        set({
          roomId: snap.roomId,
          phase: snap.phase,
          countdown: snap.countdown,
          myTeam: snap.myTeam,
          enemyTeam: snap.enemyTeam,
          availableChampions: snap.availableChampions,
          benchChampions: snap.benchChampions,
          currentUser: snap.currentUser,
        });
        break;
      }
      case 'TICK':
        set({ countdown: response.time });
        break;
      case 'PHASE_CHANGE':
        set({ phase: response.phase });
        break;
      case 'PLAYER_PICK':
        get().updatePlayerPick(response.playerId, response.championId);
        break;
      case 'PLAYER_LOCK': {
        const lockPlayer = (team: Player[]): Player[] =>
          team.map(p => (p.id === response.playerId ? { ...p, isLocked: true } : p));
        set(state => ({
          myTeam: lockPlayer(state.myTeam),
          enemyTeam: lockPlayer(state.enemyTeam),
        }));
        break;
      }
      case 'POOL_UPDATE':
        set({
          availableChampions: response.available,
          benchChampions: response.bench,
        });
        break;
    }
  },

  dispose: () => {
    const { wsService } = get();
    if (wsService) wsService.disconnect();
    set({ wsService: null });
  },
}));
