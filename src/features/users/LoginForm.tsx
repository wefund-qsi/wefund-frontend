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
import { loginSchema, type LoginFormValues } from "../../types/auth";
import { useAuth } from "../../shared/modules/users/adapters/primary/useAuth";

function LoginForm() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const auth = useAuth();
  const [apiError, setApiError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { username: "", password: "" },
  });

  const onValid = async (data: LoginFormValues) => {
    setApiError(null);
    const result = await auth.login(data);

    if (result.ok) {
      void navigate("/");
    } else {
      const { statusCode, message } = result.error;
      if (statusCode === 401) {
        setApiError(t("loginForm.errors.invalidCredentials"));
      } else if (message) {
        setApiError(message);
      } else {
        setApiError(t("loginForm.errors.genericError"));
      }
    }
  };

  return (
    <Card sx={{ width: "100%", maxWidth: { xs: "100%", sm: 480 }, mx: "auto" }}>
      <CardHeader
        title={t("loginForm.title")}
        subheader={t("loginForm.subtitle")}
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
              label={t("loginForm.fields.username")}
              {...register("username")}
              fullWidth
              required
              autoComplete="username"
              error={Boolean(errors.username)}
              helperText={errors.username ? t(errors.username.message!) : undefined}
              inputProps={{ "aria-label": t("loginForm.fields.username") }}
            />

            <TextField
              label={t("loginForm.fields.password")}
              {...register("password")}
              fullWidth
              required
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              error={Boolean(errors.password)}
              helperText={errors.password ? t(errors.password.message!) : undefined}
              inputProps={{ "aria-label": t("loginForm.fields.password") }}
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
              {t("loginForm.submit")}
            </Button>

            <Typography variant="body2">
              {t("loginForm.noAccount")}{" "}
              <Link
                component="button"
                type="button"
                onClick={() => void navigate("/register")}
                underline="hover"
              >
                {t("loginForm.registerLink")}
              </Link>
            </Typography>
          </Stack>
        </Box>
      </CardContent>
    </Card>
  );
}

export default LoginForm;