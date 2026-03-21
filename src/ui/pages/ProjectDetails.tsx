import { Box, Button, CircularProgress, Container, Grid, Stack, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams, useNavigate } from "react-router-dom";
import { ProjectId, type Project } from "../../domain/projects/entities/project";
import type { Campaign } from "../../domain/campagns/entites/campaign";
import type { ViewProject } from "../../domain/projects/uses-cases/view-project";
import type { CampaignNews } from "../../domain/campagns/entites/campaign-news";
import type { ViewProjectCampaigns } from "../../domain/campagns/uses-cases/view-project-campaigns";
import type { UserId } from "../../domain/users/entities/user";
import CampaignCard from "../components/CampaignCard";

interface ProjectDetailsProps {
  viewProject: ViewProject;
  viewProjectCampaigns: ViewProjectCampaigns;
  currentUserId: UserId;
}

function ProjectDetails({ viewProject, viewProjectCampaigns, currentUserId }: ProjectDetailsProps) {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [newsList] = useState<CampaignNews[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      viewProject.execute(ProjectId(id)).then(fetchedProject => {
        setProject(fetchedProject);
        setLoading(false);
      }).catch(err => {
        console.error(err);
        setLoading(false);
      });
      viewProjectCampaigns.execute(ProjectId(id)).then(setCampaigns).catch(console.error);
    }
  }, [id, viewProject, viewProjectCampaigns]);

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (!project) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4">{t("project.notFound", "Project not found")}</Typography>
      </Container>
    );
  }

  const isOwner = currentUserId === project.ownerId;
  const activeCampaignsCount = campaigns.filter((campaign) => campaign.status === "ACTIVE").length;
  const successfulCampaignsCount = campaigns.filter((campaign) => campaign.status === "REUSSIE").length;
  const visibleCampaigns = campaigns.filter((campaign) => campaign.status !== "BROUILLON");
  const draftCampaigns = campaigns.filter((campaign) => campaign.status === "BROUILLON");

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
      <Stack spacing={{ xs: 4, md: 5 }}>
        <Stack spacing={1.5}>
          <Typography variant="overline" color="secondary.main">
            {t("project.detailsEyebrow")}
          </Typography>
          <Typography
            variant="h1"
            component="h1"
            sx={{
              color: "text.primary",
              fontSize: { xs: "2.3rem", md: "4.2rem" },
              lineHeight: { xs: 1.04, md: 0.98 },
              textWrap: "balance",
            }}
          >
            {project.title}
          </Typography>
        </Stack>

        <Grid container spacing={{ xs: 3, md: 4 }} alignItems="stretch">
          <Grid size={{ xs: 12, md: 7.5 }} sx={{ display: "flex" }}>
            <Box
              sx={(theme) => ({
                width: "100%",
                overflow: "hidden",
                borderRadius: 5,
                border: `1px solid ${theme.palette.divider}`,
                backgroundColor: theme.palette.background.paper,
                boxShadow: "0 22px 54px rgba(97, 95, 47, 0.08)",
              })}
            >
              <Box
                component="img"
                src={project.photoUrl}
                alt={project.title}
                sx={{
                  width: "100%",
                  height: "100%",
                  minHeight: { xs: 280, sm: 380, md: 520 },
                  objectFit: "cover",
                  display: "block",
                }}
              />
            </Box>
          </Grid>

          <Grid size={{ xs: 12, md: 4.5 }} sx={{ display: "flex" }}>
            <Box
              sx={(theme) => ({
                display: "flex",
                flexDirection: "column",
                gap: 3,
                width: "100%",
                borderRadius: 5,
                border: `1px solid ${theme.palette.divider}`,
                background: `linear-gradient(180deg, ${alpha(theme.palette.secondary.main, 0.06)} 0%, ${theme.palette.background.paper} 100%)`,
                boxShadow: "0 18px 44px rgba(97, 95, 47, 0.08)",
                p: { xs: 2.5, md: 3 },
              })}
            >
              <Box>
                <Typography variant="h3" component="h2" sx={{ mb: 1.5, fontSize: { xs: "1.8rem", md: "2.2rem" } }}>
                  {t("project.detailsSummaryTitle")}
                </Typography>
                <Typography variant="body1" sx={{ color: "text.secondary", lineHeight: 1.8 }}>
                  {t("project.detailsSummaryDescription")}
                </Typography>
              </Box>

              <Box sx={{ px: 0.5, py: 0.5 }}>
                <Stack direction="row" spacing={1.2} alignItems="baseline">
                  <Typography
                    component="p"
                    sx={{
                      color: "text.primary",
                      fontFamily: "var(--font-family-heading)",
                      fontSize: { xs: "3.1rem", md: "4.35rem" },
                      lineHeight: 0.88,
                    }}
                  >
                    {campaigns.length}
                  </Typography>
                  <Typography variant="h6" component="p" sx={{ color: "text.secondary", fontWeight: 500 }}>
                    {t("project.totalCampaignsLabel")}
                  </Typography>
                </Stack>
              </Box>

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
                spacing={{ xs: 1.8, sm: 0 }}
                sx={{ pt: 1 }}
              >
                <Box sx={{ flex: 1, pr: { sm: 2 } }}>
                  <Typography
                    component="p"
                    sx={{
                      color: "text.primary",
                      fontFamily: "var(--font-family-heading)",
                      fontSize: { xs: "1.7rem", md: "2rem" },
                      lineHeight: 0.95,
                      mb: 0.6,
                    }}
                  >
                    {campaigns.filter((campaign) => campaign.status === "BROUILLON" || campaign.status === "EN_ATTENTE").length}
                  </Typography>
                  <Typography variant="caption" sx={{ display: "block", color: "text.secondary" }}>
                    {t("project.draftOrPendingCampaigns")}
                  </Typography>
                </Box>
                <Box sx={{ flex: 1, px: { sm: 2 } }}>
                  <Typography
                    component="p"
                    sx={{
                      color: "secondary.main",
                      fontFamily: "var(--font-family-heading)",
                      fontSize: { xs: "1.7rem", md: "2rem" },
                      lineHeight: 0.95,
                      mb: 0.6,
                    }}
                  >
                    {activeCampaignsCount}
                  </Typography>
                  <Typography variant="caption" sx={{ display: "block", color: "text.secondary" }}>
                    {t("project.activeCampaigns")}
                  </Typography>
                </Box>
                <Box sx={{ flex: 1, pl: { sm: 2 } }}>
                  <Typography
                    component="p"
                    sx={{
                      color: "success.dark",
                      fontFamily: "var(--font-family-heading)",
                      fontSize: { xs: "1.7rem", md: "2rem" },
                      lineHeight: 0.95,
                      mb: 0.6,
                    }}
                  >
                    {successfulCampaignsCount}
                  </Typography>
                  <Typography variant="caption" sx={{ display: "block", color: "text.secondary" }}>
                    {t("project.successfulCampaigns")}
                  </Typography>
                </Box>
              </Stack>

              {isOwner ? (
                <Stack spacing={1.5} sx={{ mt: "auto" }}>
                  <Button
                    variant="contained"
                    onClick={() => { void navigate(`/projects/${project.id}/campaigns/create`); }}
                    sx={{
                      py: 1.35,
                      bgcolor: "secondary.main",
                      color: "secondary.contrastText",
                      boxShadow: "0 16px 36px rgba(182, 102, 56, 0.2)",
                      "&:hover": {
                        bgcolor: "secondary.dark",
                      },
                    }}
                  >
                    {t("campaign.createNew")}
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() => { void navigate(`/projects/${project.id}/edit`); }}
                    sx={{
                      py: 1.25,
                      borderColor: "rgba(97,95,47,0.28)",
                      color: "primary.main",
                    }}
                  >
                    {t("project.edit")}
                  </Button>
                </Stack>
              ) : null}
            </Box>
          </Grid>
        </Grid>

        <Box
          sx={(theme) => ({
            borderRadius: 5,
            border: `1px solid ${theme.palette.divider}`,
            background: `linear-gradient(180deg, rgba(255,255,255,0.42) 0%, ${theme.palette.background.paper} 100%)`,
            px: { xs: 2.5, md: 3.5 },
            py: { xs: 2.5, md: 3.5 },
          })}
        >
          <Typography variant="h3" component="h2" sx={{ mb: 2.5, fontSize: { xs: "1.75rem", md: "2.2rem" } }}>
            {t("project.descriptionTitle")}
          </Typography>
          <Box
            sx={{
              color: "text.primary",
              lineHeight: 1.85,
              fontSize: { xs: "1rem", md: "1.06rem" },
              whiteSpace: "pre-wrap",
            }}
          >
            {project.description}
          </Box>
        </Box>

        <Box>
          <Typography variant="h3" component="h2" sx={{ mb: 3, fontSize: { xs: "1.75rem", md: "2.2rem" } }}>
            {t("campaign.projectSectionTitle")}
          </Typography>

          {visibleCampaigns.length === 0 ? (
            <Box
              sx={(theme) => ({
                borderRadius: 4,
                border: `1px dashed ${alpha(theme.palette.primary.main, 0.26)}`,
                backgroundColor: alpha(theme.palette.background.paper, 0.8),
                px: 2.5,
                py: 3,
              })}
            >
              <Typography variant="body1" sx={{ color: "text.secondary" }}>
                {t("campaign.noCampaignYet")}
              </Typography>
            </Box>
          ) : (
            <Grid container spacing={3}>
              {visibleCampaigns.map((campaign) => (
                <Grid size={{ xs: 12, md: 6 }} key={campaign.id}>
                  <CampaignCard campaign={campaign} titleComponent="h3" />
                </Grid>
              ))}
            </Grid>
          )}
        </Box>

        {isOwner && draftCampaigns.length > 0 ? (
          <Box>
            <Box
              sx={(theme) => ({
                borderRadius: 5,
                border: `1px solid ${alpha(theme.palette.primary.main, 0.14)}`,
                background: `linear-gradient(180deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${theme.palette.background.paper} 100%)`,
                px: { xs: 2.5, md: 3 },
                py: { xs: 2.5, md: 3 },
                mb: 3,
              })}
            >
              <Typography variant="h3" component="h2" sx={{ mb: 1.2, fontSize: { xs: "1.75rem", md: "2.2rem" } }}>
                {t("project.draftCampaignsTitle")}
              </Typography>
              <Typography variant="body1" sx={{ color: "text.secondary", lineHeight: 1.8, maxWidth: 760 }}>
                {t("project.draftCampaignsDescription")}
              </Typography>
            </Box>

            <Grid container spacing={3}>
              {draftCampaigns.map((campaign) => (
                <Grid size={{ xs: 12, md: 6 }} key={campaign.id}>
                  <CampaignCard campaign={campaign} titleComponent="h3" />
                </Grid>
              ))}
            </Grid>
          </Box>
        ) : null}

        <Box>
          <Typography variant="h3" component="h2" sx={{ mb: 3, fontSize: { xs: "1.75rem", md: "2.2rem" } }}>
            {t("project.newsTitle", "Actualités")}
          </Typography>

          {newsList.length === 0 ? (
            <Box
              sx={(theme) => ({
                borderRadius: 4,
                border: `1px dashed ${alpha(theme.palette.secondary.main, 0.3)}`,
                background: `linear-gradient(180deg, ${alpha(theme.palette.secondary.main, 0.04)} 0%, ${theme.palette.background.paper} 100%)`,
                px: 2.5,
                py: 3,
              })}
            >
              <Typography variant="body1" sx={{ color: "text.secondary" }}>
                {t("project.noNews", "Aucune actualité pour le moment.")}
              </Typography>
            </Box>
          ) : (
            <Grid container spacing={3}>
              {newsList.map((news) => (
                <Grid size={{ xs: 12 }} key={news.id}>
                  <Box
                    sx={(theme) => ({
                      p: 3,
                      border: `1px solid ${theme.palette.divider}`,
                      borderRadius: 4,
                      backgroundColor: theme.palette.background.paper,
                    })}
                  >
                    <Typography variant="h4" component="h3" sx={{ fontWeight: 600, mb: 1.25, fontSize: "1.45rem" }}>
                      {news.title}
                    </Typography>
                    <Typography variant="caption" sx={{ color: "text.secondary", display: "block", mb: 2 }}>
                      {new Date(news.publishedAt).toLocaleDateString()}
                    </Typography>
                    <Typography variant="body2" sx={{ lineHeight: 1.8 }}>
                      {news.content}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
      </Stack>
    </Container>
  );
}

export default ProjectDetails;
