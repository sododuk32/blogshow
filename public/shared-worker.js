// public/shared-worker.js

const ports = [];
let socket = null;

onconnect = (e) => {
  const port = e.ports[0];
  ports.push(port);
  port.start();

  // 클라이언트→워커 메시지(필요 시)
  port.onmessage = (ev) => {
    // 예: 클라이언트가 서버로 보내고 싶을 때
    if (socket && ev.data?.type === 'send') {
      socket.send(JSON.stringify(ev.data.payload));
    }
  };

  // 최초 연결된 포트에서만 WS 생성
  if (!socket) {
    // 1) API 라우트로 초기화 호출 (keep‑alive 체크용)
    // fetch('/api/stream');

    // 2) WebSocket 연결
    socket = new WebSocket(`ws://localhost:4433/api/stream`);

    socket.onopen = () => {
      console.log('✅ WS connected');
      // 모든 탭에 연결 알림
      ports.forEach((p) =>
        p.postMessage({ meta: { type: 'info', requestCode: 'ws' }, payload: { id: 'ws', currentValue: 'connected' } })
      );
    };

    socket.onmessage = (e) => {
      const msg = JSON.parse(e.data);
      // 받은 메시지 그대로 브로드캐스트
      ports.forEach((p) =>
        p.postMessage(msg)
      );
    };

    socket.onclose = () => {
      console.log('⚠️ WS disconnected');
      ports.forEach((p) =>
        p.postMessage({ meta: { type: 'info', requestCode: 'ws' }, payload: { id: 'ws', currentValue: 'disconnected' } })
      );
    };
  }
};
