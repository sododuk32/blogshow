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

    // port가 준비되면 state에 넣어서 리렌더링 트리거
    setPort(worker.port);
    console.log(worker.port);
    // cleanup
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
    throw new Error('useSharedWorkerContext should be used within SharedWorkerContextProvider');
  }
  return context;
};
