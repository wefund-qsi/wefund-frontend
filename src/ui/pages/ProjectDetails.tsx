import { Box, Button, Container, Grid, Typography, CircularProgress, IconButton } from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams, useNavigate } from "react-router-dom";
import { ProjectId, type Project } from "../../domain/projects/entities/project";
import type { ViewProject } from "../../domain/projects/uses-cases/view-project";

interface ProjectDetailsProps {
  viewProject: ViewProject;
}

function ProjectDetails({ viewProject }: ProjectDetailsProps) {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
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
    }
  }, [id, viewProject]);

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

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Titre en gros avec bouton retour */}
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

      {/* Section image et campagne côte à côte */}
      <Grid container spacing={4} sx={{ mb: 4, alignItems: "stretch" }}>
        {/* Colonne gauche - Image (2/3) */}
        <Grid size={{ xs: 12, md: 8 }} sx={{ display: "flex" }}>
          {/* Image du projet */}
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

        {/* Colonne droite - Bouton créer campagne (1/3) */}
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
              {t("campaign.createCampaign")}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                mb: 3,
                fontSize: { xs: "0.9rem", md: "1rem" },
                lineHeight: 1.6,
              }}
            >
              {t("campaign.noCampaignYet")}
            </Typography>
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
            >
              {t("campaign.createNew")}
            </Button>
          </Box>
        </Grid>
      </Grid>

      {/* Description en pleine largeur */}
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
    </Container>
  );
}

export default ProjectDetails;

