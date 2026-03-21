import { useState, useEffect } from "react";
import {
  alpha,
  Box,
  Chip,
  Card,
  CardContent,
  Typography,
  Button,
  Stack,
  Tabs,
  Tab,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import type { Campaign, CampaignStatus } from "../../domain/campagns/entites/campaign";
import type { ViewAllCampaigns } from "../../domain/campagns/uses-cases/view-all-campaigns";

interface AdminPageProps {
  viewAllCampaigns: ViewAllCampaigns;
}

function AdminPage({ viewAllCampaigns }: AdminPageProps) {
  const { t, i18n } = useTranslation();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    void viewAllCampaigns.execute().then(setCampaigns);
  }, [viewAllCampaigns]);

  const statuses: CampaignStatus[] = [
    'EN_ATTENTE',
    'ACTIVE',
    'REUSSIE',
    'ECHOUEE',
    'REFUSEE',
  ];

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleAccept = (id: string) => {
    setCampaigns((prev: Campaign[]) =>
      prev.map((c: Campaign) =>
        c.id === id && c.status === 'EN_ATTENTE'
          ? { ...c, status: 'ACTIVE', startedAt: new Date().toISOString(), collectedAmount: 0 }
          : c
      )
    );
  };

  const handleReject = (id: string) => {
    setCampaigns((prev: Campaign[]) =>
      prev.map((c: Campaign) =>
        c.id === id && c.status === 'EN_ATTENTE'
          ? { ...c, status: 'REFUSEE' }
          : c
      )
    );
  };

  const filteredCampaigns = campaigns.filter(
    (c: Campaign) => c.status === statuses[tabValue]
  );

  const locale = i18n.language.startsWith("fr") ? "fr-FR" : "en-GB";
  const formatCurrency = (value: number) => new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(value);
  const formatDate = (value: string) => new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(value));

  return (
    <Stack spacing={{ xs: 4, md: 5 }} sx={{ maxWidth: 1240, mx: "auto", width: "100%" }}>
      <Stack spacing={1.5} sx={{ maxWidth: 780 }}>
        <Typography variant="overline" color="secondary.main">
          {t("admin.eyebrow")}
        </Typography>
        <Typography variant="h1" component="h1" sx={{ fontSize: { xs: "2.4rem", md: "4rem" }, lineHeight: { xs: 1.03, md: 0.98 } }}>
          {t("admin.title")}
        </Typography>
        <Typography variant="body1" sx={{ color: "text.secondary", lineHeight: 1.85 }}>
          {t("admin.description")}
        </Typography>
      </Stack>

      <Box
        sx={(theme) => ({
          borderRadius: 4,
          border: `1px solid ${theme.palette.divider}`,
          backgroundColor: alpha(theme.palette.background.paper, 0.92),
          boxShadow: "0 14px 30px rgba(97, 95, 47, 0.06)",
          width: "fit-content",
          maxWidth: "100%",
          px: { xs: 1, md: 1.5 },
          py: 1,
        })}
      >
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          aria-label="campaign status tabs"
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            minHeight: 0,
            "& .MuiTabs-indicator": {
              height: 3,
              borderRadius: 999,
            },
          }}
        >
          <Tab label={t("admin.tabs.pendingValidation")} sx={{ textTransform: "none", minHeight: 48 }} />
          <Tab label={t("admin.tabs.active")} sx={{ textTransform: "none", minHeight: 48 }} />
          <Tab label={t("admin.tabs.succeeded")} sx={{ textTransform: "none", minHeight: 48 }} />
          <Tab label={t("admin.tabs.failed")} sx={{ textTransform: "none", minHeight: 48 }} />
          <Tab label={t("admin.tabs.rejected")} sx={{ textTransform: "none", minHeight: 48 }} />
        </Tabs>
      </Box>

      <Stack direction="row" alignItems="baseline" spacing={1.2} sx={{ maxWidth: 980 }}>
        <Typography variant="h2" component="p" sx={{ fontSize: { xs: "2.1rem", md: "2.7rem" }, lineHeight: 0.95 }}>
          {filteredCampaigns.length}
        </Typography>
        <Typography variant="body1" sx={{ color: "text.secondary" }}>
          {t("admin.reviewCount")}
        </Typography>
      </Stack>

      {filteredCampaigns.length > 0 ? (
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", xl: "repeat(3, 1fr)" }, gap: 3, alignItems: "start" }}>
          {filteredCampaigns.map((campaign: Campaign) => (
            <Card
              key={campaign.id}
              sx={(theme) => ({
                display: "flex",
                flexDirection: "column",
                height: "100%",
                borderRadius: 4,
                border: `1px solid ${theme.palette.divider}`,
                backgroundColor: alpha(theme.palette.background.paper, 0.96),
                boxShadow: "0 8px 20px rgba(97, 95, 47, 0.04)",
                transition: "transform 180ms ease, box-shadow 180ms ease, border-color 180ms ease",
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: "0 14px 28px rgba(97, 95, 47, 0.07)",
                  borderColor: alpha(theme.palette.primary.main, 0.22),
                },
              })}
            >
              <CardContent sx={{ p: 3, height: "100%", display: "flex", flexDirection: "column", flex: 1 }}>
                <Stack spacing={2.4} sx={{ height: "100%", flex: 1, justifyContent: "space-between" }}>
                  <Stack direction="row" justifyContent="space-between" spacing={2} alignItems="flex-start">
                    <Stack spacing={0.8} sx={{ minWidth: 0 }}>
                      <Typography variant="overline" color="secondary.main" sx={{ mb: 0 }}>
                        {t("admin.cardEyebrow")}
                      </Typography>
                      <Typography variant="h4" component="h2" sx={{ fontSize: "1.55rem", lineHeight: 1.08 }}>
                        {campaign.title}
                      </Typography>
                    </Stack>
                    <Chip
                      label={t(`campaign.statuses.${campaign.status}`)}
                      sx={(theme) => ({
                        textTransform: "none",
                        backgroundColor: alpha(theme.palette.primary.main, 0.05),
                        color: "text.primary",
                        border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                        borderRadius: 999,
                        height: 30,
                        ".MuiChip-label": {
                          px: 1.1,
                        },
                      })}
                    />
                  </Stack>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      lineHeight: 1.8,
                      display: "-webkit-box",
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {campaign.description}
                  </Typography>

                  <Stack spacing={1.2}>
                    <Box
                      sx={(theme) => ({
                        borderTop: `1px solid ${alpha(theme.palette.primary.main, 0.08)}`,
                        borderBottom: `1px solid ${alpha(theme.palette.primary.main, 0.08)}`,
                        py: 1.7,
                      })}
                    >
                      <Stack direction="row" spacing={2.5} alignItems="flex-end" flexWrap="wrap">
                        <Box>
                          <Typography variant="caption" sx={{ display: "block", color: "text.secondary", mb: 0.35 }}>
                            {t("admin.goal")}
                          </Typography>
                          <Typography component="p" sx={{ fontFamily: "var(--font-family-heading)", fontSize: "2.05rem", lineHeight: 0.95 }}>
                            {formatCurrency(campaign.goal)}
                          </Typography>
                        </Box>
                        <Box>
                          <Typography variant="caption" sx={{ display: "block", color: "text.secondary", mb: 0.35 }}>
                            {t("admin.endDate")}
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {formatDate(campaign.endDate)}
                          </Typography>
                        </Box>
                      </Stack>
                    </Box>

                    {campaign.status === "EN_ATTENTE" ? (
                      <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
                        <Button
                          variant="contained"
                          color="primary"
                          sx={{ px: 2.4 }}
                          onClick={() => handleAccept(campaign.id)}
                        >
                          {t("admin.accept")}
                        </Button>
                        <Button
                          variant="outlined"
                          color="error"
                          sx={{ px: 2.4 }}
                          onClick={() => handleReject(campaign.id)}
                        >
                          {t("admin.reject")}
                        </Button>
                      </Stack>
                    ) : null}
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          ))}
        </Box>
      ) : null}
    </Stack>
  );
}

export default AdminPage;
