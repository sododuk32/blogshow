import { style } from '@vanilla-extract/css';
import { sprinkles } from '@styles/theme/sparkles.css';

// receipe;

export const cellStyleItem = style([
  sprinkles({
    fontSize: {
      mobile: 'xsmallF',
      tablet: 'medium',
      desktop: 'large',
    },
    padding: {
      mobile: 'xsmallSpace',
      tablet: 'smallSpace',
      desktop: 'smallSpace',
    },
  }),
  {
    width: '100%',
  },
]);
