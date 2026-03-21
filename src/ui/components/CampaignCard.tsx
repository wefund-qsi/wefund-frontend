import { Box, Card, CardActionArea, CardContent, Chip, LinearProgress, Stack, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { getCampaignCollectedAmount, getCampaignProgress, getCampaignProgressForBar, type Campaign } from "../../domain/campagns/entites/campaign";

interface CampaignCardProps {
  campaign: Campaign;
  titleComponent?: "h2" | "h3";
}

function CampaignCard({ campaign, titleComponent = "h3" }: CampaignCardProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const collectedAmount = getCampaignCollectedAmount(campaign);
  const progress = getCampaignProgress(campaign);
  const progressValue = getCampaignProgressForBar(campaign);

  const statusConfig = {
    BROUILLON: {
      label: t("campaign.statuses.BROUILLON"),
      accent: "#8A7F57",
      chipBg: "rgba(138, 127, 87, 0.16)",
      chipColor: "#615f2f",
      progress: "#8A7F57",
      border: "rgba(138, 127, 87, 0.24)",
      background: "linear-gradient(180deg, rgba(138, 127, 87, 0.14) 0%, rgba(255,255,255,0.86) 100%)",
      shadow: "0 18px 42px rgba(138, 127, 87, 0.08)",
      pattern: "repeating-linear-gradient(135deg, rgba(138, 127, 87, 0.06) 0px, rgba(138, 127, 87, 0.06) 10px, rgba(255,255,255,0) 10px, rgba(255,255,255,0) 22px)",
    },
    EN_ATTENTE: {
      label: t("campaign.statuses.EN_ATTENTE"),
      accent: "#b66638",
      chipBg: "rgba(182, 102, 56, 0.12)",
      chipColor: "#9a522a",
      progress: "#b66638",
      border: "rgba(182, 102, 56, 0.24)",
      background: "linear-gradient(180deg, rgba(182, 102, 56, 0.12) 0%, rgba(255,250,245,0.94) 100%)",
      shadow: "0 18px 42px rgba(182, 102, 56, 0.08)",
      pattern: "radial-gradient(circle at top right, rgba(182, 102, 56, 0.14) 0%, rgba(182, 102, 56, 0) 42%)",
    },
    ACTIVE: {
      label: t("campaign.statuses.ACTIVE"),
      accent: "#615f2f",
      chipBg: "rgba(97, 95, 47, 0.12)",
      chipColor: "#4F4D25",
      progress: "#615f2f",
      border: "rgba(97, 95, 47, 0.22)",
      background: "linear-gradient(180deg, rgba(97, 95, 47, 0.1) 0%, rgba(251,247,240,0.96) 100%)",
      shadow: "0 18px 42px rgba(97, 95, 47, 0.08)",
      pattern: "radial-gradient(circle at top right, rgba(97, 95, 47, 0.14) 0%, rgba(97, 95, 47, 0) 48%)",
    },
    REUSSIE: {
      label: t("campaign.statuses.REUSSIE"),
      accent: "#2F6B52",
      chipBg: "rgba(47, 107, 82, 0.12)",
      chipColor: "#1F503C",
      progress: "#2F6B52",
      border: "rgba(47, 107, 82, 0.3)",
      background: "linear-gradient(180deg, rgba(47, 107, 82, 0.16) 0%, rgba(242,249,246,0.98) 100%)",
      shadow: "0 18px 42px rgba(47, 107, 82, 0.1)",
      pattern: "linear-gradient(135deg, rgba(47, 107, 82, 0.08) 0%, rgba(47, 107, 82, 0.03) 100%)",
    },
    ECHOUEE: {
      label: t("campaign.statuses.ECHOUEE"),
      accent: "#9C7756",
      chipBg: "rgba(156, 119, 86, 0.12)",
      chipColor: "#7A5D42",
      progress: "#9C7756",
      border: "rgba(156, 119, 86, 0.24)",
      background: "linear-gradient(180deg, rgba(156, 119, 86, 0.12) 0%, rgba(251,248,244,0.96) 100%)",
      shadow: "0 18px 42px rgba(156, 119, 86, 0.08)",
      pattern: "radial-gradient(circle at top right, rgba(156, 119, 86, 0.14) 0%, rgba(156, 119, 86, 0) 44%)",
    },
    REFUSEE: {
      label: t("campaign.statuses.REFUSEE"),
      accent: "#9C5F49",
      chipBg: "rgba(156, 95, 73, 0.12)",
      chipColor: "#7E4836",
      progress: "#9C5F49",
      border: "rgba(156, 95, 73, 0.24)",
      background: "linear-gradient(180deg, rgba(156, 95, 73, 0.14) 0%, rgba(252,247,245,0.96) 100%)",
      shadow: "0 18px 42px rgba(156, 95, 73, 0.08)",
      pattern: "radial-gradient(circle at top right, rgba(156, 95, 73, 0.16) 0%, rgba(156, 95, 73, 0) 44%)",
    },
  }[campaign.status];

  return (
    <Card
      sx={{
        position: "relative",
        height: "100%",
        overflow: "hidden",
        borderRadius: 4,
        border: campaign.status === "BROUILLON"
          ? `1px dashed ${statusConfig.border}`
          : `1px solid ${statusConfig.border}`,
        background: statusConfig.background,
        backgroundImage: statusConfig.pattern,
        boxShadow: statusConfig.shadow,
        transition: "transform 0.24s ease, box-shadow 0.24s ease, border-color 0.24s ease",
        "&:hover": {
          transform: "translateY(-8px)",
          boxShadow: `0 26px 52px ${alpha(statusConfig.accent, 0.16)}`,
          borderColor: alpha(statusConfig.accent, 0.32),
        },
      }}
    >
      <CardActionArea onClick={() => { void navigate(`/campaigns/${campaign.id}`); }} sx={{ height: "100%" }}>
        <CardContent sx={{ display: "flex", flexDirection: "column", gap: 2.5, height: "100%", p: 2.5 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
            <Typography variant="h5" component={titleComponent} fontWeight={600} sx={{ color: "text.primary", lineHeight: 1.08 }}>
              {campaign.title}
            </Typography>
            <Chip
              label={statusConfig.label}
              size="small"
              sx={{
                bgcolor: statusConfig.chipBg,
                color: statusConfig.chipColor,
                fontWeight: 700,
                letterSpacing: "0.02em",
                textTransform: "none",
                border: `1px solid ${alpha(statusConfig.accent, 0.18)}`,
              }}
            />
          </Stack>
          <Typography
            variant="body2"
            sx={{
              flex: 1,
              color: "text.secondary",
              lineHeight: 1.8,
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {campaign.description}
          </Typography>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
            <Box
              sx={(theme) => ({
                flex: 1,
                borderRadius: 3,
                border: `1px solid ${theme.palette.divider}`,
                backgroundColor: alpha("#ffffff", 0.48),
                px: 1.5,
                py: 1.4,
              })}
            >
              <Typography variant="caption" sx={{ display: "block", mb: 0.6, color: "text.secondary" }}>
                {t("campaign.goal")}
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 700, color: "text.primary" }}>
                {campaign.goal.toLocaleString()} EUR
              </Typography>
            </Box>
            <Box
              sx={(theme) => ({
                flex: 1,
                borderRadius: 3,
                border: `1px solid ${theme.palette.divider}`,
                backgroundColor: alpha("#ffffff", 0.48),
                px: 1.5,
                py: 1.4,
              })}
            >
              <Typography variant="caption" sx={{ display: "block", mb: 0.6, color: "text.secondary" }}>
                {t("campaign.collected")}
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 700, color: "text.primary" }}>
                {collectedAmount.toLocaleString()} EUR
              </Typography>
            </Box>
          </Stack>
          <Box sx={{ mt: "auto" }}>
            <Stack direction="row" justifyContent="space-between" spacing={2} sx={{ mb: 1 }}>
              <Typography variant="body2" sx={{ fontWeight: 600, color: "text.primary" }}>
                {progress}% {t("campaign.progress")}
              </Typography>
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                {t("campaign.endDate")} {campaign.endDate}
              </Typography>
            </Stack>
            <LinearProgress
              variant="determinate"
              value={progressValue}
              sx={{
                height: 8,
                borderRadius: 999,
                bgcolor: alpha(statusConfig.accent, 0.14),
                "& .MuiLinearProgress-bar": { bgcolor: statusConfig.progress },
              }}
            />
            <Typography variant="body2" sx={{ mt: 1.4, color: "primary.main", fontWeight: 600 }}>
              {t("campaign.viewAction")}
            </Typography>
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

export default CampaignCard;
