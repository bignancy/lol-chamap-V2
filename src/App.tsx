import { useEffect } from 'react';
import { config } from './config/env';
import { useChampSelectStore } from './features/champ-select/store';
import { createMockApiService } from './services/mock/mock-api';
import { createMockWsService } from './services/mock/mock-ws';
import { createMockRoom } from './services/mock/mock-room';
import { HeaderBar } from './components/layout/HeaderBar';
import { Countdown } from './features/champ-select/components/Countdown';
import { ChampionPool } from './features/champ-select/components/ChampionPool';
import { BenchRow } from './features/champ-select/components/BenchRow';
import { RerollBar } from './features/champ-select/components/RerollBar';
import { TeamPanel } from './features/champ-select/components/TeamPanel';

function App() {
  const { initWs, setAllChampions, allChampions, myTeam, enemyTeam } = useChampSelectStore();

  useEffect(() => {
    if (config.USE_MOCK) {
      const apiService = createMockApiService();

      apiService.getChampions().then(setAllChampions);

      apiService.getRoomSnapshot('mock-room-001').then(snapshot => {
        const wsService = createMockWsService(createMockRoom());
        initWs(wsService, snapshot.roomId);
      });
    }

    return () => {
      useChampSelectStore.getState().dispose();
    };
  }, [initWs, setAllChampions]);

  if (allChampions.length === 0) {
    return (
      <div className="flex h-screen w-screen items-center justify-center" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <span style={{ color: 'var(--text-secondary)' }}>加载中...</span>
      </div>
    );
  }

  return (
    <div
      className="flex h-screen w-screen flex-col"
      style={{ backgroundColor: 'var(--bg-primary)' }}
    >
      <HeaderBar />

      <div className="flex flex-1 flex-col overflow-hidden gap-2 p-3">
        {/* Countdown */}
        <Countdown />

        {/* Champion Pool */}
        <ChampionPool />

        {/* Bench Row */}
        <BenchRow />

        {/* Reroll Bar */}
        <RerollBar />

        {/* Team Panels */}
        <div className="flex flex-1 gap-4">
          <TeamPanel team={myTeam} side="BLUE" />

          {/* Center divider */}
          <div
            className="w-px shrink-0 self-stretch"
            style={{ backgroundColor: 'var(--gold-dark)' }}
          />

          <TeamPanel team={enemyTeam} side="RED" />
        </div>

        {/* TODO: Phase 4 - Champion Detail + Footer */}
        <div
          className="py-2 text-center text-xs"
          style={{ color: 'var(--text-disabled)' }}
        >
          阶段 4 - 英雄详情 + 底部栏待开发
        </div>
      </div>
    </div>
  );
}

export default App;
