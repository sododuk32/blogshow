// externalConnector.ts
import WebSocket, { WebSocketServer } from 'ws';
import type { ClientManager } from './ClientManage';
import { EndpointsRecord } from '@util/types/Socket/SocketConnect';

export class ExternalConnector {
  private sockets = new Map<string, WebSocket>();
  private configs: EndpointsRecord;

  constructor(manager: ClientManager, configs: EndpointsRecord) {
    this.configs = configs;

    Object.entries(configs).forEach(([topic, cfg]) => {
      const ws = new WebSocket(cfg.endpoint, { headers: cfg.header });

      ws.on('open', () => {
        console.log(`${topic} 외부 서버(${cfg.endpoint}) 연결됨`);
      });

      ws.on('message', (raw) => {
        const msg = JSON.parse(raw.toString());
        // msg.topic, msg.payload 형태로 온다고 가정
        manager.broadcast(msg.topic, msg.payload);
      });

      this.sockets.set(topic, ws);
    });
  }

  subscribe(topic: string, trKey: string) {
    const ws = this.sockets.get(topic);
    const cfg = this.configs[topic];
    if (!ws || !cfg) return;
    const body = { ...cfg.bodyTemplate, tr_key: trKey };
    ws.send(JSON.stringify({ header: cfg.header, body }));
  }

  unsubscribe(topic: string, trKey: string) {
    const ws = this.sockets.get(topic);
    const cfg = this.configs[topic];
    if (!ws || !cfg) return;
    const body = { ...cfg.bodyTemplate, tr_key: trKey, unsub: true };
    ws.send(JSON.stringify({ header: cfg.header, body }));
  }
}
