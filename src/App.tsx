import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import MainLayout from './components/layouts/MainLayout';
import { useTranslation } from "react-i18next";
import theme from './theme';

function App() {
  const { t } = useTranslation();

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <MainLayout>
      <p>{t("welcome")}</p>
    </MainLayout>
    </ThemeProvider>
  )
}

export default App