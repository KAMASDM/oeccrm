import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  IconButton,
  Typography,
  Avatar,
  ThemeProvider,
  ListSubheader,
  Divider,
  alpha,
} from "@mui/material";
import {
  Home as HomeIcon,
  Search as SearchIcon,
  School as UniversityIcon,
  Assignment as AssignmentIcon,
  HelpOutline as HelpIcon,
  FileCopy as FileCopyIcon,
  People as PeopleIcon,
  Logout as LogoutIcon,
  ChevronLeft as ChevronLeftIcon,
  ExpandLess as ExpandLessIcon,
  ExpandMore as ExpandMoreIcon,
} from "@mui/icons-material";
import { authAction } from "../../../store/authStore";
import { deleteFromLocalStorage } from "../../../helpers/helperFunctions";
import lavenderTheme from "../../../theme";

const NavItem = ({
  to,
  icon,
  text,
  isExternal = false,
  isSubItem = false,
  isActive,
}) => {
  return (
    <ListItem disablePadding sx={{ display: "block" }}>
      <ListItemButton
        component={isExternal ? "a" : NavLink}
        to={isExternal ? undefined : to}
        href={isExternal ? to : undefined}
        target={isExternal ? "_blank" : undefined}
        selected={isActive}
        sx={{
          minHeight: 48,
          justifyContent: "initial",
          px: isSubItem ? 3 : 2.5,
          pl: isSubItem ? 6 : 2.5,
          borderRadius: 2,
          my: 0.5,
          "&.Mui-selected": {
            backgroundColor: "primary.light",
            color: "primary.dark",
            "&:hover": {
              backgroundColor: "primary.light",
            },
          },
        }}
      >
        <ListItemIcon
          sx={{
            minWidth: 0,
            mr: 2,
            justifyContent: "center",
            color: isActive ? "primary.dark" : "text.secondary",
          }}
        >
          {icon}
        </ListItemIcon>
        <ListItemText
          primary={text}
          primaryTypographyProps={{
            sx: {
              fontWeight: isActive ? 600 : 500,
              fontSize: "0.875rem",
              whiteSpace: "nowrap",
            },
          }}
        />
      </ListItemButton>
    </ListItem>
  );
};

const CollapsibleNavItem = ({ icon, text, items }) => {
  const location = useLocation();
  const [open, setOpen] = useState(() =>
    items.some((item) => location.pathname.startsWith(item.link))
  );

  const hasActiveChild = items.some(
    (item) =>
      location.pathname === item.link ||
      (item.link !== "/" && location.pathname.startsWith(item.link))
  );

  return (
    <>
      <ListItemButton
        onClick={() => setOpen(!open)}
        sx={{
          minHeight: 48,
          justifyContent: "initial",
          px: 2.5,
          borderRadius: 2,
          my: 0.5,
          backgroundColor: hasActiveChild
            ? alpha(lavenderTheme.palette.primary.light, 0.1)
            : "transparent",
        }}
      >
        <ListItemIcon
          sx={{
            minWidth: 0,
            mr: 2,
            justifyContent: "center",
            color: hasActiveChild ? "primary.dark" : "text.secondary",
          }}
        >
          {icon}
        </ListItemIcon>
        <ListItemText
          primary={text}
          primaryTypographyProps={{
            sx: {
              fontWeight: hasActiveChild ? 600 : 500,
              fontSize: "0.875rem",
            },
          }}
        />
        {open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
      </ListItemButton>

      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {items.map((item) => (
            <NavItem
              key={item.link}
              to={item.link}
              icon={
                item.icon || (
                  <Box
                    sx={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      bgcolor: "text.disabled",
                    }}
                  />
                )
              }
              text={item.name}
              isSubItem
              isActive={
                location.pathname === item.link ||
                (item.link !== "/" && location.pathname.startsWith(item.link))
              }
            />
          ))}
        </List>
      </Collapse>
    </>
  );
};

