import { common } from '@mui/material/colors';
import shadow from './shadow';
import typography from './typography';

export const dark = {
  palette: {
    mode: 'dark',
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
      primary: '#ffffff',
      secondary: '#b0b0b0',
      dark: common.white,
    },
  },
  components: {
    MuiTypography: {
      styleOverrides: {
        root: {
          letterSpacing: '0',
        },
      },
    },
    MuiLink: {
      styleOverrides: {
        root: {
          color: '#b0b0b0',
          textDecoration: 'none',
          '&:hover': {
            color: '#ffffff',
          },
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: '#2d2d2d',
        },
      },
    },
    MuiCssBaseline: {
      styleOverrides: {
        html: { height: '100%' },
        body: {
          background: '#1e1e1e',
          height: '100%',
          minHeight: '100%',
          color: '#ffffff',
        },
        p: {
          margin: '0',
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
          backgroundColor: '#2d2d2d',
          '& fieldset': {
            borderColor: '#2d2d2d',
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
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          backgroundColor: '#2d2d2d',
          color: '#ffffff',
        },
        icon: {
          color: '#b0b0b0',
        },
      },
    },
    MuiFormHelperText: {
      styleOverrides: {
        root: {
          margin: '5px 0 0 2px',
          lineHeight: '1.2',
          color: '#b0b0b0',
        },
      },
    },
    MuiStepIcon: {
      styleOverrides: {
        root: {
          color: '#2d2d2d',
          borderRadius: '50%',
          border: '1px solid #3d3d3d',
        },
        text: {
          fill: '#b0b0b0',
        },
      },
    },
    MuiStepConnector: {
      styleOverrides: {
        line: {
          borderColor: '#2d2d2d',
        },
      },
    },
    MuiCheckbox: {
      styleOverrides: {
        root: {
          color: '#b0b0b0',
          '&.Mui-checked': {
            color: '#E92C28',
          },
        },
      },
    },
    MuiRadio: {
      styleOverrides: {
        root: {
          color: '#b0b0b0',
          '&.Mui-checked': {
            color: '#E92C28',
          },
        },
      },
    },
    MuiSwitch: {
      styleOverrides: {
        root: {
          '& .MuiSwitch-switchBase': {
            color: '#b0b0b0',
          },
          '& .MuiSwitch-switchBase.Mui-checked': {
            color: '#E92C28',
            '& + .MuiSwitch-track': {
              backgroundColor: '#E92C28',
            },
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: '#1e1e1e',
          backgroundImage: 'none',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#1e1e1e',
          backgroundImage: 'none',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#1e1e1e',
          backgroundImage: 'none',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: '#1e1e1e',
          backgroundImage: 'none',
        },
      },
    },
  },
  typography,
  shadows: shadow,
};
