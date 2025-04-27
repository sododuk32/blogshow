import { defineProperties, createSprinkles } from '@vanilla-extract/sprinkles';

export const space = {
  none: '0px',
  small: '4px',
  medium: '8px',
  large: '16px',
  xlarge: '32px',
};
export const fontSize = {
  xlarge: '21px',
  large: '16px',
  medium: '14px',
  small: '11px',
  xsmall: '10px',
};
const responsivePrope = defineProperties({
  conditions: {
    mobile: { '@media': 'screen and (max-width: 767px)' },
    tablet: { '@media': 'screen and (min-width: 768px) and (max-width: 1023px)' },
    desktop: { '@media': 'screen and (min-width: 1024px)' },
    lightMode: { '@media': '(prefers-color-scheme: light)' },
    darkMode: { '@media': '(prefers-color-scheme: dark)' },
  },
  responsiveArray: ['mobile', 'tablet', 'desktop'],
  defaultCondition: 'desktop',
  properties: {
    width: ['100%', '50%', '25%'],
    padding: Object.keys(space),
    fontSize: Object.keys(fontSize),
  },
});

export const sprinkles = createSprinkles(responsivePrope);
