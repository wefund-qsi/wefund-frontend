import { Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ProjectCreationForm from "../features/projects/ProjectCreationForm";
import type { ProjectFormValues } from "../types/project";

function CreateProjectPage() {
  const navigate = useNavigate();

  const handleSubmit = (payload: ProjectFormValues) => {
    // TODO: envoyer payload au backend via API, qui retournera le Project complet avec id
    console.log("Données envoyées (mock) :", payload);

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
