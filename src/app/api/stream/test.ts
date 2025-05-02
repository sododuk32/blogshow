import { NextRequest, NextResponse } from 'next/server';
import WebSocket, { WebSocketServer } from 'ws';

interface Client {
  id: string;
  ws: WebSocket;
}

/** 서버 객체 wss */
let wss: WebSocketServer | null = null;

let clients: Client[] = [];

export async function GET(requests: NextRequest) {
  if (!wss) {
    console.log('WebSocket server is initializing');

    // 포트번호는 원하는 포트로 변경하여 사용
    wss = new WebSocketServer({ port: 4433 });

    wss.on('connection', (ws) => {
      const clientId = requests.cookies.get('uuid')?.value || '';
      if (clientId === '') {
        ws.on('close', () => {
          clients = clients.filter((client) => client.ws !== ws);
          console.log(`Client disconnected: ${clientId}`);
        });
      }

      clients.push({ id: clientId, ws });

      ws.send(JSON.stringify({ type: 'id', id: clientId }));

      ws.on('message', (message: string) => {
        const data = JSON.parse(message);

        // 개인에게 메시지 전송
        if (data.type === 'private') {
          const recipient = clients.find((client) => client.id === data.to);
          if (recipient) {
            recipient.ws.send(
              JSON.stringify({
                type: 'private',
                from: data.from,
                message: data.message,
              })
            );
          }

          // 전역으로 메시지 전송
        } else if (data.type === 'broadcast') {
          clients.forEach((client) => {
            if (client.id !== data.from) {
              client.ws.send(
                JSON.stringify({
                  type: 'broadcast',
                  from: data.from,
                  message: data.message,
                })
              );
            }
          });
        }
      });

      ws.on('close', () => {
        clients = clients.filter((client) => client.ws !== ws);
        console.log(`Client disconnected: ${clientId}`);
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
