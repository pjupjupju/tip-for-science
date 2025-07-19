import theme from '@rebass/preset';
import { grey, pink } from '@mui/material/colors';
import { createTheme } from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface Palette {
    accent: Palette['primary'];
    dimmed: Palette['primary'];
  }
  interface PaletteOptions {
    accent?: PaletteOptions['primary'];
    dimmed?: PaletteOptions['primary'];
  }
}

declare module '@mui/material' {
  interface ButtonPropsColorOverrides {
    accent: true;
    dimmed: true;
  }
}

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
    // todo: why this doesn't work - because mismatch of emotion/rebass/react versions, outdated
    body: 'Jost',
    heading: 'Raleway',
  },
};

export const getColor = (colorId: string) => tipForScienceTheme.colors[colorId];

export const resetStyles = `
body,
html,
#root {
  width: 100%;
  height: 100%;
}

body {
  margin: 0;
  background-color: #161616;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-family: 'Jost', 'Helvetica Neue', sans-serif;
}
code {
  font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
    monospace;
}

button {
  font-family: 'Jost', 'Helvetica Neue', sans-serif;
}

input {
  font-family: 'Jost', 'Helvetica Neue', sans-serif;
}

/* chart bottom axis styles */
text[dominant-baseline='text-before-edge'] {
  font-size: 12px !important;
  font-family: 'Courier New';
}
`;

export const muiTheme = createTheme({
  components: {
    MuiButtonBase: {
      defaultProps: {
        disableRipple: true,
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          boxShadow: 'none',
          fontWeight: 600,
          textTransform: 'none',
        },
      },
    },
    MuiAutocomplete: {
      styleOverrides: {
        inputRoot: {
          paddingTop: 1,
          paddingBottom: 1,
          '.MuiOutlinedInput-notchedOutline': {
            borderRadius: 2,
            borderColor: grey[600],
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderWidth: '1px',
            borderStyle: 'solid',
            borderColor: grey[600],
          },
          '&:focus .MuiOutlinedInput-notchedOutline': {
            borderWidth: '1px',
            borderStyle: 'solid',
            borderColor: grey[600],
          },
        },
      },
    },
    MuiInput: {
      styleOverrides: {
        input: {
          padding: '8px 12px',
          borderWidth: '1px',
          borderStyle: 'solid',
          borderRadius: 2,
          borderColor: grey[600],
        },
      },
      defaultProps: {
        disableUnderline: true,
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: grey[800],
        },
      },
    },
  },
  palette: {
    primary: {
      main: pink[500],
    },
    secondary: {
      main: grey[800],
    },
    dimmed: {
      main: '#D76B90',
    },
    accent: {
      main: '#5CC9FA',
      contrastText: '#ffffff',
    },
    text: {
      secondary: '#D76B90',
    },
  },
  typography: {
    fontFamily: "'Jost', 'Helvetica Neue', sans-serif",
  },
});
