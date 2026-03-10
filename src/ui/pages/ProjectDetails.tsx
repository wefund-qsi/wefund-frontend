import { Box, Button, Container, Grid, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { mockProject } from "../../domain/projects/mocks";

function ProjectDetails() {
  const { t } = useTranslation();

  // Mock data - En production, cela viendrait d'une API
  const project = mockProject;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Titre en gros */}
      <Typography
        variant="h2"
        component="h1"
        sx={{
          fontWeight: 700,
          mb: 4,
          color: "primary.dark",
          fontSize: { xs: "2rem", md: "3rem" },
        }}
      >
        {project.title}
      </Typography>

      {/* Section image et campagne côte à côte */}
      <Grid container spacing={4} sx={{ mb: 4, alignItems: "stretch" }}>
        {/* Colonne gauche - Image (2/3) */}
        <Grid item xs={12} md={8} sx={{ display: "flex" }}>
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
          item
          xs={12}
          md={4}
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <Box
            sx={{
              backgroundColor: "primary.main",
              color: "primary.contrastText",
              p: 2,
              borderRadius: 2,
              display: "flex",
              flexDirection: "column",
              gap: 2,
              alignItems: "center",
              textAlign: "center",
              justifyContent: "center",
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
                backgroundColor: "primary.contrastText",
                color: "primary.main",
                fontWeight: 600,
                px: 3,
                py: 1.5,
                "&:hover": {
                  backgroundColor: "primary.dark",
                  color: "primary.contrastText",
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

