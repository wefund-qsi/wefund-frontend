import { Box } from "@mui/material";
import RegisterForm from "../features/users/RegisterForm";

function RegisterPage() {
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
      <RegisterForm />
    </Box>
  );
}

export default RegisterPage;