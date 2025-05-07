import type { SocketClient } from '@util/types/Socket/SocketConnect';
import type { ClientManager } from './ClientManage';
import type { WebSocket as WSWebSocket } from 'ws';

export interface TopicStrategy {
  onSubscribe(client: SocketClient): void;
  onUnsubscribe(client: SocketClient): void;
  onUpdate?(client: SocketClient, payload: unknown): void;
}

// 팩토리로 ClientManager 주입
export function createStrategies(manager: ClientManager, externalSockets: ExternalConnector) {
  return {
    currentValue: {
      onSubscribe(client) {
        // 첫 구독자일 때만 외부 구독 시작
        if (manager.count('currentValue') === 1) {
          externalSockets
            .get('currentValue')!
            .send(JSON.stringify({ action: 'subscribe', topic: 'currentValue' }));
        }
      },
      onUnsubscribe(client) {
        // 마지막 구독자 빠지면 외부 구독 중단
        if (manager.count('currentValue') === 0) {
          externalSockets
            .get('currentValue')!
            .send(JSON.stringify({ action: 'unsubscribe', topic: 'currentValue' }));
        }
      },
      onUpdate(client, payload) {
        // 개별 클라이언트에 추가 로직이 필요하면 여기서
        client.ws.send(JSON.stringify({ type: 'currentValueUpdate', payload }));
      },
    },
    realtimeAsk: {
      onSubscribe(client) {
        /* … */
      },
      onUnsubscribe(client) {
        /* … */
      },
      onUpdate(client, payload) {
        /* … */
      },
    },
    // … 다른 토픽들
  } as Record<string, TopicStrategy>;
}
