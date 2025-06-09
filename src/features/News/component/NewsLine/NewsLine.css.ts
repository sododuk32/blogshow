import { style } from '@vanilla-extract/css';
import {
  sprinkles,
  thumnailHeight,
  separateMediaQueres,
  thumnailWidth,
} from '@styles/theme/sparkles.css';
import { globals } from '@styles/theme/theme.css';
import { recipe } from '@vanilla-extract/recipes';

// receipe;

export const NewsLineBoxStyle = style([
  sprinkles({
    fontSize: {
      mobile: 'xsmallF',
      tablet: 'medium',
      desktop: 'large',
    },
    padding: {
      mobile: 'smallSpace',
      tablet: 'mediumSpace',
      desktop: 'largeSpace',
    },
  }),
  {
    width: '80%',
    height: '140px',
    display: 'grid',
    grid: `"title thumbnail" max-content
    "contents thumbnail" 1fr
    `,
    gap: '10px',
    gridTemplateColumns: 'minmax(0, 1fr) auto',
  },
]);

export const NewsTitle = style({
  gridArea: 'title',
});
export const NewsContent = style({
  gridArea: 'contents',
  height: '70px',
  display: 'block',
});
export const NewsExtra = style({
  gridArea: 'Extra',
  paddingTop: '5px',
});

export const NewsExtraPannel = style({
  display: 'contents',
  color: globals.color.slightgrayText,
});

// ----------  이 2개 항목은 sprinkles 필요.
export const NewsImageBox = style({
  gridArea: 'thumbnail',
  height: thumnailHeight.small, // 기본: 모바일
  '@media': {
    [separateMediaQueres.tablet]: {
      height: thumnailHeight.medium, // 태블릿
      width: thumnailWidth.medium,
    },
    [separateMediaQueres.desktop]: {
      height: thumnailHeight.large, // 데스크탑
      width: thumnailWidth.large,
    },
    [separateMediaQueres.mobile]: {
      height: thumnailHeight.small,
      width: thumnailWidth.small,
    },
  },
});

export const NewsImage = style({
  objectFit: 'fill',
  width: '100%',
  height: '100%',
});
