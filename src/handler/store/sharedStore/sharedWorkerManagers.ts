let sharedWorkerInstance: SharedWorker | null = null;

export function setSharedWorker(worker: SharedWorker) {
  sharedWorkerInstance = worker;
}

export function getSharedWorkerInstance(): SharedWorker | null {
  if (typeof window === 'undefined') {
    // 서버 사이드에서는 SharedWorker를 사용할 수 없음
    throw new Error('SharedWorker는 클라이언트 환경에서만 사용할 수 있습니다.');
  }

  return sharedWorkerInstance;
}
