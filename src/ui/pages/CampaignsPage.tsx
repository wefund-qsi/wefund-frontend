import { Grid, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import type { Campaign } from "../../domain/campagns/entites/campaign";
import type { ViewAllCampaigns } from "../../domain/campagns/uses-cases/view-all-campaigns";
import CampaignCard from "../components/CampaignCard";

interface CampaignsPageProps {
  viewAllCampaigns: ViewAllCampaigns;
}

function CampaignsPage({ viewAllCampaigns }: CampaignsPageProps) {
  const { t } = useTranslation();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);

  useEffect(() => {
    viewAllCampaigns.execute().then(setCampaigns).catch(console.error);
  }, [viewAllCampaigns]);

  return (
    <>
      <Typography variant="h4" component="h1" fontWeight={700} mb={3}>
        {t("campaign.listTitle")}
      </Typography>
      {campaigns.length === 0 ? (
        <Typography color="text.secondary">{t("campaign.emptyList")}</Typography>
      ) : (
        <Grid container spacing={3}>
          {campaigns.map((campaign) => (
            <Grid key={campaign.id} size={{ xs: 12, md: 6 }}>
              <CampaignCard campaign={campaign} titleComponent="h2" />
            </Grid>
          ))}
        </Grid>
      )}
    </>
  );
}

export default CampaignsPage;
