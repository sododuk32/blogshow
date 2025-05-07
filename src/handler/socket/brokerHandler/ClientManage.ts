import { SocketClient, SocketClientMessage } from '@util/types/Socket/SocketConnect';

export class ClientManager {
  /**전체 연결된 클라이언트 */
  private clients = new Set<SocketClient>();

  /** 토픽별 구독자 집합 */
  private topicSubscribers = new Map<string, Set<SocketClient>>();

  addClient(client: SocketClient) {
    this.clients.add(client);
  }

  removeClient(client: SocketClient) {
    this.clients.delete(client);
    // 모든 topic에서 지워주기
    client.subscriptions.forEach((topic) => {
      this.unsubscribe(client, topic);
    });
  }

  subscribe(client: SocketClient, topic: string) {
    client.subscriptions.add(topic);
    if (!this.topicSubscribers.has(topic)) this.topicSubscribers.set(topic, new Set());
    this.topicSubscribers.get(topic)!.add(client);
  }

  unsubscribe(client: SocketClient, topic: string) {
    client.subscriptions.delete(topic);
    this.topicSubscribers.get(topic)?.delete(client);
  }

  // 특정 topic 에 payload 브로드캐스트
  broadcast(topic: string, payload: unknown) {
    const arrays = this.topicSubscribers.get(topic) || [];

    arrays.forEach((c) => {
      c.ws.send(JSON.stringify({ type: `${topic}Update`, payload }));
    });
  }

  // 유틸: 현재 구독자 수
  count(topic: string) {
    return this.topicSubscribers.get(topic)?.size ?? 0;
  }
}
