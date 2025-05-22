import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useSelector } from "react-redux";
import { Link as RouterLink } from "react-router-dom";
import {
  Box,
  Grid,
  Typography,
  Paper,
  Button,
  CircularProgress,
  Alert,
  List,
  ListItem,
  ListItemText,
  Avatar,
  Divider,
  Card,
  CardContent,
  CardHeader,
  IconButton,
  ListItemAvatar,
  Chip,
  Switch,
  useTheme,
  ThemeProvider,
  createTheme,
  alpha,
  Menu,
  MenuItem,
  InputBase,
  Tabs,
  Tab,
  Badge,
  ListItemButton,
  Tooltip,
  Zoom,
  Collapse,
  CssBaseline,
} from "@mui/material";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import AssessmentIcon from "@mui/icons-material/Assessment";
import LoopIcon from "@mui/icons-material/Loop";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import AssignmentIcon from "@mui/icons-material/Assignment";
import DescriptionIcon from "@mui/icons-material/Description";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import FilterListIcon from "@mui/icons-material/FilterList";
import SearchIcon from "@mui/icons-material/Search";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import EqualizerIcon from "@mui/icons-material/Equalizer";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import SchoolIcon from "@mui/icons-material/School";
import PriorityHighIcon from "@mui/icons-material/PriorityHigh";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import RefreshIcon from "@mui/icons-material/Refresh";
import CloseIcon from "@mui/icons-material/Close";
import {
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  BarChart,
  Bar,
} from "recharts";
import { motion } from "framer-motion";

const ajaxCallWithHeaderOnly = async (endpoint, headers, method, body) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (endpoint.includes("enquiries")) {
        resolve({
          results: Array(5)
            .fill()
            .map((_, i) => ({
              id: i + 1,
              student_name: `Student ${i + 1}`,
              date_created: new Date(2025, 4, 16 - i).toISOString(),
              enquiry_status: [
                "Pending",
                "In Progress",
                "Completed",
                "On Hold",
                "New",
              ][i % 5],
              course_name: [
                "Data Science",
                "Business Management",
                "Computer Science",
                "Digital Marketing",
                "Graphic Design",
              ][i % 5],
            })),
        });
      } else if (endpoint.includes("courseinfo")) {
        resolve({
          results: Array(5)
            .fill()
            .map((_, i) => ({
              id: i + 1,
              student_info: { name: { student_name: `Applicant ${i + 1}` } },
              created_at: new Date(2025, 4, 16 - i).toISOString(),
              status: {
                App_status: [
                  "Under Review",
                  "Submitted",
                  "Approved",
                  "Requires Documents",
                  "Payment Pending",
                ][i % 5],
              },
              university: [
                "Oxford University",
                "MIT",
                "Stanford",
                "Harvard",
                "Cambridge",
              ][i % 5],
              program: [
                "Masters in Finance",
                "PhD in Physics",
                "Bachelor in Business",
                "Masters in Engineering",
                "Bachelor in Computer Science",
              ][i % 5],
            })),
        });
      } else if (endpoint.includes("recent-actions")) {
        resolve(
          Array(8)
            .fill()
            .map((_, i) => ({
              id: i + 1,
              content_type: {
                app_content:
                  i % 2 === 0
                    ? "enquiry | Student Enquiry"
                    : "application | Student Application",
              },
              object_repr: `Action ${i + 1}`,
              user: {
                object_id: i + 100,
                username: [
                  "Alex Smith",
                  "Taylor Jones",
                  "Sam Wilson",
                  "Jamie Lee",
                  "Dakota Kim",
                ][i % 5],
              },
              action_flag: [1, 2, 2, 1, 3][i % 5],
              action_time: new Date(
                2025,
                4,
                16 - Math.floor(i / 2)
              ).toISOString(),
              object_id: i + 1000,
            }))
        );
      } else if (endpoint.includes("broadcast-message")) {
        resolve(
          Array(3)
            .fill()
            .map((_, i) => ({
              id: i + 1,
              message: [
                "New semester application deadlines have been updated.",
                "System maintenance scheduled for May 20, 2025.",
                "Updated visa requirements for international students available now.",
              ][i],
              start_time: new Date(2025, 4, 10 + i).toISOString(),
              end_time: new Date(2025, 5, 10 + i).toISOString(),
            }))
        );
      }
    }, 500);
  });
};

// Mock data for charts
const generateMockChartData = () => ({
  enquiryTrends: Array(7)
    .fill()
    .map((_, i) => ({
      date: `May ${10 + i}`,
      enquiries: Math.floor(Math.random() * 10) + 5,
      applications: Math.floor(Math.random() * 8) + 2,
    })),
  statusDistribution: [
    { name: "Pending", value: 15 },
    { name: "In Progress", value: 25 },
    { name: "Completed", value: 45 },
    { name: "Rejected", value: 15 },
  ],
  conversionRates: [
    { name: "Jan", rate: 65 },
    { name: "Feb", rate: 59 },
    { name: "Mar", rate: 80 },
    { name: "Apr", rate: 71 },
    { name: "May", rate: 76 },
  ],
});

// ----- Custom Lavender Theme -----
const getLavenderTheme = (mode) => {
  // Define lavender palette
  const lavenderPalette = {
    // Main lavender shades
    primary: {
      light: "#c5b0e6",
      main: "#9575cd",
      dark: "#7953b3",
      contrastText: "#fff",
    },
    // Secondary lavender-rose shade
    secondary: {
      light: "#efc0ff",
      main: "#ba68c8",
      dark: "#883997",
      contrastText: "#fff",
    },
    // Various accent colors with lavender tones
    success: {
      light: "#a7d7c5",
      main: "#66bb6a",
      dark: "#43a047",
      contrastText: "#fff",
    },
    error: {
      light: "#ffb3c4",
      main: "#f06292",
      dark: "#e91e63",
      contrastText: "#fff",
    },
    info: {
      light: "#b3e0ff",
      main: "#64b5f6",
      dark: "#1976d2",
      contrastText: "#fff",
    },
    warning: {
      light: "#fff1b8",
      main: "#ffb74d",
      dark: "#f57c00",
      contrastText: "#fff",
    },
  };

  return createTheme({
    palette: {
      mode,
      ...lavenderPalette,
      background: {
        default: mode === "dark" ? "#232139" : "#f5f3fa",
        paper: mode === "dark" ? "#2d2a45" : "#ffffff",
      },
      text: {
        primary: mode === "dark" ? "#f5f3fa" : "#3f3b5b",
        secondary: mode === "dark" ? "#b8b4d8" : "#69668a",
      },
    },
    shape: {
      borderRadius: 16, // Increased border radius for more rounded edges
    },
    typography: {
      fontFamily: [
        "Poppins",
        "-apple-system",
        "BlinkMacSystemFont",
        '"Segoe UI"',
        "Roboto",
        '"Helvetica Neue"',
        "Arial",
        "sans-serif",
      ].join(","),
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            textTransform: "none",
            boxShadow: "none",
            transition: "all 0.2s ease-in-out",
            "&:hover": {
              transform: "translateY(-2px)",
              boxShadow: "0 4px 10px rgba(149, 117, 205, 0.25)",
            },
          },
          contained: {
            boxShadow: "0 2px 6px rgba(149, 117, 205, 0.2)",
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 20,
            boxShadow:
              mode === "dark"
                ? "0 10px 20px rgba(0, 0, 0, 0.19)"
                : "0 10px 20px rgba(149, 117, 205, 0.1)",
            transition: "transform 0.2s, box-shadow 0.2s",
            "&:hover": {
              boxShadow:
                mode === "dark"
                  ? "0 15px 30px rgba(0, 0, 0, 0.25)"
                  : "0 15px 30px rgba(149, 117, 205, 0.15)",
            },
            backdropFilter: "blur(8px)",
            border:
              mode === "dark" ? "1px solid rgba(255, 255, 255, 0.05)" : "none",
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            fontWeight: 500,
          },
        },
      },
      MuiAvatar: {
        styleOverrides: {
          root: {
            boxShadow: `0 4px 8px ${
              mode === "dark"
                ? "rgba(0, 0, 0, 0.3)"
                : "rgba(149, 117, 205, 0.2)"
            }`,
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          rounded: {
            borderRadius: 20,
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            "& .MuiOutlinedInput-root": {
              borderRadius: 12,
            },
          },
        },
      },
      MuiInputBase: {
        styleOverrides: {
          root: {
            borderRadius: 12,
          },
        },
      },
      MuiTooltip: {
        styleOverrides: {
          tooltip: {
            borderRadius: 12,
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.15)",
            backdropFilter: "blur(4px)",
            background:
              mode === "dark"
                ? "rgba(149, 117, 205, 0.9)"
                : "rgba(149, 117, 205, 0.95)",
          },
        },
      },
      MuiListItem: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            "&:hover": {
              backgroundColor:
                mode === "dark"
                  ? "rgba(255, 255, 255, 0.05)"
                  : "rgba(149, 117, 205, 0.05)",
            },
          },
        },
      },
      MuiListItemButton: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            "&:hover": {
              backgroundColor:
                mode === "dark"
                  ? "rgba(255, 255, 255, 0.05)"
                  : "rgba(149, 117, 205, 0.05)",
            },
          },
        },
      },
      MuiAlert: {
        styleOverrides: {
          root: {
            borderRadius: 12,
          },
        },
      },
      MuiTab: {
        styleOverrides: {
          root: {
            borderRadius: "12px 12px 0 0",
            textTransform: "none",
          },
        },
      },
      MuiMenu: {
        styleOverrides: {
          paper: {
            borderRadius: 16,
            boxShadow: "0 8px 16px rgba(0, 0, 0, 0.1)",
          },
        },
      },
      MuiMenuItem: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            margin: "2px 6px",
            "&:first-of-type": {
              marginTop: 6,
            },
            "&:last-of-type": {
              marginBottom: 6,
            },
          },
        },
      },
    },
  });
};

