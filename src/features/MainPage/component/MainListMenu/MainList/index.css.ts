import { style } from '@vanilla-extract/css';
import { sprinkles } from '@styles/theme/sparkles.css';
import { globals } from '@styles/theme/theme.css';
export const box = sprinkles({
  width: {
    mobile: '100%',
    tablet: '100%',
    desktop: '800px',
  },
  padding: {
    mobile: 'smallSpace',
    tablet: 'mediumSpace',
    desktop: 'largeSpace',
  },
  backgroundColor: {
    lightMode: globals.backgroundColor.whitebgg,
    darkMode: globals.backgroundColor.slightBlack,
  },
  color: {
    lightMode: 'black',
    darkMode: 'white',
  },
});
