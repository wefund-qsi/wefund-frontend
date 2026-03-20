import { Box } from "@mui/material";
import { useCallback, useEffect, useRef } from "react";
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
      <LoginForm onSubmit={(payload) => handleSubmit(payload)} />
    </Box>
  );
}

export default LoginPage;