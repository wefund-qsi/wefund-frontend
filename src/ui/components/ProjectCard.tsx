import { Box, Card, CardActionArea, CardMedia, CardContent, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import type { Project } from "../../domain/projects/entities/project";
import noPicture from "../public/no_picture.jpg";

interface ProjectCardProps {
  project: Project;
  titleComponent?: "h2" | "h3";
}

function ProjectCard({ project, titleComponent = "h3" }: ProjectCardProps) {
  const navigate = useNavigate();

  return (
    <Card
      sx={(theme) => ({
        display: "flex",
        flexDirection: "column",
        height: "100%",
        overflow: "hidden",
        borderRadius: 4,
        border: `1px solid ${theme.palette.divider}`,
        background: "linear-gradient(180deg, rgba(255,255,255,0.62) 0%, rgba(251,247,240,0.98) 100%)",
        boxShadow: "0 18px 40px rgba(97, 95, 47, 0.08)",
        transition: "transform 0.24s ease, box-shadow 0.24s ease, border-color 0.24s ease",
        "&:hover": {
          transform: "translateY(-8px)",
          boxShadow: "0 26px 52px rgba(97, 95, 47, 0.14)",
          borderColor: "rgba(182,102,56,0.28)",
        },
      })}
    >
      <CardActionArea 
        onClick={() => { void navigate(`/projects/${project.id}`); }}
        sx={{ display: "flex", flexDirection: "column", alignItems: "stretch", height: "100%" }}
      >
        <CardMedia
          component="img"
          height={180}
          image={project.photoUrl}
          alt={project.title}
          sx={{ objectFit: "cover" }}
          onError={(e) => { (e.target as HTMLImageElement).src = noPicture; }}
        />
        <CardContent sx={{ flex: 1, display: "flex", flexDirection: "column", gap: 1.5, p: 2.5 }}>
          <Typography variant="h5" component={titleComponent} fontWeight={600} sx={{ color: "text.primary", lineHeight: 1.1 }}>
            {project.title}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: "text.secondary",
              lineHeight: 1.75,
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {project.description}
          </Typography>
          <Box sx={{ mt: "auto", pt: 1 }}>
            <Typography variant="body2" sx={{ color: "primary.main", fontWeight: 600 }}>
              Voir le projet
            </Typography>
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

export default ProjectCard;
