import { Grid, Typography, Alert } from "@mui/material";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import type { Project } from "../../domain/projects/entities/project";
import type { ViewAllProjects } from "../../domain/projects/uses-cases/view-all-projects";
import ProjectCard from "../components/ProjectCard";

interface HomePageProps {
  viewAllProjects: ViewAllProjects;
}

function HomePage({ viewAllProjects }: HomePageProps) {
  const { t } = useTranslation();
  const [projects, setProjects] = useState<Project[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    viewAllProjects.execute().then((result) => {
      if (result.isSuccess) {
        setProjects(result.value);
        setError(null);
      } else {
        setError(result.error?.message || t("homePage.errors.loadFailed"));
        setProjects([]);
      }
    }).catch(() => {
        setError(t("homePage.errors.unknownError"));
    });
  }, [viewAllProjects, t]);

  return (
    <>
      <Typography variant="h4" component="h1" fontWeight={700} mb={3}>
        {t("homePage.projectsTitle")}
      </Typography>

      {error ? (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      ) : null}

      {!error && projects.length === 0 ? (
        <Typography color="text.secondary">{t("homePage.noProjects")}</Typography>
      ) : (
        <Grid container spacing={3}>
          {projects.map((project) => (
            <Grid key={project.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
              <ProjectCard project={project} />
            </Grid>
          ))}
        </Grid>
      )}
    </>
  );
}

export default HomePage;
