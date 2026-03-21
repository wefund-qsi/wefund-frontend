import { AppBar, Toolbar, Typography, Button, Box, IconButton, Menu, MenuItem } from "@mui/material";
import LanguageIcon from "@mui/icons-material/Language";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useEffect, useState, type MouseEvent } from "react";
import wefundLogo from "../../public/wefund-logo.svg";
import { useAuth } from "../../contexts/use-auth";
import { navigationLinkButtonSx } from "./navigation-link.styles";

function Header() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 12);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleLanguageMenuOpen = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleLanguageChange = (lng: string) => {
    void i18n.changeLanguage(lng);
    setAnchorEl(null);
  };

  return (
    <>
      <AppBar
        position="fixed"
        elevation={0}
        sx={(theme) => ({
          bgcolor: isScrolled ? theme.palette.background.default : "transparent",
          color: theme.palette.text.primary,
          backgroundImage: "none",
          borderBottom: isScrolled ? `1px solid ${theme.palette.divider}` : "1px solid transparent",
          boxShadow: isScrolled ? "0 12px 32px rgba(97, 95, 47, 0.08)" : "none",
          backdropFilter: isScrolled ? "blur(14px)" : "none",
          transition: "background-color 220ms ease, box-shadow 220ms ease, border-color 220ms ease, backdrop-filter 220ms ease",
        })}
      >
        <Toolbar sx={{ justifyContent: "space-between", minHeight: { xs: 76, md: 88 } }}>
          <Box
            component="button"
            type="button"
            onClick={() => void navigate("/")}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              p: 0,
              border: 0,
              bgcolor: "transparent",
              cursor: "pointer",
            }}
          >
            <Box
              component="img"
              src={wefundLogo}
              alt="WeFund logo"
              sx={{
                height: { xs: 42, md: 50 },
                width: "auto",
                display: "block",
              }}
            />
            <Typography
              variant="h5"
              component="div"
              sx={{
                fontFamily: "var(--font-family-accent)",
                fontWeight: 400,
                fontSize: { xs: "1.6rem", md: "1.9rem" },
                color: "text.primary",
                letterSpacing: "0.01em",
              }}
            >
              WeFund
            </Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1.75 }}>
            <IconButton
              aria-label={t("header.language")}
              aria-controls={anchorEl ? "language-menu" : undefined}
              aria-expanded={anchorEl ? "true" : undefined}
              aria-haspopup="menu"
              onClick={handleLanguageMenuOpen}
              sx={(theme) => ({
                color: "primary.main",
                border: `1px solid ${anchorEl ? theme.palette.secondary.light : "transparent"}`,
                bgcolor: anchorEl ? "rgba(182, 102, 56, 0.06)" : "transparent",
                transition: "background-color 180ms ease, border-color 180ms ease",
                "&:hover": {
                  bgcolor: "rgba(182, 102, 56, 0.08)",
                },
              })}
            >
              <LanguageIcon />
            </IconButton>
            <Menu
              id="language-menu"
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={() => setAnchorEl(null)}
              slotProps={{
                paper: {
                  sx: {
                    minWidth: 180,
                  },
                },
              }}
            >
              <MenuItem
                selected={i18n.language.startsWith("fr")}
                onClick={() => handleLanguageChange("fr")}
              >
                Français
              </MenuItem>
              <MenuItem
                selected={i18n.language.startsWith("en")}
                onClick={() => handleLanguageChange("en")}
              >
                English
              </MenuItem>
            </Menu>
            <Button color="inherit" sx={navigationLinkButtonSx} onClick={() => void navigate("/projects")}>{t("header.exploreProjects")}</Button>
            <Button color="inherit" sx={navigationLinkButtonSx} onClick={() => void navigate("/campaigns")}>{t("header.exploreCampaigns")}</Button>
            {currentUser ? (
              <>
                <Button color="inherit" sx={navigationLinkButtonSx} onClick={() => void navigate("/my-projects")}>{t("header.myProjects")}</Button>
                <Button color="inherit" sx={navigationLinkButtonSx} onClick={() => void navigate("/my-contributions")}>{t("header.myContributions")}</Button>
                <Button color="inherit" sx={navigationLinkButtonSx} onClick={() => void navigate("/projects/create")}>{t("header.createProject")}</Button>
                <Button
                  variant="outlined"
                  sx={(theme) => ({
                    color: theme.palette.primary.main,
                    borderColor: theme.palette.secondary.light,
                    "&:hover": {
                      borderColor: theme.palette.secondary.main,
                      bgcolor: "rgba(182, 102, 56, 0.06)",
                    },
                  })}
                  onClick={() => { logout(); void navigate("/"); }}
                >
                  {t("header.logout")}
                </Button>
              </>
            ) : null}
            {!currentUser ? (
              <>
                <Button
                  variant="outlined"
                  sx={(theme) => ({
                    color: theme.palette.primary.main,
                    borderColor: theme.palette.secondary.light,
                    "&:hover": {
                      borderColor: theme.palette.secondary.main,
                      bgcolor: "rgba(182, 102, 56, 0.06)",
                    },
                  })}
                  onClick={() => void navigate("/signup")}
                >
                  {t("header.signup")}
                </Button>
                <Button
                  variant="contained"
                  sx={(theme) => ({
                    bgcolor: theme.palette.primary.main,
                    color: theme.palette.primary.contrastText,
                    backgroundImage: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.success.main} 100%)`,
                    boxShadow: "none",
                    "&:hover": {
                      boxShadow: "none",
                      backgroundImage: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.success.dark} 100%)`,
                    },
                  })}
                  onClick={() => void navigate("/login")}
                >
                  {t("header.login")}
                </Button>
              </>
            ) : null}
          </Box>
        </Toolbar>
      </AppBar>
      <Toolbar sx={{ minHeight: { xs: 76, md: 88 } }} />
    </>
  );
}

export default Header;
