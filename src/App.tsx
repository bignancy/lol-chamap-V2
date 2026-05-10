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
import { ChampionDetail } from './features/champ-select/components/ChampionDetail';
import { FooterBar } from './features/champ-select/components/FooterBar';

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

      <div className="flex flex-1 overflow-hidden">
        {/* Left side: Pool + Teams */}
        <div className="flex flex-1 flex-col overflow-hidden p-3 gap-2">
          <Countdown />
          <ChampionPool />
          <BenchRow />
          <RerollBar />

          {/* Team Panels */}
          <div className="flex flex-1 gap-3">
            <TeamPanel team={myTeam} side="BLUE" />
            <div
              className="w-px shrink-0 self-stretch"
              style={{ backgroundColor: 'var(--gold-dark)' }}
            />
            <TeamPanel team={enemyTeam} side="RED" />
          </div>
        </div>

        {/* Right side: Champion Detail */}
        <div className="w-[380px] shrink-0 p-3">
          <ChampionDetail />
        </div>
      </div>

      <FooterBar />
    </div>
  );
}

export default App;
