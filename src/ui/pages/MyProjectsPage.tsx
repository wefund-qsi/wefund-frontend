import { Box, Button, Card, CardActions, CardContent, CardMedia, Dialog, DialogActions, DialogContent, DialogTitle, Grid, Stack, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import type { Project } from "../../domain/projects/entities/project";
import type { DeleteProject } from "../../domain/projects/uses-cases/delete-project";
import type { ViawAllUserProject } from "../../domain/projects/uses-cases/view-all-user-projects";
import type { UserId } from "../../domain/users/entities/user";
import noPicture from "../public/no_picture.jpg";

interface MyProjectsPageProps {
  currentUserId: UserId;
  deleteProject: DeleteProject;
  viewAllUserProjects: ViawAllUserProject;
}

function MyProjectsPage({ currentUserId, deleteProject, viewAllUserProjects }: MyProjectsPageProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);

  useEffect(() => {
    viewAllUserProjects.execute(currentUserId).then(setProjects).catch(console.error);
  }, [currentUserId, viewAllUserProjects]);

  const handleDelete = async (id: Project["id"]) => {
    await deleteProject.execute(id);
    const nextProjects = await viewAllUserProjects.execute(currentUserId);
    setProjects(nextProjects);
    setProjectToDelete(null);
  };

  return (
    <Stack spacing={{ xs: 4, md: 5 }}>
      <Stack spacing={1.5} sx={{ width: "100%" }}>
        <Typography variant="overline" color="secondary.main">
          {t("myProjects.eyebrow")}
        </Typography>
        <Stack direction={{ xs: "column", md: "row" }} justifyContent="space-between" spacing={2} alignItems={{ xs: "flex-start", md: "flex-start" }}>
          <Typography variant="h1" component="h1" sx={{ maxWidth: 760, fontSize: { xs: "2.4rem", md: "4rem" }, lineHeight: { xs: 1.03, md: 0.98 } }}>
            {t("myProjects.title")}
          </Typography>
          <Button variant="contained" onClick={() => { void navigate("/projects/create"); }} sx={{ alignSelf: { xs: "flex-start", md: "center" } }}>
            {t("myProjects.create")}
          </Button>
        </Stack>
        <Typography variant="body1" sx={{ maxWidth: 760, color: "text.secondary", lineHeight: 1.85 }}>
          {t("myProjects.description")}
        </Typography>
      </Stack>

      {projects.length === 0 ? (
        <Box
          sx={(theme) => ({
            borderRadius: 5,
            border: `1px dashed ${alpha(theme.palette.primary.main, 0.22)}`,
            background: `linear-gradient(180deg, ${alpha(theme.palette.primary.main, 0.04)} 0%, ${theme.palette.background.paper} 100%)`,
            px: { xs: 2.5, md: 3 },
            py: { xs: 3, md: 3.5 },
          })}
        >
          <Typography color="text.secondary">{t("myProjects.empty")}</Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {projects.map((project) => (
            <Grid key={project.id} size={{ xs: 12, sm: 6, lg: 4 }}>
              <Card
                sx={(theme) => ({
                  height: "100%",
                  overflow: "hidden",
                  borderRadius: 4,
                  border: `1px solid ${theme.palette.divider}`,
                  background: "linear-gradient(180deg, rgba(255,255,255,0.62) 0%, rgba(251,247,240,0.98) 100%)",
                  boxShadow: "0 18px 40px rgba(97, 95, 47, 0.08)",
                })}
              >
                <CardMedia
                  component="img"
                  height={210}
                  image={project.photoUrl}
                  alt={project.title}
                  sx={{ objectFit: "cover" }}
                  onError={(e) => { (e.target as HTMLImageElement).src = noPicture; }}
                />
                <CardContent sx={{ pb: 1.5 }}>
                  <Stack spacing={1.5}>
                    <Typography variant="h4" component="h2" sx={{ fontSize: "1.6rem" }}>
                      {project.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        lineHeight: 1.8,
                        display: "-webkit-box",
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {project.description}
                    </Typography>
                  </Stack>
                </CardContent>
                <CardActions sx={{ px: 2.5, pb: 2.5, gap: 1, flexWrap: "wrap" }}>
                  <Button size="small" onClick={() => { void navigate(`/projects/${project.id}`); }}>
                    {t("myProjects.view")}
                  </Button>
                  <Button size="small" onClick={() => { void navigate(`/projects/${project.id}/edit`); }}>
                    {t("myProjects.edit")}
                  </Button>
                  <Button size="small" onClick={() => { void navigate(`/projects/${project.id}/campaigns/create`); }}>
                    {t("myProjects.addCampaign")}
                  </Button>
                  <Button size="small" color="error" onClick={() => { setProjectToDelete(project); }}>
                    {t("myProjects.delete")}
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Dialog open={projectToDelete !== null} onClose={() => setProjectToDelete(null)} fullWidth maxWidth="sm">
        <DialogTitle sx={{ px: { xs: 3, md: 3.5 }, pt: { xs: 3, md: 3.5 }, pb: 1 }}>
          {t("myProjects.deleteDialogTitle")}
        </DialogTitle>
        <DialogContent sx={{ px: { xs: 3, md: 3.5 }, pb: 1.5 }}>
          <Typography variant="body1" sx={{ lineHeight: 1.85, color: "text.secondary" }}>
            {t("myProjects.deleteDialogBody", { title: projectToDelete?.title ?? "" })}
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: { xs: 3, md: 3.5 }, pb: { xs: 3, md: 3.5 }, pt: 1.5, gap: 1 }}>
          <Button onClick={() => setProjectToDelete(null)}>
            {t("myProjects.cancel")}
          </Button>
          <Button
            color="error"
            variant="contained"
            onClick={() => { if (projectToDelete) { void handleDelete(projectToDelete.id); } }}
          >
            {t("myProjects.confirmDelete")}
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}

export default MyProjectsPage;
