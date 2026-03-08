import { useState, type ChangeEvent, type FormEvent } from "react";
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
import { useTranslation } from "react-i18next";
import type { Project } from "../../types/project";

type ProjectFormValues = Pick<Project, "title" | "description" | "photoUrl">;

interface ProjectCreationFormProps {
  onSubmit: (payload: ProjectFormValues) => void;
}

const initialFormValues: ProjectFormValues = {
  title: "",
  description: "",
  photoUrl: "",
};

function ProjectCreationForm({ onSubmit }: ProjectCreationFormProps) {
  const { t } = useTranslation();
  const [formValues, setFormValues] = useState<ProjectFormValues>(initialFormValues);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof ProjectFormValues, string>>>({});

  const handleChange =
    (field: keyof ProjectFormValues) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFormValues((previousValues) => ({
        ...previousValues,
        [field]: event.target.value,
      }));
    };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof ProjectFormValues, string>> = {};

    if (!formValues.title.trim()) {
      newErrors.title = t("projectForm.errors.titleRequired");
    }
    if (!formValues.description.trim()) {
      newErrors.description = t("projectForm.errors.descriptionRequired");
    }
    if (!formValues.photoUrl.trim()) {
      newErrors.photoUrl = t("projectForm.errors.photoUrlRequired");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    onSubmit(formValues);
    setIsSubmitted(true);
    setFormValues(initialFormValues);
    setErrors({});
  };

  return (
    <Card sx={{ width: "100%", maxWidth: { xs: "100%", sm: 720 }, mx: "auto" }}>
      <CardHeader title={t("projectForm.title")} subheader={t("projectForm.subtitle")} />
      <CardContent>
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Stack spacing={2}>
            {isSubmitted ? (
              <Alert severity="success">{t("projectForm.success")}</Alert>
            ) : null}

            <TextField
              label={t("projectForm.fields.title")}
              value={formValues.title}
              onChange={handleChange("title")}
              fullWidth
              required
              error={Boolean(errors.title)}
              helperText={errors.title}
            />

            <TextField
              label={t("projectForm.fields.description")}
              value={formValues.description}
              onChange={handleChange("description")}
              fullWidth
              required
              multiline
              minRows={4}
              error={Boolean(errors.description)}
              helperText={errors.description}
            />

            <TextField
              label={t("projectForm.fields.photoUrl")}
              value={formValues.photoUrl}
              onChange={handleChange("photoUrl")}
              fullWidth
              required
              type="url"
              placeholder="https://example.com/photo.jpg"
              error={Boolean(errors.photoUrl)}
              helperText={errors.photoUrl}
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
