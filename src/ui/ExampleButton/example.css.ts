// src/button.css.ts
import { recipe } from '@vanilla-extract/recipes';
import { style } from '@vanilla-extract/css';
import { globals } from '../../styles/theme/theme.css';

export const buttonEx = recipe({
  base: {
    fontFamily: globals.font.body,
    fontSize: globals.fontSize.fnm,
    padding: `10px`,
    border: `1px solid ${globals.color.brightBlue}`,
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'background-color 150ms ease-out',
    backgroundColor: globals.backgroundColor.blue150,
    minWidth: '3vw',
  },

  variants: {
    intent: {
      primary: {
        backgroundColor: globals.color.brightBlue,
        color: globals.font.blueText,
      },
      danger: {
        backgroundColor: globals.color.brightBlue,
        color: globals.font.grayText,
      },
      neutral: {
        backgroundColor: globals.backgroundColor.gray50,
        color: globals.font.grayText,
      },
    },

    size: {
      small: {
        fontSize: globals.fontSize.fsm,
        padding: `${globals.spacing.xs} ${globals.spacing.s}`,
      },
      medium: {
        fontSize: globals.fontSize.fnm,
        padding: `${globals.spacing.s} ${globals.spacing.s}`,
      },
      large: {
        fontSize: globals.fontSize.fxl,
        padding: `${globals.spacing.md} ${globals.spacing.lg}`,
      },
    },
  },

  defaultVariants: {
    size: 'medium',
  },
});

// 필요하다면 스타일만 따로 추출하는 helper
export const buttonReset = style({
  boxSizing: 'border-box',
});
