# LOL 大乱斗选英雄页面 - 完整开发方案

## 一、项目概述

### 1.1 目标

一比一还原英雄联盟大乱斗模式的选英雄界面（不含聊天区域）。

### 1.2 技术栈

| 类别 | 技术 | 版本要求 |
|------|------|----------|
| 构建工具 | Vite | 5.x |
| 框架 | React | 18+ |
| 语言 | TypeScript | 5.x（严格模式，禁止 `any`） |
| 样式 | Tailwind CSS + CSS Modules | 3.x |
| 状态管理 | Zustand | 4.x |
| 预留通信 | SockJS + @stomp/stompjs | — |

### 1.3 排除项

- 聊天区域（截图中红色框选部分）完全移除

### 1.4 核心原则

1. **前端可独立运行** — 不依赖后端即可完整测试所有交互
2. **后期无缝接入 SpringBoot** — 通过服务层抽象，切换 Mock/Real 模式只需改环境变量
3. **英雄数据使用 Riot Data Dragon CDN** — 不自己造图，直接引用官方资源

---

## 二、UI 界面分区详解

基于截图分析，页面从上到下划分为以下区域：

```
┌──────────────────────────────────────────────────────────┐
│  Header: 英雄联盟 ｜ 艾欧尼亚 - 经典模式          ─ □ ✕ │
├──────────────────────────────────────────────────────────┤
│                     倒计时 0:23                           │
│  ┌─ 可选英雄池（网格排列 ~48x48 头像）─────────────────┐  │
│  │ [奥恩][艾尼维亚][阿兹尔][凯特琳][科加斯][德莱文]... │  │
│  │ [菲兹][迦娜][杰斯][卡莎][卡特琳娜][凯隐][拉克丝]... │  │
│  │ [墨菲特][娜美][妮蔻][努努][奥莉安娜][芮尔]...      │  │
│  └──────────────────────────────────────────────────────┘  │
│  ┌─ 板凳席 ────────────────────────────────────────────┐  │
│  │ [小图标][小图标][小图标]...                          │  │
│  └──────────────────────────────────────────────────────┘  │
│  掷骰子 REROLL  消耗 250 蓝色精粹        253 蓝色精萃 2/2 │
├──────────────────────┬───────────────────────────────────┤
│    蓝色方 Team 1     │         红色方 Team 2             │
│  ┌────────────────┐  │  ┌────────────────┐               │
│  │ [头像] 玩家名   │  │  │ [头像] 玩家名   │               │
│  │ [头像] 玩家名   │  │  │ [头像] 玩家名   │               │
│  │ [头像] 玩家名   │  │  │ [头像] 玩家名   │               │
│  │ [头像] 玩家名   │  │  │ [头像] 玩家名   │               │
│  │ [头像] 玩家名   │  │  │ [头像] 玩家名   │               │
│  └────────────────┘  │  └────────────────┘               │
├──────────────────────┴───────────────────────────────────┤
│  英雄详情面板（点击英雄后右侧展示）                        │
│  ┌──────────┐  卡牌大师 崔斯特                            │
│  │          │  [P][Q][W][E][R] 技能图标行                 │
│  │  英雄    │  ──────────────────────                     │
│  │  立绘    │  技能名称                                   │
│  │          │  技能描述文本内容...                         │
│  └──────────┘                                             │
├──────────────────────────────────────────────────────────┤
│  [菜单]  [交换请求]                      [确认选择/确认锁定] │
└──────────────────────────────────────────────────────────┘
```

---

## 三、设计规范（Design Tokens）

### 3.1 色彩系统

