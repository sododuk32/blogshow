import { globals } from '@styles/theme/theme.css';
import { style, globalStyle } from '@vanilla-extract/css';

export const tableStyle = style({
  width: '100%',
  borderCollapse: 'collapse',
  backgroundColor: 'white',
  fontSize: 'medium',
  textAlign: 'center',
  lineHeight: '1.5',
  color: 'black',
});

globalStyle(`${tableStyle} tbody tr:nth-child(odd)`, {
  backgroundColor: globals.backgroundColor.gray50,
});

export const cellStyle = style({
  padding: '6px 4px', // 셀 안 여백
  borderBottom: '1px solid #e0e0e0', // 줄 간격 나누기
});

export const headerBlue = style({
  color: globals.color.blueText,
  fontWeight: 'bold',
});
export const cellRed = style({
  color: globals.color.hardRed,
});
export const cellBlue = style({
  color: globals.color.blueText,
});
