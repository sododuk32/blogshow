/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect, useState, useRef } from 'react';
import { useStringRealTimeStore } from '@handler/store/sharedStore/useRealTimeStore';
type Message = { type: string; message: any };

export default function WebSocketDemo() {
  const googPaper = useStringRealTimeStore(
    // 1) selector: papers.stock.GOOG만 반환
    (state) => state.papers['time']?.['times']
    // 2) equalityFn: currentValue가 바뀔 때만 리렌더
  );

  return (
    <div style={{ padding: 20 }}>
      <h2>WebSocket 메시지 로그</h2>
      <ul>
        <li key="logs">{googPaper?.payload?.id || 'load'}</li>
        <li key="message">
          <strong>[{googPaper?.payload?.currentValue || 'load'}]</strong>
        </li>
      </ul>
    </div>
  );
}
