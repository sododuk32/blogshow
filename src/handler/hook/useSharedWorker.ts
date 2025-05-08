'use client';
import { useEffect } from 'react';

export function RealTimeConnector() {
  useEffect(() => {
    const worker = new SharedWorker('/shared-worker.js');
    worker.port.start();

    worker.port.onmessage = (e) => {
      const msg = e.data;
      console.log(msg);
      if (msg.meta?.type === 'info' && msg.payload.id === 'ws') {
        console.log(`[WebSocket 상태]: ${msg.payload.currentValue}`);
      } else if (msg.__workerLog) {
        console.log('[Shared Worker 로그]:', ...msg.args);
      } else {
        console.log('[Shared Worker 데이터]:', msg);
      }
    };

    worker.port.postMessage({
      type: 'send',
      payload: {
        type: 'subscribe',
        topic: 'realtime',
        detail: '005930',
      },
    });

    return () => {
      worker.port.close();
    };
  }, []);

  return null;
}
