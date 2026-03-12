import { Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import type { SignupFormValues } from "../../domain/auth/entities/auth";
import type { Signup } from "../../domain/auth/uses-cases/signup";
import SignupForm from "../components/forms/SignupForm";

interface SignupPageProps {
  signup: Signup;
}

function SignupPage({ signup }: SignupPageProps) {
  const navigate = useNavigate();

  const handleSubmit = async (payload: SignupFormValues) => {
    await signup.execute(payload);

    setTimeout(() => {
      void navigate("/login");
    }, 1500);
  };

  return (
    <Box sx={{ width: "100%", display: "flex", justifyContent: "center" }}>
      <SignupForm onSubmit={(payload) => handleSubmit(payload)} />
    </Box>
  );
}

export default SignupPage;
