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
import { loginSchema, type LoginFormValues } from "../../../domain/auth/entities/auth";

interface LoginFormProps {
  onSubmit: (payload: LoginFormValues) => Promise<void> | void;
}

function LoginForm({ onSubmit }: LoginFormProps) {
  const { t } = useTranslation();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { username: "", password: "" },
  });

  const onValid = async (data: LoginFormValues) => {
    try {
      setIsSubmitted(false);
      setErrorMessage(null);
      await onSubmit(data);
      setIsSubmitted(true);
      reset();
    } catch (error: unknown) {
      setIsSubmitted(false);
      if (error instanceof Error) {
        setErrorMessage(error.message);
      }
    }
  };

  return (
    <Card sx={{ width: "100%", maxWidth: { xs: "100%", sm: 720 }, mx: "auto" }}>
      <CardHeader title={t("authForm.login.title")} subheader={t("authForm.login.subtitle")} />
      <CardContent>
        <Box component="form" onSubmit={(e) => void handleSubmit(onValid)(e)} noValidate>
          <Stack spacing={2}>
            {isSubmitted ? (
              <Alert severity="success">{t("authForm.login.success")}</Alert>
            ) : null}

            {errorMessage ? (
              <Alert severity="error">{errorMessage}</Alert>
            ) : null}

            <TextField
              label={t("authForm.fields.username")}
              {...register("username")}
              fullWidth
              required
              error={Boolean(errors.username)}
              helperText={errors.username ? t(errors.username.message!) : undefined}
            />

            <TextField
              label={t("authForm.fields.password")}
              {...register("password")}
              fullWidth
              required
              type="password"
              error={Boolean(errors.password)}
              helperText={errors.password ? t(errors.password.message!) : undefined}
            />

            <Button variant="contained" type="submit" sx={{ alignSelf: { xs: "stretch", sm: "flex-start" } }}>
              {t("authForm.login.submit")}
            </Button>
          </Stack>
        </Box>
      </CardContent>
    </Card>
  );
}

export default LoginForm;
