import { Box, Grid, Paper, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

const frontendTeamMembers = [
  "Aymeric JAKOBOWSKI",
  "Camille BARTHELEMY",
  "Julien CONOIR",
  "Florine PAWLOWSKI",
  "Alyocha YAHI",
];

function AboutPage() {
  const { t } = useTranslation();

  return (
    <Box sx={{ maxWidth: 1120, mx: "auto", py: { xs: 3, md: 5 } }}>
      <Typography variant="h1" component="h1" sx={{ mb: 2 }}>
        {t("about.title")}
      </Typography>
      <Typography variant="body1" sx={{ maxWidth: 760, color: "text.secondary", lineHeight: 1.8, mb: 5 }}>
        {t("about.intro")}
      </Typography>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 7 }}>
          <Paper
            elevation={0}
            sx={(theme) => ({
              p: { xs: 3, md: 4 },
              borderRadius: 4,
              bgcolor: theme.palette.background.paper,
              border: `1px solid ${theme.palette.divider}`,
            })}
          >
            <Typography variant="h4" component="h2" sx={{ mb: 2 }}>
              {t("about.projectTitle")}
            </Typography>
            <Typography variant="body1" sx={{ color: "text.secondary", lineHeight: 1.85 }}>
              {t("about.projectBody")}
            </Typography>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 5 }}>
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
              {t("about.promotionTitle")}
            </Typography>
            <Typography variant="body1" sx={{ color: "text.secondary", lineHeight: 1.8 }}>
              {t("about.promotionBody")}
            </Typography>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Paper
            elevation={0}
            sx={(theme) => ({
              p: { xs: 3, md: 4 },
              borderRadius: 4,
              bgcolor: theme.palette.background.paper,
              border: `1px solid ${theme.palette.divider}`,
            })}
          >
            <Typography variant="h4" component="h2" sx={{ mb: 2.5 }}>
              {t("about.teamTitle")}
            </Typography>
            <Grid container spacing={2}>
              {frontendTeamMembers.map((member) => (
                <Grid key={member} size={{ xs: 12, sm: 6, md: 4 }}>
                  <Box
                    sx={(theme) => ({
                      px: 2.5,
                      py: 2,
                      borderRadius: 3,
                      bgcolor: "rgba(255,255,255,0.45)",
                      border: `1px solid ${theme.palette.divider}`,
                    })}
                  >
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      {member}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default AboutPage;
