/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect, useState, useRef } from 'react';

type Message = { type: string; message: any };

export default function WebSocketDemo() {
  const [logs, setLogs] = useState<Message[]>([]);
  const wsRef = useRef<WebSocket>();

  useEffect(() => {
    // 1) API 라우트 호출해 서버측 wss 초기화
    fetch('/api/stream');

    // 2) WebSocket 연결
    // const protocol = location.protocol === 'https:' ? 'wss' : 'ws';
    const socket = new WebSocket(`ws://localhost:4433/api/stream`);
    wsRef.current = socket;

    socket.onopen = () => {
      console.log('✅ WS connected');
      setLogs((prev) => [{ type: 'info', message: 'connected' }]);

      // 서버로 메시지 보내보기
      socket.send(JSON.stringify({ msg: 'hello from client' }));
    };

    socket.onmessage = (e) => {
      const data: Message = JSON.parse(e.data);
      console.log('📨', data);
      setLogs((prev) => [data]);
    };

    socket.onclose = () => {
      console.log('⚠️ WS disconnected');
      setLogs((prev) => [{ type: 'info', message: 'disconnected' }]);
    };

    return () => {
      socket.close();
    };
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2>WebSocket 메시지 로그</h2>
      <ul>
        <li key="logs">
          <strong>[{logs[0].type}]</strong>
        </li>
        <li key="message">
          <strong>[{logs[0].message}]</strong>
        </li>
      </ul>
    </div>
  );
}
