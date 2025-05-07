/* eslint-disable prefer-const */
import { WebSocketServer } from 'ws';
import { ClientManager } from '@handler/socket/brokerHandler/ClientManage';
import { createStrategies } from '@handler/socket/brokerHandler/createStrategies';
import { ExternalConnector } from '@handler/socket/brokerHandler/outSocket';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { UuidValidate } from '@util/regex/UuidVal';
import { parse } from 'cookie';
import type { WebSocket as WSWebSocket } from 'ws';
import { SocketEndpoints } from '@handler/socket/endpoint/soketConnect';

let socketReceiver: WebSocketServer | null = null;

export async function GET(request: NextRequest) {
  if (!socketReceiver) {
    const manager = new ClientManager();
    let endpoints = SocketEndpoints;

    const connector = new ExternalConnector(manager, SocketEndpoints);
    const strategies = createStrategies(manager, connector);

    socketReceiver = new WebSocketServer({ port: 4433 });
    socketReceiver.on('connection', (ws, wsReq) => {
      // UUID 체크
      const uuid = parse(wsReq.headers.cookie || '').uuid;
      if (!UuidValidate(uuid)) {
        ws.send(JSON.stringify({ type: 'error', message: 'NOUUID' }));
        return ws.close(1008, 'Invalid UUID');
      }

      const client = { id: uuid, ws, subscriptions: new Set<string>() };
      manager.addClient(client);

      // 타이머 등 초기 메시지
      const timer = setInterval(() => {
        ws.send(JSON.stringify({ type: 'time', message: new Date().toISOString() }));
      }, 1000);

      ws.on('message', (raw) => {
        let msg;
        try {
          msg = JSON.parse(raw.toString());
        } catch {
          return ws.send(JSON.stringify({ type: 'error', message: 'Invalid JSON' }));
        }

        switch (msg.type) {
          case 'subscribe':
            manager.subscribe(client, msg.topic);
            strategies[msg.topic]?.onSubscribe(client);
            ws.send(JSON.stringify({ type: 'subscribed', topic: msg.topic }));
            break;

          case 'unsubscribe':
            manager.unsubscribe(client, msg.topic);
            strategies[msg.topic]?.onUnsubscribe(client);
            ws.send(JSON.stringify({ type: 'unsubscribed', topic: msg.topic }));
            break;

          case 'update':
            // client → client 메시지는 보통 필요 없고,
            // 외부 데이터는 externalConnector -> manager.broadcast 로 처리
            break;

          case 'error':
            console.error('Client error:', msg.message);
            break;
        }
      });

      ws.on('close', () => {
        clearInterval(timer);
        manager.removeClient(client);
      });
    });
  }

  return NextResponse.json({ message: 'WebSocket server is running' });
}

export const config = { api: { bodyParser: false } };

// 1. 각 클라이언트 객체는 구독목록을 가지고있고

// 전달받는 데이터는 구독 목록에 의해 정의됨.

// 2. 서버는 클라이언트 객체로 부터 구독 목록을받고

// 중복처리하여 다른서버로 소캣 요청을 해야함.

// 그럼 여러개의 엔드포인트로 여러개의 요청을
