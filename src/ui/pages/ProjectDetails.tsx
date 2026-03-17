import { Box, Button, Container, Grid, Typography, CircularProgress, IconButton, Stack } from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
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

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: "flex", alignItems: "center", mb: 4, gap: 2 }}>
        <IconButton onClick={() => { void navigate("/"); }} aria-label="back" sx={{ color: "primary.dark" }}>
          <ArrowBackIcon fontSize="large" />
        </IconButton>
        <Typography
          variant="h2"
          component="h1"
          sx={{
            fontWeight: 700,
            color: "primary.dark",
            fontSize: { xs: "2rem", md: "3rem" },
          }}
        >
          {project.title}
        </Typography>
      </Box>

      <Grid container spacing={4} sx={{ mb: 4, alignItems: "stretch" }}>
        <Grid size={{ xs: 12, md: 8 }} sx={{ display: "flex" }}>
          <Box
            component="img"
            src={project.photoUrl}
            alt={project.title}
            sx={{
              width: "100%",
              height: "auto",
              maxHeight: { xs: "300px", sm: "400px", md: "500px" },
              objectFit: "cover",
              borderRadius: 2,
              boxShadow: 2,
              display: "block",
            }}
          />
        </Grid>

        <Grid
          size={{ xs: 12, md: 4 }}
          sx={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Box
            sx={{
              backgroundColor: "#283618",
              color: "#FEFAE0",
              p: 2,
              borderRadius: 2,
              display: "flex",
              flexDirection: "column",
              gap: 2,
              alignItems: "center",
              textAlign: "center",
              justifyContent: "center",
              height: "100%",
            }}
          >
            <Typography
              variant="h5"
              sx={{
                fontWeight: 600,
                fontSize: { xs: "1.3rem", md: "1.5rem" },
                lineHeight: 1.4,
                mb: 1,
              }}
            >
              {campaigns.length > 0 ? t("campaign.projectSectionTitle") : t("campaign.createCampaign")}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                mb: 3,
                fontSize: { xs: "0.9rem", md: "1rem" },
                lineHeight: 1.6,
              }}
            >
              {campaigns.length > 0 ? t("campaign.projectSummary", { count: campaigns.length }) : t("campaign.noCampaignYet")}
            </Typography>
            {isOwner ? (
              <Stack spacing={2} width="100%">
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: "#FEFAE0",
                    color: "#283618",
                    fontWeight: 600,
                    px: 3,
                    py: 1.5,
                    "&:hover": {
                      backgroundColor: "#E5E1C9",
                      color: "#283618",
                    },
                  }}
                  onClick={() => { void navigate(`/projects/${project.id}/campaigns/create`); }}
                >
                  {t("campaign.createNew")}
                </Button>
                <Button
                  variant="outlined"
                  sx={{ color: "#FEFAE0", borderColor: "#FEFAE0" }}
                  onClick={() => { void navigate(`/projects/${project.id}/edit`); }}
                >
                  {t("project.edit")}
                </Button>
              </Stack>
            ) : null}
          </Box>
        </Grid>
      </Grid>

      <Box sx={{ mb: 6 }}>
        <Typography
          variant="body1"
          sx={{
            color: "text.primary",
            lineHeight: 1.8,
            fontSize: "1.1rem",
            whiteSpace: "pre-wrap",
          }}
        >
          {project.description}
        </Typography>
      </Box>
      <Box sx={{ mt: 4 }}>
        <Typography
          variant="h4"
          component="h2"
          sx={{ fontWeight: 700, mb: 3, color: "primary.dark" }}
        >
          {t("campaign.projectSectionTitle")}
        </Typography>

        {campaigns.length === 0 ? (
          <Typography variant="body1" sx={{ color: "text.secondary", fontStyle: "italic", mb: 4 }}>
            {t("campaign.noCampaignYet")}
          </Typography>
        ) : (
          <Grid container spacing={3} sx={{ mb: 5 }}>
            {campaigns.map((campaign) => (
              <Grid size={{ xs: 12, md: 6 }} key={campaign.id}>
                <CampaignCard campaign={campaign} />
              </Grid>
            ))}
          </Grid>
        )}

        <Typography
          variant="h4"
          component="h2"
          sx={{ fontWeight: 700, mb: 3, color: "primary.dark" }}
        >
          {t("project.newsTitle", "Actualités")}
        </Typography>

        {newsList.length === 0 ? (
          <Typography variant="body1" sx={{ color: "text.secondary", fontStyle: "italic" }}>
            {t("project.noNews", "Aucune actualité pour le moment.")}
          </Typography>
        ) : (
          <Grid container spacing={3}>
            {newsList.map((news) => (
              <Grid size={{ xs: 12 }} key={news.id}>
                <Box sx={{ p: 3, border: "1px solid", borderColor: "divider", borderRadius: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                    {news.title}
                  </Typography>
                  <Typography variant="caption" sx={{ color: "text.secondary", display: "block", mb: 2 }}>
                    {new Date(news.publishedAt).toLocaleDateString()}
                  </Typography>
                  <Typography variant="body2">
                    {news.content}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Container>
  );
}

export default ProjectDetails;
