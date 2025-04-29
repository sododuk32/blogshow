// index.css.ts
import { style } from '@vanilla-extract/css';
import { globals } from '@styles/theme/theme.css';
import { sprinkles } from '@styles/theme/sparkles.css';
import { recipe } from '@vanilla-extract/recipes';

export const MainNav = style([
  {
    display: 'flex',
    flexDirection: 'row',
    listStyle: 'none',
  },
  sprinkles({
    py: {
      mobile: 'xsmallSpace', // 2px
      tablet: 'mediumSpace', // 4px
      desktop: 'mediumSpace', // 8px
    },
    // 좌우 padding
    px: {
      mobile: 'smallSpace', // 4px
      tablet: 'mediumSpace', // 8px
      desktop: 'mediumSpace', //16px
    },
  }),
]);
export const MainNavItem = recipe({
  base: [
    {
      cursor: 'pointer',
      userSelect: 'none',
    },
    // sprinkles에서 반환되는 atomic 클래스를 그대로 섞어줍니다
    sprinkles({
      fontSize: {
        mobile: 'xsmallF',
        tablet: 'small',
        desktop: 'medium',
      },
      py: {
        mobile: 'xsmallSpace', // 2px
        tablet: 'smallSpace', // 4px
        desktop: 'smallSpace', // 8px
      },
      // 좌우 padding
      px: {
        mobile: 'xsmallSpace', // 4px
        tablet: 'smallSpace', // 8px
        desktop: 'smallSpace', //16px
      },
    }),
    {
      selectors: {
        '&::after': {
          content: '""',
          position: 'relative',
          display: 'flex',
          height: '2px',
          backgroundColor: 'currentColor',
          transition: 'width 0.3s ease-out', // 올바른 transition 사용
        },
      },
    },
  ],
  variants: {
    selected: {
      true: {
        // selected일 때 ::after만 width를 늘림
        selectors: {
          '&::after': {
            width: '100%',
          },
        },
      },
      false: {
        selectors: {
          '&::after': {
            width: '0%',
          },
        },
      },
    },
  },
  defaultVariants: {
    selected: false,
  },
});
export const tableWrapper = style({
  width: '100%',
});
export const titleWrapper = style({
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  gap: globals.spacing.md,
});
