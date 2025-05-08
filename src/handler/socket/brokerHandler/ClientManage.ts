/* eslint-disable @typescript-eslint/no-unused-expressions */
import { SocketMessageBodyEvent, SocketClient } from '@util/types/Socket/SocketConnect';
import { EventBrokers } from './eventbroker';
import { ExternalConnector } from './outSocket';
export class ClientManager {
  /**전체 연결된 클라이언트 */
  private clients = new Map<string, SocketClient>();

  constructor(private externalConnector: ExternalConnector) {
    const broker = EventBrokers;

    broker.on('subscribe', ({ uuid, topic, detail, ws }) =>
      this.subscribe({ uuid, topic, detail, ws })
    );
    broker.on('unsubscribe', ({ uuid, topic, detail, ws }) =>
      this.unsubscribe({ uuid, topic, detail, ws })
    );
    broker.on('removeClient', (uuid) => this.removeClient(uuid));
    broker.on('giveUser', ({ topic, payload }) => this.broadcast(topic, payload));
  }

  addClient(client: SocketMessageBodyEvent) {}

  public getClient(uuid: string) {
    return this.clients.get(uuid);
  }

  subscribe(events: SocketMessageBodyEvent) {
    const { uuid, topic, detail, ws } = events;
    console.log('manager subscribe  ' + topic);

    // 1) 클라이언트 조회 (없으면 새로 등록)
    let client = this.clients.get(uuid);
    if (!client) {
      client = { id: uuid, ws, subscriptions: {} };
      this.clients.set(uuid, client);
    }

    // 2) topic별 구독 리스트에 detail 추가
    const subs = client.subscriptions;
    if (!subs[topic]) subs[topic] = [];
    // 이미 포함되어 있지 않을 때만 푸시
    if (!subs[topic].includes(detail)) {
      subs[topic].push(detail);
    }

    // 3) (선택) 외부 커넥터에 실제 구독 요청
    //    — 이 topic에 대해 첫 구독(detail)일 때만 호출하도록 하면,
    //      중복 구독 요청을 방지할 수 있습니다.
    if (subs[topic].length === 0) {
      this.externalConnector.subscribe(topic, detail);
    }
  }

  unsubscribe(events: SocketMessageBodyEvent) {
    const { uuid, topic, detail, ws } = events;
    const client = this.clients.get(uuid);
    if (!client) return;
    else {
      const subs = client.subscriptions[topic] || [];
      client.subscriptions[topic] = subs.filter((sub) => sub !== detail);
      if (client.subscriptions[topic].length === 0) {
        delete client.subscriptions[topic];
        this.externalConnector.unsubscribe(events.topic, events.detail);
      }
    }
  }
  removeClient(uuid: string) {
    this.clients.delete(uuid);
  }
  /** 특정 topic을 구독 중인 클라이언트 ID 목록 조회 */
  getSubscribersByTopic(topic: string): SocketClient[] {
    const out: SocketClient[] = [];
    this.clients.values().forEach((client) => {
      const details = client.subscriptions[topic];
      if (details && details.length > 0) {
        out.push(client);
      }
    });

    return out;
  }
  // 특정 topic 에 payload 브로드캐스트
  broadcast(topic: string, payload: { detail: string; [k: string]: unknown }) {
    console.log('manager broad cast');

    this.clients.values().forEach((client) => {
      const details = client.subscriptions[topic];
      if (details && details.includes(payload.detail)) {
        client.ws.send(JSON.stringify({ type: `${topic}Update`, payload }));
      }
    });
  }

  // 유틸: 현재 구독자 수
  count(topic: string) {}
}
