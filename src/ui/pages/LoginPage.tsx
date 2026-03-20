import { Box, Button, Stack, Typography } from "@mui/material";
import { useCallback, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import type { LoginFormValues } from "../../domain/auth/entities/auth";
import { decodeJwt } from "../../domain/auth/decode-jwt";
import type { Login } from "../../domain/auth/uses-cases/login";
import { useAuth } from "../contexts/use-auth";
import LoginForm from "../components/forms/LoginForm";

interface LoginPageProps {
  login: Login;
}

function LoginPage({ login }: LoginPageProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { setCurrentUser } = useAuth();
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleSubmit = useCallback(
    async (payload: LoginFormValues) => {
      const result = await login.execute(payload);
      const user = decodeJwt(result.data.access_token);
      setCurrentUser(user);

      timeoutRef.current = setTimeout(() => {
        void navigate("/");
      }, 1500);
    },
    [login, navigate, setCurrentUser],
  );

  return (
    <Box sx={{ width: "100%", display: "flex", justifyContent: "center" }}>
      <Stack spacing={{ xs: 3, md: 4 }} sx={{ width: "100%", maxWidth: 780 }}>
        <Stack spacing={1.5} sx={{ maxWidth: 620 }}>
          <Typography variant="overline" color="secondary.main">
            {t("authForm.login.eyebrow")}
          </Typography>
          <Typography
            variant="h1"
            component="h1"
            sx={{
              fontSize: { xs: "2.4rem", md: "4rem" },
              lineHeight: { xs: 1.03, md: 0.98 },
              textWrap: "balance",
            }}
          >
            {t("authForm.login.pageTitle")}
          </Typography>
          <Typography variant="body1" sx={{ color: "text.secondary", lineHeight: 1.85 }}>
            {t("authForm.login.pageDescription")}
          </Typography>
        </Stack>

        <LoginForm onSubmit={(payload) => handleSubmit(payload)} />

        <Stack direction={{ xs: "column", sm: "row" }} spacing={1.2} alignItems={{ xs: "flex-start", sm: "center" }}>
          <Typography variant="body2" color="text.secondary">
            {t("authForm.login.secondaryPrompt")}
          </Typography>
          <Button variant="text" onClick={() => { void navigate("/signup"); }} sx={{ px: 0, minWidth: "fit-content", color: "primary.main", fontWeight: 600 }}>
            {t("authForm.login.secondaryCta")}
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}

export default LoginPage;
