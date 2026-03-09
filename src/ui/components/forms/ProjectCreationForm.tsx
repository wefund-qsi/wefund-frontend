import { useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Stack,
  TextField,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import { projectSchema, type ProjectFormValues } from "../../../types/project";

interface ProjectCreationFormProps {
  onSubmit: (payload: ProjectFormValues) => void;
}

function ProjectCreationForm({ onSubmit }: ProjectCreationFormProps) {
  const { t } = useTranslation();
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: { title: "", description: "", photoUrl: "" },
  });

  const onValid = (data: ProjectFormValues) => {
    onSubmit(data);
    setIsSubmitted(true);
    reset();
  };

  return (
    <Card sx={{ width: "100%", maxWidth: { xs: "100%", sm: 720 }, mx: "auto" }}>
      <CardHeader title={t("projectForm.title")} subheader={t("projectForm.subtitle")} />
      <CardContent>
        <Box component="form" onSubmit={(e) => void handleSubmit(onValid)(e)} noValidate>
          <Stack spacing={2}>
            {isSubmitted ? (
              <Alert severity="success">{t("projectForm.success")}</Alert>
            ) : null}

            <TextField
              label={t("projectForm.fields.title")}
              {...register("title")}
              fullWidth
              required
              error={Boolean(errors.title)}
              helperText={errors.title ? t(errors.title.message!) : undefined}
            />

            <TextField
              label={t("projectForm.fields.description")}
              {...register("description")}
              fullWidth
              required
              multiline
              minRows={4}
              error={Boolean(errors.description)}
              helperText={errors.description ? t(errors.description.message!) : undefined}
            />

            <TextField
              label={t("projectForm.fields.photoUrl")}
              {...register("photoUrl")}
              fullWidth
              required
              type="url"
              placeholder="https://example.com/photo.jpg"
              error={Boolean(errors.photoUrl)}
              helperText={errors.photoUrl ? t(errors.photoUrl.message!) : undefined}
            />

            <Button variant="contained" type="submit" sx={{ alignSelf: { xs: "stretch", sm: "flex-start" } }}>
              {t("projectForm.submit")}
            </Button>
          </Stack>
        </Box>
      </CardContent>
    </Card>
  );
}

export default ProjectCreationForm;
