import { Box, Button, Grid, Stack, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import type { Campaign } from "../../domain/campagns/entites/campaign";
import type { ViewAllCampaigns } from "../../domain/campagns/uses-cases/view-all-campaigns";
import type { UserId } from "../../domain/users/entities/user";
import CampaignCard from "../components/CampaignCard";

interface CampaignsPageProps {
  viewAllCampaigns: ViewAllCampaigns;
  currentUserId: UserId;
}

function CampaignsPage({ viewAllCampaigns, currentUserId }: CampaignsPageProps) {
  const { t } = useTranslation();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<"ACTIVE" | "FINISHED">("ACTIVE");

  useEffect(() => {
    viewAllCampaigns.execute().then(setCampaigns).catch(console.error);
  }, [viewAllCampaigns]);

  const publicCampaigns = useMemo(
    () => campaigns.filter((campaign) =>
      campaign.status === "ACTIVE" || campaign.status === "REUSSIE" || campaign.status === "ECHOUEE"),
    [campaigns],
  );

  const filteredCampaigns = useMemo(
    () => publicCampaigns.filter((campaign) =>
      selectedFilter === "ACTIVE" ? campaign.status === "ACTIVE" : campaign.status === "REUSSIE" || campaign.status === "ECHOUEE"),
    [publicCampaigns, selectedFilter],
  );

  const draftCampaigns = useMemo(
    () => campaigns.filter((campaign) => campaign.ownerId === currentUserId && campaign.status === "BROUILLON"),
    [campaigns, currentUserId],
  );

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: { xs: 5, md: 7 } }}>
      <Stack spacing={1.5} sx={{ maxWidth: 760 }}>
        <Typography variant="overline" color="secondary.main">
          {t("campaign.pageEyebrow")}
        </Typography>
        <Typography variant="h1" component="h1" sx={{ fontSize: { xs: "2.4rem", md: "4rem" }, lineHeight: { xs: 1.03, md: 0.98 } }}>
          {t("campaign.listTitle")}
        </Typography>
        <Typography variant="body1" sx={{ color: "text.secondary", lineHeight: 1.85 }}>
          {t("campaign.pageDescription")}
        </Typography>
      </Stack>

      <Stack spacing={3}>
        <Stack direction={{ xs: "column", md: "row" }} justifyContent="space-between" spacing={2} alignItems={{ xs: "flex-start", md: "center" }}>
          <Typography variant="h3" component="h2">
            {t("campaign.publicSectionTitle")}
          </Typography>
          <Stack
            direction="row"
            spacing={1}
            sx={(theme) => ({
              p: 0.6,
              borderRadius: 999,
              border: `1px solid ${alpha(theme.palette.primary.main, 0.14)}`,
              backgroundColor: alpha(theme.palette.background.paper, 0.88),
            })}
          >
            <Button
              color="inherit"
              onClick={() => { setSelectedFilter("ACTIVE"); }}
              sx={(theme) => ({
                borderRadius: 999,
                px: 2,
                py: 0.9,
                color: selectedFilter === "ACTIVE" ? theme.palette.secondary.contrastText : theme.palette.text.primary,
                bgcolor: selectedFilter === "ACTIVE" ? theme.palette.secondary.main : "transparent",
                "&:hover": {
                  bgcolor: selectedFilter === "ACTIVE" ? theme.palette.secondary.dark : alpha(theme.palette.secondary.main, 0.08),
                },
              })}
            >
              {t("campaign.filters.active")}
            </Button>
            <Button
              color="inherit"
              onClick={() => { setSelectedFilter("FINISHED"); }}
              sx={(theme) => ({
                borderRadius: 999,
                px: 2,
                py: 0.9,
                color: selectedFilter === "FINISHED" ? theme.palette.secondary.contrastText : theme.palette.text.primary,
                bgcolor: selectedFilter === "FINISHED" ? theme.palette.secondary.main : "transparent",
                "&:hover": {
                  bgcolor: selectedFilter === "FINISHED" ? theme.palette.secondary.dark : alpha(theme.palette.secondary.main, 0.08),
                },
              })}
            >
              {t("campaign.filters.finished")}
            </Button>
          </Stack>
        </Stack>

        {filteredCampaigns.length === 0 ? (
          <Typography color="text.secondary">
            {t(selectedFilter === "ACTIVE" ? "campaign.emptyActiveList" : "campaign.emptyFinishedList")}
          </Typography>
        ) : (
          <Grid container spacing={3}>
            {filteredCampaigns.map((campaign) => (
              <Grid key={campaign.id} size={{ xs: 12, md: 6 }}>
                <CampaignCard campaign={campaign} titleComponent="h2" />
              </Grid>
            ))}
          </Grid>
        )}
      </Stack>

      <Stack spacing={3}>
        <Box
          sx={(theme) => ({
            borderRadius: 5,
            border: `1px solid ${alpha(theme.palette.primary.main, 0.14)}`,
            background: `linear-gradient(180deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${theme.palette.background.paper} 100%)`,
            px: { xs: 2.5, md: 3 },
            py: { xs: 2.5, md: 3 },
          })}
        >
          <Typography variant="h3" component="h2" sx={{ mb: 1.2 }}>
            {t("campaign.draftSectionTitle")}
          </Typography>
          <Typography variant="body1" sx={{ color: "text.secondary", lineHeight: 1.8, maxWidth: 760 }}>
            {t("campaign.draftSectionDescription")}
          </Typography>
        </Box>

        {draftCampaigns.length === 0 ? (
          <Typography color="text.secondary">{t("campaign.emptyDraftList")}</Typography>
        ) : (
          <Grid container spacing={3}>
            {draftCampaigns.map((campaign) => (
              <Grid key={campaign.id} size={{ xs: 12, md: 6 }}>
                <CampaignCard campaign={campaign} titleComponent="h2" />
              </Grid>
            ))}
          </Grid>
        )}
      </Stack>
    </Box>
  );
}

export default CampaignsPage;
