export const navigationLinkButtonSx = {
  px: 0,
  py: 0.75,
  minWidth: "fit-content",
  justifyContent: "flex-start",
  alignSelf: "flex-start",
  borderRadius: 0,
  position: "relative",
  fontWeight: 500,
  "&::after": {
    content: '""',
    position: "absolute",
    left: 0,
    bottom: 4,
    width: 0,
    height: 1.5,
    bgcolor: "secondary.main",
    transition: "width 180ms ease",
  },
  "&:hover": {
    bgcolor: "transparent",
  },
  "&:hover::after": {
    width: "100%",
  },
} as const;
