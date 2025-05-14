// src/handler/hooks/useSharedWorkerPort.ts
'use client';

import { useState, useEffect } from 'react';

export function useSharedWorkerPort(): MessagePort | null {
  const [port, setPort] = useState<MessagePort | null>(null);

  useEffect(() => {
    if (typeof SharedWorker === 'undefined') return;

    const worker = new SharedWorker('/shared-worker.js', { type: 'module' });
    worker.port.start();
    console.log(worker);
    setPort(worker.port);

    return () => {
      // 언마운트 시 포트 닫기(필요시)
      worker.port.close();
    };
  }, []);

  return port;
}
