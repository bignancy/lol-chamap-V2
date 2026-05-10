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
│   ├── champions/          # 英雄头像 / 立绘 / 技能图标
│   │   ├── icons/          # 48x48 头像
│   │   ├── splash/         # 立绘大图
│   │   └── skills/         # 技能图标
│   ├── spells/             # 召唤师技能图标
│   ├── runes/              # 符文图标
│   └── backgrounds/        # 背景图
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
├── services/
│   ├── api.ts              # Axios (预留)
│   └── websocket.ts        # STOMP (预留)
├── data/
│   └── mock-champions.ts   # Mock 数据
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

/** 房间快照（初始化用） */
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

## 六、Zustand Store 设计

```typescript
// features/champ-select/store.ts

import { create } from 'zustand';
import type {
  Champion, Player, RoomPhase, ChatMessage,
  WSAction, WSResponse
} from './types';

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

  // ---- Actions (纯前端) ----
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
  initFromSnapshot: (data: import('./types').RoomSnapshot) => void;

  // ---- WS Action 发送（预留） ----
  sendAction: (action: WSAction) => void;
}
```

---

## 七、组件层级与职责

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

## 八、五阶段开发计划

### 阶段 1：项目初始化 + 环境搭建

**目标：** 创建 Vite + React + TS 项目，配置 Tailwind、Zustand，建立目录结构。

**任务清单：**

- [ ] 1.1 使用 `npm create vite@latest` 初始化项目（React + TypeScript 模板）
- [ ] 1.2 安装依赖：`tailwindcss` `zustand` `sockjs-client` `@stomp/stompjs`
- [ ] 1.3 配置 `tsconfig.json` 开启严格模式（`strict: true`，禁用 `any`）
- [ ] 1.4 配置 Tailwind CSS（`tailwind.config.js` + `postcss.config.js`）
- [ ] 1.5 在 Tailwind 配置中扩展 LOL 主题色和字体
- [ ] 1.6 创建项目目录结构（`components/` `features/` `services/` `data/` `styles/`）
- [ ] 1.7 编写 CSS 变量（`globals.css` 中定义 Design Tokens）
- [ ] 1.8 创建 `types.ts` 完整类型定义
- [ ] 1.9 创建 `mock-champions.ts`（至少 20 个英雄的 Mock 数据）
- [ ] 1.10 创建 Zustand Store 骨架（`store.ts`）
- [ ] 1.11 搭建 `App.tsx` + `main.tsx` 基础路由

**验收标准：**
- `npm run dev` 能正常启动
- TypeScript 编译零错误
- Tailwind 类名可正常使用
- 页面显示空白深色背景

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

---

### 阶段 5：Store 联调 + 交互完善 + WebSocket 预留

**目标：** 打通前端完整交互流程，完善动画过渡，预留 WebSocket 接口。

**任务清单：**

- [ ] 5.1 完善 Zustand Store 交互逻辑
  - `selectChampion` → 更新选中状态 + 详情面板 + 自己 Slot 头像
  - `reroll` → 随机替换可用英雄池 + 更新板凳席
  - `swapFromBench` → 板凳英雄与当前选中交换
  - `lockIn` → 切换 phase 为 LOCKED
- [ ] 5.2 添加 CSS 过渡动画
  - 英雄头像 hover 发光渐变
  - 选中边框出现动画
  - 详情面板切换淡入淡出
  - 按钮点击反馈
- [ ] 5.3 WebSocket 服务层预埋
  - `services/websocket.ts`：封装 `connect()` `disconnect()` `send(action)` `subscribe(callback)`
  - 接口定义与 `types.ts` 中的 `WSAction` / `WSResponse` 对齐
  - 当前阶段用 mock 实现（`setTimeout` 模拟网络延迟）
- [ ] 5.4 Mock 数据扩展
  - 补充至 40+ 英雄数据
  - 每个英雄包含完整技能信息
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

---

## 九、开发命令速查

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

## 十、注意事项

1. **禁止使用 `any`** — 所有类型必须显式声明，WS 消息使用联合类型
2. **菱形切角** — 统一使用 `clip-path`，不要用 border-radius
3. **深色电竞风格** — 所有面板背景色在 `#091428 ~ #0E2042` 之间
4. **金色边框** — 使用 `#C8AA6E` 及其渐变，不用亮黄色
5. **字体** — 中文使用系统默认，英文/数字使用 `Beaufort, sans-serif` 风格
6. **Mock 优先** — 前 4 个阶段完全不连后端，所有数据来自 Mock
7. **每阶段验收** — 每完成一个阶段必须停止，等待确认后再继续
