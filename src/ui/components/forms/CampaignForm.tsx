import { zodResolver } from "@hookform/resolvers/zod";
import {
  Checkbox,
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  FormControlLabel,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { campaignSchema, type CampaignFormValues } from "../../../domain/campagns/entites/campaign";

interface CampaignFormProps {
  onSubmit: (payload: CampaignFormValues, options: { isDraft: boolean }) => void | Promise<void>;
  initialValues?: CampaignFormValues;
  title?: string;
  subtitle?: string;
  submitLabel?: string;
  successMessage?: string;
  showDraftOption?: boolean;
  initialIsDraft?: boolean;
}

function CampaignForm({
  onSubmit,
  initialValues,
  title,
  subtitle,
  submitLabel,
  successMessage,
  showDraftOption = false,
  initialIsDraft = true,
}: CampaignFormProps) {
  const { t } = useTranslation();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isDraft, setIsDraft] = useState(initialIsDraft);

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
    }, { isDraft });
    setIsSubmitted(true);
    reset(data);
  };

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
        title={title ?? t("campaignForm.title")}
        subheader={subtitle ?? t("campaignForm.subtitle")}
        sx={{ px: { xs: 2.5, md: 3 }, pt: { xs: 2.5, md: 3 }, pb: 0 }}
        titleTypographyProps={{ variant: "h3", component: "h2", sx: { fontSize: { xs: "1.9rem", md: "2.3rem" }, mb: 0.3 } }}
        subheaderTypographyProps={{ sx: { mt: 0.8, color: "text.secondary", lineHeight: 1.8 } }}
      />
      <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
        <Box component="form" onSubmit={(event) => void handleSubmit(onValid)(event)} noValidate>
          <Stack spacing={2.4}>
            {isSubmitted ? <Alert severity="success">{successMessage ?? t("campaignForm.success")}</Alert> : null}

            <TextField
              label={t("campaignForm.fields.title")}
              {...register("title")}
              id="campaign-title"
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
              label={t("campaignForm.fields.description")}
              {...register("description")}
              id="campaign-description"
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
              label={t("campaignForm.fields.goal")}
              {...register("goal", { valueAsNumber: true })}
              id="campaign-goal"
              fullWidth
              required
              type="number"
              variant="filled"
              slotProps={{ htmlInput: { min: 1, step: 100 } }}
              error={Boolean(errors.goal)}
              helperText={errors.goal ? t(errors.goal.message!) : undefined}
              sx={{
                "& .MuiFilledInput-root": {
                  borderRadius: 3,
                  bgcolor: "rgba(255,255,255,0.7)",
                },
              }}
            />

            <TextField
              label={t("campaignForm.fields.endDate")}
              {...register("endDate")}
              id="campaign-end-date"
              fullWidth
              required
              type="date"
              variant="filled"
              slotProps={{ inputLabel: { shrink: true } }}
              error={Boolean(errors.endDate)}
              helperText={errors.endDate ? t(errors.endDate.message!) : undefined}
              sx={{
                "& .MuiFilledInput-root": {
                  borderRadius: 3,
                  bgcolor: "rgba(255,255,255,0.7)",
                },
              }}
            />

            {showDraftOption ? (
              <FormControlLabel
                control={
                  <Checkbox
                    checked={isDraft}
                    onChange={(event) => { setIsDraft(event.target.checked); }}
                  />
                }
                label={
                  <Box>
                    <Typography variant="body2" sx={{ color: "text.primary", fontWeight: 600 }}>
                      {t("campaignForm.draftLabel")}
                    </Typography>
                    <Typography variant="caption" sx={{ color: "text.secondary" }}>
                      {isDraft ? t("campaignForm.draftHint") : t("campaignForm.publishHint")}
                    </Typography>
                  </Box>
                }
                sx={{ alignItems: "flex-start", m: 0 }}
              />
            ) : null}

            <Button variant="contained" type="submit" sx={{ alignSelf: { xs: "stretch", sm: "flex-start" }, px: 2.8, py: 1.2 }}>
              {submitLabel ?? t("campaignForm.submit")}
            </Button>
          </Stack>
        </Box>
      </CardContent>
    </Card>
  );
}

export default CampaignForm;
