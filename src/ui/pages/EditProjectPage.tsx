import { Box, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ProjectId, type Project } from "../../domain/projects/entities/project";
import type { UpdateProject } from "../../domain/projects/uses-cases/update-project";
import type { ViewProject } from "../../domain/projects/uses-cases/view-project";
import ProjectCreationForm from "../components/forms/ProjectCreationForm";

interface EditProjectPageProps {
  viewProject: ViewProject;
  updateProject: UpdateProject;
}

function EditProjectPage({ viewProject, updateProject }: EditProjectPageProps) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);

  useEffect(() => {
    if (!id) {
      return;
    }

    viewProject.execute(ProjectId(id)).then(setProject).catch(console.error);
  }, [id, viewProject]);

  if (!project || !id) {
    return <Typography variant="h5">Projet introuvable.</Typography>;
  }

  return (
    <Box sx={{ width: "100%", display: "flex", justifyContent: "center" }}>
      <ProjectCreationForm
        initialValues={{
          title: project.title,
          description: project.description,
          photoUrl: project.photoUrl,
        }}
        title="Modifier le projet"
        subtitle="Mettez a jour le titre, la description et la photo"
        submitLabel="Enregistrer les modifications"
        successMessage="Projet mis a jour avec succes !"
        onSubmit={(values) => {
          void updateProject.execute({
            id: ProjectId(id),
            values,
          }).then(() => navigate(`/projects/${id}`));
        }}
      />
    </Box>
  );
}

export default EditProjectPage;
