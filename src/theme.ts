import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    background: {
      default: "#FEFAE0",
      paper: "#FEFAE0",
    },
    primary: {
      main: "#606C38",
      dark: "#283618",
      contrastText: "#FEFAE0",
    },
    text: {
      primary: "#283618",
      secondary: "#606C38",
    },
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
          textRendering: "optimizeLegibility",
          WebkitFontSmoothing: "antialiased",
          MozOsxFontSmoothing: "grayscale",
        },
      },
    },
  },
});

export default theme;