```css
/* 全局背景 */
--bg-primary:       #0A1628;    /* 深海军蓝 - 页面主背景 */
--bg-secondary:     #0E2042;    /* 稍亮蓝 - 面板背景 */
--bg-panel:         #091428;    /* 面板内层 */

/* 金色系统（边框、高亮、标题） */
--gold-primary:     #C8AA6E;    /* 主金色 - 边框、标题 */
--gold-light:       #F0E6D2;    /* 亮金 - 高亮文字 */
--gold-dark:        #785A28;    /* 暗金 - 次要边框 */
--gold-gradient:    linear-gradient(180deg, #C8AA6E 0%, #917438 50%, #7A5C2E 100%);

/* 文字 */
--text-primary:     #F0E6D2;    /* 主文字 - 暖白 */
--text-secondary:   #A09B8C;    /* 次要文字 - 灰 */
--text-disabled:    #5B5A56;    /* 禁用文字 */

/* 队伍颜色 */
--blue-team:        #0AC8B9;    /* 蓝色方 */
--red-team:         #EE4444;    /* 红色方 */

/* 按钮 */
--btn-hover:        #1E2328;
--btn-active:       #0AB3E7;
```

### 3.2 圆角规范

英雄联盟 UI 特征性的**菱形切角**效果，使用 CSS `clip-path` 实现：

```css
clip-path: polygon(
  8px 0, calc(100% - 8px) 0,
  100% 8px, 100% calc(100% - 8px),
  calc(100% - 8px) 100%, 8px 100%,
  0 calc(100% - 8px), 0 8px
);
```

### 3.3 字体

| 元素 | 字号 | 字重 | 颜色 |
|------|------|------|------|
| 页面标题 | 18px | 700 | `--gold-primary` |
| 倒计时 | 32px | 700 | `#FFFFFF` |
| 英雄名（池中） | 11px | 400 | `--text-primary` |
| 英雄名（详情） | 28px | 700 | `--gold-primary` |
| 玩家名 | 14px | 500 | `--text-primary` |
| 按钮文字 | 14px | 600 | `--text-primary` |
| 技能描述 | 13px | 400 | `--text-secondary` |

---

## 四、项目目录结构

```
src/
├── assets/
│   └── backgrounds/        # 背景图（英雄头像/立绘/技能图直接用 Data Dragon CDN）
├── components/
│   ├── ui/                 # 通用 UI 原子组件
│   │   ├── ChampionIcon.tsx
│   │   ├── GoldButton.tsx
│   │   ├── ClipPanel.tsx
│   │   └── Tooltip.tsx
│   └── layout/
│       └── HeaderBar.tsx
├── features/
│   └── champ-select/
│       ├── components/     # 选人模块业务组件
│       │   ├── ChampionPool.tsx
│       │   ├── BenchRow.tsx
│       │   ├── RerollBar.tsx
│       │   ├── TeamPanel.tsx
│       │   ├── PlayerSlot.tsx
│       │   ├── ChampionDetail.tsx
│       │   ├── Countdown.tsx
│       │   └── FooterBar.tsx
│       ├── store.ts        # Zustand Store
│       ├── types.ts        # 类型定义
│       └── index.tsx       # 页面主入口
├── services/               # 服务层（关键：Mock/Real 通过接口抽象切换）
│   ├── api.ts              # HTTP 服务接口定义 + Axios 实现
│   ├── websocket.ts        # WS 服务接口定义 + STOMP 实现
│   └── mock/
│       ├── mock-api.ts     # HTTP Mock 实现
│       ├── mock-ws.ts      # WS Mock 实现（含模拟倒计时广播）
│       └── mock-room.ts    # 完整 Mock 房间状态生成器
├── config/
│   └── env.ts              # 环境变量配置（API_BASE_URL / WS_URL / USE_MOCK）
├── data/
│   └── champions-index.ts  # 英雄 Data Dragon ID 索引表
├── styles/
│   ├── globals.css         # Tailwind 基础 + CSS 变量
│   └── cham-select.module.css
├── App.tsx
├── main.tsx
└── vite-env.d.ts
```

---

## 五、核心类型定义

