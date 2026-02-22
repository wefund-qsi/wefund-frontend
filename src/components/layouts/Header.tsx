import { AppBar, Toolbar, Typography, Button, Box, IconButton, Menu, MenuItem } from "@mui/material";
import LanguageIcon from "@mui/icons-material/Language";
import { useTranslation } from "react-i18next";
import { useState, type MouseEvent } from "react";

function Header() {
  const { t, i18n } = useTranslation();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleLanguageMenuOpen = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleLanguageChange = (lng: string) => {
    void i18n.changeLanguage(lng);
    setAnchorEl(null);
  };

  return (
    <AppBar position="static" color="default">
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <Typography
          variant="h5"
          component="div"
          sx={{ fontWeight: 700, color: "primary.main" }}
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
          
          <Button color="inherit">{t("header.createProject")}</Button>
          <Button color="inherit">{t("header.exploreProjects")}</Button>
          <Button variant="outlined">{t("header.register")}</Button>
          <Button variant="contained">{t("header.login")}</Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Header;