// externalConnector.ts
import WebSocket, { WebSocketServer } from 'ws';
import type { ClientManager } from './ClientManage';
import { SocketEndpoints } from '../endpoint/soketConnect';
import { EventBrokers } from './eventbroker';
import { EndpointsRecord } from '@util/types/Socket/SocketConnect';
export class ExternalConnector {
  // topic → WebSocket 인스턴스
  private sockets = new Map<string, WebSocket>();
  // topic → 현재 구독된 detail 목록
  private subscribedDetails = new Map<string, Set<string>>();

  constructor(private configs: EndpointsRecord) {}

  /** 클라이언트의 subscribe 이벤트가 발생했을 때 호출 */
  subscribe(topic: string, detail: string) {
    const cfg = this.configs[topic];
    if (!cfg) throw new Error(`Unknown topic: ${topic}`);

    // 1) detail 목록 관리
    if (!this.subscribedDetails.has(topic)) {
      this.subscribedDetails.set(topic, new Set());
    }
    const details = this.subscribedDetails.get(topic)!;
    details.add(detail);

    // 2) 토픽용 WebSocket이 없다면 새로 열기
    if (!this.sockets.has(topic)) {
      const ws = new WebSocket(cfg.endpoint, { headers: cfg.header });

      ws.on('open', () => {
        const payload = {
          header: cfg.header, // approval_key, custtype, tr_type, content-type
          body: {
            tr_id: cfg.bodyTemplate.tr_id,
            tr_key: detail,
          },
        };
        ws.send(JSON.stringify(payload));
      });
      ws.on('message', (raw) => {
        console.log('outsocket receive message');
        const { topic: t, payload } = JSON.parse(raw.toString());
        console.log(t);
        console.log(payload);

        EventBrokers.emit('giveUser', { topic: t, payload });
      });
      this.sockets.set(topic, ws);
    }

    // 3) 열린 소켓에 detail 기반 구독 요청 보내기
    const ws = this.sockets.get(topic)!;
    const body = { ...cfg.bodyTemplate, tr_key: detail };
    ws.send(JSON.stringify({ header: cfg.header, body }));
  }

  /** 클라이언트의 unsubscribe 이벤트가 발생했을 때 호출 */
  unsubscribe(topic: string, detail: string) {
    const cfg = this.configs[topic];
    const ws = this.sockets.get(topic);
    const details = this.subscribedDetails.get(topic);
    if (!cfg || !ws || !details) return;

    // 1) 로컬 detail 목록에서 제거
    details.delete(detail);

    // 2) 3자 서버에 해제 요청 전송
    const body = { ...cfg.bodyTemplate, tr_key: detail, unsub: true };
    ws.send(JSON.stringify({ header: cfg.header, body }));

    // 3) 더 이상 남은 detail이 없으면 소켓 닫기
    if (details.size === 0) {
      ws.close();
      this.sockets.delete(topic);
      this.subscribedDetails.delete(topic);
    }
  }
}