```typescript
// features/champ-select/types.ts

/** 英雄信息 */
export interface Champion {
  id: number;
  key: string;           // 如 "TwistedFate"
  name: string;          // 如 "卡牌大师"
  title: string;         // 如 "崔斯特"
  icon: string;          // 头像 URL
  splash: string;        // 立绘 URL
  skills: SkillInfo[];   // P Q W E R
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

/** 聊天消息（预留，仅类型定义） */
export interface ChatMessage {
  id: string;
  sender: string;
  content: string;
  type: 'SYSTEM' | 'USER';
  timestamp: number;
}

/** 房间阶段 */
export type RoomPhase = 'WAITING' | 'PICKING' | 'LOCKED' | 'STARTING';

/** WS 动作类型（预留接口） */
export type WSAction =
  | { type: 'SELECT_CHAMPION'; championId: number }
  | { type: 'LOCK_IN' }
  | { type: 'REROLL' }
  | { type: 'SWAP_BENCH'; championId: number }
  | { type: 'CHAT'; content: string }
  | { type: 'REQUEST_SWAP'; targetPlayerId: string };

/** WS 服务端推送类型（预留接口） */
export type WSResponse =
  | { type: 'ROOM_SNAPSHOT'; payload: RoomSnapshot }
  | { type: 'PLAYER_PICK'; playerId: string; championId: number }
  | { type: 'PLAYER_LOCK'; playerId: string }
  | { type: 'POOL_UPDATE'; available: number[]; bench: number[] }
  | { type: 'TICK'; time: number }
  | { type: 'PHASE_CHANGE'; phase: RoomPhase };

//** 房间快照（初始化用） */
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
```

---

## 六、服务层抽象（Mock/Real 无缝切换）

这是前端能独立测试 + 后期接入 SpringBoot 的核心设计。

### 6.1 环境变量配置

```typescript
// config/env.ts

export const config = {
  /** 后端 API 地址，SpringBoot 服务地址 */
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080/api',
  /** WebSocket 地址 */
  WS_URL: import.meta.env.VITE_WS_URL ?? 'http://localhost:8080/ws',
  /** 是否使用 Mock 模式（前端独立测试时为 true） */
  USE_MOCK: import.meta.env.VITE_USE_MOCK === 'true',
} as const;
```

```env
# .env.development（前端独立开发）
VITE_USE_MOCK=true

# .env.production（对接 SpringBoot）
VITE_USE_MOCK=false
VITE_API_BASE_URL=http://localhost:8080/api
VITE_WS_URL=http://localhost:8080/ws
```

### 6.2 服务层接口定义

```typescript
// services/api.ts — HTTP 接口

import type { Champion, RoomSnapshot } from '../features/champ-select/types';

/** HTTP 服务接口（Mock 和 Real 都实现此接口） */
export interface IApiService {
  /** 获取全量英雄数据 */
  getChampions(): Promise<Champion[]>;
  /** 获取当前房间快照 */
  getRoomSnapshot(roomId: string): Promise<RoomSnapshot>;
}

/** 真实实现（Axios，对接 SpringBoot） */
export function createRealApiService(baseUrl: string): IApiService {
  // 后期实现：import axios from 'axios'
  // return { getChampions: () => axios.get(...) ... }
  throw new Error('Real API not implemented yet');
}
```

```typescript
// services/websocket.ts — WebSocket 接口

import type { WSAction, WSResponse } from '../features/champ-select/types';

type MessageHandler = (response: WSResponse) => void;

/** WebSocket 服务接口 */
export interface IWebSocketService {
  /** 建立连接 */
  connect(roomId: string): Promise<void>;
  /** 断开连接 */
  disconnect(): void;
  /** 发送动作 */
  send(action: WSAction): void;
  /** 注册消息回调 */
  subscribe(handler: MessageHandler): () => void;  // 返回 unsubscribe 函数
}

/** 真实实现（SockJS + STOMP，对接 SpringBoot） */
export function createRealWsService(url: string): IWebSocketService {
  // 后期实现：SockJS + @stomp/stompjs
  // connect() → stompClient.activate()
  // send() → stompClient.publish({ destination: '/app/room/...', body: JSON.stringify(action) })
  // subscribe() → stompClient.subscribe('/topic/room/...', handler)
  throw new Error('Real WebSocket not implemented yet');
}
```

