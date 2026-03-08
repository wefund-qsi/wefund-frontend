import { Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ProjectCreationForm from "../features/projects/ProjectCreationForm";
import type { Project } from "../types/project";

type ProjectFormValues = Pick<Project, "title" | "description" | "photoUrl">;

function CreateProjectPage() {
  const navigate = useNavigate();

  const handleSubmit = (payload: ProjectFormValues) => {
    const newProject: Project = {
      ...payload,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };

    // TODO: à remplacer par un appel API quand le backend sera prêt
    console.log("Projet créé (mock) :", newProject);

    setTimeout(() => {
      void navigate("/");
    }, 1500);
  };

  return (
    <Box sx={{ width: "100%", display: "flex", justifyContent: "center" }}>
      <ProjectCreationForm onSubmit={handleSubmit} />
    </Box>
  );
}

export default CreateProjectPage;
