import { Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import type { ProjectFormValues } from "../../domain/projects/entities/project";
import type { CreateProject } from "../../domain/projects/uses-cases/create-project";
import { UserId } from "../../domain/users/entities/user";
import ProjectCreationForm from "../components/forms/ProjectCreationForm";

const PLACEHOLDER_USER_ID = UserId("placeholder-user-id");

interface CreateProjectPageProps {
  createProject: CreateProject;
}

function CreateProjectPage({ createProject }: CreateProjectPageProps) {
  const navigate = useNavigate();

  const handleSubmit = async (payload: ProjectFormValues) => {
    const result = await createProject.execute({
      ...payload,
      ownerId: PLACEHOLDER_USER_ID,
    });

    if (result.isSuccess) {
      setTimeout(() => {
        void navigate("/");
      }, 1500);
    }

    return result;
  };

  return (
    <Box sx={{ width: "100%", display: "flex", justifyContent: "center" }}>
      <ProjectCreationForm onSubmit={(payload) => handleSubmit(payload)} />
    </Box>
  );
}

export default CreateProjectPage;
