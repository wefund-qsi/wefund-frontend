import { Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

function HomePage() {
  const { t } = useTranslation();

  return <Typography>{t("welcome")}</Typography>;
}

export default HomePage;
