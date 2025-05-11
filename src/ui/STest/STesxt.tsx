/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect, useState, useRef } from 'react';
type Message = { type: string; message: any };

export default function WebSocketDemo() {
  return (
    <div style={{ padding: 20 }}>
      <h2>WebSocket 메시지 로그</h2>
    </div>
  );
}
