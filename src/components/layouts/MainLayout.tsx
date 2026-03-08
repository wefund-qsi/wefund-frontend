import { Box } from "@mui/material";
import Header from "./Header";
import Footer from "./Footer";
import type { ReactNode } from "react";

interface MainLayoutProps {
  children: ReactNode;
}

function MainLayout({ children }: MainLayoutProps) {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh", bgcolor: "background.default" }}>
      <Header />
      <Box component="main" sx={{ flex: 1, p: 3 }}>
        {children}
      </Box>
      <Footer />
    </Box>
  );
}

export default MainLayout;