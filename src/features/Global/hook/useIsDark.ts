import { useEffect, useState } from 'react';

export function useIsDark() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const match = window.matchMedia('(prefers-color-scheme: dark)');
    const update = () => setIsDark(match.matches);

    update(); // 초기값 설정
    match.addEventListener('change', update); // 시스템 다크모드 변경 감지

    return () => match.removeEventListener('change', update);
  }, []);

  return isDark;
}
