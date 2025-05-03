/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import WebSocket, { WebSocketServer } from 'ws';
import { parse } from 'cookie';
import { UuidValidate } from '@util/regex/UuidVal';

interface Client {
  id: string;
  ws: WebSocket;
  subscriptions: Set<string>;
}
type ClientMessage =
  | { type: 'subscribe'; topic: string }
  | { type: 'unsubscribe'; topic: string }
  | { type: 'update'; topic: string; payload: any }
  | { type: 'error'; message: string };

// next api 내부에서 웹소캣 서버 동작하는 이유
/**
 * 이것보다 위에서 실행하면 해당 파일을 next에서 열기만해도
 * 서버가 만들어져 버리지만 이 get요청안에서 실행되게하면
 * 특정 주소의 특정 포트에서만 실행되게됨.
 *
 *
 */

/** 서버 객체 wss type*/
let socketReceiver: WebSocketServer | null = null;
const ClentList: Set<Client> = new Set([]);
const Dtates = new Date();

export async function GET(requests: NextRequest) {
  if (!socketReceiver) {
    console.error('WebSocket이 아직 준비되지 않았습니다.');
    socketReceiver = new WebSocketServer({ port: 4433 });

    socketReceiver.on('connection', (ws, wsReq) => {
      const uuidV = parse(wsReq.headers.cookie || '');
      const uuid = uuidV.uuid;
      if (!UuidValidate(uuid)) {
        ws.send(
          JSON.stringify({
            type: 'error',
            message: 'NOUUID',
          })
        );
        ws.close(1008, 'Invalid UUID');
        return;
      }
      const client: Client = { id: uuid, ws, subscriptions: new Set() };

      ClentList.add(client);

      const timer = setInterval(() => {
        ws.send(
          JSON.stringify({
            type: 'time',
            message: new Date().toISOString(),
          })
        );
      }, 1000);

      ws.on('message', (raw: WebSocket.Data) => {
        let msg: ClientMessage;

        try {
          // JSON.parse 결과를 ClientMessage로 단언
          msg = JSON.parse(raw.toString()) as ClientMessage;
        } catch {
          ws.send(JSON.stringify({ type: 'error', message: 'Invalid JSON' }));
          return;
        }

        // 3) 타입별 분기 처리
        switch (msg.type) {
          case 'subscribe':
            client.subscriptions.add(msg.topic);
            ws.send(JSON.stringify({ type: 'subscribed', topic: msg.topic }));
            break;

          case 'unsubscribe':
            client.subscriptions.delete(msg.topic);
            ws.send(JSON.stringify({ type: 'unsubscribed', topic: msg.topic }));
            break;

          case 'update':
            // update는 서버→클라이언트로만 쓰는 경우 생략 가능
            break;

          case 'error':
            console.error('Client error:', msg.message);
            break;
        }
      });

      ws.on('close', () => {
        clearInterval(timer);
      });
    });
  }

  return NextResponse.json({ message: 'WebSocket server is running' });
}

export const config = {
  api: {
    bodyParser: false,
  },
};

// 1. 각 클라이언트 객체는 구독목록을 가지고있고

// 전달받는 데이터는 구독 목록에 의해 정의됨.

// 2. 서버는 클라이언트 객체로 부터 구독 목록을받고

// 중복처리하여 다른서버로 소캣 요청을 해야함.

// 그럼 여러개의 엔드포인트로 여러개의 요청을
