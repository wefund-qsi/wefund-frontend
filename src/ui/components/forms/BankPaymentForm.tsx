import { zodResolver } from "@hookform/resolvers/zod";
import { Alert, Button, Stack, TextField } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";

const bankPaymentSchema = z.object({
  amount: z.number().positive("funding.errors.amountPositive"),
  cardholderName: z.string().min(1, "payment.errors.cardholderRequired"),
  cardNumber: z.string().regex(/^(?:\d{4} ){3}\d{4}$/, "payment.errors.cardNumberInvalid"),
  expiryDate: z.string().regex(/^\d{2}\/\d{2}$/, "payment.errors.expiryInvalid"),
  cvc: z.string().regex(/^\d{3,4}$/, "payment.errors.cvcInvalid"),
});

export type BankPaymentFormValues = z.infer<typeof bankPaymentSchema>;

interface BankPaymentFormProps {
  defaultAmount?: number;
  isSubmitting: boolean;
  onSubmit: (values: BankPaymentFormValues) => Promise<void> | void;
  errorMessage?: string | null;
}

function BankPaymentForm({ defaultAmount, isSubmitting, onSubmit, errorMessage }: BankPaymentFormProps) {
  const { t } = useTranslation();
  const formatCardNumber = (value: string) =>
    value
      .replace(/\D/g, "")
      .slice(0, 16)
      .replace(/(\d{4})(?=\d)/g, "$1 ");

  const formatExpiryDate = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 4);
    if (digits.length <= 2) {
      return digits;
    }

    return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  };

  const formatCvc = (value: string) => value.replace(/\D/g, "").slice(0, 4);

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BankPaymentFormValues>({
    resolver: zodResolver(bankPaymentSchema),
    defaultValues: {
      amount: defaultAmount,
      cardholderName: "",
      cardNumber: "",
      expiryDate: "",
      cvc: "",
    },
  });

  return (
    <Stack component="form" spacing={2.5} onSubmit={(event) => void handleSubmit(onSubmit)(event)}>
      {errorMessage ? <Alert severity="error">{errorMessage}</Alert> : null}

      <TextField
        label={t("payment.fields.amount")}
        type="number"
        id="payment-amount"
        variant="filled"
        slotProps={{ htmlInput: { min: 1, step: 1 } }}
        {...register("amount", { valueAsNumber: true })}
        error={Boolean(errors.amount)}
        helperText={errors.amount ? t(errors.amount.message!) : t("payment.amountHelper")}
        disabled={isSubmitting}
        sx={{
          "& .MuiFilledInput-root": {
            borderRadius: 3,
            bgcolor: "rgba(255,255,255,0.72)",
          },
        }}
      />

      <TextField
        label={t("payment.fields.cardholderName")}
        id="payment-cardholder-name"
        {...register("cardholderName")}
        variant="filled"
        error={Boolean(errors.cardholderName)}
        helperText={errors.cardholderName ? t(errors.cardholderName.message!) : undefined}
        disabled={isSubmitting}
        sx={{
          "& .MuiFilledInput-root": {
            borderRadius: 3,
            bgcolor: "rgba(255,255,255,0.72)",
          },
        }}
      />

      <Controller
        name="cardNumber"
        control={control}
        render={({ field }) => (
          <TextField
            label={t("payment.fields.cardNumber")}
            id="payment-card-number"
            value={field.value ?? ""}
            onChange={(event) => field.onChange(formatCardNumber(event.target.value))}
            variant="filled"
            error={Boolean(errors.cardNumber)}
            helperText={errors.cardNumber ? t(errors.cardNumber.message!) : t("payment.cardNumberHelper")}
            disabled={isSubmitting}
            sx={{
              "& .MuiFilledInput-root": {
                borderRadius: 3,
                bgcolor: "rgba(255,255,255,0.72)",
              },
            }}
          />
        )}
      />

      <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
        <Controller
          name="expiryDate"
          control={control}
          render={({ field }) => (
            <TextField
              label={t("payment.fields.expiryDate")}
              id="payment-expiry-date"
              value={field.value ?? ""}
              onChange={(event) => field.onChange(formatExpiryDate(event.target.value))}
              variant="filled"
              error={Boolean(errors.expiryDate)}
              helperText={errors.expiryDate ? t(errors.expiryDate.message!) : t("payment.expiryHelper")}
              disabled={isSubmitting}
              fullWidth
              sx={{
                "& .MuiFilledInput-root": {
                  borderRadius: 3,
                  bgcolor: "rgba(255,255,255,0.72)",
                },
              }}
            />
          )}
        />
        <Controller
          name="cvc"
          control={control}
          render={({ field }) => (
            <TextField
              label={t("payment.fields.cvc")}
              id="payment-cvc"
              value={field.value ?? ""}
              onChange={(event) => field.onChange(formatCvc(event.target.value))}
              variant="filled"
              error={Boolean(errors.cvc)}
              helperText={errors.cvc ? t(errors.cvc.message!) : undefined}
              disabled={isSubmitting}
              fullWidth
              sx={{
                "& .MuiFilledInput-root": {
                  borderRadius: 3,
                  bgcolor: "rgba(255,255,255,0.72)",
                },
              }}
            />
          )}
        />
      </Stack>

      <Button type="submit" variant="contained" disabled={isSubmitting} sx={{ alignSelf: { xs: "stretch", sm: "flex-start" }, px: 2.8, py: 1.2 }}>
        {t("payment.submit")}
      </Button>
    </Stack>
  );
}

export default BankPaymentForm;
