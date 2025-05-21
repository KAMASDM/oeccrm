// src/theme.js
import { createTheme, alpha } from '@mui/material/styles';

const lavenderTheme = createTheme({
  palette: {
    primary: {
      light: '#c5b0e6',
      main: '#9575cd',
      dark: '#7953b3',
      contrastText: '#fff',
    },
    secondary: {
      light: '#efc0ff',
      main: '#ba68c8',
      dark: '#883997',
      contrastText: '#fff',
    },
    success: {
      light: '#a7d7c5',
      main: '#66bb6a',
      dark: '#43a047',
      contrastText: '#fff',
    },
    error: {
      light: '#ffb3c4',
      main: '#f06292',
      dark: '#e91e63',
      contrastText: '#fff',
    },
    info: {
      light: '#b3e0ff',
      main: '#64b5f6',
      dark: '#1976d2',
      contrastText: '#fff',
    },
    warning: {
      light: '#fff1b8',
      main: '#ffb74d',
      dark: '#f57c00',
      contrastText: '#fff',
    },
    background: {
      default: '#f5f3fa',
      paper: '#ffffff',
    },
    text: {
      primary: '#3f3b5b',
      secondary: '#69668a',
    },
  },
  shape: {
    borderRadius: 16,
  },
  typography: {
    fontFamily: [
      'Poppins',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          boxShadow: '0 10px 20px rgba(149, 117, 205, 0.1)',
          transition: 'transform 0.2s, box-shadow 0.2s',
          '&:hover': {
            boxShadow: '0 15px 30px rgba(149, 117, 205, 0.15)',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          textTransform: 'none',
          boxShadow: 'none',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 4px 10px rgba(149, 117, 205, 0.25)',
          },
        },
        contained: {
          boxShadow: '0 2px 6px rgba(149, 117, 205, 0.2)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: alpha('#9575cd', 0.5),
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: '#9575cd',
            },
          },
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        rounded: {
          borderRadius: 20,
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          boxShadow: '0 4px 8px rgba(149, 117, 205, 0.2)',
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        root: {
          '& .MuiTabs-indicator': {
            backgroundColor: '#9575cd',
            height: 3,
          },
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          '&.Mui-selected': {
            color: '#9575cd',
            fontWeight: 600,
          },
        },
      },
    },
  },
});

export default lavenderTheme;