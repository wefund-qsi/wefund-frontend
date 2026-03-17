import { Box, Stack, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import type { ProjectFormValues } from "../../domain/projects/entities/project";
import type { CreateProject } from "../../domain/projects/uses-cases/create-project";
import ProjectCreationForm from "../components/forms/ProjectCreationForm";
import type { UserId } from "../../domain/users/entities/user";

interface CreateProjectPageProps {
  createProject: CreateProject;
  currentUserId: UserId;
}

function CreateProjectPage({ createProject, currentUserId }: CreateProjectPageProps) {
  const navigate = useNavigate();

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
    <Box sx={{ width: "100%", display: "flex", justifyContent: "center", flexDirection: "column", gap: 2 }}>
      <Stack spacing={1} sx={{ maxWidth: 720, mx: "auto", width: "100%" }}>
        <Typography variant="body2" color="text.secondary">
          Cette page utilise un proprietaire local fixe pour la demonstration du CRUD projet/campagne.
        </Typography>
      </Stack>
      <ProjectCreationForm onSubmit={(payload) => void handleSubmit(payload)} />
    </Box>
  );
}

export default CreateProjectPage;
