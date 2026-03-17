import { Button, Card, CardActions, CardContent, Grid, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Project } from "../../domain/projects/entities/project";
import type { DeleteProject } from "../../domain/projects/uses-cases/delete-project";
import type { ViawAllUserProject } from "../../domain/projects/uses-cases/view-all-user-projects";
import type { UserId } from "../../domain/users/entities/user";

interface MyProjectsPageProps {
  currentUserId: UserId;
  deleteProject: DeleteProject;
  viewAllUserProjects: ViawAllUserProject;
}

function MyProjectsPage({ currentUserId, deleteProject, viewAllUserProjects }: MyProjectsPageProps) {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    viewAllUserProjects.execute(currentUserId).then(setProjects).catch(console.error);
  }, [currentUserId, viewAllUserProjects]);

  const handleDelete = async (id: Project["id"]) => {
    await deleteProject.execute(id);
    const nextProjects = await viewAllUserProjects.execute(currentUserId);
    setProjects(nextProjects);
  };

  return (
    <Stack spacing={3}>
      <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" spacing={2}>
        <Typography variant="h4" component="h1" fontWeight={700}>
          Mes projets
        </Typography>
        <Button variant="contained" onClick={() => { void navigate("/projects/create"); }}>
          Nouveau projet
        </Button>
      </Stack>

      {projects.length === 0 ? (
        <Typography color="text.secondary">Vous n'avez encore cree aucun projet.</Typography>
      ) : (
        <Grid container spacing={3}>
          {projects.map((project) => (
            <Grid key={project.id} size={{ xs: 12, md: 6 }}>
              <Card>
                <CardContent>
                  <Typography variant="h6" fontWeight={700}>{project.title}</Typography>
                  <Typography variant="body2" color="text.secondary">{project.description}</Typography>
                </CardContent>
                <CardActions sx={{ px: 2, pb: 2, gap: 1, flexWrap: "wrap" }}>
                  <Button size="small" onClick={() => { void navigate(`/projects/${project.id}`); }}>
                    Voir
                  </Button>
                  <Button size="small" onClick={() => { void navigate(`/projects/${project.id}/edit`); }}>
                    Modifier
                  </Button>
                  <Button size="small" onClick={() => { void navigate(`/projects/${project.id}/campaigns/create`); }}>
                    Ajouter une campagne
                  </Button>
                  <Button size="small" color="error" onClick={() => { void handleDelete(project.id); }}>
                    Supprimer
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Stack>
  );
}

export default MyProjectsPage;
