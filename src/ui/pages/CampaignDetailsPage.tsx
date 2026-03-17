import { Box, Button, Chip, Container, LinearProgress, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { CampaignId, getCampaignCollectedAmount, getCampaignProgress, getCampaignProgressForBar, type Campaign } from "../../domain/campagns/entites/campaign";
import type { DeleteCampaign } from "../../domain/campagns/uses-cases/delete-campaign";
import type { ViewCampaign } from "../../domain/campagns/uses-cases/view-campaign";
import type { UserId } from "../../domain/users/entities/user";

interface CampaignDetailsPageProps {
  currentUserId: UserId;
  viewCampaign: ViewCampaign;
  deleteCampaign: DeleteCampaign;
}

function CampaignDetailsPage({
  currentUserId,
  viewCampaign,
  deleteCampaign,
}: CampaignDetailsPageProps) {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [campaign, setCampaign] = useState<Campaign | null>(null);

  useEffect(() => {
    if (!id) {
      return;
    }

    viewCampaign.execute(CampaignId(id)).then(setCampaign).catch(console.error);
  }, [id, viewCampaign]);

  if (!campaign) {
    return <Typography variant="h5">{t("campaign.notFound")}</Typography>;
  }

  const isOwner = currentUserId === campaign.ownerId;

  const handleDelete = async () => {
    await deleteCampaign.execute(campaign.id);
    void navigate("/campaigns");
  };

  return (
    <Container maxWidth="md" sx={{ py: 3 }}>
      <Stack spacing={3}>
        <Box>
          <Typography variant="h3" component="h1" fontWeight={700} gutterBottom>
            {campaign.title}
          </Typography>
          <Chip label={campaign.status} sx={{ textTransform: "capitalize" }} />
        </Box>

        <Typography variant="body1">{campaign.description}</Typography>

        <Box>
          <Typography variant="subtitle1">Objectif: {campaign.goal.toLocaleString()} EUR</Typography>
          <Typography variant="subtitle1">
            Collecte actuelle: {getCampaignCollectedAmount(campaign).toLocaleString()} EUR
          </Typography>
          <LinearProgress
            variant="determinate"
            value={getCampaignProgressForBar(campaign)}
            sx={{ mt: 1, mb: 1.5, height: 10, borderRadius: 999 }}
          />
          <Typography variant="body2">{getCampaignProgress(campaign)}% de l objectif atteint</Typography>
          <Typography variant="subtitle1">Date de fin: {campaign.endDate}</Typography>
          <Typography variant="subtitle1">Projet lié: {campaign.projectId}</Typography>
        </Box>

        {campaign.status === "active" ? (
          <Box sx={{ p: 3, border: "1px solid", borderColor: "divider", borderRadius: 2 }}>
            <Typography variant="h5" fontWeight={700} mb={1}>
              {t("funding.title")}
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={2}>
              {t("funding.subtitle")}
            </Typography>
            <Button variant="contained" onClick={() => { void navigate(`/campaigns/${campaign.id}/fund`); }}>
              {t("funding.submit")}
            </Button>
          </Box>
        ) : null}

        {isOwner ? (
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <Button variant="contained" onClick={() => { void navigate(`/campaigns/${campaign.id}/edit`); }}>
              {t("campaign.edit")}
            </Button>
            <Button color="error" variant="outlined" onClick={() => { void handleDelete(); }}>
              {t("campaign.delete")}
            </Button>
          </Stack>
        ) : null}
      </Stack>
    </Container>
  );
}

export default CampaignDetailsPage;
