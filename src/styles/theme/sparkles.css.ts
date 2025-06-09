import { defineProperties, createSprinkles } from '@vanilla-extract/sprinkles';
import { globals } from '@styles/theme/theme.css';
export const space = {
  none: '0px',
  xsmallSpace: '2px',
  smallSpace: '4px',
  mediumSpace: '8px',
  largeSpace: '16px',
  xlargeSpace: '32px',
};
export const fontSize = {
  xlarge: '21px',
  large: '16px',
  medium: '14px',
  small: '11px',
  vwsamll: '3vw',
  xsmallF: '10px',
};
export const thumnailHeight = {
  large: '120px',
  medium: '90px',
  small: '60px',
};

export const thumnailWidth = {
  large: '160px',
  medium: '120px',
  small: '80px',
};

export const separateMediaQueres = {
  desktop: 'screen and (min-width: 1024px)',
  tablet: 'screen and (min-width: 768px) and (max-width: 1023px)',
  mobile: 'screen and (max-width: 767px)',
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
  // Object.keys(...) 로 properties value 선언한다음, 다른쪽에서 동일한 property를 다른 용도로 선언하면 overload에러났었음.
  // 객체 리터럴로 전달하니까 동일 keyname이여도 문제없어짐.
  properties: {
    width: ['800px', '100%', '50%', '25%'],
    padding: space,
    fontSize: fontSize,
    backgroundColor: [globals.backgroundColor.slightBlack, globals.backgroundColor.whitebgg],
    color: ['black', 'white'],
    paddingTop: space,
    paddingRight: space,
    paddingBottom: space,
    paddingLeft: space,
  },
  shorthands: {
    p: ['paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft'],
    px: ['paddingLeft', 'paddingRight'],
    py: ['paddingTop', 'paddingBottom'],
  },
});

export const sprinkles = createSprinkles(responsivePrope);