const ThemeToggle = ({ darkMode, setDarkMode }) => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        background: darkMode
          ? "rgba(255, 255, 255, 0.05)"
          : "rgba(149, 117, 205, 0.08)",
        borderRadius: 30,
        padding: "2px 10px",
        boxShadow: darkMode ? "none" : "0 2px 8px rgba(149, 117, 205, 0.15)",
      }}
    >
      <LightModeIcon
        color={darkMode ? "disabled" : "warning"}
        sx={{ fontSize: 20 }}
      />
      <Switch
        checked={darkMode}
        onChange={() => setDarkMode(!darkMode)}
        color="primary"
        size="small"
        sx={{
          "& .MuiSwitch-switchBase.Mui-checked": {
            color: "#9575cd",
          },
          "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
            backgroundColor: "#c5b0e6",
          },
        }}
      />
      <DarkModeIcon
        color={darkMode ? "primary" : "disabled"}
        sx={{ fontSize: 20 }}
      />
    </Box>
  );
};

const WelcomeBanner = ({ userName, darkMode }) => {
  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      sx={{
        background: darkMode
          ? "linear-gradient(135deg, rgba(121, 83, 179, 0.8) 0%, rgba(149, 117, 205, 0.6) 100%)"
          : "linear-gradient(135deg, rgba(197, 176, 230, 0.8) 0%, rgba(149, 117, 205, 0.9) 100%)",
        borderRadius: 4,
        boxShadow: darkMode
          ? "0 10px 30px rgba(0, 0, 0, 0.3)"
          : "0 10px 30px rgba(149, 117, 205, 0.2)",
        p: 3,
        color: darkMode ? "#fff" : "#fff",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          backgroundColor: "transparent",
          backgroundImage: `radial-gradient(${alpha(
            "#fff",
            0.15
          )} 1px, transparent 1px)`,
          backgroundSize: "20px 20px",
        }}
      />

      <Grid container spacing={2} alignItems="center" position="relative">
        <Grid item xs={12} md={8}>
          <Typography
            variant="h4"
            component="h1"
            fontWeight="bold"
            gutterBottom
            sx={{
              textShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
              fontSize: { xs: "1.75rem", md: "2.25rem" },
            }}
          >
            Welcome back, {userName}!
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.95, fontWeight: 300 }}>
            Today is{" "}
            {new Date().toLocaleDateString("en-GB", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </Typography>
        </Grid>
        <Grid
          item
          xs={12}
          md={4}
          sx={{ textAlign: { xs: "left", md: "right" } }}
        >
          <Button
            variant="contained"
            startIcon={<AssessmentIcon />}
            sx={{
              bgcolor: alpha("#fff", 0.2),
              borderColor: alpha("#fff", 0.3),
              color: "#fff",
              "&:hover": {
                bgcolor: alpha("#fff", 0.3),
              },
              backdropFilter: "blur(4px)",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
            }}
          >
            Monthly Report
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

const EnhancedKPICard = ({ title, value, icon, trend, color, sx }) => {
  const theme = useTheme();
  const isPositive = trend && trend.startsWith("+");
  const trendIcon = isPositive ? (
    <TrendingUpIcon fontSize="small" />
  ) : (
    <TrendingDownIcon fontSize="small" />
  );

  return (
    <Card
      component={motion.div}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      elevation={0}
      sx={{
        height: "100%",
        position: "relative",
        overflow: "hidden",
        borderTop: "4px solid",
        borderColor: color || theme.palette.primary.main,
        backdropFilter: "blur(10px)",
        ...sx,
      }}
    >
      <CardContent sx={{ p: 3, height: "100%" }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item>
            <Avatar
              sx={{
                bgcolor: alpha(color || theme.palette.primary.main, 0.12),
                color: color || theme.palette.primary.main,
                width: 64,
                height: 64,
                boxShadow: `0 4px 12px ${alpha(
                  color || theme.palette.primary.main,
                  0.2
                )}`,
              }}
            >
              {icon}
            </Avatar>
          </Grid>
          <Grid item xs>
            <Typography
              variant="h6"
              component="div"
              color="text.secondary"
              gutterBottom
            >
              {title}
            </Typography>
            <Box sx={{ display: "flex", alignItems: "baseline" }}>
              <Typography variant="h4" component="div" fontWeight="bold">
                {typeof value === "object" ? value : value}
              </Typography>
              {trend && (
                <Chip
                  icon={trendIcon}
                  label={trend}
                  size="small"
                  color={isPositive ? "success" : "error"}
                  sx={{
                    ml: 1.5,
                    height: 24,
                    borderRadius: 8,
                    boxShadow: `0 4px 8px ${alpha(
                      isPositive
                        ? theme.palette.success.main
                        : theme.palette.error.main,
                      0.15
                    )}`,
                  }}
                />
              )}
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

const QuickActionsPanel = () => {
  const theme = useTheme();
  const actions = [
    {
      name: "New Enquiry",
      icon: <HelpOutlineIcon />,
      to: "/enquiry/create",
      color: theme.palette.primary.main,
    },
    {
      name: "New Application",
      icon: <AddCircleOutlineIcon />,
      to: "/application/create",
      color: theme.palette.secondary.main,
    },
    {
      name: "View Reports",
      icon: <AssessmentIcon />,
      to: "/reports",
      color: theme.palette.info.main,
    },
    {
      name: "My Tasks",
      icon: <AssignmentIcon />,
      to: "/tasks",
      color: theme.palette.warning.main,
    },
  ];

  return (
    <Card
      elevation={0}
      sx={{
        p: 2,
        height: "100%",
      }}
    >
      <CardHeader
        title="Quick Actions"
        titleTypographyProps={{
          variant: "h6",
          fontWeight: "bold",
          sx: {
            color:
              theme.palette.mode === "dark"
                ? theme.palette.primary.light
                : theme.palette.primary.dark,
          },
        }}
        sx={{ pb: 1 }}
      />
      <CardContent sx={{ p: 1 }}>
        <Grid container spacing={2}>
          {actions.map((action, index) => (
            <Grid item xs={6} sm={3} key={action.name}>
              <Button
                component={RouterLink}
                to={action.to}
                sx={{
                  p: 2,
                  height: "100%",
                  width: "100%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 1,
                  borderRadius: 4,
                  color: "text.primary",
                  bgcolor: alpha(
                    action.color,
                    theme.palette.mode === "dark" ? 0.1 : 0.05
                  ),
                  border: `1px solid ${alpha(
                    action.color,
                    theme.palette.mode === "dark" ? 0.15 : 0.1
                  )}`,
                  transition: "all 0.2s",
                  "&:hover": {
                    bgcolor: alpha(
                      action.color,
                      theme.palette.mode === "dark" ? 0.2 : 0.1
                    ),
                    boxShadow: `0 8px 16px ${alpha(action.color, 0.15)}`,
                    transform: "translateY(-4px)",
                  },
                }}
              >
                <Avatar
                  sx={{
                    bgcolor: alpha(
                      action.color,
                      theme.palette.mode === "dark" ? 0.2 : 0.1
                    ),
                    color: action.color,
                    mb: 1,
                    width: 48,
                    height: 48,
                  }}
                >
                  {action.icon}
                </Avatar>
                <Typography variant="body2" align="center" fontWeight="medium">
                  {action.name}
                </Typography>
              </Button>
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  );
};

// Enhanced Broadcast Messages
const EnhancedBroadcastMessages = ({ messages, isLoading }) => {
  const [expanded, setExpanded] = useState(null);
  const theme = useTheme();

  return (
    <Card elevation={0} sx={{ height: "100%", position: "relative" }}>
      <CardHeader
        avatar={
          <Avatar
            sx={{
              bgcolor: theme.palette.warning.main,
              boxShadow: `0 4px 8px ${alpha(theme.palette.warning.main, 0.25)}`,
            }}
          >
            <NotificationsActiveIcon />
          </Avatar>
        }
        title="Broadcast Messages"
        titleTypographyProps={{
          variant: "h6",
          fontWeight: "bold",
          sx: {
            color:
              theme.palette.mode === "dark"
                ? theme.palette.primary.light
                : theme.palette.primary.dark,
          },
        }}
        action={
          <IconButton
            aria-label="refresh"
            sx={{
              bgcolor: alpha(theme.palette.primary.main, 0.05),
              "&:hover": {
                bgcolor: alpha(theme.palette.primary.main, 0.1),
              },
            }}
          >
            <RefreshIcon fontSize="small" />
          </IconButton>
        }
      />
      <CardContent sx={{ pt: 0, maxHeight: 320, overflow: "auto", px: 2 }}>
        {isLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
            <CircularProgress
              size={30}
              sx={{ color: theme.palette.primary.main }}
            />
          </Box>
        ) : messages?.length > 0 ? (
          <List sx={{ pt: 0 }}>
            {messages.map((msg) => (
              <Box
                key={msg.id}
                sx={{
                  mb: 2,
                  transition: "transform 0.2s",
                  "&:hover": {
                    transform: "translateY(-2px)",
                  },
                }}
                component={motion.div}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Alert
                  severity="info"
                  icon={
                    <Avatar
                      sx={{
                        width: 28,
                        height: 28,
                        bgcolor: theme.palette.info.light,
                        boxShadow: `0 2px 4px ${alpha(
                          theme.palette.info.main,
                          0.25
                        )}`,
                      }}
                    >
                      <NotificationsActiveIcon sx={{ fontSize: 16 }} />
                    </Avatar>
                  }
                  sx={{
                    borderRadius: 3,
                    boxShadow:
                      theme.palette.mode === "dark"
                        ? `0 4px 12px rgba(0, 0, 0, 0.2)`
                        : `0 4px 12px ${alpha(theme.palette.info.main, 0.15)}`,
                    border: `1px solid ${alpha(
                      theme.palette.info.main,
                      theme.palette.mode === "dark" ? 0.15 : 0.08
                    )}`,
                    "& .MuiAlert-message": { width: "100%" },
                    cursor: "pointer",
                    backgroundColor:
                      theme.palette.mode === "dark"
                        ? alpha(theme.palette.info.dark, 0.1)
                        : alpha(theme.palette.info.light, 0.1),
                  }}
                  onClick={() =>
                    setExpanded(expanded === msg.id ? null : msg.id)
                  }
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Typography variant="subtitle2" fontWeight="medium">
                      {new Date(msg.start_time).toLocaleDateString()}
                    </Typography>
                    <IconButton
                      size="small"
                      sx={{
                        bgcolor: alpha(theme.palette.background.paper, 0.3),
                        "&:hover": {
                          bgcolor: alpha(theme.palette.background.paper, 0.5),
                        },
                      }}
                    >
                      {expanded === msg.id ? (
                        <CloseIcon fontSize="small" />
                      ) : (
                        <MoreVertIcon fontSize="small" />
                      )}
                    </IconButton>
                  </Box>
                  <Collapse in={expanded === msg.id || msg.message.length < 60}>
                    <Typography variant="body2" sx={{ pt: 0.5 }}>
                      {msg.message}
                    </Typography>
                  </Collapse>
                  {!expanded && msg.message.length >= 60 && (
                    <Typography variant="body2" noWrap>
                      {msg.message}
                    </Typography>
                  )}
                </Alert>
              </Box>
            ))}
          </List>
        ) : (
          <Box
            sx={{
              p: 4,
              textAlign: "center",
              bgcolor: alpha(theme.palette.background.paper, 0.5),
              borderRadius: 3,
              border: `1px dashed ${alpha(theme.palette.primary.main, 0.1)}`,
            }}
          >
            <Typography color="text.secondary">No new messages</Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

// Recent Activity Feed with Filtering
const EnhancedActivityFeed = ({ activities, isLoading }) => {
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const theme = useTheme();

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    handleMenuClose();
  };

  const filteredActivities = useMemo(() => {
    return activities.filter((activity) => {
      // Filter by type
      if (
        filter !== "all" &&
        activity.content_type.app_content.split("|")[0].trim() !== filter
      ) {
        return false;
      }

      // Filter by search term
      if (
        searchTerm &&
        !activity.object_repr
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) &&
        !activity.user.username.toLowerCase().includes(searchTerm.toLowerCase())
      ) {
        return false;
      }

      return true;
    });
  }, [activities, filter, searchTerm]);

  const getStatusColor = (statusCode) => {
    switch (statusCode) {
      case 1:
        return "success";
      case 2:
        return "info";
      case 3:
        return "error";
      default:
        return "default";
    }
  };

  const getActionIcon = (actionType) => {
    const type = actionType.split("|")[0].trim();
    return type === "enquiry" ? <HelpOutlineIcon /> : <DescriptionIcon />;
  };

  return (
    <Card elevation={0} sx={{ height: "100%" }}>
      <CardHeader
        title="Recent Activity"
        titleTypographyProps={{
          variant: "h6",
          fontWeight: "bold",
          sx: {
            color:
              theme.palette.mode === "dark"
                ? theme.palette.primary.light
                : theme.palette.primary.dark,
          },
        }}
        action={
          <Box sx={{ display: "flex", gap: 1 }}>
            <Paper
              component="form"
              elevation={0}
              sx={{
                p: "2px 12px",
                display: "flex",
                alignItems: "center",
                width: { xs: 150, sm: 200 },
                height: 40,
                borderRadius: 20,
                border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                bgcolor: alpha(theme.palette.background.default, 0.6),
              }}
            >
              <InputBase
                sx={{ flex: 1 }}
                placeholder="Search activity"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <IconButton type="button" sx={{ p: "6px" }} aria-label="search">
                <SearchIcon fontSize="small" />
              </IconButton>
            </Paper>

            <Button
              aria-controls="filter-menu"
              aria-haspopup="true"
              onClick={handleMenuClick}
              startIcon={<FilterListIcon />}
              endIcon={
                filter !== "all" && (
                  <Badge
                    variant="dot"
                    color="primary"
                    sx={{ "& .MuiBadge-badge": { right: -4, top: 4 } }}
                  />
                )
              }
              variant="outlined"
              size="small"
              sx={{
                height: 40,
                borderRadius: 20,
                borderColor: alpha(theme.palette.primary.main, 0.2),
              }}
            >
              Filter
            </Button>
            <Menu
              id="filter-menu"
              anchorEl={anchorEl}
              keepMounted
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              PaperProps={{
                elevation: 3,
                sx: {
                  mt: 1.5,
                  borderRadius: 3,
                  boxShadow:
                    theme.palette.mode === "dark"
                      ? "0 8px 20px rgba(0, 0, 0, 0.3)"
                      : "0 8px 20px rgba(149, 117, 205, 0.2)",
                  border:
                    theme.palette.mode === "dark"
                      ? `1px solid ${alpha(theme.palette.primary.main, 0.1)}`
                      : "none",
                },
              }}
            >
              <MenuItem
                selected={filter === "all"}
                onClick={() => handleFilterChange("all")}
                sx={{
                  borderRadius: 2,
                  mx: 0.5,
                  my: 0.2,
                  fontSize: "0.95rem",
                }}
              >
                All Activities
              </MenuItem>
              <MenuItem
                selected={filter === "enquiry"}
                onClick={() => handleFilterChange("enquiry")}
                sx={{
                  borderRadius: 2,
                  mx: 0.5,
                  my: 0.2,
                  fontSize: "0.95rem",
                }}
              >
                Enquiries Only
              </MenuItem>
              <MenuItem
                selected={filter === "application"}
                onClick={() => handleFilterChange("application")}
                sx={{
                  borderRadius: 2,
                  mx: 0.5,
                  my: 0.2,
                  fontSize: "0.95rem",
                }}
              >
                Applications Only
              </MenuItem>
            </Menu>
          </Box>
        }
      />
      <Divider sx={{ opacity: 0.5 }} />
      <CardContent sx={{ pt: 2, pb: 1.5, maxHeight: 370, overflow: "auto" }}>
        {isLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
            <CircularProgress
              size={30}
              sx={{ color: theme.palette.primary.main }}
            />
          </Box>
        ) : filteredActivities.length > 0 ? (
          <List disablePadding>
            {filteredActivities.map((activity, index) => (
              <ListItem
                key={activity.id}
                disablePadding
                secondaryAction={
                  <Tooltip
                    title="View Details"
                    arrow
                    TransitionComponent={Zoom}
                    placement="left"
                  >
                    <IconButton
                      edge="end"
                      size="small"
                      sx={{
                        bgcolor: alpha(theme.palette.primary.main, 0.05),
                        "&:hover": {
                          bgcolor: alpha(theme.palette.primary.main, 0.1),
                        },
                      }}
                    >
                      <MoreVertIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                }
                divider={index < filteredActivities.length - 1}
                component={motion.div}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05, duration: 0.2 }}
                sx={{ px: 1 }}
              >
                <ListItemButton
                  sx={{
                    py: 1.5,
                    borderRadius: 3,
                    transition: "all 0.2s",
                    "&:hover": {
                      transform: "translateX(4px)",
                      boxShadow:
                        theme.palette.mode === "dark"
                          ? "0 4px 12px rgba(0, 0, 0, 0.2)"
                          : "0 4px 12px rgba(149, 117, 205, 0.1)",
                    },
                  }}
                >
                  <ListItemAvatar>
                    <Badge
                      overlap="circular"
                      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                      badgeContent={
                        <Box
                          component="span"
                          sx={{
                            width: 16,
                            height: 16,
                            borderRadius: "50%",
                            bgcolor:
                              theme.palette[
                                getStatusColor(activity.action_flag)
                              ].main,
                            border: "2px solid",
                            borderColor: "background.paper",
                            display: "block",
                            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
                          }}
                        />
                      }
                    >
                      <Avatar
                        sx={{
                          bgcolor: alpha(
                            theme.palette[getStatusColor(activity.action_flag)]
                              .main,
                            0.15
                          ),
                          color:
                            theme.palette[getStatusColor(activity.action_flag)]
                              .main,
                        }}
                      >
                        {getActionIcon(activity.content_type.app_content)}
                      </Avatar>
                    </Badge>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          flexWrap: "wrap",
                        }}
                      >
                        <Typography
                          variant="subtitle2"
                          component="span"
                          fontWeight="medium"
                        >
                          {activity.action_flag === 1
                            ? "Created"
                            : activity.action_flag === 2
                            ? "Updated"
                            : "Deleted"}
                        </Typography>
                        &nbsp;
                        <Typography
                          variant="body2"
                          component="span"
                          color="text.secondary"
                        >
                          {activity.content_type.app_content
                            .split("|")[0]
                            .trim()}
                          :
                        </Typography>
                        &nbsp;
                        <Typography variant="subtitle2" component="span">
                          {activity.object_repr}
                        </Typography>
                      </Box>
                    }
                    secondary={
                      <Typography
                        variant="caption"
                        sx={{ display: "flex", alignItems: "center", mt: 0.5 }}
                      >
                        <Box
                          component="span"
                          sx={{ display: "flex", alignItems: "center", mr: 2 }}
                        >
                          by {activity.user.username}
                        </Box>
                        <Box
                          component="span"
                          sx={{ display: "flex", alignItems: "center" }}
                        >
                          <CalendarTodayIcon
                            fontSize="inherit"
                            sx={{ mr: 0.5, fontSize: "0.875rem" }}
                          />
                          {new Date(activity.action_time).toLocaleString(
                            undefined,
                            {
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}
                        </Box>
                      </Typography>
                    }
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        ) : (
          <Box
            sx={{
              p: 4,
              textAlign: "center",
              bgcolor: alpha(theme.palette.background.paper, 0.5),
              borderRadius: 3,
              border: `1px dashed ${alpha(theme.palette.primary.main, 0.1)}`,
            }}
          >
            <Typography color="text.secondary">
              No matching activities
            </Typography>
          </Box>
        )}
      </CardContent>
      {filteredActivities.length > 0 && (
        <Box
          sx={{
            p: 2,
            textAlign: "center",
            borderTop: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
          }}
        >
          <Button
            size="small"
            endIcon={<MoreVertIcon />}
            variant="text"
            sx={{
              color: theme.palette.primary.main,
              "&:hover": {
                backgroundColor: alpha(theme.palette.primary.main, 0.05),
              },
            }}
          >
            View All Activity
          </Button>
        </Box>
      )}
    </Card>
  );
};

// Task List with Interactive Elements
const EnhancedTaskList = ({ tasks, isLoading }) => {
  const [stateTasks, setStateTasks] = useState([]);
  const theme = useTheme();

  useEffect(() => {
    if (tasks?.length > 0) {
      setStateTasks(tasks);
    }
  }, [tasks]);

  const handleToggleComplete = (id) => {
    setStateTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const pendingTasks = stateTasks.filter((task) => !task.completed).length;

  return (
    <Card elevation={0} sx={{ height: "100%" }}>
      <CardHeader
        avatar={
          <Badge
            badgeContent={pendingTasks}
            color="error"
            max={99}
            sx={{
              "& .MuiBadge-badge": {
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
              },
            }}
          >
            <Avatar
              sx={{
                bgcolor: theme.palette.error.main,
                boxShadow: `0 4px 8px ${alpha(theme.palette.error.main, 0.25)}`,
              }}
            >
              <AssignmentIcon />
            </Avatar>
          </Badge>
        }
        title="My Tasks"
        titleTypographyProps={{
          variant: "h6",
          fontWeight: "bold",
          sx: {
            color:
              theme.palette.mode === "dark"
                ? theme.palette.primary.light
                : theme.palette.primary.dark,
          },
        }}
        subheader={`${pendingTasks} pending, ${
          stateTasks.length - pendingTasks
        } completed`}
        action={
          <Tooltip title="Add New Task" arrow TransitionComponent={Zoom}>
            <IconButton
              sx={{
                bgcolor: alpha(theme.palette.primary.main, 0.05),
                "&:hover": {
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                },
              }}
            >
              <AddCircleOutlineIcon />
            </IconButton>
          </Tooltip>
        }
      />
      <Divider sx={{ opacity: 0.5 }} />
      <CardContent sx={{ pt: 2, pb: 1, maxHeight: 320, overflow: "auto" }}>
        {isLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
            <CircularProgress
              size={30}
              sx={{ color: theme.palette.primary.main }}
            />
          </Box>
        ) : stateTasks?.length > 0 ? (
          <List>
            {stateTasks.map((task, index) => {
              const isOverdue =
                new Date(task.dueDate) < new Date() && !task.completed;
              return (
                <ListItem
                  key={task.id}
                  secondaryAction={
                    <IconButton
                      edge="end"
                      onClick={() => handleToggleComplete(task.id)}
                      color={task.completed ? "success" : "default"}
                      sx={{
                        bgcolor: task.completed
                          ? alpha(theme.palette.success.main, 0.1)
                          : alpha(theme.palette.action.hover, 0.1),
                        "&:hover": {
                          bgcolor: task.completed
                            ? alpha(theme.palette.success.main, 0.2)
                            : alpha(theme.palette.action.hover, 0.2),
                        },
                      }}
                    >
                      <TaskAltIcon />
                    </IconButton>
                  }
                  sx={{
                    opacity: task.completed ? 0.7 : 1,
                    py: 0.5,
                    px: 1,
                    mb: 1,
                    borderRadius: 3,
                    bgcolor: task.completed
                      ? alpha(
                          theme.palette.success.main,
                          theme.palette.mode === "dark" ? 0.05 : 0.03
                        )
                      : isOverdue
                      ? alpha(
                          theme.palette.error.main,
                          theme.palette.mode === "dark" ? 0.05 : 0.03
                        )
                      : "transparent",
                    border: `1px solid ${
                      task.completed
                        ? alpha(
                            theme.palette.success.main,
                            theme.palette.mode === "dark" ? 0.1 : 0.05
                          )
                        : isOverdue
                        ? alpha(
                            theme.palette.error.main,
                            theme.palette.mode === "dark" ? 0.1 : 0.05
                          )
                        : "transparent"
                    }`,
                    transition: "all 0.2s",
                    "&:hover": {
                      bgcolor: task.completed
                        ? alpha(
                            theme.palette.success.main,
                            theme.palette.mode === "dark" ? 0.08 : 0.05
                          )
                        : isOverdue
                        ? alpha(
                            theme.palette.error.main,
                            theme.palette.mode === "dark" ? 0.08 : 0.05
                          )
                        : alpha(theme.palette.action.hover, 0.05),
                    },
                  }}
                  component={motion.div}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.3 }}
                >
                  <ListItemText
                    primary={
                      <Typography
                        variant="body1"
                        sx={{
                          textDecoration: task.completed
                            ? "line-through"
                            : "none",
                          display: "flex",
                          alignItems: "center",
                          fontWeight: 500,
                        }}
                      >
                        {isOverdue && !task.completed && (
                          <Tooltip
                            title="Overdue"
                            arrow
                            TransitionComponent={Zoom}
                          >
                            <PriorityHighIcon
                              color="error"
                              fontSize="small"
                              sx={{ mr: 1 }}
                            />
                          </Tooltip>
                        )}
                        {task.title}
                      </Typography>
                    }
                    secondary={
                      <Typography
                        variant="caption"
                        color={isOverdue ? "error" : "text.secondary"}
                        sx={{ display: "flex", alignItems: "center", mt: 0.5 }}
                      >
                        <CalendarTodayIcon
                          fontSize="inherit"
                          sx={{ mr: 0.5, fontSize: "0.875rem" }}
                        />
                        Due: {new Date(task.dueDate).toLocaleDateString()}
                      </Typography>
                    }
                  />
                </ListItem>
              );
            })}
          </List>
        ) : (
          <Box
            sx={{
              p: 4,
              textAlign: "center",
              bgcolor: alpha(theme.palette.success.main, 0.05),
              borderRadius: 3,
              border: `1px dashed ${alpha(theme.palette.success.main, 0.2)}`,
            }}
          >
            <CheckCircleIcon
              color="success"
              sx={{
                fontSize: 48,
                mb: 1,
                opacity: 0.8,
                filter: "drop-shadow(0 2px 4px rgba(76, 175, 80, 0.3))",
              }}
            />
            <Typography color="text.secondary" fontWeight="medium">
              No pending tasks. Great job!
            </Typography>
          </Box>
        )}
      </CardContent>
      {stateTasks.length > 0 && (
        <Box
          sx={{
            p: 2,
            textAlign: "center",
            borderTop: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
          }}
        >
          <Button
            size="small"
            component={RouterLink}
            to="/tasks"
            endIcon={<MoreVertIcon />}
            variant="text"
            sx={{
              color: theme.palette.primary.main,
              "&:hover": {
                backgroundColor: alpha(theme.palette.primary.main, 0.05),
              },
            }}
          >
            Manage All Tasks
          </Button>
        </Box>
      )}
    </Card>
  );
};

// Interactive Recent Items List with Tabs
const EnhancedRecentItemsList = ({ title, items, isLoading, itemType }) => {
  const [tabValue, setTabValue] = useState(0);
  const theme = useTheme();

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const getStatusColor = (status) => {
    if (!status) return "default";

    status = status.toLowerCase();
    if (status.includes("new") || status.includes("pending")) return "warning";
    if (
      status.includes("progress") ||
      status.includes("submitted") ||
      status.includes("review")
    )
      return "info";
    if (status.includes("complete") || status.includes("approved"))
      return "success";
    if (
      status.includes("hold") ||
      status.includes("rejected") ||
      status.includes("requires")
    )
      return "error";
    return "default";
  };

  const getStatusIcon = (status) => {
    if (!status) return null;

    status = status.toLowerCase();
    if (status.includes("complete") || status.includes("approved"))
      return <CheckCircleIcon fontSize="small" />;
    if (
      status.includes("progress") ||
      status.includes("submitted") ||
      status.includes("review")
    )
      return <LoopIcon fontSize="small" />;
    if (status.includes("hold") || status.includes("rejected"))
      return <PriorityHighIcon fontSize="small" />;
    return null;
  };

  const displayItems = useMemo(() => {
    if (!items?.length) return [];

    return items.filter((item) => {
      if (tabValue === 0) return true; // All

      const status =
        itemType === "Enquiry"
          ? item.enquiry_status?.toLowerCase()
          : item.status?.App_status?.toLowerCase();

      if (tabValue === 1)
        // Active
        return (
          status &&
          (status.includes("new") ||
            status.includes("progress") ||
            status.includes("review") ||
            status.includes("pending"))
        );
      if (tabValue === 2)
        // Completed
        return (
          status && (status.includes("complete") || status.includes("approved"))
        );

      return true;
    });
  }, [items, tabValue, itemType]);

  const getTabs = () => {
    return [
      { label: "All", count: items?.length || 0 },
      {
        label: "Active",
        count:
          items?.filter((item) => {
            const status =
              itemType === "Enquiry"
                ? item.enquiry_status?.toLowerCase()
                : item.status?.App_status?.toLowerCase();
            return (
              status &&
              (status.includes("new") ||
                status.includes("progress") ||
                status.includes("review") ||
                status.includes("pending"))
            );
          }).length || 0,
      },
      {
        label: "Completed",
        count:
          items?.filter((item) => {
            const status =
              itemType === "Enquiry"
                ? item.enquiry_status?.toLowerCase()
                : item.status?.App_status?.toLowerCase();
            return (
              status &&
              (status.includes("complete") || status.includes("approved"))
            );
          }).length || 0,
      },
    ];
  };

  return (
    <Card elevation={0} sx={{ height: "100%" }}>
      <CardHeader
        avatar={
          <Avatar
            sx={{
              bgcolor:
                itemType === "Enquiry"
                  ? theme.palette.secondary.main
                  : theme.palette.info.main,
              boxShadow: `0 4px 8px ${alpha(
                itemType === "Enquiry"
                  ? theme.palette.secondary.main
                  : theme.palette.info.main,
                0.25
              )}`,
            }}
          >
            {itemType === "Enquiry" ? <HelpOutlineIcon /> : <SchoolIcon />}
          </Avatar>
        }
        title={title}
        titleTypographyProps={{
          variant: "h6",
          fontWeight: "bold",
          sx: {
            color:
              theme.palette.mode === "dark"
                ? theme.palette.primary.light
                : theme.palette.primary.dark,
          },
        }}
        action={
          <Button
            component={RouterLink}
            to={`/${itemType.toLowerCase()}s`}
            size="small"
            endIcon={<MoreVertIcon />}
            variant="text"
            sx={{
              color: theme.palette.primary.main,
              "&:hover": {
                backgroundColor: alpha(theme.palette.primary.main, 0.05),
              },
            }}
          >
            View All
          </Button>
        }
        sx={{ pb: 0 }}
      />

      <Box sx={{ px: 2 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant="fullWidth"
          aria-label={`${title} tabs`}
          sx={{
            minHeight: 42,
            "& .MuiTabs-indicator": {
              height: 3,
              borderRadius: "3px 3px 0 0",
            },
            "& .MuiTab-root": {
              textTransform: "none",
              fontWeight: 500,
              fontSize: "0.9rem",
              minHeight: 42,
            },
          }}
        >
          {getTabs().map((tab) => (
            <Tab
              key={tab.label}
              label={
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  {tab.label}
                  <Chip
                    label={tab.count}
                    size="small"
                    sx={{
                      ml: 0.8,
                      height: 20,
                      minWidth: 20,
                      fontWeight: "bold",
                      fontSize: "0.7rem",
                      bgcolor:
                        tabValue ===
                        getTabs().findIndex((t) => t.label === tab.label)
                          ? alpha(theme.palette.primary.main, 0.2)
                          : alpha(theme.palette.action.hover, 0.1),
                    }}
                  />
                </Box>
              }
              sx={{
                minHeight: 42,
                py: 1,
                "&.Mui-selected": {
                  color: theme.palette.primary.main,
                  fontWeight: 600,
                },
              }}
            />
          ))}
        </Tabs>
      </Box>

      <CardContent sx={{ pt: 2, pb: 1, maxHeight: 320, overflow: "auto" }}>
        {isLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
            <CircularProgress
              size={30}
              sx={{ color: theme.palette.primary.main }}
            />
          </Box>
        ) : displayItems.length > 0 ? (
          <List disablePadding>
            {displayItems.map((item, index) => {
              const name =
                itemType === "Enquiry"
                  ? item.student_name
                  : item.student_info?.name?.student_name || "N/A";

              const status =
                itemType === "Enquiry"
                  ? item.enquiry_status
                  : item.status?.App_status || "N/A";

              const date =
                itemType === "Enquiry"
                  ? new Date(item.date_created).toLocaleDateString()
                  : new Date(item.created_at).toLocaleDateString();

              const secondaryInfo =
                itemType === "Enquiry"
                  ? item.course_name
                  : `${item.university || "University"} - ${
                      item.program || "Program"
                    }`;

              const statusColorCode = getStatusColor(status);

              return (
                <ListItem
                  key={item.id}
                  component={motion.div}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.2 }}
                  divider={index < displayItems.length - 1}
                  disablePadding
                  secondaryAction={
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Chip
                        label={status}
                        size="small"
                        color={statusColorCode}
                        icon={getStatusIcon(status)}
                        sx={{
                          mr: 1.5,
                          fontWeight: "medium",
                          boxShadow: `0 2px 4px ${alpha(
                            theme.palette[statusColorCode].main,
                            0.2
                          )}`,
                        }}
                      />
                      <Tooltip
                        title="View Details"
                        arrow
                        TransitionComponent={Zoom}
                      >
                        <IconButton
                          edge="end"
                          aria-label="details"
                          component={RouterLink}
                          to={`/${itemType.toLowerCase()}/${
                            itemType === "Enquiry" ? "edit" : "edit"
                          }/${item.id}`}
                          size="small"
                          sx={{
                            bgcolor: alpha(theme.palette.primary.main, 0.05),
                            "&:hover": {
                              bgcolor: alpha(theme.palette.primary.main, 0.1),
                            },
                          }}
                        >
                          <MoreVertIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  }
                  sx={{ px: 1 }}
                >
                  <ListItemButton
                    sx={{
                      py: 1.5,
                      borderRadius: 3,
                      transition: "all 0.2s",
                      "&:hover": {
                        transform: "translateX(4px)",
                        boxShadow:
                          theme.palette.mode === "dark"
                            ? "0 4px 12px rgba(0, 0, 0, 0.2)"
                            : "0 4px 12px rgba(149, 117, 205, 0.1)",
                      },
                    }}
                  >
                    <ListItemText
                      primary={
                        <Typography variant="subtitle2" fontWeight="medium">
                          {name}
                        </Typography>
                      }
                      secondary={
                        <Typography
                          variant="caption"
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            mt: 0.5,
                          }}
                        >
                          <Box
                            component="span"
                            sx={{
                              mb: 0.2,
                              display: "flex",
                              alignItems: "center",
                            }}
                          >
                            <CalendarTodayIcon
                              fontSize="inherit"
                              sx={{ mr: 0.5, fontSize: "0.75rem" }}
                            />
                            {date}
                          </Box>
                          <Box component="span">{secondaryInfo}</Box>
                        </Typography>
                      }
                    />
                  </ListItemButton>
                </ListItem>
              );
            })}
          </List>
        ) : (
          <Box
            sx={{
              p: 4,
              textAlign: "center",
              bgcolor: alpha(theme.palette.background.paper, 0.5),
              borderRadius: 3,
              border: `1px dashed ${alpha(theme.palette.primary.main, 0.1)}`,
            }}
          >
            <Typography color="text.secondary">
              No {tabValue === 0 ? "" : getTabs()[tabValue].label.toLowerCase()}{" "}
              {itemType.toLowerCase()}s found.
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

// Analytics Section
const AnalyticsSection = ({ chartData }) => {
  const theme = useTheme();
  const [activeChart, setActiveChart] = useState("trends");

  const COLORS = [
    theme.palette.primary.main,
    theme.palette.secondary.main,
    theme.palette.success.main,
    theme.palette.error.main,
  ];

  const handleChartChange = (chart) => {
    setActiveChart(chart);
  };

  const renderChart = () => {
    switch (activeChart) {
      case "trends":
        return (
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart
              data={chartData.enquiryTrends}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorEnquiries" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor={theme.palette.primary.main}
                    stopOpacity={0.7}
                  />
                  <stop
                    offset="95%"
                    stopColor={theme.palette.primary.main}
                    stopOpacity={0.05}
                  />
                </linearGradient>
                <linearGradient
                  id="colorApplications"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor={theme.palette.secondary.main}
                    stopOpacity={0.7}
                  />
                  <stop
                    offset="95%"
                    stopColor={theme.palette.secondary.main}
                    stopOpacity={0.05}
                  />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="date"
                fontSize={12}
                axisLine={{ stroke: theme.palette.divider }}
                tickLine={{ stroke: theme.palette.divider }}
                tick={{ fill: theme.palette.text.secondary }}
              />
              <YAxis
                fontSize={12}
                axisLine={{ stroke: theme.palette.divider }}
                tickLine={{ stroke: theme.palette.divider }}
                tick={{ fill: theme.palette.text.secondary }}
              />
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke={theme.palette.divider}
              />
              <RechartsTooltip
                contentStyle={{
                  backgroundColor: theme.palette.background.paper,
                  borderRadius: 12,
                  border: `1px solid ${theme.palette.divider}`,
                  boxShadow:
                    theme.palette.mode === "dark"
                      ? "0 4px 12px rgba(0, 0, 0, 0.3)"
                      : "0 4px 12px rgba(149, 117, 205, 0.15)",
                }}
              />
              <Area
                type="monotone"
                dataKey="enquiries"
                stroke={theme.palette.primary.main}
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorEnquiries)"
                activeDot={{
                  stroke: theme.palette.background.paper,
                  strokeWidth: 2,
                  r: 6,
                  boxShadow: "0 0 8px rgba(0, 0, 0, 0.2)",
                }}
              />
              <Area
                type="monotone"
                dataKey="applications"
                stroke={theme.palette.secondary.main}
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorApplications)"
                activeDot={{
                  stroke: theme.palette.background.paper,
                  strokeWidth: 2,
                  r: 6,
                  boxShadow: "0 0 8px rgba(0, 0, 0, 0.2)",
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        );
      case "status":
        return (
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={chartData.statusDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) =>
                  `${name}: ${(percent * 100).toFixed(0)}%`
                }
              >
                {chartData.statusDistribution.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                    stroke={theme.palette.background.paper}
                    strokeWidth={2}
                  />
                ))}
              </Pie>
              <RechartsTooltip
                contentStyle={{
                  backgroundColor: theme.palette.background.paper,
                  borderRadius: 12,
                  border: `1px solid ${theme.palette.divider}`,
                  boxShadow:
                    theme.palette.mode === "dark"
                      ? "0 4px 12px rgba(0, 0, 0, 0.3)"
                      : "0 4px 12px rgba(149, 117, 205, 0.15)",
                }}
              />
              <Legend
                verticalAlign="bottom"
                iconType="circle"
                iconSize={10}
                formatter={(value, entry) => (
                  <span
                    style={{ color: theme.palette.text.primary, marginLeft: 4 }}
                  >
                    {value}
                  </span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        );
      case "conversion":
        return (
          <ResponsiveContainer width="100%" height={250}>
            <BarChart
              data={chartData.conversionRates}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke={theme.palette.divider}
              />
              <XAxis
                dataKey="name"
                fontSize={12}
                axisLine={{ stroke: theme.palette.divider }}
                tickLine={{ stroke: theme.palette.divider }}
                tick={{ fill: theme.palette.text.secondary }}
              />
              <YAxis
                fontSize={12}
                domain={[0, 100]}
                axisLine={{ stroke: theme.palette.divider }}
                tickLine={{ stroke: theme.palette.divider }}
                tick={{ fill: theme.palette.text.secondary }}
              />
              <RechartsTooltip
                formatter={(value) => [`${value}%`, "Conversion Rate"]}
                contentStyle={{
                  backgroundColor: theme.palette.background.paper,
                  borderRadius: 12,
                  border: `1px solid ${theme.palette.divider}`,
                  boxShadow:
                    theme.palette.mode === "dark"
                      ? "0 4px 12px rgba(0, 0, 0, 0.3)"
                      : "0 4px 12px rgba(149, 117, 205, 0.15)",
                }}
              />
              <defs>
                <linearGradient
                  id="colorConversion"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor={theme.palette.info.main}
                    stopOpacity={0.9}
                  />
                  <stop
                    offset="95%"
                    stopColor={theme.palette.info.light}
                    stopOpacity={0.6}
                  />
                </linearGradient>
              </defs>
              <Bar
                dataKey="rate"
                fill="url(#colorConversion)"
                radius={[6, 6, 0, 0]}
                barSize={30}
                animationDuration={1500}
              />
            </BarChart>
          </ResponsiveContainer>
        );
      default:
        return null;
    }
  };

  return (
    <Card elevation={0} sx={{ height: "100%" }}>
      <CardHeader
        avatar={
          <Avatar
            sx={{
              bgcolor: theme.palette.info.main,
              boxShadow: `0 4px 8px ${alpha(theme.palette.info.main, 0.25)}`,
            }}
          >
            <EqualizerIcon />
          </Avatar>
        }
        title="Analytics Overview"
        titleTypographyProps={{
          variant: "h6",
          fontWeight: "bold",
          sx: {
            color:
              theme.palette.mode === "dark"
                ? theme.palette.primary.light
                : theme.palette.primary.dark,
          },
        }}
        action={
          <Box
            sx={{
              display: "flex",
              gap: 0.5,
              bgcolor: alpha(theme.palette.background.default, 0.6),
              borderRadius: 3,
              p: 0.5,
            }}
          >
            <Button
              size="small"
              variant={activeChart === "trends" ? "contained" : "text"}
              onClick={() => handleChartChange("trends")}
              sx={{
                minWidth: "auto",
                px: 1.5,
                borderRadius: 2.5,
                fontWeight: "medium",
                boxShadow: activeChart === "trends" ? 2 : "none",
              }}
            >
              Trends
            </Button>
            <Button
              size="small"
              variant={activeChart === "status" ? "contained" : "text"}
              onClick={() => handleChartChange("status")}
              sx={{
                minWidth: "auto",
                px: 1.5,
                borderRadius: 2.5,
                fontWeight: "medium",
                boxShadow: activeChart === "status" ? 2 : "none",
              }}
            >
              Status
            </Button>
            <Button
              size="small"
              variant={activeChart === "conversion" ? "contained" : "text"}
              onClick={() => handleChartChange("conversion")}
              sx={{
                minWidth: "auto",
                px: 1.5,
                borderRadius: 2.5,
                fontWeight: "medium",
                boxShadow: activeChart === "conversion" ? 2 : "none",
              }}
            >
              Conversion
            </Button>
          </Box>
        }
      />
      <CardContent sx={{ pt: 0, pb: 2 }}>{renderChart()}</CardContent>
    </Card>
  );
};

const HomePage = () => {
  const [darkMode, setDarkMode] = useState(false);

  const customTheme = useMemo(
    () => getLavenderTheme(darkMode ? "dark" : "light"),
    [darkMode]
  );

  const authData = useSelector(
    (state) => state.authStore || { userName: "Demo User", user_type: "admin" }
  );

  const [kpiData, setKpiData] = useState({
    newEnquiriesToday: 0,
    applicationsInProgress: 0,
    tasksDueToday: 0,
  });
  const [chartData, setChartData] = useState(generateMockChartData());
  const [userTasks, setUserTasks] = useState([]);
  const [enqData, setEnqData] = useState([]);
  const [appData, setAppData] = useState([]);
  const [msgData, setMsgData] = useState([]);
  const [activityData, setActivityData] = useState([]);

  const [isEnqLoadingData, setIsEnqLoadingData] = useState(true);
  const [isMsgLoadingData, setIsMsgLoadingData] = useState(true);
  const [isAppLoadingData, setIsAppLoadingData] = useState(true);
  const [isActivityLoadingData, setIsActivityLoadingData] = useState(true);
  const [isKpiLoading, setIsKpiLoading] = useState(true);
  const [isTasksLoading, setIsTasksLoading] = useState(true);

  const [throwErr, setThrowErr] = useState(null);

  useEffect(() => {
    if (throwErr) throw throwErr;
  }, [throwErr]);

  const fetchKpiData = useCallback(async () => {
    setIsKpiLoading(true);
    try {
      setTimeout(() => {
        setKpiData({
          newEnquiriesToday: 8,
          applicationsInProgress: 23,
          tasksDueToday: 5,
        });
        setIsKpiLoading(false);
      }, 800);
    } catch (e) {
      setThrowErr({ e, page: "dashboard-kpi" });
      setIsKpiLoading(false);
    }
  }, []);

  const fetchUserTasks = useCallback(async () => {
    setIsTasksLoading(true);
    try {
      setTimeout(() => {
        setUserTasks([
          {
            id: 1,
            title: "Follow up with John Doe about visa application",
            dueDate: "2025-05-17",
            completed: false,
          },
          {
            id: 2,
            title: "Prepare application documents for Jane Smith",
            dueDate: "2025-05-15",
            completed: true,
          },
          {
            id: 3,
            title: "Call University of London about admission status",
            dueDate: "2025-05-16",
            completed: false,
          },
          {
            id: 4,
            title: "Submit progress report for Q2",
            dueDate: "2025-05-20",
            completed: false,
          },
        ]);
        setIsTasksLoading(false);
      }, 1000);
    } catch (e) {
      setThrowErr({ e, page: "dashboard-tasks" });
      setIsTasksLoading(false);
    }
  }, []);

  const getEnqData = useCallback(async () => {
    setIsEnqLoadingData(true);
    try {
      const response = await ajaxCallWithHeaderOnly(
        `enquiries/?ordering=-date_created&p=1&records=5`,
        { Authorization: `Bearer ${authData.accessToken}` },
        "GET",
        null
      );
      if (response?.isNetwork || response?.status === 401) {
        setThrowErr({ ...response, page: "dashboard-enquiries" });
        return;
      }
      if (response?.results) {
        setEnqData(response.results);
      } else {
        setEnqData([]);
      }
    } catch (e) {
      setThrowErr({ e, page: "dashboard-enquiries" });
    } finally {
      setIsEnqLoadingData(false);
    }
  }, [authData.accessToken]);

  const getAppData = useCallback(async () => {
    setIsAppLoadingData(true);
    try {
      const response = await ajaxCallWithHeaderOnly(
        `get/courseinfo/?ordering=-created_at&p=1&records=5`,
        { Authorization: `Bearer ${authData.accessToken}` },
        "GET",
        null
      );
      if (response?.isNetwork || response?.status === 401) {
        setThrowErr({ ...response, page: "dashboard-applications" });
        return;
      }
      if (response?.results) {
        setAppData(response.results);
      } else {
        setAppData([]);
      }
    } catch (e) {
      setThrowErr({ e, page: "dashboard-applications" });
    } finally {
      setIsAppLoadingData(false);
    }
  }, [authData.accessToken]);

  const getActivityData = useCallback(async () => {
    setIsActivityLoadingData(true);
    try {
      const response = await ajaxCallWithHeaderOnly(
        `recent-actions`,
        { Authorization: `Bearer ${authData.accessToken}` },
        "GET",
        null
      );
      if (response?.isNetwork || response?.status === 401) {
        setThrowErr({ ...response, page: "dashboard-activity" });
        return;
      }
      if (response?.length) {
        setActivityData(response);
      } else {
        setActivityData([]);
      }
    } catch (e) {
      setThrowErr({ e, page: "dashboard-activity" });
    } finally {
      setIsActivityLoadingData(false);
    }
  }, [authData.accessToken]);

  const getMsgData = useCallback(async () => {
    setIsMsgLoadingData(true);
    try {
      const response = await ajaxCallWithHeaderOnly(
        `broadcast-message`,
        { Authorization: `Bearer ${authData.accessToken}` },
        "GET",
        null
      );
      if (response?.isNetwork || response?.status === 401) {
        setThrowErr({ ...response, page: "dashboard-messages" });
        return;
      }
      if (response?.length) {
        setMsgData(response);
      } else {
        setMsgData([]);
      }
    } catch (e) {
      setThrowErr({ e, page: "dashboard-messages" });
    } finally {
      setIsMsgLoadingData(false);
    }
  }, [authData.accessToken]);

  useEffect(() => {
    fetchKpiData();
    fetchUserTasks();
    if (authData.user_type !== "staff") {
      getEnqData();
    }
    getAppData();
    getActivityData();
    getMsgData();

    setChartData(generateMockChartData());
  }, [
    authData.user_type,
    fetchKpiData,
    fetchUserTasks,
    getEnqData,
    getAppData,
    getActivityData,
    getMsgData,
  ]);

  return (
    <ThemeProvider theme={customTheme}>
      <CssBaseline />
      <Box
        sx={{
          flexGrow: 1,
          p: { xs: 2, sm: 3, md: 4 },
          minHeight: "100vh",
          bgcolor: "background.default",
          color: "text.primary",
          transition: "all 0.3s ease",
          backgroundImage: darkMode
            ? "radial-gradient(rgba(149, 117, 205, 0.08) 2px, transparent 0)"
            : "radial-gradient(rgba(149, 117, 205, 0.1) 2px, transparent 0)",
          backgroundSize: "24px 24px",
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 3 }}>
          <ThemeToggle darkMode={darkMode} setDarkMode={setDarkMode} />
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12}>
            <WelcomeBanner
              userName={authData.userName || "User"}
              darkMode={darkMode}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <EnhancedKPICard
              title="New Enquiries"
              value={
                isKpiLoading ? (
                  <CircularProgress size={24} />
                ) : (
                  kpiData.newEnquiriesToday
                )
              }
              icon={<HelpOutlineIcon />}
              trend="+3 since yesterday"
              color={customTheme.palette.primary.main}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <EnhancedKPICard
              title="Applications In Progress"
              value={
                isKpiLoading ? (
                  <CircularProgress size={24} />
                ) : (
                  kpiData.applicationsInProgress
                )
              }
              icon={<LoopIcon />}
              color={customTheme.palette.secondary.main}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <EnhancedKPICard
              title="Tasks Due Today"
              value={
                isKpiLoading ? (
                  <CircularProgress size={24} />
                ) : (
                  kpiData.tasksDueToday
                )
              }
              icon={<AssignmentIcon />}
              trend="+2 since yesterday"
              color={customTheme.palette.error.main}
            />
          </Grid>

          <Grid item xs={12}>
            <AnalyticsSection chartData={chartData} />
          </Grid>

          <Grid item xs={12} md={authData.user_type === "staff" ? 12 : 8}>
            {authData.user_type !== "staff" && <QuickActionsPanel />}
          </Grid>
          {authData.user_type !== "staff" && (
            <Grid item xs={12} md={4}>
              <EnhancedBroadcastMessages
                messages={msgData}
                isLoading={isMsgLoadingData}
              />
            </Grid>
          )}

          <Grid item xs={12} lg={authData.user_type === "staff" ? 12 : 8}>
            <EnhancedActivityFeed
              activities={activityData}
              isLoading={isActivityLoadingData}
            />
          </Grid>
          {authData.user_type !== "staff" && (
            <Grid item xs={12} lg={4}>
              <EnhancedTaskList tasks={userTasks} isLoading={isTasksLoading} />
            </Grid>
          )}

          {authData.user_type !== "staff" && (
            <Grid item xs={12} md={6}>
              <EnhancedRecentItemsList
                title="Recent Enquiries"
                items={enqData}
                isLoading={isEnqLoadingData}
                itemType="Enquiry"
              />
            </Grid>
          )}
          <Grid item xs={12} md={authData.user_type === "staff" ? 12 : 6}>
            <EnhancedRecentItemsList
              title="Recent Applications"
              items={appData}
              isLoading={isAppLoadingData}
              itemType="Application"
            />
          </Grid>
        </Grid>
      </Box>
    </ThemeProvider>
  );
};

export default HomePage;
