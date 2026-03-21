import { Box, Grid, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import type { Project } from "../../domain/projects/entities/project";
import type { ViewAllProjects } from "../../domain/projects/uses-cases/view-all-projects";
import ProjectCard from "../components/ProjectCard";

interface ProjectsPageProps {
  viewAllProjects: ViewAllProjects;
}

function ProjectsPage({ viewAllProjects }: ProjectsPageProps) {
  const { t } = useTranslation();
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    viewAllProjects.execute().then(setProjects).catch(console.error);
  }, [viewAllProjects]);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 5 }}>
      <Box sx={{ px: { xs: 0, md: 1 }, py: { xs: 1, md: 2 } }}>
        <Typography variant="overline" color="secondary.main">
          {t("project.pageEyebrow")}
        </Typography>
        <Typography variant="h1" component="h1" sx={{ maxWidth: 760, mb: 2, fontSize: { xs: "2.4rem", md: "4rem" } }}>
          {t("project.listTitle")}
        </Typography>
        <Typography variant="body1" sx={{ maxWidth: 720, color: "text.secondary", lineHeight: 1.85 }}>
          {t("project.pageDescription")}
        </Typography>
      </Box>

      {projects.length === 0 ? (
        <Typography color="text.secondary">{t("project.emptyList")}</Typography>
      ) : (
        <Grid container spacing={3}>
          {projects.map((project) => (
            <Grid key={project.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
              <ProjectCard project={project} titleComponent="h2" />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}

export default ProjectsPage;
