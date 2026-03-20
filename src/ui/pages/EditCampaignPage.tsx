import { Box, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CampaignId, type Campaign } from "../../domain/campagns/entites/campaign";
import type { UpdateCampaign } from "../../domain/campagns/uses-cases/update-campaign";
import type { ViewCampaign } from "../../domain/campagns/uses-cases/view-campaign";
import CampaignForm from "../components/forms/CampaignForm";

interface EditCampaignPageProps {
  viewCampaign: ViewCampaign;
  updateCampaign: UpdateCampaign;
}

function EditCampaignPage({ viewCampaign, updateCampaign }: EditCampaignPageProps) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [campaign, setCampaign] = useState<Campaign | null>(null);

  useEffect(() => {
    if (!id) {
      return;
    }

    viewCampaign.execute(CampaignId(id)).then(setCampaign).catch(console.error);
  }, [id, viewCampaign]);

  if (!campaign || !id) {
    return <Typography variant="h5">Campagne introuvable.</Typography>;
  }

  return (
    <Box sx={{ display: "flex", justifyContent: "center" }}>
      <CampaignForm
        initialValues={{
          title: campaign.title,
          description: campaign.description,
          goal: campaign.goal,
          endDate: campaign.endDate,
        }}
        showDraftOption={campaign.status === "BROUILLON" || campaign.status === "EN_ATTENTE"}
        initialIsDraft={campaign.status === "BROUILLON"}
        title="Modifier la campagne"
        subtitle="Mettez a jour vos informations de campagne"
        submitLabel="Enregistrer les modifications"
        successMessage="Campagne mise a jour avec succes !"
        onSubmit={async (values, { isDraft }) => {
          await updateCampaign.execute({
            id: CampaignId(id),
            values,
            nextStatus: campaign.status === "BROUILLON" || campaign.status === "EN_ATTENTE"
              ? (isDraft ? "BROUILLON" : "EN_ATTENTE")
              : undefined,
          });
          void navigate(`/campaigns/${id}`);
        }}
      />
    </Box>
  );
}

export default EditCampaignPage;
