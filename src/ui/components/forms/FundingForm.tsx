import { zodResolver } from "@hookform/resolvers/zod";
import { Alert, Button, Stack, TextField } from "@mui/material";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";

const fundingSchema = z.object({
  amount: z.number().positive("funding.errors.amountPositive"),
});

type FundingFormValues = z.infer<typeof fundingSchema>;

interface FundingFormProps {
  onSubmit: (amount: number) => Promise<void> | void;
}

function FundingForm({ onSubmit }: FundingFormProps) {
  const { t } = useTranslation();
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FundingFormValues>({
    resolver: zodResolver(fundingSchema),
    defaultValues: {
      amount: undefined,
    },
  });

  const onValid = async (values: FundingFormValues) => {
    await onSubmit(values.amount);
    setIsSubmitted(true);
    reset({ amount: undefined });
  };

  return (
    <Stack component="form" spacing={2} onSubmit={(event) => void handleSubmit(onValid)(event)}>
      {isSubmitted ? <Alert severity="success">{t("funding.success")}</Alert> : null}
      <TextField
        label={t("funding.amount")}
        type="number"
        inputProps={{ min: 1, step: 1 }}
        {...register("amount", { valueAsNumber: true })}
        error={Boolean(errors.amount)}
        helperText={errors.amount ? t(errors.amount.message!) : t("funding.helper")}
      />
      <Button type="submit" variant="contained">
        {t("funding.submit")}
      </Button>
    </Stack>
  );
}

export default FundingForm;
