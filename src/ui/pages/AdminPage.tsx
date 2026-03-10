import { useState } from "react";
import {
  Box,
  Tabs,
  Tab,
  Card,
  CardContent,
  Typography,
  Button,
  Stack,
  Grid,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import type { Campaign } from "../../domain/campagns/entites/campaign";

// Mock data for campaigns
const mockCampaigns: Campaign[] = [
  {
    id: "1" as any,
    projectId: "p1" as any,
    title: "Campaign 1",
    description: "Description 1",
    goal: 1000,
    endDate: "2024-12-31",
    ownerId: "u1" as any,
    createdAt: "2024-01-01",
    status: "pending_validation",
  },
  {
    id: "2" as any,
    projectId: "p2" as any,
    title: "Campaign 2",
    description: "Description 2",
    goal: 2000,
    endDate: "2024-12-31",
    ownerId: "u2" as any,
    createdAt: "2024-01-01",
    status: "pending_validation",
    startedAt: "2024-01-15",
  },
  {
    id: "3" as any,
    projectId: "p3" as any,
    title: "Campaign 3",
    description: "Description 3",
    goal: 1500,
    endDate: "2024-12-31",
    ownerId: "u3" as any,
    createdAt: "2024-01-01",
    status: "succeeded",
    startedAt: "2024-01-15",
    completedAt: "2024-06-01",
    collectedAmount: 1600,
  },
  {
    id: "4" as any,
    projectId: "p4" as any,
    title: "Campaign 4",
    description: "Description 4",
    goal: 3000,
    endDate: "2024-12-31",
    ownerId: "u4" as any,
    createdAt: "2024-01-01",
    status: "failed",
    startedAt: "2024-01-15",
    completedAt: "2024-12-31",
    collectedAmount: 500,
  },
  {
    id: "5" as any,
    projectId: "p5" as any,
    title: "Campaign 5",
    description: "Description 5",
    goal: 2500,
    endDate: "2024-12-31",
    ownerId: "u5" as any,
    createdAt: "2024-01-01",
    status: "rejected",
  },
];

function AdminPage() {
  const { t } = useTranslation();
  const [campaigns, setCampaigns] = useState<Campaign[]>(mockCampaigns);
  const [tabValue, setTabValue] = useState(0);

  const statuses = [
    "pending_validation",
    "active",
    "succeeded",
    "failed",
    "rejected",
  ];

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleAccept = (id: string) => {
    setCampaigns((prev) =>
      prev.map((c) =>
        c.id === id && c.status === "pending_validation"
          ? { ...c, status: "active", startedAt: new Date().toISOString() }
          : c
      )
    );
  };

  const handleReject = (id: string) => {
    setCampaigns((prev) =>
      prev.map((c) =>
        c.id === id && c.status === "pending_validation"
          ? { ...c, status: "rejected" }
          : c
      )
    );
  };

  const filteredCampaigns = campaigns.filter(
    (c) => c.status === statuses[tabValue]
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
      <Box sx={{ mt: 2 }}>
        <Grid container spacing={2}>
          {filteredCampaigns.map((campaign) => (
            <Grid item xs={12} sm={6} md={4} key={campaign.id}>
              <Card>
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
                  {campaign.status === "pending_validation" && (
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
            </Grid>
          ))}
        </Grid>
        {filteredCampaigns.length === 0 && (
          <Typography variant="body1" sx={{ mt: 2 }}>
            {t("admin.noCampaigns")}
          </Typography>
        )}
      </Box>
    </Box>
  );
}

export default AdminPage;
