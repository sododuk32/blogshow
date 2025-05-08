const ports = [];
let socket = null;

onconnect = (e) => {
  const port = e.ports[0];
  ports.push(port);
  port.start();

  port.onmessage = (ev) => {
    if (socket && ev.data?.type === 'send') {
      const message = JSON.stringify(ev.data.payload);
      socket.send(message);

      ports.forEach((p) =>
        p.postMessage({
          __workerLog: true,
          args: [`클라이언트에서 받은 메시지 전송됨:`, ev.data.payload],
        })
      );
    }
  };

  if (!socket) {
    socket = new WebSocket(`ws://localhost:4433`);

    socket.onopen = () => {
      // 소켓으로 메시지를 보내는 코드로 수정
      socket.send(JSON.stringify({
        type: 'subscribe', topic: 'realtime', detail: '005930'
      }));
    
      console.log('✅ WS connected');
      ports.forEach((p) =>
        p.postMessage({
          __workerLog: true,
          args: ['서버로 subscribe 메시지 전송됨', { type: 'subscribe', topic: 'realtime', detail: '005930' }]
        })
      );
    };
    

    socket.onmessage = (e) => {
      let parsedMsg;
      try {
        parsedMsg = JSON.parse(e.data);
      } catch (err) {
        ports.forEach((p) =>
          p.postMessage({
            __workerLog: true,
            args: ['WebSocket 메시지 파싱 에러:', e.data],
          })
        );
        return;
      }
      console.log(parsedMsg)
      ports.forEach((p) => p.postMessage(parsedMsg));
    };

    socket.onclose = () => {
      console.log('⚠️ WS disconnected');
      ports.forEach((p) =>
        p.postMessage({ type: 'removeClient' })
      );
    };
  }
};
