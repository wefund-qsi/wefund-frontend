import { Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import type { LoginFormValues } from "../../domain/auth/entities/auth";
import type { Login } from "../../domain/auth/uses-cases/login";
import LoginForm from "../components/forms/LoginForm";

interface LoginPageProps {
  login: Login;
}

function LoginPage({ login }: LoginPageProps) {
  const navigate = useNavigate();

  const handleSubmit = async (payload: LoginFormValues) => {
    await login.execute(payload);

    setTimeout(() => {
      void navigate("/");
    }, 1500);
  };

  return (
    <Box sx={{ width: "100%", display: "flex", justifyContent: "center" }}>
      <LoginForm onSubmit={(payload) => handleSubmit(payload)} />
    </Box>
  );
}

export default LoginPage;
