'use client';
import { createContext, ReactNode, useState, useContext, useEffect } from 'react';

interface SharedWorkerProps {
  port: MessagePort | null;
  postMessage: (msg: unknown) => void;
}

const SharedWorkerContext = createContext<SharedWorkerProps | undefined>(undefined);

export const SharedWorkerProvider = ({ children }: { children: ReactNode }) => {
  const [port, setPort] = useState<MessagePort | null>(null);

  useEffect(() => {
    const worker = new SharedWorker('/shared-worker.js', { type: 'module' });
    worker.port.start();

    setPort(worker.port);
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
