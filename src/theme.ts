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
});

export default theme;
