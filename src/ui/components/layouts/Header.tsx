import { AppBar, Toolbar, Typography, Button, Box, IconButton, Menu, MenuItem, Drawer, Stack, Divider } from "@mui/material";
import LanguageIcon from "@mui/icons-material/Language";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

  const handleNavigate = (path: string) => {
    setIsMobileMenuOpen(false);
    void navigate(path);
  };

  const handleLogout = () => {
    setIsMobileMenuOpen(false);
    logout();
    void navigate("/");
  };

  const primaryNavigationItems = [
    { label: t("header.exploreProjects"), path: "/projects" },
    { label: t("header.exploreCampaigns"), path: "/campaigns" },
  ];

  const authenticatedNavigationItems = currentUser ? [
    { label: t("header.myProjects"), path: "/my-projects" },
    { label: t("header.myContributions"), path: "/my-contributions" },
    { label: t("header.createProject"), path: "/projects/create" },
  ] : [];

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

          <Box sx={{ display: { xs: "none", md: "flex" }, alignItems: "center", gap: 1.75 }}>
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
            {primaryNavigationItems.map((item) => (
              <Button key={item.path} color="inherit" sx={navigationLinkButtonSx} onClick={() => handleNavigate(item.path)}>
                {item.label}
              </Button>
            ))}
            {currentUser ? (
              <>
                {authenticatedNavigationItems.map((item) => (
                  <Button key={item.path} color="inherit" sx={navigationLinkButtonSx} onClick={() => handleNavigate(item.path)}>
                    {item.label}
                  </Button>
                ))}
                <Button
                  variant="outlined"
                  sx={(theme) => ({
                    color: theme.palette.error.main,
                    borderColor: theme.palette.error.light,
                    "&:hover": {
                      borderColor: theme.palette.error.main,
                      bgcolor: "rgba(211, 47, 47, 0.06)",
                    },
                  })}
                  onClick={handleLogout}
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

          <Box sx={{ display: { xs: "flex", md: "none" }, alignItems: "center", gap: 1 }}>
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
            <IconButton
              aria-label="Open navigation menu"
              onClick={() => setIsMobileMenuOpen(true)}
              sx={(theme) => ({
                color: "primary.main",
                border: `1px solid ${theme.palette.divider}`,
                bgcolor: "rgba(255,255,255,0.32)",
                "&:hover": {
                  bgcolor: "rgba(255,255,255,0.5)",
                },
              })}
            >
              <MenuIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      <Toolbar sx={{ minHeight: { xs: 76, md: 88 } }} />
      <Drawer
        anchor="right"
        open={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        PaperProps={{
          sx: (theme) => ({
            width: "min(88vw, 360px)",
            p: 2,
            bgcolor: theme.palette.background.paper,
            backgroundImage: "linear-gradient(180deg, rgba(255,255,255,0.58) 0%, rgba(255,255,255,0.18) 100%)",
          }),
        }}
      >
        <Stack spacing={2.5} sx={{ height: "100%" }}>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
              <Box
                component="img"
                src={wefundLogo}
                alt="WeFund logo"
                sx={{
                  height: 38,
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
                  fontSize: "1.5rem",
                  color: "text.primary",
                }}
              >
                WeFund
              </Typography>
            </Box>
            <IconButton
              aria-label="Close navigation menu"
              onClick={() => setIsMobileMenuOpen(false)}
              sx={{ color: "primary.main" }}
            >
              <CloseIcon />
            </IconButton>
          </Box>

          <Divider />

          <Stack spacing={0.75}>
            {primaryNavigationItems.map((item) => (
              <Button
                key={item.path}
                color="inherit"
                sx={{ ...navigationLinkButtonSx, px: 0.5, py: 1.1 }}
                onClick={() => handleNavigate(item.path)}
              >
                {item.label}
              </Button>
            ))}
            {authenticatedNavigationItems.map((item) => (
              <Button
                key={item.path}
                color="inherit"
                sx={{ ...navigationLinkButtonSx, px: 0.5, py: 1.1 }}
                onClick={() => handleNavigate(item.path)}
              >
                {item.label}
              </Button>
            ))}
          </Stack>

          <Divider />

          <Box>
            <Typography
              variant="overline"
              sx={{
                mb: 1.25,
                color: "secondary.main",
              }}
            >
              {t("header.language")}
            </Typography>
            <Stack direction="row" spacing={1.25}>
              <Button
                variant={i18n.language.startsWith("fr") ? "contained" : "outlined"}
                onClick={() => handleLanguageChange("fr")}
                sx={(theme) => ({
                  minWidth: 0,
                  flex: 1,
                  ...(i18n.language.startsWith("fr") ? {
                    bgcolor: theme.palette.secondary.main,
                    color: theme.palette.secondary.contrastText,
                    "&:hover": {
                      bgcolor: theme.palette.secondary.dark,
                    },
                  } : {
                    color: theme.palette.primary.main,
                    borderColor: theme.palette.divider,
                  }),
                })}
              >
                FR
              </Button>
              <Button
                variant={i18n.language.startsWith("en") ? "contained" : "outlined"}
                onClick={() => handleLanguageChange("en")}
                sx={(theme) => ({
                  minWidth: 0,
                  flex: 1,
                  ...(i18n.language.startsWith("en") ? {
                    bgcolor: theme.palette.secondary.main,
                    color: theme.palette.secondary.contrastText,
                    "&:hover": {
                      bgcolor: theme.palette.secondary.dark,
                    },
                  } : {
                    color: theme.palette.primary.main,
                    borderColor: theme.palette.divider,
                  }),
                })}
              >
                EN
              </Button>
            </Stack>
          </Box>

          <Box sx={{ mt: "auto" }}>
            {currentUser ? (
              <Button
                fullWidth
                variant="outlined"
                sx={(theme) => ({
                  color: theme.palette.error.main,
                  borderColor: theme.palette.error.light,
                  "&:hover": {
                    borderColor: theme.palette.error.main,
                    bgcolor: "rgba(211, 47, 47, 0.06)",
                  },
                })}
                onClick={handleLogout}
              >
                {t("header.logout")}
              </Button>
            ) : (
              <Stack spacing={1.25}>
                <Button
                  fullWidth
                  variant="outlined"
                  sx={(theme) => ({
                    color: theme.palette.primary.main,
                    borderColor: theme.palette.secondary.light,
                    "&:hover": {
                      borderColor: theme.palette.secondary.main,
                      bgcolor: "rgba(182, 102, 56, 0.06)",
                    },
                  })}
                  onClick={() => handleNavigate("/signup")}
                >
                  {t("header.signup")}
                </Button>
                <Button
                  fullWidth
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
                  onClick={() => handleNavigate("/login")}
                >
                  {t("header.login")}
                </Button>
              </Stack>
            )}
          </Box>
        </Stack>
      </Drawer>
    </>
  );
}

export default Header;
