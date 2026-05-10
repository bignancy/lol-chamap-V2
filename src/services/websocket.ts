import type { WSAction, WSResponse } from '../features/champ-select/types';

export type MessageHandler = (response: WSResponse) => void;

export interface IWebSocketService {
  connect(roomId: string): Promise<void>;
  disconnect(): void;
  send(action: WSAction): void;
  subscribe(handler: MessageHandler): () => void;
}
