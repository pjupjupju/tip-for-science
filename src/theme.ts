import theme from '@rebass/preset';

export const tipForScienceTheme = {
  ...theme,
  radii: { default: 0 },
  buttons: {
    ...(theme as any).buttons,
    primary: { ...(theme as any).buttons.primary, cursor: 'pointer' },
  },
  colors: { background: 'black', primary: '#FF0070', secondary: '#5CC9FA' },
  fonts: {
    ...(theme as any).fonts,
    body: 'Tahoma',
    heading: 'Tahoma',
  },
};
