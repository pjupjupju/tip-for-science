import { grey, pink } from '@mui/material/colors';
import { createTheme } from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface Palette {
    accent: Palette['primary'];
    dimmed: Palette['primary'];
    expressive: Palette['primary'];
  }
  interface PaletteOptions {
    accent?: PaletteOptions['primary'];
    dimmed?: PaletteOptions['primary'];
    expressive?: PaletteOptions['primary'];
  }
}

declare module '@mui/material' {
  interface ButtonPropsColorOverrides {
    accent: true;
    dimmed: true;
  }
}

// relic of rebass theme, later we should getColor() on MUI theme
export const tipForSciencePalette = {
  background: 'black',
  primary: '#FF0070',
  secondary: '#D76B90',
  neutralFade: '#414141',
  accent: '#5CC9FA',
  graphScore: '#fdf41c',
};

export const getColor = (colorId: string) => tipForSciencePalette[colorId];

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
          '&.Mui-disabled': {
            color: grey[400],
            borderColor: grey[700],
            backgroundColor: grey[800],
            opacity: 0.35,
          },
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
    MuiRadio: {
      defaultProps: {
        color: 'primary',
      },
      styleOverrides: {
        root: {
          color: grey[800],
          '&.Mui-checked': {
            color: pink[500],
          },
          '&.Mui-disabled': {
            color: grey[300],
          },
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
    expressive: {
      main: '#fdf41c',
    },
    text: {
      secondary: '#D76B90',
    },
  },
  typography: {
    fontFamily: "'Jost', 'Helvetica Neue', sans-serif",
    h1: {
      fontFamily: '"Raleway", sans-serif',
    },
    h2: {
      fontFamily: '"Raleway", sans-serif',
    },
    h3: {
      fontFamily: '"Raleway", sans-serif',
    },
    h4: {
      fontFamily: '"Raleway", sans-serif',
    },
    h5: {
      fontFamily: '"Raleway", sans-serif',
    },
    h6: {
      fontFamily: '"Raleway", sans-serif',
    },
  },
});
