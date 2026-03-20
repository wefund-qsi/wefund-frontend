import { Card, CardActionArea, CardMedia, CardContent, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import type { Project } from "../../domain/projects/entities/project";
import noPicture from "../public/no_picture.jpg";

interface ProjectCardProps {
  project: Project;
}

function ProjectCard({ project }: ProjectCardProps) {
  const navigate = useNavigate();

  return (
    <Card
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        bgcolor: "#283618",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
        "&:hover": {
          transform: "translateY(-6px)",
          boxShadow: 8,
        },
      }}
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
        <CardContent sx={{ flex: 1 }}>
          <Typography variant="h5" component="h3" fontWeight={600} noWrap sx={{ color: "#FEFAE0" }}>
            {project.title}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

export default ProjectCard;
