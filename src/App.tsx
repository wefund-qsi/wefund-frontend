import MainLayout from './components/layouts/MainLayout';
import { useTranslation } from "react-i18next";

function App() {
  const { t } = useTranslation();

  return (
    <MainLayout>
      <p>{t("welcome")}</p>
    </MainLayout>
  )
}

export default App