### 6.3 Mock 实现

```typescript
// services/mock/mock-ws.ts

import type { IWebSocketService } from '../websocket';
import type { WSAction, WSResponse, RoomSnapshot } from '../../features/champ-select/types';

/** Mock WS：模拟后端行为 */
export function createMockWsService(
  snapshot: RoomSnapshot,
  onUpdate: (response: WSResponse) => void
): IWebSocketService {
  let timer: ReturnType<typeof setInterval> | null = null;
  let handlers: MessageHandler[] = [];

  return {
    async connect() {
      // 模拟连接成功后推送初始快照
      setTimeout(() => {
        emit({ type: 'ROOM_SNAPSHOT', payload: snapshot });
      }, 100);

      // 模拟后端每秒广播倒计时
      let remaining = snapshot.countdown;
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

    disconnect() {
      if (timer) clearInterval(timer);
      handlers = [];
    },

    send(action: WSAction) {
      // 模拟后端处理逻辑
      switch (action.type) {
        case 'SELECT_CHAMPION':
          emit({ type: 'PLAYER_PICK', playerId: snapshot.currentUser.id, championId: action.championId });
          break;
        case 'LOCK_IN':
          emit({ type: 'PLAYER_LOCK', playerId: snapshot.currentUser.id });
          break;
        case 'REROLL':
          // 模拟 reroll 后更新英雄池
          emit({ type: 'POOL_UPDATE', available: [...snapshot.availableChampions], bench: [...snapshot.benchChampions] });
          break;
      }
    },

    subscribe(handler) {
      handlers.push(handler);
      return () => { handlers = handlers.filter(h => h !== handler); };
    },
  };

  function emit(response: WSResponse) {
    handlers.forEach(h => h(response));
  }
}
```

### 6.4 SpringBoot 对接约定

前端与 SpringBoot 后端的通信协议约定如下：

**HTTP 端点：**

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/champions` | 获取全量英雄数据 |
| GET | `/api/rooms/{roomId}` | 获取房间快照 |
| POST | `/api/rooms/{roomId}/join` | 加入房间 |

**WebSocket（STOMP）：**

| 方向 | Destination | 消息体 | 说明 |
|------|-------------|--------|------|
| 前端 → 后端 | `/app/room/{roomId}/select` | `{ championId: number }` | 选英雄 |
| 前端 → 后端 | `/app/room/{roomId}/lock` | 空 | 锁定 |
| 前端 → 后端 | `/app/room/{roomId}/reroll` | 空 | 掷骰子 |
| 前端 → 后端 | `/app/room/{roomId}/swap-bench` | `{ championId: number }` | 从板凳交换 |
| 后端 → 前端 | `/topic/room/{roomId}` | `WSResponse` 联合类型 | 房间状态广播 |

**接入步骤（后期）：**
1. `.env.production` 设置 `VITE_USE_MOCK=false` + 真实地址
2. `services/api.ts` 中实现 `createRealApiService`
3. `services/websocket.ts` 中实现 `createRealWsService`
4. 组件代码**零改动**，因为所有组件只依赖 Store，不直接调用服务

---

## 七、Zustand Store 设计

Store 是唯一的状态来源。组件只读写 Store，不直接调用服务。服务层通过 `initStore` 注入。

```typescript
// features/champ-select/store.ts

import { create } from 'zustand';
import type {
  Champion, Player, RoomPhase, ChatMessage,
  WSAction, WSResponse
} from './types';
import type { IWebSocketService } from '../../services/websocket';

interface ChampSelectState {
  // ---- 房间基础 ----
  roomId: string;
  phase: RoomPhase;
  countdown: number;

  // ---- 玩家 ----
  myTeam: Player[];
  enemyTeam: Player[];
  currentUser: Player | null;

  // ---- 英雄池 ----
  availableChampions: number[];   // 可选英雄 ID
  benchChampions: number[];       // 板凳席英雄 ID
  allChampions: Champion[];       // 全量英雄数据
  selectedChampionId: number | null;

