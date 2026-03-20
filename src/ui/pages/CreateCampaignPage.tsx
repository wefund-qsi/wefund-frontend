import { Box, Button, CircularProgress, Grid, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import type { Campaign } from "../../domain/campagns/entites/campaign";
import type { CreateCampaign } from "../../domain/campagns/uses-cases/create-campaign";
import type { ViewProjectCampaigns } from "../../domain/campagns/uses-cases/view-project-campaigns";
import CampaignForm from "../components/forms/CampaignForm";
import { ProjectId, type Project } from "../../domain/projects/entities/project";
import type { ViewProject } from "../../domain/projects/uses-cases/view-project";
import type { UserId } from "../../domain/users/entities/user";
import ProjectCard from "../components/ProjectCard";

interface CreateCampaignPageProps {
  createCampaign: CreateCampaign;
  currentUserId: UserId;
  viewProject: ViewProject;
  viewProjectCampaigns: ViewProjectCampaigns;
}

function CreateCampaignPage({ createCampaign, currentUserId, viewProject, viewProjectCampaigns }: CreateCampaignPageProps) {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { projectId } = useParams<{ projectId: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [projectCampaigns, setProjectCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!projectId) {
      setLoading(false);
      return;
    }

    Promise.all([
      viewProject.execute(ProjectId(projectId)),
      viewProjectCampaigns.execute(ProjectId(projectId)),
    ])
      .then(([fetchedProject, fetchedCampaigns]) => {
        setProject(fetchedProject);
        setProjectCampaigns(fetchedCampaigns);
      })
      .catch(console.error)
      .finally(() => { setLoading(false); });
  }, [projectId, viewProject, viewProjectCampaigns]);

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

  if (loading) {
    return (
      <Box sx={{ width: "100%", display: "flex", justifyContent: "center", py: 6 }}>
        <CircularProgress />
      </Box>
    );
  }

  const activeCampaigns = projectCampaigns.filter((campaign) => campaign.status === "ACTIVE");
  const draftCampaigns = projectCampaigns.filter((campaign) => campaign.status === "BROUILLON");
  const nextActiveEndDate = activeCampaigns
    .map((campaign) => campaign.endDate)
    .sort()[0];
  const nextDraftEndDate = draftCampaigns
    .map((campaign) => campaign.endDate)
    .sort()[0];

  const formatDate = (value?: string) => {
    if (!value) {
      return t("campaignForm.none");
    }

    return new Intl.DateTimeFormat(i18n.language === "fr" ? "fr-FR" : "en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(new Date(value));
  };

  return (
    <Box sx={{ width: "100%", display: "flex", justifyContent: "center" }}>
      <Stack spacing={{ xs: 3, md: 4 }} sx={{ width: "100%", maxWidth: 1180 }}>
        <Stack spacing={1.5} sx={{ maxWidth: 620 }}>
          <Typography variant="overline" color="secondary.main">
            {t("campaignForm.eyebrow")}
          </Typography>
          <Typography
            variant="h1"
            component="h1"
            sx={{
              fontSize: { xs: "2.4rem", md: "4rem" },
              lineHeight: { xs: 1.03, md: 0.98 },
              textWrap: "balance",
            }}
          >
            {t("campaignForm.pageTitle")}
          </Typography>
          <Typography variant="body1" sx={{ color: "text.secondary", lineHeight: 1.85 }}>
            {t("campaignForm.pageDescription")}
          </Typography>
        </Stack>

        <Grid container spacing={{ xs: 3, md: 4 }} alignItems="start">
          <Grid size={{ xs: 12, md: 7.25 }}>
            <CampaignForm
              showDraftOption
              initialIsDraft
              onSubmit={async (payload, { isDraft }) => {
                await createCampaign.execute({
                  ...payload,
                  ownerId: currentUserId,
                  projectId: ProjectId(projectId),
                  status: isDraft ? "BROUILLON" : "EN_ATTENTE",
                });
                void navigate(`/projects/${projectId}`);
              }}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 4.75 }}>
            {project ? (
              <Stack spacing={2}>
                <Typography variant="h5" component="h2" sx={{ fontSize: "1.45rem", color: "text.primary" }}>
                  {t("campaignForm.linkedProject")}
                </Typography>
                <ProjectCard project={project} titleComponent="h2" />
                <Stack spacing={1.6} sx={{ pt: 0.5 }}>
                  <Typography variant="h6" component="h3" sx={{ fontSize: "1.15rem", color: "text.primary" }}>
                    {t("campaignForm.projectContextTitle")}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "text.secondary", lineHeight: 1.8 }}>
                    {t("campaignForm.projectContextDescription")}
                  </Typography>
                  <Grid container spacing={{ xs: 2.2, sm: 2.6 }}>
                    <Grid size={{ xs: 6 }}>
                      <Typography variant="caption" sx={{ display: "block", color: "text.secondary", mb: 0.45 }}>
                        {t("campaignForm.activeCampaignsCount")}
                      </Typography>
                      <Typography
                        component="p"
                        sx={{
                          color: "text.primary",
                          fontFamily: "var(--font-family-heading)",
                          fontSize: "1.75rem",
                          lineHeight: 0.95,
                        }}
                      >
                        {activeCampaigns.length}
                      </Typography>
                    </Grid>
                    <Grid size={{ xs: 6 }}>
                      <Typography variant="caption" sx={{ display: "block", color: "text.secondary", mb: 0.45 }}>
                        {t("campaignForm.draftCampaignsCount")}
                      </Typography>
                      <Typography
                        component="p"
                        sx={{
                          color: "text.primary",
                          fontFamily: "var(--font-family-heading)",
                          fontSize: "1.75rem",
                          lineHeight: 0.95,
                        }}
                      >
                        {draftCampaigns.length}
                      </Typography>
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <Typography variant="caption" sx={{ display: "block", color: "text.secondary", mb: 0.35 }}>
                        {t("campaignForm.nextActiveEndDate")}
                      </Typography>
                      <Typography variant="body2" sx={{ color: "text.primary", fontWeight: 600 }}>
                        {formatDate(nextActiveEndDate)}
                      </Typography>
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <Typography variant="caption" sx={{ display: "block", color: "text.secondary", mb: 0.35 }}>
                        {t("campaignForm.nextDraftEndDate")}
                      </Typography>
                      <Typography variant="body2" sx={{ color: "text.primary", fontWeight: 600 }}>
                        {formatDate(nextDraftEndDate)}
                      </Typography>
                    </Grid>
                  </Grid>
                </Stack>
              </Stack>
            ) : null}
          </Grid>
        </Grid>
      </Stack>
    </Box>
  );
}

export default CreateCampaignPage;
