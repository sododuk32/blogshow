'use client';
import { createContext, ReactNode, useState, useContext, useEffect } from 'react';

interface SharedWorkerProps {
  port: MessagePort | null;
  postMessage: (msg: unknown) => void;
}

const SharedWorkerContext = createContext<SharedWorkerProps | undefined>(undefined);

/**
 * sharedworker 프로바이더,컨텍스트
 * @param param0
 * @returns
 */
export const SharedWorkerProvider = ({ children }: { children: ReactNode }) => {
  const [port, setPort] = useState<MessagePort | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const worker = new SharedWorker('/shared-worker.js', { type: 'module' });
    worker.port.start();

    setPort(worker.port);

    /** close 리스너 있어야 worker 인스턴스가 올바르게 동작함. */
    window.addEventListener('beforeunload', () => {
      worker.port.postMessage({ type: 'disconnect' });
      worker.port.close();
    });
    return () => {
      worker.port.close();
    };
  }, []);

  const postMessage = (message: unknown) => {
    if (port) port.postMessage(message);
  };
  return (
    <SharedWorkerContext.Provider value={{ port, postMessage }}>
      {children}
    </SharedWorkerContext.Provider>
  );
};

export const useSharedWorkerContext = () => {
  const context = useContext(SharedWorkerContext);
  if (!context) {
    throw new Error('worker not exist');
  }
  return context;
};
