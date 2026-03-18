import { useState, useEffect } from "react";
import {
  Box,
  Tabs,
  Tab,
  Card,
  CardContent,
  Typography,
  Button,
  Stack,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import type { Campaign } from "../../domain/campagns/entites/campaign";
import { StatutCampagne } from "../../domain/campagns/entites/campaign";
import type { ViewAllCampaigns } from "../../domain/campagns/uses-cases/view-all-campaigns";

interface AdminPageProps {
  viewAllCampaigns: ViewAllCampaigns;
}

function AdminPage({ viewAllCampaigns }: AdminPageProps) {
  const { t } = useTranslation();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    void viewAllCampaigns.execute().then(setCampaigns);
  }, [viewAllCampaigns]);

  const statuses = [
    StatutCampagne.EN_ATTENTE,
    StatutCampagne.ACTIVE,
    StatutCampagne.REUSSIE,
    StatutCampagne.ECHOUEE,
    StatutCampagne.REFUSEE,
  ];

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleAccept = (id: string) => {
    setCampaigns((prev: Campaign[]) =>
      prev.map((c: Campaign) =>
        c.id === id && c.status === StatutCampagne.EN_ATTENTE
          ? { ...c, status: StatutCampagne.ACTIVE, startedAt: new Date().toISOString(), collectedAmount: 0 }
          : c
      )
    );
  };

  const handleReject = (id: string) => {
    setCampaigns((prev: Campaign[]) =>
      prev.map((c: Campaign) =>
        c.id === id && c.status === StatutCampagne.EN_ATTENTE
          ? { ...c, status: StatutCampagne.REFUSEE }
          : c
      )
    );
  };

  const filteredCampaigns = campaigns.filter(
    (c: Campaign) => c.status === statuses[tabValue]
  );

  return (
    <Box sx={{ width: "100%" }}>
      <Typography variant="h4" gutterBottom>
        {t("admin.title")}
      </Typography>
      <Tabs value={tabValue} onChange={handleTabChange} aria-label="campaign status tabs">
        <Tab label={t("admin.tabs.pendingValidation")} />
        <Tab label={t("admin.tabs.active")} />
        <Tab label={t("admin.tabs.succeeded")} />
        <Tab label={t("admin.tabs.failed")} />
        <Tab label={t("admin.tabs.rejected")} />
      </Tabs>
      <Box sx={{ mt: 2, display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, gap: 2 }}>
        {filteredCampaigns.map((campaign: Campaign) => (
            <Card key={campaign.id}>
              <CardContent>
                <Typography variant="h6">{campaign.title}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {campaign.description}
                </Typography>
                <Typography variant="body2">
                  {t("admin.goal")}: ${campaign.goal}
                </Typography>
                <Typography variant="body2">
                  {t("admin.endDate")}: {campaign.endDate}
                </Typography>
                {campaign.status === StatutCampagne.EN_ATTENTE && (
                  <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleAccept(campaign.id)}
                    >
                      {t("admin.accept")}
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => handleReject(campaign.id)}
                    >
                      {t("admin.reject")}
                    </Button>
                  </Stack>
                )}
              </CardContent>
            </Card>
          ))}
      </Box>
    </Box>
  );
}

export default AdminPage;
