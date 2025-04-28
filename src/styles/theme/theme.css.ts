import { createGlobalThemeContract, createGlobalTheme } from '@vanilla-extract/css';

export const globals = createGlobalThemeContract(
  {
    color: {
      brightRed: 'brightRed',
      brightBlue: 'brightBlue',
      hardRed: 'hardRed',
      slightBlue: 'slightBlue',
      blueText: 'blueText',
      grayText: 'grayText',
      slightgrayText: 'slightgrayText',
    },
    font: {
      body: 'font-body',
    },
    fontSize: {
      fxs: 'fxs',
      fsm: 'fsm',
      fnm: 'fnm',
      flg: 'flg',
      fxl: 'fxl',
      fxxl: 'fxxl',
      fhg: 'fhg',
    },
    backgroundColor: {
      hardBlack: 'hardBlack',
      slightBlack: 'slightBlack',
      blue50: 'blue50',
      blue100: 'blue10',
      blue150: 'blue150',
      gray50: 'gray50',
      whitebgg: 'whitebgg',
      gray100: 'gray100',
      adaptBlack: 'adaptBlack',
    },
    spacing: {
      xs: 'xs',
      s: 's',
      md: 'md',
      lg: 'lg',
      xl: 'xl',
      xxl: 'xxl',
    },
    // breakpoints: {
    //   xxl: 'xxl',
    //   xl: 'xl',
    //   lg: 'lg',
    //   md: 'md',
    //   sm: 'sm',
    //   xs: 'xs',
    // },
  },
  (value) => `${value}`
);

createGlobalTheme(':root', globals, {
  color: {
    brightRed: '#f04452',
    brightBlue: '#64afff20',
    hardRed: '#f04452',
    slightBlue: '#3182f',
    blueText: '#64a8ff',
    grayText: '#4e5968',
    slightgrayText: '#6b7684',
  },
  font: {
    body: 'arial',
  },
  fontSize: {
    fxs: '12px',
    fsm: '14px',
    fnm: '16px',
    flg: '18px',
    fxl: '20px',
    fxxl: '24px',
    fhg: '32px',
  },

  backgroundColor: {
    hardBlack: '#101013',
    slightBlack: '#17171c',
    blue50: 'rgba(100, 168, 255, 0.15)',
    blue100: 'rgba(100, 168, 255, 0.34)',
    blue150: 'rgba(100, 168, 255, 0.70)',
    gray50: 'rgba(2, 32, 71, 0.05)',
    gray100: 'rgba(2, 32, 71, 0.34)',
    whitebgg: 'white',
    adaptBlack: '#1B1B21',
  },
  spacing: {
    xs: '3px',
    s: '6px',
    md: '9px',
    lg: '12px',
    xl: '15px',
    xxl: '21px',
  },
  // breakpoints: {
  //   xxl: '1530px',
  //   xl: '1280px',
  //   lg: '768px',
  //   md: '500px',
  //   sm: '368px',
  //   xs: '280px',
  // },
});

// color.primary.red.500 – #f04452

// color.primary.blue.500 – #64afff20

// color.text.emphasis.blue – #64a8ff

// color.text.emphasis.red.500 – #f04452

// color.primary.blue.300 – #3182f

// color.text.emphasis.grey.700 – #4e5968

// color.overlay.dark.05 – rgba(2, 32, 71, 0.05)

// color.overlay.dark.34 – rgba(2, 32, 71, 0.34)

// color.text.secondary.grey.500 – #6b7684

// color.overlay.blue.15 – rgba(100, 168, 255, 0.15)

// color.overlay.blue.34 – rgba(100, 168, 255, 0.34)

// color.overlay.blue.70 – rgba(100, 168, 255, 0.70)

// color.background.black.dark – #101013

// color.background.black.light – #17171c
