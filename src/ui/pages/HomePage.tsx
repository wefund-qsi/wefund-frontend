import { Box, Button, Grid, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import type { Campaign } from "../../domain/campagns/entites/campaign";
import type { ViewAllCampaigns } from "../../domain/campagns/uses-cases/view-all-campaigns";
import type { Project } from "../../domain/projects/entities/project";
import type { ViewAllProjects } from "../../domain/projects/uses-cases/view-all-projects";
import CampaignCard from "../components/CampaignCard";
import ProjectCard from "../components/ProjectCard";

const heroImageUrl = "https://images.unsplash.com/photo-1537884444401-d79ef2b2990d?auto=format&fit=crop&w=1600&q=80";

interface HomePageProps {
  viewAllProjects: ViewAllProjects;
  viewAllCampaigns: ViewAllCampaigns;
}

function HomePage({ viewAllProjects, viewAllCampaigns }: HomePageProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);

  useEffect(() => {
    viewAllProjects.execute().then(setProjects).catch(console.error);
    viewAllCampaigns.execute().then(setCampaigns).catch(console.error);
  }, [viewAllProjects, viewAllCampaigns]);

  const activeCampaigns = campaigns.filter((campaign) => campaign.status === "ACTIVE").slice(0, 3);
  const featuredProjects = projects.slice(0, 4);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: { xs: 6, md: 8 } }}>
      <Box
        sx={(theme) => ({
          position: "relative",
          mt: { xs: -2, sm: -3 },
          mx: { xs: -2, sm: -3 },
          overflow: "hidden",
          minHeight: { xs: "calc(100svh - 76px)", md: "calc(100svh - 88px)" },
          display: "flex",
          backgroundColor: theme.palette.background.default,
        })}
      >
        <Box
          sx={{
            position: "absolute",
            top: { xs: 12, md: 28 },
            left: { xs: 16, md: 36 },
            width: { xs: 220, md: 320 },
            height: { xs: 220, md: 320 },
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(182,102,56,0.18) 0%, rgba(182,102,56,0) 72%)",
            pointerEvents: "none",
          }}
        />
        <Box
          sx={{
            position: "absolute",
            bottom: { xs: 18, md: 34 },
            right: { xs: 20, md: "36%" },
            width: { xs: 240, md: 360 },
            height: { xs: 240, md: 360 },
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(160,147,73,0.18) 0%, rgba(160,147,73,0) 72%)",
            pointerEvents: "none",
          }}
        />
        <Box
          sx={{
            position: "absolute",
            inset: { xs: "auto -8% 2% auto", md: "8% 3% 2% auto" },
            width: { xs: "86%", md: "42%" },
            overflow: "hidden",
            boxShadow: "0 22px 64px rgba(97, 95, 47, 0.10)",
            backgroundColor: "transparent",
          }}
        >
          <Box
            component="img"
            src={heroImageUrl}
            alt=""
            sx={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center center",
              display: "block",
            }}
          />
        </Box>

        <Grid
          container
          spacing={{ xs: 3, md: 4 }}
          alignItems="stretch"
          sx={{ flex: 1, position: "relative", zIndex: 1, px: { xs: 2, sm: 3, md: 5 }, py: { xs: 5, md: 7 } }}
        >
          <Grid size={{ xs: 12, md: 6.5 }}>
            <Box
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                py: { xs: 4, md: 7 },
                pr: { md: 4 },
              }}
            >
              <Typography
                variant="overline"
                sx={{
                  color: "secondary.main",
                }}
              >
                {t("homePage.heroEyebrow")}
              </Typography>
              <Typography
                variant="h1"
                component="h1"
                sx={{
                  maxWidth: 700,
                  mb: { xs: 3, md: 4.5 },
                  color: "text.primary",
                  fontSize: { xs: "2.6rem", md: "5rem" },
                  lineHeight: { xs: 1.02, md: 0.96 },
                  textWrap: "balance",
                }}
              >
                {t("homePage.heroTitle")}
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  maxWidth: 560,
                  mb: { xs: 4, md: 5.5 },
                  color: "text.secondary",
                  lineHeight: 1.9,
                  fontSize: { xs: "1rem", md: "1.06rem" },
                }}
              >
                {t("homePage.heroDescription")}
              </Typography>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2.5}>
                <Button
                  variant="contained"
                  onClick={() => void navigate("/campaigns")}
                  sx={(theme) => ({
                    px: 2.8,
                    py: 1.35,
                    bgcolor: theme.palette.secondary.main,
                    color: theme.palette.secondary.contrastText,
                    boxShadow: "0 18px 40px rgba(182, 102, 56, 0.22)",
                    "&:hover": {
                      bgcolor: theme.palette.secondary.dark,
                      boxShadow: "0 18px 40px rgba(148, 81, 44, 0.24)",
                    },
                  })}
                >
                  {t("homePage.heroPrimaryCta")}
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => void navigate("/projects/create")}
                  sx={{
                    px: 2.8,
                    py: 1.35,
                    color: "primary.main",
                    borderColor: "rgba(97,95,47,0.28)",
                    bgcolor: "rgba(255,255,255,0.32)",
                    "&:hover": {
                      borderColor: "primary.main",
                      bgcolor: "rgba(255,255,255,0.5)",
                    },
                  }}
                >
                  {t("homePage.heroSecondaryCta")}
                </Button>
              </Stack>
            </Box>
          </Grid>
        </Grid>
      </Box>

      <Box>
        <Typography variant="h3" component="h2" sx={{ mb: 3 }}>
          {t("homePage.projectsTitle")}
        </Typography>

        {featuredProjects.length === 0 ? (
          <Typography color="text.secondary">{t("homePage.noProjects")}</Typography>
        ) : (
          <Grid container spacing={3}>
            {featuredProjects.map((project) => (
              <Grid key={project.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                <ProjectCard project={project} />
              </Grid>
            ))}
          </Grid>
        )}
      </Box>

      <Box>
        <Stack direction={{ xs: "column", md: "row" }} justifyContent="space-between" spacing={2} sx={{ mb: 3 }}>
          <Typography variant="h3" component="h2">
            {t("homePage.campaignsTitle")}
          </Typography>
          <Button color="inherit" onClick={() => void navigate("/campaigns")} sx={{ alignSelf: { xs: "flex-start", md: "center" } }}>
            {t("homePage.campaignsLink")}
          </Button>
        </Stack>

        {activeCampaigns.length === 0 ? (
          <Typography color="text.secondary">{t("homePage.noCampaigns")}</Typography>
        ) : (
          <Grid container spacing={3}>
            {activeCampaigns.map((campaign) => (
              <Grid key={campaign.id} size={{ xs: 12, md: 4 }}>
                <CampaignCard campaign={campaign} />
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Box>
  );
}

export default HomePage;
