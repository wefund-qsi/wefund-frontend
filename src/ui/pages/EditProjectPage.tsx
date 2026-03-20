import { Box, CircularProgress, Grid, Stack, Typography } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { ProjectId, type Project, type ProjectFormValues } from "../../domain/projects/entities/project";
import type { UpdateProject } from "../../domain/projects/uses-cases/update-project";
import type { ViewProject } from "../../domain/projects/uses-cases/view-project";
import ProjectCard from "../components/ProjectCard";
import ProjectCreationForm from "../components/forms/ProjectCreationForm";

interface EditProjectPageProps {
  viewProject: ViewProject;
  updateProject: UpdateProject;
}

function EditProjectPage({ viewProject, updateProject }: EditProjectPageProps) {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [previewValues, setPreviewValues] = useState<ProjectFormValues | null>(null);
  const [loading, setLoading] = useState(Boolean(id));

  useEffect(() => {
    if (!id) {
      return;
    }

    viewProject.execute(ProjectId(id))
      .then(setProject)
      .catch(console.error)
      .finally(() => { setLoading(false); });
  }, [id, viewProject]);

  const displayedPreview = useMemo(() => {
    if (!project) {
      return null;
    }

    return {
      title: previewValues?.title || project.title,
      description: previewValues?.description || project.description,
      photoUrl: previewValues?.photoUrl || project.photoUrl,
    };
  }, [previewValues, project]);

  if (loading) {
    return (
      <Box sx={{ width: "100%", display: "flex", justifyContent: "center", py: 6 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!project || !id) {
    return <Typography variant="h5">Projet introuvable.</Typography>;
  }

  return (
    <Box sx={{ width: "100%", display: "flex", justifyContent: "center" }}>
      <Stack spacing={{ xs: 3, md: 4 }} sx={{ width: "100%", maxWidth: 1180 }}>
        <Stack spacing={1.5} sx={{ maxWidth: 620 }}>
          <Typography variant="overline" color="secondary.main">
            {t("projectForm.editEyebrow")}
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
            {t("projectForm.editPageTitle")}
          </Typography>
          <Typography variant="body1" sx={{ color: "text.secondary", lineHeight: 1.85 }}>
            {t("projectForm.editPageDescription")}
          </Typography>
        </Stack>

        <Grid container spacing={{ xs: 3, md: 4 }} alignItems="start">
          <Grid size={{ xs: 12, md: 7.25 }}>
            <ProjectCreationForm
              initialValues={{
                title: project.title,
                description: project.description,
                photoUrl: project.photoUrl,
              }}
              title={t("projectForm.editTitle")}
              subtitle={t("projectForm.editSubtitle")}
              submitLabel={t("projectForm.editSubmit")}
              successMessage={t("projectForm.editSuccess")}
              onValuesChange={setPreviewValues}
              onSubmit={(values) => {
                void updateProject.execute({
                  id: ProjectId(id),
                  values,
                }).then(() => navigate(`/projects/${id}`));
              }}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 4.75 }}>
            {displayedPreview ? (
              <Stack spacing={2}>
                <Typography variant="h5" component="h2" sx={{ fontSize: "1.45rem", color: "text.primary" }}>
                  {t("projectForm.previewTitle")}
                </Typography>
                <ProjectCard
                  project={{
                    ...project,
                    title: displayedPreview.title,
                    description: displayedPreview.description,
                    photoUrl: displayedPreview.photoUrl,
                  }}
                  titleComponent="h2"
                  disableNavigation
                  hideCta
                />
              </Stack>
            ) : null}
          </Grid>
        </Grid>
      </Stack>
    </Box>
  );
}

export default EditProjectPage;
