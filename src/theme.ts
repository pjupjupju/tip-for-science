import theme from '@rebass/preset';

export const tipForScienceTheme = {
  ...theme,
  radii: { default: 0 },
  buttons: {
    ...(theme as any).buttons,
    primary: { ...(theme as any).buttons.primary, cursor: 'pointer' },
  },
  colors: {
    background: 'black',
    primary: '#FF0070',
    secondary: '#D76B90',
    neutralFade: '#414141',
    accent: '#5CC9FA',
    graphScore: '#fdf41c',
  },
  fonts: {
    ...(theme as any).fonts,
    // todo: why this doesn't work, probably some problem with rebass and emotion?
    body: 'Jost',
    heading: 'Raleway',
  },
};
