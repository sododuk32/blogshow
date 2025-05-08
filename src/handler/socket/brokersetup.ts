// src/socket/brokerSetup.ts
import { WebSocketServer } from 'ws';
import { EventBrokers } from './brokerHandler/eventbroker';
import { ExternalConnector } from './brokerHandler/outSocket';
import { ClientManager } from './brokerHandler/ClientManage';
import { SocketEndpoints } from './endpoint/soketConnect';
import { UuidValidate } from '@util/regex/UuidVal';
import { parse } from 'cookie';

export function setupBroker(wss: WebSocketServer) {
  const external = new ExternalConnector(SocketEndpoints);
  const manager = new ClientManager(external);

  wss.on('connection', (ws, req) => {
    // 1) UUID 체크
    const uuid = parse(req.headers.cookie || '').uuid;
    if (!UuidValidate(uuid)) {
      ws.send(JSON.stringify({ type: 'error', message: 'NOUUID' }));
      return ws.close(1008, 'Invalid UUID');
    }

    // 2) 메시지 처리: 클라이언트 → broker
    ws.on('message', (raw) => {
      let msg;
      try {
        msg = JSON.parse(raw.toString());
      } catch {
        return ws.send(JSON.stringify({ type: 'error', message: 'Invalid JSON' }));
      }
      const { type, topic, detail } = msg;
      EventBrokers.emit(type, { uuid, topic, detail, ws });
    });

    // 3) 연결 종료 시
    ws.on('close', () => {
      manager.removeClient(uuid);
    });
  });

  // 4) broker 이벤트 연결
  // subscribe, unsubscribe는 ClientManager 생성자에서 이미 on(…)으로 연결되어 있다고 가정
  // giveUser/update 이벤트도 manager.broadcast로 연결되어 있어야 합니다
}
