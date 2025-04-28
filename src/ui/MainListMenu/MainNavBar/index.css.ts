// index.css.ts
import { style } from '@vanilla-extract/css';
import { globals } from '@styles/theme/theme.css';
import { sprinkles } from '../../../styles/theme/sparkles.css';

export const MainNav = style({
  fontSize: 'medium',
  display: 'flex',
  flexDirection: 'row',
  listStyle: 'none',
  padding: globals.spacing.md,
});
export const MainNavItem = style({
  fontSize: 'medium',
  cursor: 'pointer',
  padding: '8px 12px',
  userSelect: 'none',
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