const SideBar = ({ isSidebarCollapsed, sidebarStateChange }) => {
  const authData = useSelector((state) => state.authStore);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    dispatch(
      authAction.setAuthStatus({
        userName: "",
        loggedIn: false,
        accessToken: null,
        refreshToken: null,
        userId: null,
        user_type: null,
        timeOfLogin: null,
        logInOperation: -1,
      })
    );
    deleteFromLocalStorage("loginInfo");
    navigate("/");
  };

  return (
    <ThemeProvider theme={lavenderTheme}>
      <Box
        sx={{
          width: isSidebarCollapsed ? 72 : 280,
          height: "100vh",
          bgcolor: "background.paper",
          boxShadow: "2px 0 10px rgba(149, 117, 205, 0.1)",
          display: "flex",
          flexDirection: "column",
          position: "fixed",
          top: 0,
          left: 0,
          zIndex: (theme) => theme.zIndex.drawer + 10,
          transition: "width 0.2s ease",
          overflowX: "hidden",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: isSidebarCollapsed ? "center" : "space-between",
            p: 2,
            height: 70,
            borderBottom: "1px solid",
            borderColor: "divider",
          }}
        >
          <Box
            component={NavLink}
            to="/"
            sx={{
              display: "flex",
              alignItems: "center",
              textDecoration: "none",
            }}
          >
            <Avatar
              src="https://www.oecindia.com/assets/images/finalpic.png"
              alt="OEC India Logo"
              sx={{ width: 40, height: 40 }}
            />
            {!isSidebarCollapsed && (
              <Typography
                variant="h6"
                noWrap
                component="div"
                sx={{
                  ml: 1.5,
                  color: "text.primary",
                  fontWeight: 600,
                  fontSize: "1.1rem",
                }}
              >
                OEC India
              </Typography>
            )}
          </Box>
          {!isSidebarCollapsed && (
            <IconButton onClick={() => sidebarStateChange(true)} size="small">
              <ChevronLeftIcon />
            </IconButton>
          )}
        </Box>

        <Box sx={{ flexGrow: 1, overflowY: "auto", py: 1, px: 1 }}>
          <List>
            <NavItem
              to="/"
              icon={<HomeIcon />}
              text={isSidebarCollapsed ? "" : "Dashboard"}
              isActive={location.pathname === "/"}
            />

            {authData.user_type !== "staff" && (
              <>
                <NavItem
                  to="/search"
                  icon={<SearchIcon />}
                  text={isSidebarCollapsed ? "" : "Search Courses"}
                  isActive={location.pathname === "/search"}
                />
                <NavItem
                  to="/university"
                  icon={<UniversityIcon />}
                  text={isSidebarCollapsed ? "" : "Universities"}
                  isActive={location.pathname === "/university"}
                />
                <NavItem
                  to="/website-enquiry"
                  icon={<AssignmentIcon />}
                  text={isSidebarCollapsed ? "" : "Website Enquiry"}
                  isActive={location.pathname === "/website-enquiry"}
                />
                <NavItem
                  to="https://oecindia.com/oeccrm/help/index.html"
                  icon={<HelpIcon />}
                  text={isSidebarCollapsed ? "" : "Help"}
                  isExternal
                />

                {!isSidebarCollapsed && (
                  <>
                    <Divider sx={{ my: 1 }} />
                    <ListSubheader
                      sx={{
                        fontWeight: 600,
                        color: "text.secondary",
                        lineHeight: "36px",
                      }}
                    >
                      Student Hub
                    </ListSubheader>
                  </>
                )}

                <CollapsibleNavItem
                  icon={<AssignmentIcon />}
                  text={isSidebarCollapsed ? "" : "Enquiries"}
                  items={[
                    { name: "All Enquiries", link: "/enquiries" },
                    { name: "Create Enquiry", link: "/enquiry/create" },
                  ]}
                />
              </>
            )}

            {!isSidebarCollapsed && (
              <>
                <Divider sx={{ my: 1 }} />
                <ListSubheader
                  sx={{
                    fontWeight: 600,
                    color: "text.secondary",
                    lineHeight: "36px",
                  }}
                >
                  Management
                </ListSubheader>
              </>
            )}

            <CollapsibleNavItem
              icon={<FileCopyIcon />}
              text={isSidebarCollapsed ? "" : "Applications"}
              items={
                authData.user_type !== "staff"
                  ? [
                      { name: "All Applications", link: "/applications" },
                      {
                        name: "Create Application",
                        link: "/application/create",
                      },
                    ]
                  : [{ name: "All Applications", link: "/applications" }]
              }
            />
          </List>
        </Box>

        <Box sx={{ p: 2, borderTop: "1px solid", borderColor: "divider" }}>
          <NavItem
            to="/user-profile"
            icon={<PeopleIcon />}
            text={isSidebarCollapsed ? "" : "Profile"}
            isActive={location.pathname === "/user-profile"}
          />

          <ListItemButton
            onClick={handleLogout}
            sx={{
              borderRadius: 2,
              justifyContent: isSidebarCollapsed ? "center" : "flex-start",
              px: isSidebarCollapsed ? 2 : 2.5,
              "&:hover": {
                backgroundColor: "error.light",
                "& .MuiListItemIcon-root": {
                  color: "error.main",
                },
                "& .MuiListItemText-primary": {
                  color: "error.main",
                },
              },
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 0,
                mr: isSidebarCollapsed ? 0 : 2,
                justifyContent: "center",
                color: "text.secondary",
              }}
            >
              <LogoutIcon />
            </ListItemIcon>
            {!isSidebarCollapsed && (
              <ListItemText
                primary="Logout"
                primaryTypographyProps={{
                  sx: {
                    fontSize: "0.875rem",
                    fontWeight: 500,
                    color: "text.secondary",
                  },
                }}
              />
            )}
          </ListItemButton>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default SideBar;
