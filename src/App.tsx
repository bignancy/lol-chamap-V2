import { useEffect } from 'react';
import { config } from './config/env';
import { useChampSelectStore } from './features/champ-select/store';
import { createMockApiService } from './services/mock/mock-api';
import { createMockWsService } from './services/mock/mock-ws';
import { createMockRoom } from './services/mock/mock-room';

function App() {
  const { initWs, setAllChampions, phase, countdown } = useChampSelectStore();

  useEffect(() => {
    if (config.USE_MOCK) {
      const apiService = createMockApiService();

      // 加载英雄数据
      apiService.getChampions().then(setAllChampions);

      // 获取房间快照并初始化 WS
      apiService.getRoomSnapshot('mock-room-001').then(snapshot => {
        const wsService = createMockWsService(createMockRoom());
        initWs(wsService, snapshot.roomId);
      });
    }

    return () => {
      useChampSelectStore.getState().dispose();
    };
  }, [initWs, setAllChampions]);

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-[var(--bg-primary)]">
      <div className="text-center">
        <h1 className="mb-4 text-3xl font-bold text-[var(--gold-primary)]">
          英雄联盟 - 大乱斗选英雄
        </h1>
        <p className="mb-2 text-[var(--text-secondary)]">
          阶段: {phase} | 倒计时: {countdown}s
        </p>
        <p className="text-sm text-[var(--text-disabled)]">
          {config.USE_MOCK ? 'Mock 模式' : 'SpringBoot 模式'}
        </p>
        <p className="mt-4 text-xs text-[var(--text-disabled)]">
          阶段 1 完成 - 项目骨架已就绪，等待组件开发
        </p>
      </div>
    </div>
  );
}

export default App;
