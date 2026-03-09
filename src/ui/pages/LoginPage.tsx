import { Box } from "@mui/material";
import LoginForm from "../features/users/LoginForm";

function LoginPage() {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        pt: 6,
        px: 2,
        minHeight: "60vh",
      }}
    >
      <LoginForm />
    </Box>
  );
}

export default LoginPage;