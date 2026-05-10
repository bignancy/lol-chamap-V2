/** 英雄信息 */
export interface Champion {
  id: number;
  key: string;
  name: string;
  title: string;
  icon: string;
  splash: string;
  skills: SkillInfo[];
}

/** 技能信息 */
export interface SkillInfo {
  key: 'P' | 'Q' | 'W' | 'E' | 'R';
  name: string;
  description: string;
  icon: string;
}

/** 召唤师技能 */
export interface SummonerSpell {
  id: number;
  name: string;
  icon: string;
}

/** 符文 */
export interface Rune {
  id: number;
  name: string;
  icon: string;
}

/** 玩家 */
export interface Player {
  id: string;
  summonerName: string;
  championId: number | null;
  spells: [SummonerSpell | null, SummonerSpell | null];
  rune: Rune | null;
  isLocked: boolean;
  team: 'BLUE' | 'RED';
  isCurrentUser: boolean;
}

/** 聊天消息（预留） */
export interface ChatMessage {
  id: string;
  sender: string;
  content: string;
  type: 'SYSTEM' | 'USER';
  timestamp: number;
}

/** 房间阶段 */
export type RoomPhase = 'WAITING' | 'PICKING' | 'LOCKED' | 'STARTING';

/** WS 前端发送动作 */
export type WSAction =
  | { type: 'SELECT_CHAMPION'; championId: number }
  | { type: 'LOCK_IN' }
  | { type: 'REROLL' }
  | { type: 'SWAP_BENCH'; championId: number }
  | { type: 'CHAT'; content: string }
  | { type: 'REQUEST_SWAP'; targetPlayerId: string };

/** WS 服务端推送 */
export type WSResponse =
  | { type: 'ROOM_SNAPSHOT'; payload: RoomSnapshot }
  | { type: 'PLAYER_PICK'; playerId: string; championId: number }
  | { type: 'PLAYER_LOCK'; playerId: string }
  | { type: 'POOL_UPDATE'; available: number[]; bench: number[] }
  | { type: 'TICK'; time: number }
  | { type: 'PHASE_CHANGE'; phase: RoomPhase };

/** 房间快照 */
export interface RoomSnapshot {
  roomId: string;
  phase: RoomPhase;
  countdown: number;
  myTeam: Player[];
  enemyTeam: Player[];
  availableChampions: number[];
  benchChampions: number[];
  currentUser: Player;
}
