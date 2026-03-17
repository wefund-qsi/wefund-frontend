import { zodResolver } from "@hookform/resolvers/zod";
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
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { campaignSchema, type CampaignFormValues } from "../../../domain/campagns/entites/campaign";

interface CampaignFormProps {
  onSubmit: (payload: CampaignFormValues) => void | Promise<void>;
  initialValues?: CampaignFormValues;
  title?: string;
  subtitle?: string;
  submitLabel?: string;
  successMessage?: string;
}

function CampaignForm({
  onSubmit,
  initialValues,
  title,
  subtitle,
  submitLabel,
  successMessage,
}: CampaignFormProps) {
  const { t } = useTranslation();
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CampaignFormValues>({
    resolver: zodResolver(campaignSchema),
    defaultValues: initialValues ?? {
      title: "",
      description: "",
      goal: 1000,
      endDate: "",
    },
  });

  const onValid = async (data: CampaignFormValues) => {
    await onSubmit({
      ...data,
      goal: Number(data.goal),
    });
    setIsSubmitted(true);
    reset(data);
  };

  return (
    <Card sx={{ width: "100%", maxWidth: { xs: "100%", sm: 720 }, mx: "auto" }}>
      <CardHeader
        title={title ?? t("campaignForm.title")}
        subheader={subtitle ?? t("campaignForm.subtitle")}
      />
      <CardContent>
        <Box component="form" onSubmit={(event) => void handleSubmit(onValid)(event)} noValidate>
          <Stack spacing={2}>
            {isSubmitted ? <Alert severity="success">{successMessage ?? t("campaignForm.success")}</Alert> : null}

            <TextField
              label={t("campaignForm.fields.title")}
              {...register("title")}
              fullWidth
              required
              error={Boolean(errors.title)}
              helperText={errors.title ? t(errors.title.message!) : undefined}
            />

            <TextField
              label={t("campaignForm.fields.description")}
              {...register("description")}
              fullWidth
              required
              multiline
              minRows={4}
              error={Boolean(errors.description)}
              helperText={errors.description ? t(errors.description.message!) : undefined}
            />

            <TextField
              label={t("campaignForm.fields.goal")}
              {...register("goal", { valueAsNumber: true })}
              fullWidth
              required
              type="number"
              slotProps={{ htmlInput: { min: 1, step: 100 } }}
              error={Boolean(errors.goal)}
              helperText={errors.goal ? t(errors.goal.message!) : undefined}
            />

            <TextField
              label={t("campaignForm.fields.endDate")}
              {...register("endDate")}
              fullWidth
              required
              type="date"
              slotProps={{ inputLabel: { shrink: true } }}
              error={Boolean(errors.endDate)}
              helperText={errors.endDate ? t(errors.endDate.message!) : undefined}
            />

            <Button variant="contained" type="submit" sx={{ alignSelf: { xs: "stretch", sm: "flex-start" } }}>
              {submitLabel ?? t("campaignForm.submit")}
            </Button>
          </Stack>
        </Box>
      </CardContent>
    </Card>
  );
}

export default CampaignForm;
