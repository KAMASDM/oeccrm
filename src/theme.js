import { createTheme, alpha } from "@mui/material/styles";

const lavenderTheme = createTheme({
  palette: {
    mode: 'light', // Force light mode only
    primary: {
      light: "#c5b0e6",
      main: "#9575cd",
      dark: "#7953b3",
      contrastText: "#fff",
    },
    secondary: {
      light: "#efc0ff",
      main: "#ba68c8",
      dark: "#883997",
      contrastText: "#fff",
    },
    background: {
      default: "#f5f3fa",
      paper: "#ffffff",
    },
    text: {
      primary: "#3f3b5b",
      secondary: "#69668a",
    },
  },
  shape: {
    borderRadius: 16,
  },
  typography: {
    fontFamily: '"Poppins", sans-serif',
    button: {
      fontWeight: 500,
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#ffffff',
          color: '#3f3b5b',
          boxShadow: '0 2px 10px rgba(149, 117, 205, 0.1)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          boxShadow: "0 10px 20px rgba(149, 117, 205, 0.1)",
          transition: "transform 0.2s, box-shadow 0.2s",
          "&:hover": {
            transform: "translateY(-2px)",
            boxShadow: "0 15px 30px rgba(149, 117, 205, 0.15)",
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          textTransform: "none",
          boxShadow: "none",
          transition: "all 0.2s ease-in-out",
          "&:hover": {
            transform: "translateY(-2px)",
            boxShadow: "0 4px 10px rgba(149, 117, 205, 0.25)",
          },
        },
        contained: {
          boxShadow: "0 2px 6px rgba(149, 117, 205, 0.2)",
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 12,
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: alpha("#9575cd", 0.5),
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: "#9575cd",
              boxShadow: "0 0 0 2px rgba(149, 117, 205, 0.2)",
            },
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 20,
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          boxShadow: "0 4px 8px rgba(149, 117, 205, 0.2)",
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        root: {
          "& .MuiTabs-indicator": {
            backgroundColor: "#9575cd",
            height: 3,
          },
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: "none",
          "&.Mui-selected": {
            color: "#9575cd",
            fontWeight: 600,
          },
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          margin: '4px 8px',
          '&.Mui-selected': {
            backgroundColor: alpha('#9575cd', 0.1),
            '&:hover': {
              backgroundColor: alpha('#9575cd', 0.15),
            },
          },
        },
      },
    },
  },
});

export default lavenderTheme;