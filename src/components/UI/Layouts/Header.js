import React, { useMemo } from "react";
import { Link as RouterLink, useLocation } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Breadcrumbs,
  Link as MuiLink,
  Button,
  ThemeProvider,
  Container,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import AddIcon from "@mui/icons-material/Add";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import lavenderTheme from "../../../theme";

const Header = ({ sidebarStateChange }) => {
  const location = useLocation();
  const currentPathname = location.pathname;

  const generateBreadcrumbs = useMemo(() => {
    const pathSegments = currentPathname.split("/").filter(Boolean);
    if (pathSegments.length === 0) return null;

    return (
      <Breadcrumbs
        separator={
          <NavigateNextIcon fontSize="small" sx={{ color: "text.secondary" }} />
        }
        aria-label="breadcrumb"
        sx={{
          "& .MuiBreadcrumbs-ol": {
            alignItems: "center",
            flexWrap: "nowrap",
            overflowX: "auto",
            pb: 0.5,
            px: 1,
          },
        }}
      >
        <MuiLink
          component={RouterLink}
          to="/"
          underline="hover"
          color="text.secondary"
          variant="body2"
          sx={{ display: "flex", alignItems: "center" }}
        >
          Dashboard
        </MuiLink>
        {pathSegments.map((segment, index) => {
          const isLast = index === pathSegments.length - 1;
          const path = `/${pathSegments.slice(0, index + 1).join("/")}`;
          const displayName =
            segment.charAt(0).toUpperCase() +
            segment.slice(1).replace(/-/g, " ");

          return isLast ? (
            <Typography
              key={path}
              color="text.primary"
              variant="body2"
              sx={{ fontWeight: 500 }}
            >
              {displayName}
            </Typography>
          ) : (
            <MuiLink
              key={path}
              component={RouterLink}
              to={path}
              underline="hover"
              color="text.secondary"
              variant="body2"
            >
              {displayName}
            </MuiLink>
          );
        })}
      </Breadcrumbs>
    );
  }, [currentPathname]);

  return (
    <ThemeProvider theme={lavenderTheme}>
      <AppBar position="sticky" elevation={0}>
        <Container maxWidth="xl" disableGutters>
          <Toolbar
            sx={{
              minHeight: { xs: 56, sm: 64 },
              justifyContent: "space-between",
              px: { xs: 2, sm: 3 },
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                flex: 1,
                overflow: "hidden",
              }}
            >
              <IconButton
                aria-label="open drawer"
                edge="start"
                onClick={() => sidebarStateChange((old) => !old)}
                sx={{ mr: 1, color: "text.primary" }}
              >
                <MenuIcon />
              </IconButton>
              {generateBreadcrumbs}
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", ml: 2 }}>
              {(currentPathname === "/enquiries" ||
                currentPathname === "/applications") && (
                <Button
                  variant="contained"
                  color="primary"
                  component={RouterLink}
                  to={
                    currentPathname === "/enquiries"
                      ? "/enquiry/create"
                      : "/application/create"
                  }
                  startIcon={<AddIcon />}
                  sx={{
                    ml: 1,
                    whiteSpace: "nowrap",
                  }}
                >
                  {currentPathname === "/enquiries"
                    ? "New Enquiry"
                    : "New Application"}
                </Button>
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
    </ThemeProvider>
  );
};

export default Header;
