// src/button.css.ts
import { recipe } from '@vanilla-extract/recipes';
import { style } from '@vanilla-extract/css';
import { vars } from '../../styles/theme/theme.css';

export const buttonEx = recipe({
  base: {
    fontFamily: vars.font.body,
    fontSize: vars.fontSize.fnm,
    padding: `10px`,
    border: `1px solid ${vars.color.brightBlue}`,
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'background-color 150ms ease-out',
    backgroundColor: vars.backgroundColor.blue150,
    minWidth: '3vw',
  },

  variants: {
    intent: {
      primary: {
        backgroundColor: vars.color.brightBlue,
        color: vars.font.blueText,
      },
      danger: {
        backgroundColor: vars.color.brightBlue,
        color: vars.font.grayText,
      },
      neutral: {
        backgroundColor: vars.backgroundColor.gray50,
        color: vars.font.grayText,
      },
    },

    size: {
      small: {
        fontSize: vars.fontSize.fsm,
        padding: `${vars.spacing.xs} ${vars.spacing.s}`,
      },
      medium: {
        fontSize: vars.fontSize.fnm,
        padding: `${vars.spacing.s} ${vars.spacing.s}`,
      },
      large: {
        fontSize: vars.fontSize.fxl,
        padding: `${vars.spacing.md} ${vars.spacing.lg}`,
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
