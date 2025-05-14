import { keyframes as vanillaKeyframes } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';
import { style } from '@vanilla-extract/css';

export const fitContentCell = style({
  width: '80%',
  padding: '5px 10px',
  borderRadius: '5px',
});
const redBlinkKeyframes = vanillaKeyframes({
  '0%': { backgroundColor: 'rgba(240, 68, 82,1.0)' },
  '25%': { backgroundColor: 'rgba(240, 68, 82,0.8)' },
  '50%': { backgroundColor: 'rgba(240, 68, 82,0.6)' },
  '75%': { backgroundColor: 'rgba(240, 68, 82,0.4)' },
  '100%': { backgroundColor: 'rgba(240, 68, 82,0.2)' },
});

const blueBlinkKeyframes = vanillaKeyframes({
  '0%': { backgroundColor: 'rgba(100, 168, 255,1.0)' },
  '25%': { backgroundColor: 'rgba(100, 168, 255,0.8)' },
  '50%': { backgroundColor: 'rgba(100, 168, 255,0.6)' },
  '75%': { backgroundColor: 'rgba(100, 168, 255,0.4)' },
  '100%': { backgroundColor: 'rgba(100, 168, 255,0.2)' },
});

export const blinkStyles = recipe({
  variants: {
    blink: {
      increase: {
        animationName: redBlinkKeyframes,
        animationDuration: '0.9s',
        animationTimingFunction: 'ease-out',
        animationFillMode: 'forwards',
      },
      decrease: {
        animationName: blueBlinkKeyframes,
        animationDuration: '0.9s',
        animationTimingFunction: 'ease-out',
        animationFillMode: 'forwards',
      },
    },
    alignments: {
      left: { textAlign: 'left' },
      middle: { textAlign: 'center' },
      right: { textAlign: 'right' },
    },
  },
  defaultVariants: {
    blink: undefined,
    alignments: 'middle',
  },
});
