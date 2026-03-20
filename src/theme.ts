import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    background: {
      default: "#f6f1e8",
      paper: "#fbf7f0",
    },
    primary: {
      light: "#a09349",
      main: "#615f2f",
      dark: "#4f4d27",
      contrastText: "#fcfaf6",
    },
    secondary: {
      light: "#cf8b61",
      main: "#b66638",
      dark: "#94512c",
      contrastText: "#fcfaf6",
    },
    success: {
      light: "#b4aa68",
      main: "#a09349",
      dark: "#887d3f",
      contrastText: "#fcfaf6",
    },
    text: {
      primary: "#2f3122",
      secondary: "#615f2f",
    },
    divider: "rgba(97, 95, 47, 0.14)",
  },
  typography: {
    fontFamily: 'var(--font-family-body)',
    h1: {
      fontFamily: 'var(--font-family-heading)',
      fontWeight: 700,
      letterSpacing: "-0.03em",
    },
    h2: {
      fontFamily: 'var(--font-family-heading)',
      fontWeight: 700,
      letterSpacing: "-0.03em",
    },
    h3: {
      fontFamily: 'var(--font-family-heading)',
      fontWeight: 700,
      letterSpacing: "-0.03em",
    },
    h4: {
      fontFamily: 'var(--font-family-heading)',
      fontWeight: 700,
      letterSpacing: "-0.02em",
    },
    h5: {
      fontFamily: 'var(--font-family-heading)',
      fontWeight: 700,
      letterSpacing: "-0.02em",
    },
    h6: {
      fontFamily: 'var(--font-family-heading)',
      fontWeight: 700,
      letterSpacing: "-0.02em",
    },
    button: {
      fontFamily: 'var(--font-family-body)',
      fontWeight: 700,
      textTransform: "none",
    },
    subtitle1: {
      fontFamily: 'var(--font-family-accent)',
      fontWeight: 400,
    },
    subtitle2: {
      fontFamily: 'var(--font-family-accent)',
      fontWeight: 400,
    },
    overline: {
      fontFamily: 'var(--font-family-accent)',
      fontWeight: 400,
      letterSpacing: "0.08em",
      textTransform: "none",
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          fontFamily: 'var(--font-family-body)',
          backgroundColor: "#f6f1e8",
          color: "#2f3122",
          textRendering: "optimizeLegibility",
          WebkitFontSmoothing: "antialiased",
          MozOsxFontSmoothing: "grayscale",
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
    MuiMenu: {
      defaultProps: {
        slotProps: {
          paper: {
            elevation: 0,
          },
        },
      },
      styleOverrides: {
        paper: {
          marginTop: 12,
          minWidth: 180,
          overflow: "hidden",
          border: "1px solid rgba(97, 95, 47, 0.14)",
          backgroundColor: "#fbf7f0",
          backgroundImage: "linear-gradient(180deg, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0.18) 100%)",
          boxShadow: "0 12px 24px rgba(79, 77, 39, 0.08)",
        },
        list: {
          paddingTop: 8,
          paddingBottom: 8,
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          marginLeft: 8,
          marginRight: 8,
          marginTop: 2,
          marginBottom: 2,
          borderRadius: 12,
          fontSize: "0.95rem",
          color: "#2f3122",
          transition: "background-color 160ms ease, color 160ms ease",
          "&:hover": {
            backgroundColor: "rgba(160, 147, 73, 0.10)",
          },
          "&.Mui-selected": {
            backgroundColor: "rgba(182, 102, 56, 0.10)",
            color: "#94512c",
          },
          "&.Mui-selected:hover": {
            backgroundColor: "rgba(182, 102, 56, 0.14)",
          },
        },
      },
    },
  },
});

export default theme;
