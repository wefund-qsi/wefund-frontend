import { zodResolver } from "@hookform/resolvers/zod";
import { Alert, Box, Button, Stack, TextField } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";

const refundRequestSchema = z.object({
  accountHolder: z.string().min(1, "refund.errors.accountHolderRequired"),
  iban: z.string().regex(/^[A-Z]{2}\d{2}[A-Z0-9]{11,30}$/, "refund.errors.ibanInvalid"),
  reason: z.string().min(1, "refund.errors.reasonRequired"),
});

export type RefundRequestFormValues = z.infer<typeof refundRequestSchema>;

interface RefundRequestFormProps {
  isSubmitting: boolean;
  onSubmit: (values: RefundRequestFormValues) => Promise<void> | void;
  errorMessage?: string | null;
}

function RefundRequestForm({ isSubmitting, onSubmit, errorMessage }: RefundRequestFormProps) {
  const { t } = useTranslation();
  const formatIban = (value: string) => value.replace(/\s+/g, "").toUpperCase();

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RefundRequestFormValues>({
    resolver: zodResolver(refundRequestSchema),
    defaultValues: {
      accountHolder: "",
      iban: "",
      reason: "",
    },
  });

  return (
    <Box
      sx={(theme) => ({
        borderRadius: 4,
        border: `1px solid ${theme.palette.divider}`,
        background: "linear-gradient(180deg, rgba(255,255,255,0.62) 0%, rgba(251,247,240,0.98) 100%)",
        boxShadow: "0 20px 46px rgba(97, 95, 47, 0.08)",
        px: { xs: 2.25, md: 2.5 },
        py: { xs: 2.25, md: 2.5 },
      })}
    >
      <Stack component="form" spacing={2.5} onSubmit={(event) => void handleSubmit(onSubmit)(event)}>
        {errorMessage ? <Alert severity="error">{errorMessage}</Alert> : null}

        <TextField
          id="refund-account-holder"
          label={t("refund.fields.accountHolder")}
          {...register("accountHolder")}
          error={Boolean(errors.accountHolder)}
          helperText={errors.accountHolder ? t(errors.accountHolder.message!) : undefined}
          disabled={isSubmitting}
          variant="filled"
          fullWidth
          sx={{
            "& .MuiFilledInput-root": {
              borderRadius: 3,
              bgcolor: "rgba(255,255,255,0.7)",
            },
          }}
        />

        <Controller
          name="iban"
          control={control}
          render={({ field }) => (
            <TextField
              id="refund-iban"
              label={t("refund.fields.iban")}
              value={field.value ?? ""}
              onChange={(event) => field.onChange(formatIban(event.target.value))}
              error={Boolean(errors.iban)}
              helperText={errors.iban ? t(errors.iban.message!) : t("refund.ibanHelper")}
              disabled={isSubmitting}
              variant="filled"
              fullWidth
              sx={{
                "& .MuiFilledInput-root": {
                  borderRadius: 3,
                  bgcolor: "rgba(255,255,255,0.7)",
                },
              }}
            />
          )}
        />

        <TextField
          id="refund-reason"
          label={t("refund.fields.reason")}
          {...register("reason")}
          error={Boolean(errors.reason)}
          helperText={errors.reason ? t(errors.reason.message!) : t("refund.reasonHelper")}
          disabled={isSubmitting}
          multiline
          minRows={3}
          variant="filled"
          fullWidth
          sx={{
            "& .MuiFilledInput-root": {
              borderRadius: 3,
              bgcolor: "rgba(255,255,255,0.7)",
            },
          }}
        />

        <Button type="submit" color="error" variant="contained" disabled={isSubmitting} sx={{ alignSelf: { xs: "stretch", sm: "flex-start" }, px: 2.8, py: 1.2 }}>
          {t("refund.submit")}
        </Button>
      </Stack>
    </Box>
  );
}

export default RefundRequestForm;
