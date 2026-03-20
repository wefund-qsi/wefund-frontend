import { Box, Button, Divider, Grid, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import wefundLogo from "../../public/wefund-logo.svg";
import { navigationLinkButtonSx } from "./navigation-link.styles";

function Footer() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <Box
      component="footer"
      sx={(theme) => ({
        position: "relative",
        overflow: "hidden",
        mt: 8,
        px: { xs: 2, sm: 3, md: 4 },
        py: { xs: 5, md: 6 },
        color: theme.palette.text.primary,
        backgroundColor: theme.palette.background.paper,
        backgroundImage: "linear-gradient(180deg, rgba(255,255,255,0.42) 0%, rgba(160,147,73,0.08) 100%)",
        borderTop: `1px solid ${theme.palette.divider}`,
      })}
    >
      <Box
        sx={{
          position: "absolute",
          inset: "auto -80px -120px auto",
          width: 280,
          height: 280,
          borderRadius: "50%",
          background: `radial-gradient(circle, rgba(182,102,56,0.16) 0%, rgba(182,102,56,0) 72%)`,
          pointerEvents: "none",
          opacity: 0.8,
          zIndex: 0,
        }}
      />

      <Grid container spacing={{ xs: 4, md: 6 }} sx={{ position: "relative", zIndex: 1 }}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2.5 }}>
            <Box
              component="img"
              src={wefundLogo}
              alt=""
              sx={{ height: 42, width: "auto", display: "block" }}
            />
            <Typography
              variant="body1"
              sx={{
                fontFamily: "var(--font-family-accent)",
                fontWeight: 400,
                fontSize: "1.8rem",
                color: "text.primary",
              }}
            >
              WeFund
            </Typography>
          </Box>
          <Typography
            variant="h2"
            component="h2"
            sx={{
              fontFamily: "var(--font-family-accent)",
              fontWeight: 400,
              maxWidth: 560,
              mb: 2.5,
              color: "primary.main",
              fontSize: { xs: "2rem", md: "2.6rem" },
              lineHeight: 1.15,
            }}
          >
            {t("footer.signature")}
          </Typography>
          <Typography variant="body1" sx={{ maxWidth: 460, color: "text.secondary", lineHeight: 1.8 }}>
            {t("footer.description")}
          </Typography>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Typography
            variant="body2"
            color="secondary.main"
            sx={{ fontFamily: "var(--font-family-heading)", fontWeight: 700, letterSpacing: "0.01em", mb: 1 }}
          >
            {t("footer.navigationTitle")}
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start", mt: 1 }}>
            <Button
              color="inherit"
              onClick={() => void navigate("/campaigns")}
              sx={navigationLinkButtonSx}
            >
              {t("header.exploreCampaigns")}
            </Button>
            <Button
              color="inherit"
              onClick={() => void navigate("/projects")}
              sx={navigationLinkButtonSx}
            >
              {t("header.exploreProjects")}
            </Button>
            <Button
              color="inherit"
              onClick={() => void navigate("/projects/create")}
              sx={navigationLinkButtonSx}
            >
              {t("header.createProject")}
            </Button>
          </Box>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Typography
            variant="body2"
            color="secondary.main"
            sx={{ fontFamily: "var(--font-family-heading)", fontWeight: 700, letterSpacing: "0.01em", mb: 1 }}
          >
            {t("footer.informationTitle")}
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.25, mt: 1 }}>
            <Button
              color="inherit"
              onClick={() => void navigate("/who-we-are")}
              sx={navigationLinkButtonSx}
            >
              {t("footer.aboutLink")}
            </Button>
            <Button
              color="inherit"
              onClick={() => void navigate("/legal-notice")}
              sx={navigationLinkButtonSx}
            >
              {t("footer.legalLink")}
            </Button>
          </Box>
        </Grid>
      </Grid>

      <Divider sx={{ my: { xs: 3, md: 4 } }} />

      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          alignItems: { xs: "flex-start", sm: "center" },
          justifyContent: "space-between",
          gap: 1,
        }}
      >
        <Typography variant="body2" color="text.secondary">
          © {new Date().getFullYear()} WeFund
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {t("footer.baseline")}
        </Typography>
      </Box>
    </Box>
  );
}

export default Footer;
