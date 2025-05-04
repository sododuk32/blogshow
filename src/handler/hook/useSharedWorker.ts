'use client';
import { useEffect } from 'react';
import { useStringRealTimeStore } from '../store/sharedStore/useRealTimeStore';

// export interface SubscriptionPaper<G> {
//     /** 구독 메타 정보 */
//     meta: {
//       type: string;
//       requestCode: string;
//     };
//     /** 실시간 값 */
//     payload: {
//       /** 값 식별자, 다른걸로 바꿔도댐 */
//       id: string;
//       /** 제네릭 형태로 바꿔야함.  */
//       currentValue: G;
//     };
//   }

export function RealTimeConnector() {
  const updatePaper = useStringRealTimeStore((s) => s.updatePaper);

  useEffect(() => {
    const worker = new SharedWorker('/shared-worker.js');
    worker.port.start();
    worker.port.onmessage = (e) => {
      const result = {
        meta: {
          type: 'time',
          requestCode: 'times',
        },
        payload: {
          id: '1',
          currentValue: e.data.message,
        },
      };
      updatePaper(result);
    };
    return () => {
      worker.port.close();
    };
  }, [updatePaper]);

  return null;
}
