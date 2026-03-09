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
  Typography,
  Link,
  InputAdornment,
  IconButton,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { registerSchema } from "../../types/auth";
import { useAuth } from "../../shared/modules/users/adapters/primary/useAuthProvider";

function RegisterForm() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { register: authRegister } = useAuth();
  const [apiError, setApiError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: { prenom: "", nom: "", username: "", password: "" },
  });

  const onValid = async (data: { prenom: string; nom: string; username: string; password: string }) => {
    setApiError(null);
    const result = await authRegister(data);

    if (result.ok) {
      void navigate("/login");
    } else {
      const msg =
        result.error.statusCode === 409
          ? t("registerForm.errors.usernameTaken")
          : result.error.message;
      setApiError(msg);
    }
  };

  return (
    <Card sx={{ width: "100%", maxWidth: { xs: "100%", sm: 480 }, mx: "auto" }}>
      <CardHeader
        title={t("registerForm.title")}
        subheader={t("registerForm.subtitle")}
      />
      <CardContent>
        <Box
          component="form"
          onSubmit={(e) => void handleSubmit(onValid)(e)}
          noValidate
        >
          <Stack spacing={2}>
            {apiError ? (
              <Alert severity="error" role="alert">
                {apiError}
              </Alert>
            ) : null}

            <TextField
              label={t("registerForm.fields.prenom")}
              {...register("prenom")}
              fullWidth
              required
              autoComplete="given-name"
              error={Boolean(errors.prenom)}
              helperText={errors.prenom ? t(errors.prenom.message!) : undefined}
              inputProps={{ "aria-label": t("registerForm.fields.prenom") }}
            />

            <TextField
              label={t("registerForm.fields.nom")}
              {...register("nom")}
              fullWidth
              required
              autoComplete="family-name"
              error={Boolean(errors.nom)}
              helperText={errors.nom ? t(errors.nom.message!) : undefined}
              inputProps={{ "aria-label": t("registerForm.fields.nom") }}
            />

            <TextField
              label={t("registerForm.fields.username")}
              {...register("username")}
              fullWidth
              required
              autoComplete="username"
              error={Boolean(errors.username)}
              helperText={errors.username ? t(errors.username.message!) : undefined}
              inputProps={{ "aria-label": t("registerForm.fields.username") }}
            />

            <TextField
              label={t("registerForm.fields.password")}
              {...register("password")}
              fullWidth
              required
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              error={Boolean(errors.password)}
              helperText={errors.password ? t(errors.password.message!) : undefined}
              inputProps={{ "aria-label": t("registerForm.fields.password") }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowPassword((prev) => !prev)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Button
              variant="contained"
              type="submit"
              disabled={isSubmitting}
              sx={{ alignSelf: { xs: "stretch", sm: "flex-start" } }}
            >
              {t("registerForm.submit")}
            </Button>

            <Typography variant="body2">
              {t("registerForm.alreadyAccount")}{" "}
              <Link
                component="button"
                type="button"
                onClick={() => void navigate("/login")}
                underline="hover"
              >
                {t("registerForm.loginLink")}
              </Link>
            </Typography>
          </Stack>
        </Box>
      </CardContent>
    </Card>
  );
}

export default RegisterForm;