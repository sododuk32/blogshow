import React from 'react';
import { buttonEx, buttonReset } from './example.css';

export function ExButton({
  children,

  size = 'medium',
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  size?: 'small' | 'medium' | 'large';
}) {
  return (
    <button className={`${buttonReset} ${buttonEx({ size })}`} {...props}>
      11 {children}
    </button>
  );
}
