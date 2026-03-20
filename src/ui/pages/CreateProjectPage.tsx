import { Box, Grid, Stack, Typography } from "@mui/material";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { type ProjectFormValues } from "../../domain/projects/entities/project";
import type { CreateProject } from "../../domain/projects/uses-cases/create-project";
import { UserId } from "../../domain/users/entities/user";
import ProjectCard from "../components/ProjectCard";
import ProjectCreationForm from "../components/forms/ProjectCreationForm";

interface CreateProjectPageProps {
  createProject: CreateProject;
  currentUserId: UserId;
}

function CreateProjectPage({ createProject, currentUserId }: CreateProjectPageProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [previewValues, setPreviewValues] = useState<ProjectFormValues>({
    title: "",
    description: "",
    photoUrl: "",
  });

  const handleSubmit = async (payload: ProjectFormValues) => {
    await createProject.execute({
      ...payload,
      ownerId: currentUserId,
    });

    setTimeout(() => {
      void navigate("/my-projects");
    }, 1500);
  };

  return (
    <Box sx={{ width: "100%", display: "flex", justifyContent: "center" }}>
      <Stack spacing={{ xs: 3, md: 4 }} sx={{ width: "100%", maxWidth: 1180 }}>
        <Stack spacing={1.5} sx={{ maxWidth: 620 }}>
          <Typography variant="overline" color="secondary.main">
            {t("projectForm.createEyebrow")}
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
            {t("projectForm.createPageTitle")}
          </Typography>
          <Typography variant="body1" sx={{ color: "text.secondary", lineHeight: 1.85 }}>
            {t("projectForm.createPageDescription")}
          </Typography>
        </Stack>

        <Grid container spacing={{ xs: 3, md: 4 }} alignItems="start">
          <Grid size={{ xs: 12, md: 7.25 }}>
            <ProjectCreationForm
              onValuesChange={setPreviewValues}
              onSubmit={(payload) => void handleSubmit(payload)}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 4.75 }}>
            <Stack spacing={2}>
              <Typography variant="h5" component="h2" sx={{ fontSize: "1.45rem", color: "text.primary" }}>
                {t("projectForm.previewTitle")}
              </Typography>
              <ProjectCard
                project={{
                  id: "preview-project" as never,
                  ownerId: currentUserId,
                  createdAt: new Date(),
                  title: previewValues.title || t("projectForm.previewFallbackTitle"),
                  description: previewValues.description || t("projectForm.previewFallbackDescription"),
                  photoUrl: previewValues.photoUrl || "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1200&q=80",
                }}
                titleComponent="h2"
                disableNavigation
                hideCta
              />
            </Stack>
          </Grid>
        </Grid>
      </Stack>
    </Box>
  );
}

export default CreateProjectPage;
