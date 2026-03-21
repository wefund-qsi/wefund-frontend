import { Box, Button, Chip, CircularProgress, Container, Grid, LinearProgress, Stack, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { CampaignId, getCampaignCollectedAmount, getCampaignProgress, getCampaignProgressForBar, type Campaign } from "../../domain/campagns/entites/campaign";
import type { DeleteCampaign } from "../../domain/campagns/uses-cases/delete-campaign";
import type { ViewCampaign } from "../../domain/campagns/uses-cases/view-campaign";
import type { Project } from "../../domain/projects/entities/project";
import type { ViewProject } from "../../domain/projects/uses-cases/view-project";
import type { UserId } from "../../domain/users/entities/user";
import ProjectCard from "../components/ProjectCard";

interface CampaignDetailsPageProps {
  currentUserId: UserId;
  viewCampaign: ViewCampaign;
  viewProject: ViewProject;
  deleteCampaign: DeleteCampaign;
}

function CampaignDetailsPage({
  currentUserId,
  viewCampaign,
  viewProject,
  deleteCampaign,
}: CampaignDetailsPageProps) {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      return;
    }

    viewCampaign.execute(CampaignId(id))
      .then(async (fetchedCampaign) => {
        setCampaign(fetchedCampaign);

        if (!fetchedCampaign) {
          setLoading(false);
          return;
        }

        try {
          const fetchedProject = await viewProject.execute(fetchedCampaign.projectId);
          setProject(fetchedProject);
        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
        }
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  }, [id, viewCampaign, viewProject]);

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 6, display: "flex", justifyContent: "center" }}>
        <CircularProgress />
      </Container>
    );
  }

  if (!campaign) {
    return (
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Typography variant="h4">{t("campaign.notFound")}</Typography>
      </Container>
    );
  }

  const isOwner = currentUserId === campaign.ownerId;
  const collectedAmount = getCampaignCollectedAmount(campaign);
  const progress = getCampaignProgress(campaign);
  const progressValue = getCampaignProgressForBar(campaign);

  const statusConfig = {
    BROUILLON: {
      label: t("campaign.statuses.BROUILLON"),
      accent: "#8A7F57",
      chipBg: "rgba(138, 127, 87, 0.16)",
      chipColor: "#615f2f",
    },
    EN_ATTENTE: {
      label: t("campaign.statuses.EN_ATTENTE"),
      accent: "#b66638",
      chipBg: "rgba(182, 102, 56, 0.12)",
      chipColor: "#9a522a",
    },
    ACTIVE: {
      label: t("campaign.statuses.ACTIVE"),
      accent: "#615f2f",
      chipBg: "rgba(97, 95, 47, 0.12)",
      chipColor: "#4F4D25",
    },
    REUSSIE: {
      label: t("campaign.statuses.REUSSIE"),
      accent: "#2F6B52",
      chipBg: "rgba(47, 107, 82, 0.12)",
      chipColor: "#1F503C",
    },
    ECHOUEE: {
      label: t("campaign.statuses.ECHOUEE"),
      accent: "#9C7756",
      chipBg: "rgba(156, 119, 86, 0.12)",
      chipColor: "#7A5D42",
    },
    REFUSEE: {
      label: t("campaign.statuses.REFUSEE"),
      accent: "#9C5F49",
      chipBg: "rgba(156, 95, 73, 0.12)",
      chipColor: "#7E4836",
    },
  }[campaign.status];

  const handleDelete = async () => {
    await deleteCampaign.execute(campaign.id);
    void navigate("/campaigns");
  };

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
      <Stack spacing={{ xs: 5, md: 7 }}>
        <Stack spacing={{ xs: 2, md: 2.5 }}>
          <Typography variant="overline" color="secondary.main">
            {t("campaign.detailsEyebrow")}
          </Typography>
          <Stack direction={{ xs: "column", md: "row" }} spacing={{ xs: 2, md: 2.5 }} alignItems={{ xs: "flex-start", md: "center" }}>
            <Typography variant="h1" component="h1" sx={{ fontSize: { xs: "2.35rem", md: "4.1rem" }, lineHeight: { xs: 1.03, md: 0.98 }, textWrap: "balance" }}>
              {campaign.title}
            </Typography>
            <Chip
              label={statusConfig.label}
              sx={{
                bgcolor: statusConfig.chipBg,
                color: statusConfig.chipColor,
                fontWeight: 700,
                border: `1px solid ${alpha(statusConfig.accent, 0.18)}`,
              }}
            />
          </Stack>
        </Stack>

        <Grid container spacing={{ xs: 4, md: 5 }} alignItems="stretch">
          <Grid size={{ xs: 12, md: 7 }}>
            <Box
              sx={(theme) => ({
                display: "flex",
                flexDirection: "column",
                gap: { xs: 3.5, md: 4 },
                height: "100%",
                borderRadius: 5,
                border: `1px solid ${alpha(statusConfig.accent, 0.18)}`,
                background: `linear-gradient(180deg, ${alpha(statusConfig.accent, 0.06)} 0%, ${theme.palette.background.paper} 100%)`,
                boxShadow: `0 18px 44px ${alpha(statusConfig.accent, 0.1)}`,
                p: { xs: 3, md: 3.5 },
              })}
            >
              <Typography variant="body1" sx={{ color: "text.secondary", lineHeight: 1.85, maxWidth: 640 }}>
                {campaign.description}
              </Typography>

              <Box>
                <Stack direction="row" spacing={1.2} alignItems="baseline" sx={{ mb: { xs: 1.5, md: 1.8 } }}>
                  <Typography
                    component="p"
                    sx={{
                      color: "text.primary",
                      fontFamily: "var(--font-family-heading)",
                      fontSize: { xs: "3.2rem", md: "4.7rem" },
                      lineHeight: 0.9,
                    }}
                  >
                    {progress}%
                  </Typography>
                  <Typography variant="h6" component="p" sx={{ color: "text.secondary", fontWeight: 500 }}>
                    {t("campaign.progressReached")}
                  </Typography>
                </Stack>
                <LinearProgress
                  variant="determinate"
                  value={progressValue}
                  sx={{
                    mb: { xs: 2.8, md: 3.2 },
                    height: 10,
                    borderRadius: 999,
                    bgcolor: alpha(statusConfig.accent, 0.14),
                    "& .MuiLinearProgress-bar": { bgcolor: statusConfig.accent },
                  }}
                />
                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  divider={
                    <Box
                      sx={(theme) => ({
                        alignSelf: "stretch",
                        width: { xs: "100%", sm: "1px" },
                        height: { xs: "1px", sm: "auto" },
                        backgroundColor: alpha(theme.palette.primary.main, 0.12),
                      })}
                    />
                  }
                  spacing={{ xs: 2.2, sm: 0 }}
                >
                  <Box sx={{ flex: 1, pr: { sm: 2 } }}>
                    <Typography component="p" sx={{ color: "text.primary", fontFamily: "var(--font-family-heading)", fontSize: { xs: "1.8rem", md: "2.1rem" }, lineHeight: 0.95, mb: 0.6 }}>
                      {collectedAmount.toLocaleString()} EUR
                    </Typography>
                    <Typography variant="caption" sx={{ display: "block", color: "text.secondary" }}>
                      {t("campaign.collected")}
                    </Typography>
                  </Box>
                  <Box sx={{ flex: 1, px: { sm: 2 } }}>
                    <Typography component="p" sx={{ color: "secondary.main", fontFamily: "var(--font-family-heading)", fontSize: { xs: "1.8rem", md: "2.1rem" }, lineHeight: 0.95, mb: 0.6 }}>
                      {campaign.goal.toLocaleString()} EUR
                    </Typography>
                    <Typography variant="caption" sx={{ display: "block", color: "text.secondary" }}>
                      {t("campaign.goal")}
                    </Typography>
                  </Box>
                  <Box sx={{ flex: 1, pl: { sm: 2 } }}>
                    <Typography component="p" sx={{ color: "text.primary", fontFamily: "var(--font-family-heading)", fontSize: { xs: "1.8rem", md: "2.1rem" }, lineHeight: 0.95, mb: 0.6 }}>
                      {campaign.endDate}
                    </Typography>
                    <Typography variant="caption" sx={{ display: "block", color: "text.secondary" }}>
                      {t("campaign.endDateLabel")}
                    </Typography>
                  </Box>
                </Stack>
              </Box>

              {campaign.status === "ACTIVE" ? (
                <Stack direction={{ xs: "column", sm: "row" }} spacing={2.5} alignItems={{ xs: "flex-start", sm: "center" }} sx={{ mt: "auto", pt: { xs: 1.5, md: 2 } }}>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h4" component="h2" sx={{ mb: 0.8, fontSize: "1.7rem" }}>
                      {t("funding.title")}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.8 }}>
                      {t("funding.subtitle")}
                    </Typography>
                  </Box>
                  <Button
                    variant="contained"
                    onClick={() => { void navigate(`/campaigns/${campaign.id}/fund`); }}
                    sx={{
                      alignSelf: { xs: "flex-start", sm: "center" },
                      px: 2.8,
                      py: 1.2,
                      boxShadow: "0 16px 34px rgba(182, 102, 56, 0.18)",
                    }}
                  >
                    {t("funding.submit")}
                  </Button>
                </Stack>
              ) : (
                <Typography variant="body2" color="text.secondary" sx={{ mt: "auto", pt: { xs: 1.5, md: 2 }, lineHeight: 1.8 }}>
                    {t("funding.subtitle")}
                  </Typography>
              )}

              {isOwner ? (
                <Stack
                  spacing={1.6}
                  sx={(theme) => ({
                    mt: 1,
                    pt: 2.5,
                    borderTop: `1px solid ${alpha(theme.palette.primary.main, 0.12)}`,
                  })}
                >
                  <Typography
                    variant="h5"
                    component="h2"
                    sx={{ fontSize: "1.4rem", color: "text.primary" }}
                  >
                    {t("campaign.ownerActions")}
                  </Typography>
                  <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                    <Button variant="outlined" onClick={() => { void navigate(`/campaigns/${campaign.id}/edit`); }}>
                      {t("campaign.edit")}
                    </Button>
                    <Button color="error" variant="outlined" onClick={() => { void handleDelete(); }}>
                      {t("campaign.delete")}
                    </Button>
                  </Stack>
                </Stack>
              ) : null}
            </Box>
          </Grid>

          <Grid size={{ xs: 12, md: 5 }}>
            {project ? (
              <Stack spacing={2}>
                <Typography
                  variant="h5"
                  component="h2"
                  sx={{ fontSize: "1.45rem", color: "text.primary" }}
                >
                  {t("campaign.linkedProject")}
                </Typography>
                <ProjectCard project={project} titleComponent="h2" />
              </Stack>
            ) : (
              <Typography variant="body1" color="text.secondary">
                {t("campaign.projectUnavailable")}
              </Typography>
            )}
          </Grid>
        </Grid>
      </Stack>
    </Container>
  );
}

export default CampaignDetailsPage;
