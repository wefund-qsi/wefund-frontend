import { Box, Button, Stack, Typography } from "@mui/material";
import { useCallback, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import type { SignupFormValues } from "../../domain/auth/entities/auth";
import type { Signup } from "../../domain/auth/uses-cases/signup";
import SignupForm from "../components/forms/SignupForm";

interface SignupPageProps {
  signup: Signup;
}

function SignupPage({ signup }: SignupPageProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleSubmit = useCallback(
    async (payload: SignupFormValues) => {
      await signup.execute(payload);

      timeoutRef.current = setTimeout(() => {
        void navigate("/login");
      }, 1500);
    },
    [signup, navigate],
  );

  return (
    <Box sx={{ width: "100%", display: "flex", justifyContent: "center" }}>
      <Stack spacing={{ xs: 3, md: 4 }} sx={{ width: "100%", maxWidth: 780 }}>
        <Stack spacing={1.5} sx={{ maxWidth: 620 }}>
          <Typography variant="overline" color="secondary.main">
            {t("authForm.signup.eyebrow")}
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
            {t("authForm.signup.pageTitle")}
          </Typography>
          <Typography variant="body1" sx={{ color: "text.secondary", lineHeight: 1.85 }}>
            {t("authForm.signup.pageDescription")}
          </Typography>
        </Stack>

        <SignupForm onSubmit={(payload) => handleSubmit(payload)} />

        <Stack direction={{ xs: "column", sm: "row" }} spacing={1.2} alignItems={{ xs: "flex-start", sm: "center" }}>
          <Typography variant="body2" color="text.secondary">
            {t("authForm.signup.secondaryPrompt")}
          </Typography>
          <Button variant="text" onClick={() => { void navigate("/login"); }} sx={{ px: 0, minWidth: "fit-content", color: "primary.main", fontWeight: 600 }}>
            {t("authForm.signup.secondaryCta")}
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}

export default SignupPage;
