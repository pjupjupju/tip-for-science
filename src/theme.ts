import theme from '@rebass/preset';

export const tipForScienceTheme = {
  ...theme,
  radii: { default: 0 },
  colors: { background: 'black', primary: '#FF0070', secondary: '#5CC9FA' },
  fonts: {
    body: 'Tahoma',
    ...(theme as any).fonts,
  },
};
