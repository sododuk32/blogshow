'use client';
import { useState, useEffect } from 'react';

export default function CurTime({ targetDom }: { targetDom: string }) {
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return <label htmlFor="targetDom">{currentTime}</label>;
}