  // ---- 聊天（预留） ----
  messages: ChatMessage[];

  // ---- UI 状态 ----
  hoveredChampionId: number | null;
  detailChampionId: number | null;

  // ---- WS 引用 ----
  wsService: IWebSocketService | null;

  // ---- Actions ----
  initWs: (ws: IWebSocketService, roomId: string) => void;
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
```

**数据流：**
```
用户操作 → 组件调用 Store Action → Store 调用 wsService.send(action)
                                          ↓
                         wsService 推送 WSResponse → Store.handleWsResponse()
                                          ↓
                                    Store 状态更新 → 组件自动重渲染
```

**关键：Mock 模式下 `wsService` 是 `mock-ws.ts`，Real 模式下是 `websocket.ts`（STOMP），组件无感知。**

---

## 八、英雄资源（Riot Data Dragon CDN）

不本地存储英雄图片，直接引用 Riot 官方 CDN，保证图片最新且项目体积小。

```typescript
// config/ddragon.ts

const DDRAGON_VERSION = '14.10.1';  // 可通过 https://ddragon.leagueoflegends.com/api/versions.json 获取最新版
const DDRAGON_BASE = `https://ddragon.leagueoflegends.com/cdn/${DDRAGON_VERSION}`;

export const ddragon = {
  /** 英雄头像 48x48 */
  championIcon: (championKey: string) =>
    `${DDRAGON_BASE}/img/champion/${championKey}.png`,

  /** 英雄立绘 Loading 图 */
  championSplash: (championKey: string) =>
    `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${championKey}_0.jpg`,

  /** 技能图标 */
  spellIcon: (spellId: string) =>
    `${DDRAGON_BASE}/img/spell/${spellId}.png`,

  /** 被动技能图标 */
  passiveIcon: (filename: string) =>
    `${DDRAGON_BASE}/img/passive/${filename}`,

  /** 召唤师技能图标 */
  summonerSpellIcon: (spellId: string) =>
    `${DDRAGON_BASE}/img/spell/${spellId}.png`,
};
```

**使用示例：**
```typescript
// 英雄 "TwistedFate" 的头像
ddragon.championIcon('TwistedFate')
// → https://ddragon.leagueoflegends.com/cdn/14.10.1/img/champion/TwistedFate.png
```

**`champions-index.ts`** 只存 ID → Key 映射 + 中文名，不存图片路径：
```typescript
// data/champions-index.ts
export const CHAMPION_INDEX: Record<number, { key: string; name: string; title: string }> = {
  41:  { key: 'Gangplank',  name: '海洋之灾', title: '普朗克' },
  136: { key: 'AurelionSol', name: '铸星龙王', title: '奥瑞利安·索尔' },
  // ...
};
```

---

## 九、组件层级与职责

```
<ChampSelectPage>                    # features/champ-select/index.tsx
├── <HeaderBar>                      # components/layout/HeaderBar.tsx
│     └── 英雄联盟 + 服务器名 + 窗口控件
├── <Countdown>                      # 倒计时数字 "0:23"
├── <ChampionPool>                   # 可选英雄池网格
│     ├── <ChampionIcon> × N        # 单个英雄头像
│     └── hover/selected 状态联动
├── <BenchRow>                       # 板凳席一行
│     └── <ChampionIcon> × N
├── <RerollBar>                      # 掷骰子按钮 + 蓝色精粹
├── <TeamPanels>                     # 两队容器
│     ├── <TeamPanel side="blue">    # 蓝色方
│     │     └── <PlayerSlot> × 5
│     └── <TeamPanel side="red">     # 红色方
│           └── <PlayerSlot> × 5
├── <ChampionDetail>                 # 右侧英雄详情（选中后显示）
│     ├── 立绘大图
│     ├── 英雄名 + 称号
│     ├── 技能图标行 (P/Q/W/E/R)
│     └── 技能描述文本
└── <FooterBar>                      # 底部按钮栏
      ├── 菜单按钮
      ├── 交换请求按钮
      └── 确认选择 / 确认锁定 金色按钮
```

---

## 十、五阶段开发计划

### 阶段 1：项目初始化 + 环境搭建

**目标：** 创建 Vite + React + TS 项目，配置 Tailwind、Zustand，建立目录结构和服务层抽象。

**任务清单：**

- [ ] 1.1 使用 `npm create vite@latest` 初始化项目（React + TypeScript 模板）
- [ ] 1.2 安装依赖：`tailwindcss` `zustand` `sockjs-client` `@stomp/stompjs`
- [ ] 1.3 配置 `tsconfig.json` 开启严格模式（`strict: true`，禁用 `any`）
- [ ] 1.4 配置 Tailwind CSS（`tailwind.config.js` + `postcss.config.js`）
- [ ] 1.5 在 Tailwind 配置中扩展 LOL 主题色和字体
- [ ] 1.6 创建项目目录结构（`components/` `features/` `services/` `config/` `data/` `styles/`）
- [ ] 1.7 编写环境变量配置（`.env.development` + `config/env.ts`）
- [ ] 1.8 编写 CSS 变量（`globals.css` 中定义 Design Tokens）
- [ ] 1.9 创建 `features/champ-select/types.ts` 完整类型定义
- [ ] 1.10 创建服务层接口定义（`services/api.ts` + `services/websocket.ts` 的接口）
- [ ] 1.11 创建 Data Dragon 配置（`config/ddragon.ts` + `data/champions-index.ts` 至少 20 个英雄）
- [ ] 1.12 创建 Mock 实现（`services/mock/mock-api.ts` + `mock-ws.ts` + `mock-room.ts`）
- [ ] 1.13 创建 Zustand Store 骨架（`store.ts`，包含 `initWs` 和 `handleWsResponse`）
- [ ] 1.14 搭建 `App.tsx` + `main.tsx`（根据 `config.USE_MOCK` 选择服务实现）

**验收标准：**
- `npm run dev` 能正常启动
- TypeScript 编译零错误
- Tailwind 类名可正常使用
- 页面显示空白深色背景

**Git 提交：**
```bash
git add -A
git commit -m "feat: 初始化 Vite + React + TS 项目，配置 Tailwind 和 Zustand"
git push origin master
```

---

### 阶段 2：通用 UI 组件 + 英雄池

**目标：** 完成可复用的原子组件和核心的英雄池/板凳席区域。

**任务清单：**

- [ ] 2.1 `ChampionIcon` 组件
  - 支持尺寸：`sm`(40px) / `md`(48px) / `lg`(64px)
  - 支持状态：`default` / `hover` / `selected` / `disabled` / `locked`
  - 使用 `clip-path` 菱形切角
  - selected 状态显示金色边框
  - disabled 状态显示灰色遮罩
- [ ] 2.2 `GoldButton` 组件
  - 金色渐变背景
  - 菱形切角
  - hover / active / disabled 状态
- [ ] 2.3 `ClipPanel` 组件（通用菱形容器）
  - 可配置背景色、边框色
  - 接收 `children`
- [ ] 2.4 `ChampionPool` 组件
  - 网格布局展示可选英雄
  - 点击选中 → 更新 `selectedChampionId` + `detailChampionId`
  - hover 效果（发光边框）
  - 与 Zustand Store 联动
- [ ] 2.5 `BenchRow` 组件
  - 横向排列板凳英雄（较小尺寸）
  - 点击可交换到自己英雄位
- [ ] 2.6 `HeaderBar` 组件
  - "英雄联盟" 标题 + 金色下边框
  - 服务器信息文字
  - 窗口控件占位（─ □ ✕）

**验收标准：**
- 英雄池网格正常渲染 20+ 英雄头像
- 点击英雄头像有选中高亮效果
- 板凳席正常显示
- Header 金色风格还原

**Git 提交：**
```bash
git add -A
git commit -m "feat: 完成 ChampionIcon/GoldButton/ChampionPool/BenchRow/HeaderBar 组件"
git push origin master
```

---

### 阶段 3：队伍面板 + 玩家信息

**目标：** 完成蓝色方/红色方队伍面板和玩家 Slot 组件。

**任务清单：**

- [ ] 3.1 `PlayerSlot` 组件
  - 左侧英雄头像（大尺寸）
  - 右侧玩家名字
  - 下方两个召唤师技能图标位
  - 一个符文图标位
  - 当前用户高亮样式
  - 锁定状态样式
- [ ] 3.2 `TeamPanel` 组件
  - 队伍标题（蓝色方 / 红色方 + 队伍颜色标识）
  - 纵向排列 5 个 `PlayerSlot`
  - 蓝色方左侧对齐，红色方右侧对齐
- [ ] 3.3 `RerollBar` 组件
  - 掷骰子按钮（使用 `GoldButton`）
  - 蓝色精粹消耗文字
  - 剩余次数显示 "2/2"
  - 点击后通过 Store 模拟 reroll 逻辑
- [ ] 3.4 `Countdown` 组件
  - 大号白色倒计时数字
  - 接收 `seconds` prop
  - 格式化为 `m:ss`

**验收标准：**
- 两支队伍各 5 个 Slot 正常渲染
- Mock 数据中当前用户 Slot 有高亮区分
- 掷骰子按钮点击可触发（console.log 即可）
- 倒计时数字正确显示

**Git 提交：**
```bash
git add -A
git commit -m "feat: 完成 PlayerSlot/TeamPanel/RerollBar/Countdown 组件"
git push origin master
```

---

### 阶段 4：英雄详情面板 + 底部栏

**目标：** 完成点击英雄后右侧展示的详情面板和底部操作栏。

**任务清单：**

- [ ] 4.1 `ChampionDetail` 组件
  - 右侧展示，占据约 40% 宽度
  - 英雄立绘大图（splash art）
  - 英雄名（大号金色）+ 称号
  - 技能图标行：P Q W E R 五个图标，当前选中高亮
  - 点击技能图标切换显示对应技能描述
  - 技能名称 + 描述文本
  - 无选中英雄时显示空态提示
- [ ] 4.2 `FooterBar` 组件
  - 左侧："菜单" 暗色按钮 + "交换请求" 暗色按钮
  - 右侧：金色 "确认选择" 按钮
  - 锁定后变为 "确认锁定" 按钮
  - 按钮状态逻辑联动 Store 中的 `phase` 和 `selectedChampionId`
- [ ] 4.3 将所有组件组装到 `ChampSelectPage`
  - 左侧（60%）：英雄池 + 板凳席 + 掷骰子 + 队伍面板
  - 右侧（40%）：英雄详情
  - 顶部：Header + 倒计时
  - 底部：FooterBar
- [ ] 4.4 整体布局调整
  - 使用 CSS Grid / Flexbox 实现响应式布局
  - 固定最小宽度 1280px（游戏 UI 不需要响应式）
  - 确保全屏沉浸感

**验收标准：**
- 点击英雄池中任意英雄，右侧详情面板正确切换
- 技能图标可点击切换描述
- 底部按钮状态正确（有英雄选中时可点击确认）
- 整体布局与截图一致

**Git 提交：**
```bash
git add -A
git commit -m "feat: 完成 ChampionDetail/FooterBar，组装 ChampSelectPage 主页面"
git push origin master
```

---

### 阶段 5：Store 联调 + 交互完善 + WebSocket 接入

**目标：** 打通前端完整交互流程，完善动画过渡，Mock WS 跑通全链路。

**任务清单：**

- [ ] 5.1 完善 Zustand Store 交互逻辑
  - `initWs` → 创建 WS 服务实例 + 订阅消息 + 连接房间
  - `handleWsResponse` → 统一分发 WS 服务端推送，更新对应状态
  - `selectChampion` → 更新选中状态 + 调用 `wsService.send()`
  - `reroll` → 调用 `wsService.send()` → Mock WS 推送 `POOL_UPDATE`
  - `swapFromBench` → 板凳英雄与当前选中交换
  - `lockIn` → 切换 phase 为 LOCKED
  - `dispose` → 断开 WS 连接 + 清理定时器
- [ ] 5.2 添加 CSS 过渡动画
  - 英雄头像 hover 发光渐变
  - 选中边框出现动画
  - 详情面板切换淡入淡出
  - 按钮点击反馈
- [ ] 5.3 完善 Mock WS 全链路
  - mock-ws.ts 模拟倒计时每秒推送 `TICK`
  - mock-ws.ts 处理 `SELECT_CHAMPION` 后广播 `PLAYER_PICK`
  - mock-ws.ts 处理 `REROLL` 后随机刷新英雄池并推送 `POOL_UPDATE`
  - 验证：Mock 模式下完整走通「选英雄 → 查看详情 → 确认选择 → 锁定 → 倒计时结束」
- [ ] 5.4 Mock 数据扩展
  - 补充至 40+ 英雄数据（使用 Data Dragon CDN）
  - 添加召唤师技能和符文 Mock 数据
- [ ] 5.5 最终视觉还原检查
  - 对照截图逐像素检查
  - 调整边框、间距、颜色
  - 确保菱形切角效果统一

**验收标准：**
- 完整交互流程：选英雄 → 查看详情 → 确认选择 → 锁定
- 掷骰子可随机刷新英雄池
- 板凳席可点击交换
- 所有动画流畅
- WebSocket 接口定义完整，mock 模式可运行
- TypeScript 编译零错误，无 `any`

**Git 提交：**
```bash
git add -A
git commit -m "feat: 完成 Store 交互逻辑、CSS 动画、WebSocket 接口预埋"
git push origin master
```

---

## 十一、Mock → SpringBoot 切换指南

后期接入 SpringBoot 时，只需以下步骤，**组件代码零改动**：

```
步骤 1：修改环境变量
  .env.production → VITE_USE_MOCK=false

步骤 2：实现真实服务
  services/api.ts → 完成 createRealApiService()
  services/websocket.ts → 完成 createRealWsService()

步骤 3：确认协议对齐
  HTTP 端点、STOMP destination、消息格式与后端一致

步骤 4：构建部署
  npm run build → 产物交给 SpringBoot 或 Nginx 托管
```

**架构保障：**
```
组件层（ChampionPool / TeamPanel / ...）
        ↓ 只读写 Store
Zustand Store
        ↓ 调用 wsService.send() / wsService.subscribe()
服务层接口（IWebSocketService / IApiService）
        ↓
  ┌─────┴─────┐
  Mock 实现    Real 实现（STOMP）
  (前端独立)   (对接 SpringBoot)
```

---

## 十二、开发命令速查

```bash
# 初始化项目
npm create vite@latest . -- --template react-ts

# 安装依赖
npm install zustand tailwindcss postcss autoprefixer
npm install sockjs-client @stomp/stompjs
npm install -D @types/sockjs-client

# Tailwind 初始化
npx tailwindcss init -p

# 启动开发
npm run dev

# 类型检查
npm run build
```

---

## 十三、注意事项

1. **禁止使用 `any`** — 所有类型必须显式声明，WS 消息使用联合类型
2. **菱形切角** — 统一使用 `clip-path`，不要用 border-radius
3. **深色电竞风格** — 所有面板背景色在 `#091428 ~ #0E2042` 之间
4. **金色边框** — 使用 `#C8AA6E` 及其渐变，不用亮黄色
5. **字体** — 中文使用系统默认，英文/数字使用 `Beaufort, sans-serif` 风格
6. **Mock 优先** — 前 5 个阶段完全不连后端，`VITE_USE_MOCK=true`
7. **每阶段验收** — 每完成一个阶段必须停止，等待确认后再继续
8. **英雄图片不本地存储** — 全部使用 Data Dragon CDN 引用
9. **组件不直接调服务** — 组件只读写 Zustand Store，Store 内部调用服务层
10. **WS 接口即契约** — `WSAction` 和 `WSResponse` 类型就是前后端的接口契约，修改时双方同步
