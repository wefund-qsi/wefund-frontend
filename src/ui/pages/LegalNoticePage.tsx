import { Box, Grid, Paper, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

function LegalNoticePage() {
  const { t } = useTranslation();

  return (
    <Box sx={{ maxWidth: 1120, mx: "auto", py: { xs: 3, md: 5 } }}>
      <Typography variant="h1" component="h1" sx={{ mb: 2 }}>
        {t("legal.title")}
      </Typography>
      <Typography variant="body1" sx={{ maxWidth: 760, color: "text.secondary", lineHeight: 1.8, mb: 5 }}>
        {t("legal.intro")}
      </Typography>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper
            elevation={0}
            sx={(theme) => ({
              p: { xs: 3, md: 4 },
              borderRadius: 4,
              bgcolor: theme.palette.background.paper,
              border: `1px solid ${theme.palette.divider}`,
              height: "100%",
            })}
          >
            <Typography variant="h4" component="h2" sx={{ mb: 2 }}>
              {t("legal.editorTitle")}
            </Typography>
            <Typography variant="body1" sx={{ color: "text.secondary", lineHeight: 1.85, whiteSpace: "pre-line" }}>
              {t("legal.editorBody")}
            </Typography>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Paper
            elevation={0}
            sx={(theme) => ({
              p: { xs: 3, md: 4 },
              borderRadius: 4,
              bgcolor: theme.palette.background.paper,
              border: `1px solid ${theme.palette.divider}`,
              height: "100%",
            })}
          >
            <Typography variant="h4" component="h2" sx={{ mb: 2 }}>
              {t("legal.usageTitle")}
            </Typography>
            <Typography variant="body1" sx={{ color: "text.secondary", lineHeight: 1.85, whiteSpace: "pre-line" }}>
              {t("legal.usageBody")}
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default LegalNoticePage;
