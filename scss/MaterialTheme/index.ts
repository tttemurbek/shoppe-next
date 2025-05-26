import { common } from '@mui/material/colors';
import shadow from './shadow';
import typography from './typography';


/**
 * LIGHT THEME (DEFAULT)
 */
export const light = {
  palette: {
    mode: 'light' as const,
    background: {
      default: '#f4f6f8',
      paper: common.white,
    },
    primary: {
      contrastText: '#ffffff',
      main: '#E92C28',
    },
    secondary: {
      main: '#1646C1',
    },
    text: {
      primary: '#{$text-primary}',
      secondary: '#{text-secondary}',
      dark: common.black,
    },
    divider: '#eeeeee',
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        html: {
          height: '100%',
          colorScheme: 'light',
        },
        body: {
          background: '#fff',
          height: '100%',
          minHeight: '100%',
          transition: 'background-color 0.3s ease, color 0.3s ease',
        },
        p: {
          margin: '0',
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          letterSpacing: '0',
          transition: 'color 0.3s ease',
        },
      },
      defaultProps: {
        variantMapping: {
          h1: 'h1',
          h2: 'h2',
          h3: 'h3',
          h4: 'h4',
          h5: 'h5',
          h6: 'h6',
          subtitle1: 'p',
          subtitle2: 'p',
          subtitle3: 'p',
          body1: 'p',
          body2: 'p',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          transition: 'background-color 0.3s ease, box-shadow 0.3s ease',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          color: '#212121',
          minWidth: 'auto',
          lineHeight: '1.2',
          boxShadow: 'none',
          transition: 'all 0.3s ease',
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          height: '48px',
          width: '100%',
          backgroundColor: '#fff',
          transition: 'background-color 0.3s ease, border-color 0.3s ease',
          input: {
            transition: 'color 0.3s ease',
          },
        },
        notchedOutline: {
          padding: '8px',
          top: '-9px',
          border: '1px solid #eee',
          transition: 'border-color 0.3s ease',
        },
      },
    },
    // ... rest of your light theme components
  },
  shadow,
  typography,
};

/**
 * DARK THEME
 */
export const dark = {
  palette: {
    mode: 'dark' as const,
    background: {
      default: '#1e1e1e',
      paper: '#1e1e1e',
    },
    primary: {
      contrastText: '#ffffff',
      main: '#E92C28',
    },
    secondary: {
      main: '#1646C1',
    },
    text: {
      primary: '#{$text-primary}',
      secondary: '#{$text-secondary}',
      dark: common.white,
    },
    divider: '#2d2d2d',
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        html: {
          height: '100%',
          colorScheme: 'dark',
        },
        body: {
          background: '#1e1e1e',
          height: '100%',
          minHeight: '100%',
          color: '#ffffff',
          transition: 'background-color 0.3s ease, color 0.3s ease',
        },
        p: {
          margin: '0',
          color: '#ffffff',
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          letterSpacing: '0',
          color: '#ffffff',
          transition: 'color 0.3s ease',
        },
      },
      defaultProps: {
        variantMapping: {
          h1: 'h1',
          h2: 'h2',
          h3: 'h3',
          h4: 'h4',
          h5: 'h5',
          h6: 'h6',
          subtitle1: 'p',
          subtitle2: 'p',
          subtitle3: 'p',
          body1: 'p',
          body2: 'p',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: '#1e1e1e',
          backgroundImage: 'none',
          transition: 'background-color 0.3s ease, box-shadow 0.3s ease',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          color: '#ffffff',
          minWidth: 'auto',
          lineHeight: '1.2',
          boxShadow: 'none',
          transition: 'all 0.3s ease',
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.08)',
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          height: '48px',
          width: '100%',
          backgroundColor: '#1e1e1e',
          transition: 'background-color 0.3s ease, border-color 0.3s ease',
          '& fieldset': {
            borderColor: '#2d2d2d',
            transition: 'border-color 0.3s ease',
          },
          '&:hover fieldset': {
            borderColor: '#3d3d3d',
          },
          '&.Mui-focused fieldset': {
            borderColor: '#E92C28',
          },
        },
        input: {
          color: '#ffffff',
          transition: 'color 0.3s ease',
        },
      },
    },
    // ... rest of your dark theme components
  },
  shadow,
  typography,
};
