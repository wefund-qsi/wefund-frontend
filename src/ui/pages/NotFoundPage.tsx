import { Box, Button, Stack, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

function NotFoundPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <Box
      sx={(theme) => ({
        position: "relative",
        mt: { xs: -2, sm: -3 },
        mx: { xs: -2, sm: -3 },
        minHeight: { xs: "calc(100svh - 76px)", md: "calc(100svh - 88px)" },
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: { xs: 2, sm: 3, md: 5 },
        py: { xs: 5, md: 7 },
        backgroundColor: theme.palette.background.default,
      })}
    >
      <Box
        sx={{
          position: "absolute",
          top: { xs: 24, md: 48 },
          left: { xs: 20, md: 48 },
          width: { xs: 180, md: 280 },
          height: { xs: 180, md: 280 },
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(182,102,56,0.22) 0%, rgba(182,102,56,0) 72%)",
          pointerEvents: "none",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          right: { xs: 12, md: 56 },
          bottom: { xs: 24, md: 52 },
          width: { xs: 220, md: 340 },
          height: { xs: 220, md: 340 },
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(160,147,73,0.24) 0%, rgba(160,147,73,0) 72%)",
          pointerEvents: "none",
        }}
      />

      <Box
        sx={(theme) => ({
          position: "relative",
          zIndex: 1,
          width: "100%",
          maxWidth: 1080,
          borderRadius: 6,
          border: `1px solid ${theme.palette.divider}`,
          background: "linear-gradient(145deg, rgba(255,255,255,0.5) 0%, rgba(160,147,73,0.08) 100%)",
          boxShadow: "0 32px 80px rgba(97, 95, 47, 0.10)",
          overflow: "hidden",
        })}
      >
        <Box
          sx={{
            position: "absolute",
            inset: { xs: "auto -12% -10% auto", md: "12% -2% -14% auto" },
            width: { xs: "70%", md: "44%" },
            height: { xs: "58%", md: "84%" },
            fontFamily: "var(--font-family-heading)",
            fontSize: { xs: "9rem", md: "18rem" },
            lineHeight: 0.82,
            color: "rgba(97,95,47,0.10)",
            letterSpacing: "-0.06em",
            userSelect: "none",
          }}
        >
          404
        </Box>

        <Box sx={{ position: "relative", zIndex: 1, px: { xs: 3, md: 6 }, py: { xs: 6, md: 8 } }}>
          <Typography
            variant="overline"
            sx={{
              mb: 2,
              color: "secondary.main",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              fontWeight: 700,
              fontSize: { xs: "0.75rem", md: "0.875rem" },
            }}
          >
            {t("notFound.eyebrow")}
          </Typography>
          <Typography
            variant="h1"
            component="h1"
            sx={{
              maxWidth: 620,
              mb: 5,
              fontSize: { xs: "2.8rem", md: "5.4rem" },
              lineHeight: { xs: 0.95, md: 0.9 },
              textWrap: "balance",
            }}
          >
            {t("notFound.title")}
          </Typography>
          <Typography
            variant="body1"
            sx={{
              maxWidth: 560,
              mb: 1,
              color: "text.secondary",
              lineHeight: 1.9,
              fontSize: { xs: "1rem", md: "1.08rem" },
            }}
          >
            {t("notFound.description")}
          </Typography>

          <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mt: 10 }}>
            <Button
              variant="contained"
              onClick={() => void navigate("/")}
              sx={(theme) => ({
                px: 2.8,
                py: 1.35,
                bgcolor: theme.palette.secondary.main,
                color: theme.palette.secondary.contrastText,
                boxShadow: "0 18px 40px rgba(182, 102, 56, 0.20)",
                "&:hover": {
                  bgcolor: theme.palette.secondary.dark,
                  boxShadow: "0 18px 40px rgba(148, 81, 44, 0.24)",
                },
              })}
            >
              {t("notFound.primaryCta")}
            </Button>
            <Button
              variant="outlined"
              onClick={() => void navigate("/projects")}
              sx={{
                px: 2.8,
                py: 1.35,
                color: "primary.main",
                borderColor: "rgba(97,95,47,0.28)",
                bgcolor: "rgba(255,255,255,0.32)",
                "&:hover": {
                  borderColor: "primary.main",
                  bgcolor: "rgba(255,255,255,0.5)",
                },
              }}
            >
              {t("notFound.secondaryCta")}
            </Button>
          </Stack>
        </Box>
      </Box>
    </Box>
  );
}

export default NotFoundPage;
