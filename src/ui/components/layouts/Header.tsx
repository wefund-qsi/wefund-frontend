import { AppBar, Toolbar, Typography, Button, Box, IconButton, Menu, MenuItem } from "@mui/material";
import LanguageIcon from "@mui/icons-material/Language";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useState, type MouseEvent } from "react";

function Header() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleLanguageMenuOpen = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleLanguageChange = (lng: string) => {
    void i18n.changeLanguage(lng);
    setAnchorEl(null);
  };

  return (
    <AppBar position="static" color="primary">
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <Typography
          variant="h5"
          component="div"
          onClick={() => void navigate("/")}
          sx={{ fontWeight: 700, color: "primary.contrastText", cursor: "pointer" }}
        >
          WeFund
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <IconButton onClick={handleLanguageMenuOpen} color="inherit">
            <LanguageIcon />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={() => setAnchorEl(null)}
          >
            <MenuItem onClick={() => handleLanguageChange("fr")}>
              Français
            </MenuItem>
            <MenuItem onClick={() => handleLanguageChange("en")}>
              English
            </MenuItem>
          </Menu>
          
          <Button color="inherit" onClick={() => void navigate("/projects/create")}>{t("header.createProject")}</Button>
          <Button variant="outlined" sx={{ color: "primary.contrastText", borderColor: "primary.contrastText" }} onClick={() => void navigate("/signup")}>{t("header.register")}</Button>
          <Button variant="contained" sx={{ bgcolor: "primary.dark", color: "primary.contrastText", "&:hover": { bgcolor: "#1a2410" } }} onClick={() => void navigate("/login")}>{t("header.login")}</Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Header;