import { Box, Button, Stack, Typography } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import type { CreateCampaign } from "../../domain/campagns/uses-cases/create-campaign";
import CampaignForm from "../components/forms/CampaignForm";
import { ProjectId } from "../../domain/projects/entities/project";
import type { UserId } from "../../domain/users/entities/user";

interface CreateCampaignPageProps {
  createCampaign: CreateCampaign;
  currentUserId: UserId;
}

function CreateCampaignPage({ createCampaign, currentUserId }: CreateCampaignPageProps) {
  const navigate = useNavigate();
  const { projectId } = useParams<{ projectId: string }>();

  if (!projectId) {
    return (
      <Stack spacing={2}>
        <Typography variant="h5">Projet introuvable pour cette campagne.</Typography>
        <Button variant="contained" onClick={() => { void navigate("/my-projects"); }}>
          Retour aux projets
        </Button>
      </Stack>
    );
  }

  return (
    <Box sx={{ display: "flex", justifyContent: "center" }}>
      <CampaignForm
        onSubmit={async (payload) => {
          await createCampaign.execute({
            ...payload,
            ownerId: currentUserId,
            projectId: ProjectId(projectId),
          });
          void navigate(`/projects/${projectId}`);
        }}
      />
    </Box>
  );
}

export default CreateCampaignPage;
