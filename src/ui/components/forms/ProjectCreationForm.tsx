import { useEffect, useState } from "react";
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
import { projectSchema, type ProjectFormValues } from "../../../domain/projects/entities/project";

interface ProjectCreationFormProps {
  onSubmit: (payload: ProjectFormValues) => void;
  initialValues?: ProjectFormValues;
  submitLabel?: string;
  successMessage?: string;
  title?: string;
  subtitle?: string;
  onValuesChange?: (values: ProjectFormValues) => void;
}

function ProjectCreationForm({
  onSubmit,
  initialValues,
  submitLabel,
  successMessage,
  title,
  subtitle,
  onValuesChange,
}: ProjectCreationFormProps) {
  const { t } = useTranslation();
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: initialValues ?? { title: "", description: "", photoUrl: "" },
  });

  const onValid = (data: ProjectFormValues) => {
    onSubmit(data);
    setIsSubmitted(true);
    reset(initialValues ? data : undefined);
  };

  const watchedValues = watch();

  useEffect(() => {
    if (!onValuesChange) {
      return;
    }

    onValuesChange({
      title: watchedValues.title ?? "",
      description: watchedValues.description ?? "",
      photoUrl: watchedValues.photoUrl ?? "",
    });
  }, [onValuesChange, watchedValues.description, watchedValues.photoUrl, watchedValues.title]);

  return (
    <Card
      sx={(theme) => ({
        width: "100%",
        maxWidth: { xs: "100%", sm: 760 },
        mx: "auto",
        borderRadius: 5,
        border: `1px solid ${theme.palette.divider}`,
        background: "linear-gradient(180deg, rgba(255,255,255,0.62) 0%, rgba(251,247,240,0.98) 100%)",
        boxShadow: "0 20px 46px rgba(97, 95, 47, 0.08)",
      })}
    >
      <CardHeader
        title={title ?? t("projectForm.title")}
        subheader={subtitle ?? t("projectForm.subtitle")}
        sx={{ px: { xs: 2.5, md: 3 }, pt: { xs: 2.5, md: 3 }, pb: 0 }}
        titleTypographyProps={{ variant: "h3", component: "h2", sx: { fontSize: { xs: "1.9rem", md: "2.3rem" }, mb: 0.3 } }}
        subheaderTypographyProps={{ sx: { mt: 0.8, color: "text.secondary", lineHeight: 1.8 } }}
      />
      <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
        <Box component="form" onSubmit={(e) => void handleSubmit(onValid)(e)} noValidate>
          <Stack spacing={2.4}>
            {isSubmitted ? (
              <Alert severity="success">{successMessage ?? t("projectForm.success")}</Alert>
            ) : null}

            <TextField
              label={t("projectForm.fields.title")}
              {...register("title")}
              id="project-title"
              fullWidth
              required
              variant="filled"
              error={Boolean(errors.title)}
              helperText={errors.title ? t(errors.title.message!) : undefined}
              sx={{
                "& .MuiFilledInput-root": {
                  borderRadius: 3,
                  bgcolor: "rgba(255,255,255,0.7)",
                },
              }}
            />

            <TextField
              label={t("projectForm.fields.description")}
              {...register("description")}
              id="project-description"
              fullWidth
              required
              multiline
              minRows={4}
              variant="filled"
              error={Boolean(errors.description)}
              helperText={errors.description ? t(errors.description.message!) : undefined}
              sx={{
                "& .MuiFilledInput-root": {
                  borderRadius: 3,
                  bgcolor: "rgba(255,255,255,0.7)",
                },
              }}
            />

            <TextField
              label={t("projectForm.fields.photoUrl")}
              {...register("photoUrl")}
              id="project-photo-url"
              fullWidth
              required
              type="url"
              variant="filled"
              placeholder="https://example.com/photo.jpg"
              error={Boolean(errors.photoUrl)}
              helperText={errors.photoUrl ? t(errors.photoUrl.message!) : undefined}
              sx={{
                "& .MuiFilledInput-root": {
                  borderRadius: 3,
                  bgcolor: "rgba(255,255,255,0.7)",
                },
              }}
            />

            <Button variant="contained" type="submit" sx={{ alignSelf: { xs: "stretch", sm: "flex-start" }, px: 2.8, py: 1.2 }}>
              {submitLabel ?? t("projectForm.submit")}
            </Button>
          </Stack>
        </Box>
      </CardContent>
    </Card>
  );
}

export default ProjectCreationForm;
