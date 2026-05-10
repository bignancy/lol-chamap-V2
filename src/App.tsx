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

function App() {
  const { initWs, setAllChampions, allChampions } = useChampSelectStore();

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

  // Wait for champion data
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
      {/* Header */}
      <HeaderBar />

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden p-3 gap-3">
        {/* Countdown */}
        <Countdown />

        {/* Champion Pool */}
        <ChampionPool />

        {/* Bench Row */}
        <BenchRow />

        {/* Reroll Bar */}
        <RerollBar />

        {/* TODO: Phase 3 - Team Panels */}
        <div
          className="flex-1 flex items-center justify-center"
          style={{ color: 'var(--text-disabled)' }}
        >
          阶段 3 - 队伍面板开发中...
        </div>
      </div>
    </div>
  );
}

export default App;
