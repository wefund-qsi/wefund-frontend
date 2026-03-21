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
        title={t("authForm.login.title")}
        subheader={t("authForm.login.subtitle")}
        sx={{ px: { xs: 2.5, md: 3 }, pt: { xs: 2.5, md: 3 }, pb: 0 }}
        titleTypographyProps={{ variant: "h3", component: "h2", sx: { fontSize: { xs: "1.9rem", md: "2.3rem" }, mb: 0.3 } }}
        subheaderTypographyProps={{ sx: { mt: 0.8, color: "text.secondary", lineHeight: 1.8 } }}
      />
      <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
        <Box component="form" onSubmit={(e) => void handleSubmit(onValid)(e)} noValidate>
          <Stack spacing={2.4}>
            {isSubmitted ? (
              <Alert severity="success">{t("authForm.login.success")}</Alert>
            ) : null}

            {errorMessage ? (
              <Alert severity="error">{errorMessage}</Alert>
            ) : null}

            <TextField
              label={t("authForm.fields.username")}
              {...register("username")}
              id="login-username"
              fullWidth
              required
              variant="filled"
              error={Boolean(errors.username)}
              helperText={errors.username ? t(errors.username.message!) : undefined}
              sx={{
                "& .MuiFilledInput-root": {
                  borderRadius: 3,
                  bgcolor: "rgba(255,255,255,0.7)",
                },
              }}
            />

            <TextField
              label={t("authForm.fields.password")}
              {...register("password")}
              id="login-password"
              fullWidth
              required
              type="password"
              variant="filled"
              error={Boolean(errors.password)}
              helperText={errors.password ? t(errors.password.message!) : undefined}
              sx={{
                "& .MuiFilledInput-root": {
                  borderRadius: 3,
                  bgcolor: "rgba(255,255,255,0.7)",
                },
              }}
            />

            <Button variant="contained" type="submit" sx={{ alignSelf: { xs: "stretch", sm: "flex-start" }, px: 2.8, py: 1.2 }}>
              {t("authForm.login.submit")}
            </Button>
          </Stack>
        </Box>
      </CardContent>
    </Card>
  );
}

export default LoginForm;
