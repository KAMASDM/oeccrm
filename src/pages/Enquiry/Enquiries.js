import React, { useState, useEffect, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import {
  Box,
  Grid,
  Typography,
  Button,
  IconButton,
  CircularProgress,
  TextField,
  InputAdornment,
  Card,
  CardContent,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Tooltip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  FormControlLabel,
  Checkbox,
  Menu,
  Zoom,
  Badge,
  LinearProgress,
  CssBaseline,
  Avatar,
  Paper,
  ThemeProvider,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import HomeIcon from "@mui/icons-material/Home";
import AssignmentIcon from "@mui/icons-material/Assignment";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import FlagIcon from "@mui/icons-material/Flag";
import CloseIcon from "@mui/icons-material/Close";
import RefreshIcon from "@mui/icons-material/Refresh";
import WarningIcon from "@mui/icons-material/Warning";
import CommentIcon from "@mui/icons-material/Comment";
import { motion } from "framer-motion";
import {
  ajaxCallWithHeaderOnly,
  ajaxCallWithoutBody,
} from "../../helpers/ajaxCall";
import { uiAction } from "../../store/uiStore";
import { enqAction } from "../../store/EnqColumns";
import CommentPopup from "../../components/enq/CommentPopup";
import lavenderTheme from "../../theme";

// Status Chip Component
const StatusChip = ({ status }) => {
  let color = "default";

  // Convert to lowercase for case-insensitive comparison
  const statusLower = status?.toLowerCase() || "";

  if (statusLower.includes("new") || statusLower.includes("pending")) {
    color = "warning";
  } else if (statusLower.includes("progress")) {
    color = "info";
  } else if (
    statusLower.includes("complete") ||
    statusLower.includes("approved")
  ) {
    color = "success";
  } else if (statusLower.includes("hold") || statusLower.includes("rejected")) {
    color = "error";
  }

  return (
    <Chip
      label={status}
      color={color}
      size="small"
      sx={{
        fontWeight: "medium",
        boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
      }}
    />
  );
};

const Enquiries = () => {
  const [enqData, setEnqData] = useState([]);
  const [allEnq, setAllEnq] = useState(true);
  const [refreshNeeded, setRefresherNeeded] = useState(true);
  const [assignUsrData, setAssignUsrData] = useState([]);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [showCommentPopup, setShowCommentPopup] = useState({
    show: false,
    enqId: null,
    name: null,
  });

  const [promptStatus, setPromptStatus] = useState(false);
  const deleteEntryDetails = useRef({});

  const [searchText, setSearchText] = useState("");
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  const [columnFilterAnchorEl, setColumnFilterAnchorEl] = useState(null);
  const [enqFilter, setEnqFilter] = useState({
    university_interested: null,
    level_applying_for: null,
    intake_interested: null,
    enquiry_status: null,
    assigned_usr: null,
  });

  const [universities, setUniversities] = useState([]);
  const [levels, setLevels] = useState([]);
  const [intakes, setIntakes] = useState([]);
  const [statuses, setStatuses] = useState([]);

  const [pageNo, setPageNo] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [totalRows, setTotalRows] = useState(0);

  const authData = useSelector((state) => state.authStore);
  const columnData = useSelector((store) => store.enqColumn);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [throwErr, setThrowErr] = useState(null);

  useEffect(() => {
    if (throwErr) throw throwErr;
  }, [throwErr]);

  const handleChangePage = (event, newPage) => {
    setPageNo(newPage + 1);
    setEnqData([]);
    setRefresherNeeded(true);
  };

  const handleChangeRowsPerPage = (event) => {
    setPerPage(parseInt(event.target.value, 10));
    setPageNo(1);
    setEnqData([]);
    setRefresherNeeded(true);
  };

  const handleFilterOpen = (event) => {
    setFilterAnchorEl(event.currentTarget);
  };

  const handleFilterClose = () => {
    setFilterAnchorEl(null);
  };

  const handleColumnFilterOpen = (event) => {
    setColumnFilterAnchorEl(event.currentTarget);
  };

  const handleColumnFilterClose = () => {
    setColumnFilterAnchorEl(null);
  };

  const promptDelete = (student_name, deleteId) => {
    setPromptStatus(true);
    deleteEntryDetails.current = { name: student_name, id: deleteId };
  };

  const deleteEnquiry = async (deleteId) => {
    try {
      setSearchText("");
      setIsLoadingData(true);
      const response = await ajaxCallWithoutBody(
        `update-enquiry/${deleteId}/`,
        {
          Authorization: `Bearer ${authData.accessToken}`,
        },
        "DELETE"
      );

      if (response !== true) {
        setThrowErr({ ...response, page: "enquiries" });
        return;
      }

      dispatch(
        uiAction.setNotification({
          show: true,
          heading: "Enquiry Deleted Successfully",
          msg: `<strong>${deleteEntryDetails.current.name}</strong> enquiry deleted successfully`,
        })
      );

      deleteEntryDetails.current = {};
      setEnqData([]);
      setRefresherNeeded(true);
      setPageNo(1);
      setIsLoadingData(false);
    } catch (e) {
      setThrowErr({ e, page: "enquiries" });
      setIsLoadingData(false);
      return;
    }
  };

  const fetchDropdownData = useCallback(async () => {
    try {
      const univResponse = await ajaxCallWithHeaderOnly("universities/", {
        Authorization: `Bearer ${authData.accessToken}`,
      });

      if (univResponse?.length) {
        setUniversities(
          univResponse.map((uni) => ({
            value: uni.id,
            name: uni.univ_name,
          }))
        );
      }

      const levelResponse = await ajaxCallWithHeaderOnly(
        "level-applying-for/",
        { Authorization: `Bearer ${authData.accessToken}` }
      );

      if (levelResponse?.length) {
        setLevels(
          levelResponse.map((level) => ({
            value: level.id,
            name: level.levels,
          }))
        );
      }

      const intakeResponse = await ajaxCallWithHeaderOnly(
        "intake-month-year/",
        { Authorization: `Bearer ${authData.accessToken}` }
      );

      if (intakeResponse?.length) {
        setIntakes(
          intakeResponse.map((intake) => ({
            value: intake.id,
            name: `${intake.intake_month} ${intake.intake_year}`,
          }))
        );
      }

      const statusResponse = await ajaxCallWithHeaderOnly("enquiry-status/", {
        Authorization: `Bearer ${authData.accessToken}`,
      });

      if (statusResponse?.length) {
        setStatuses(
          statusResponse.map((status) => ({
            value: status.id,
            name: status.status,
          }))
        );
      }
    } catch (e) {
      setThrowErr({ e, page: "enquiries" });
    }
  }, [authData.accessToken]);

  const getAssignUsrData = useCallback(async () => {
    try {
      const response = await ajaxCallWithHeaderOnly("userlist/", {
        Authorization: `Bearer ${authData.accessToken}`,
      });

      if (response?.isNetwork) {
        setThrowErr({ ...response, page: "enquiries" });
        return;
      }

      if (response?.status === 401) {
        setThrowErr({ ...response, page: "enquiries" });
        return;
      }

      if (!response?.length) {
        setThrowErr({ ...response, page: "enquiries" });
        return;
      }

      setAssignUsrData(
        response.map((option) => ({
          value: option.id,
          name: option.username,
        }))
      );
    } catch (e) {
      setThrowErr({ e, page: "enquiries" });
    }
  }, [authData.accessToken]);

  const getEnqDTData = useCallback(
    async (url) => {
      setIsLoadingData(true);

      try {
        const response = await ajaxCallWithHeaderOnly(url, {
          Authorization: `Bearer ${authData.accessToken}`,
        });

        if (response?.isNetwork) {
          setThrowErr({ ...response, page: "enquiries" });
          return;
        }

        if (response?.status === 401) {
          setThrowErr({ ...response, page: "enquiries" });
          return;
        }

        if (response?.results?.length > 0) {
          const data = response.results.map((data) => {
            return {
              ...data,
              date_created: data?.date_created.split("-").reverse().join("-"),
              added_by: data?.added_by?.username,
              intake_interested: data?.intake_interested?.intake_month
                ? `${data?.intake_interested?.intake_month} ${data?.intake_interested?.intake_year}`
                : "",
              assigned_users: data?.assigned_users?.username
                ? data?.assigned_users?.username
                : "-",
              assigned_usersId: data?.assigned_users?.id,
              country_interested: data?.country_interested?.country_name,
              course_interested: data?.course_interested?.course_name,
              current_education: data?.current_education?.current_education,
              current_educationId: data?.current_education?.id,
              enquiry_status: data?.enquiry_status?.status,
              level_applying_for: data?.level_applying_for?.levels,
              university_interested: data?.university_interested?.univ_name,
            };
          });

          if (data?.length) setEnqData(data);
          setTotalRows(response.count);
        } else {
          setEnqData([]);
        }

        setIsLoadingData(false);
        setRefresherNeeded(false);
      } catch (e) {
        setThrowErr({ e, page: "enquiries" });
        setIsLoadingData(false);
        return;
      }
    },
    [authData.accessToken]
  );

  useEffect(() => {
    if (refreshNeeded) {
      let url = `enquiries/?ordering=-date_created&p=${pageNo}&records=${perPage}`;

      url += enqFilter.university_interested
        ? `&university_interested=${enqFilter.university_interested}`
        : "";
      url += enqFilter.level_applying_for
        ? `&level_applying_for=${enqFilter.level_applying_for}`
        : "";
      url += enqFilter.intake_interested
        ? `&intake_interested=${enqFilter.intake_interested}`
        : "";
      url += enqFilter.enquiry_status
        ? `&enquiry_status=${enqFilter.enquiry_status}`
        : "";
      url += enqFilter.assigned_usr
        ? `&assigned_users=${enqFilter.assigned_usr}`
        : "";

      url +=
        authData.user_type === "superuser"
          ? !allEnq
            ? "&assigned_usersf=1"
            : ""
          : "";

      try {
        getEnqDTData(url);
      } catch (e) {
        setThrowErr({ e, page: "enquiries" });
        return;
      }

      setRefresherNeeded(false);
    }
  }, [
    enqFilter,
    refreshNeeded,
    allEnq,
    pageNo,
    perPage,
    authData.user_type,
    getEnqDTData,
  ]);

  useEffect(() => {
    fetchDropdownData();
  }, [fetchDropdownData]);

  useEffect(() => {
    if (enqData.length && !assignUsrData.length) {
      getAssignUsrData();
    }
  }, [enqData, assignUsrData.length, getAssignUsrData]);

  // Handle filter changes
  const filterSelectionChanged = (filterName, val) => {
    setEnqFilter((oldFilter) => {
      // copying object
      const filterData = JSON.parse(JSON.stringify(oldFilter));
      filterData[filterName] = val;
      return filterData;
    });

    setRefresherNeeded(true);
    setPageNo(1);
  };

  // Search enquiries
  const searchEnq = (e) => {
    try {
      e.preventDefault();
      if (searchText?.length) {
        const partURL =
          authData.user_type === "superuser"
            ? !allEnq
              ? "&assigned_usersf=1"
              : ""
            : "";

        setIsLoadingData(true);
        setPageNo(1);
        let url = `enquiries/?ordering=-date_created&search=${searchText}${partURL}`;
        getEnqDTData(url);
      }
    } catch (e) {
      setThrowErr({ e, page: "enquiries" });
      return;
    }
  };

  // Clear filters
  const clearFilter = () => {
    setEnqFilter({
      university_interested: null,
      level_applying_for: null,
      intake_interested: null,
      enquiry_status: null,
      assigned_usr: null,
    });

    setEnqData([]);
    setPageNo(1);
    setRefresherNeeded(true);
  };

  // Clear search
  const clearSearch = () => {
    if (searchText?.length) {
      setEnqData([]);
      setRefresherNeeded(true);
      setPageNo(1);
    }

    setSearchText("");
  };

  // Toggle column visibility
  const toggleColumnVisibility = (column) => {
    dispatch(enqAction.setEnqColumnStatus({ key: column }));
  };

  // Check if any filter is active
  const hasActiveFilters = () => {
    return (
      enqFilter.university_interested ||
      enqFilter.level_applying_for ||
      enqFilter.intake_interested ||
      enqFilter.enquiry_status ||
      enqFilter.assigned_usr
    );
  };

  const ActiveFiltersCard = () => {
    if (!hasActiveFilters()) return null;

    return (
      <Box
        component={motion.div}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        sx={{ mb: 2 }}
      >
        <Card elevation={0} sx={{ p: 2 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 1,
            }}
          >
            <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
              Active Filters:
            </Typography>

            {enqFilter.university_interested && (
              <Chip
                label={`University: ${
                  universities.find(
                    (u) => u.value === enqFilter.university_interested
                  )?.name || "Selected"
                }`}
                size="small"
                onDelete={() =>
                  filterSelectionChanged("university_interested", null)
                }
                sx={{
                  bgcolor: lavenderTheme.palette.primary.light, // Using actual color from theme
                  "& .MuiChip-deleteIcon": {
                    color: lavenderTheme.palette.primary.main,
                  },
                }}
              />
            )}

            {enqFilter.level_applying_for && (
              <Chip
                label={`Level: ${
                  levels.find((l) => l.value === enqFilter.level_applying_for)
                    ?.name || "Selected"
                }`}
                size="small"
                onDelete={() =>
                  filterSelectionChanged("level_applying_for", null)
                }
                sx={{
                  bgcolor: lavenderTheme.palette.info.light, // Using actual color from theme
                  "& .MuiChip-deleteIcon": {
                    color: lavenderTheme.palette.info.main,
                  },
                }}
              />
            )}

            {enqFilter.intake_interested && (
              <Chip
                label={`Intake: ${
                  intakes.find((i) => i.value === enqFilter.intake_interested)
                    ?.name || "Selected"
                }`}
                size="small"
                onDelete={() =>
                  filterSelectionChanged("intake_interested", null)
                }
                sx={{
                  bgcolor: lavenderTheme.palette.warning.light, // Using actual color from theme
                  "& .MuiChip-deleteIcon": {
                    color: lavenderTheme.palette.warning.main,
                  },
                }}
              />
            )}

            {enqFilter.enquiry_status && (
              <Chip
                label={`Status: ${
                  statuses.find((s) => s.value === enqFilter.enquiry_status)
                    ?.name || "Selected"
                }`}
                size="small"
                onDelete={() => filterSelectionChanged("enquiry_status", null)}
                sx={{
                  bgcolor: lavenderTheme.palette.success.light, // Using actual color from theme
                  "& .MuiChip-deleteIcon": {
                    color: lavenderTheme.palette.success.main,
                  },
                }}
              />
            )}

            {enqFilter.assigned_usr && (
              <Chip
                label={`Assigned To: ${
                  assignUsrData.find((u) => u.value === enqFilter.assigned_usr)
                    ?.name || "Selected"
                }`}
                size="small"
                onDelete={() => filterSelectionChanged("assigned_usr", null)}
                sx={{
                  bgcolor: lavenderTheme.palette.secondary.light, // Using actual color from theme
                  "& .MuiChip-deleteIcon": {
                    color: lavenderTheme.palette.secondary.main,
                  },
                }}
              />
            )}

            <Button
              size="small"
              onClick={clearFilter}
              startIcon={<RefreshIcon fontSize="small" />}
              sx={{ ml: "auto" }}
            >
              Clear All
            </Button>
          </Box>
        </Card>
      </Box>
    );
  };

  return (
    <ThemeProvider theme={lavenderTheme}>
      <CssBaseline />
      <Box
        sx={{
          flexGrow: 1,
          p: { xs: 2, sm: 3, md: 4 },
          bgcolor: "background.default",
          color: "text.primary",
          transition: "all 0.3s ease",
          backgroundImage: `radial-gradient(${lavenderTheme.palette.primary.light}20 2px, transparent 0)`, // Using customTheme directly
          backgroundSize: "24px 24px",
          borderRadius: "24px",
        }}
      >
        <Card
          elevation={0}
          component={motion.div}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          sx={{ mb: 3 }}
        >
          <CardContent sx={{ p: { xs: 2, md: 3 } }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={6}>
                <form onSubmit={searchEnq}>
                  <TextField
                    fullWidth
                    placeholder="Search by name, email or phone..."
                    value={searchText}
                    onChange={(e) => {
                      setSearchText(e.target.value);
                      if (!e.target.value?.length) {
                        setRefresherNeeded(true);
                      }
                    }}
                    variant="outlined"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon />
                        </InputAdornment>
                      ),
                      endAdornment: searchText && (
                        <InputAdornment position="end">
                          <IconButton size="small" onClick={clearSearch}>
                            <CloseIcon fontSize="small" />
                          </IconButton>
                        </InputAdornment>
                      ),
                      sx: {
                        borderRadius: 3,
                        bgcolor: lavenderTheme.palette.background.default, // Using actual color from theme
                      },
                    }}
                  />
                </form>
              </Grid>

              <Grid
                item
                xs={12}
                md={6}
                sx={{
                  display: "flex",
                  justifyContent: { xs: "flex-start", md: "flex-end" },
                  gap: 1,
                }}
              >
                <Button
                  variant="outlined"
                  startIcon={<FilterListIcon />}
                  onClick={handleFilterOpen}
                  aria-controls="filter-menu"
                  aria-haspopup="true"
                  sx={{
                    borderRadius: 3,
                    borderColor: lavenderTheme.palette.primary.light, // Using actual color from theme
                    bgcolor: hasActiveFilters()
                      ? lavenderTheme.palette.primary.light // Using actual color from theme
                      : "transparent",
                  }}
                >
                  {hasActiveFilters() ? (
                    <Badge
                      color="primary"
                      variant="dot"
                      sx={{ "& .MuiBadge-dot": { right: -2, top: 3 } }}
                    >
                      Filters
                    </Badge>
                  ) : (
                    "Filters"
                  )}
                </Button>

                <Menu
                  id="filter-menu"
                  anchorEl={filterAnchorEl}
                  keepMounted
                  open={Boolean(filterAnchorEl)}
                  onClose={handleFilterClose}
                  PaperProps={{
                    elevation: 3,
                    sx: {
                      mt: 1.5,
                      width: 280,
                      borderRadius: 3,
                      padding: 2,
                      overflow: "visible",
                      boxShadow: `0 8px 20px ${lavenderTheme.palette.primary.main}30`,
                      border: `1px solid ${lavenderTheme.palette.primary.light}10`,
                    },
                  }}
                  transformOrigin={{ horizontal: "right", vertical: "top" }}
                  anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                >
                  <Typography variant="subtitle2" sx={{ mb: 2, px: 1 }}>
                    Filter Enquiries
                  </Typography>

                  <FormControl fullWidth sx={{ mb: 2.5 }}>
                    <InputLabel id="university-filter-label">
                      University
                    </InputLabel>
                    <Select
                      labelId="university-filter-label"
                      value={enqFilter.university_interested || ""}
                      label="University"
                      onChange={(e) =>
                        filterSelectionChanged(
                          "university_interested",
                          e.target.value
                        )
                      }
                      sx={{ borderRadius: 3 }}
                    >
                      <MenuItem value="">All Universities</MenuItem>
                      {universities.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <FormControl fullWidth sx={{ mb: 2.5 }}>
                    <InputLabel id="level-filter-label">Level</InputLabel>
                    <Select
                      labelId="level-filter-label"
                      value={enqFilter.level_applying_for || ""}
                      label="Level"
                      onChange={(e) =>
                        filterSelectionChanged(
                          "level_applying_for",
                          e.target.value
                        )
                      }
                      sx={{ borderRadius: 3 }}
                    >
                      <MenuItem value="">All Levels</MenuItem>
                      {levels.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <FormControl fullWidth sx={{ mb: 2.5 }}>
                    <InputLabel id="intake-filter-label">Intake</InputLabel>
                    <Select
                      labelId="intake-filter-label"
                      value={enqFilter.intake_interested || ""}
                      label="Intake"
                      onChange={(e) =>
                        filterSelectionChanged(
                          "intake_interested",
                          e.target.value
                        )
                      }
                      sx={{ borderRadius: 3 }}
                    >
                      <MenuItem value="">All Intakes</MenuItem>
                      {intakes.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <FormControl fullWidth sx={{ mb: 2.5 }}>
                    <InputLabel id="status-filter-label">Status</InputLabel>
                    <Select
                      labelId="status-filter-label"
                      value={enqFilter.enquiry_status || ""}
                      label="Status"
                      onChange={(e) =>
                        filterSelectionChanged("enquiry_status", e.target.value)
                      }
                      sx={{ borderRadius: 3 }}
                    >
                      <MenuItem value="">All Statuses</MenuItem>
                      {statuses.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <FormControl fullWidth sx={{ mb: 2.5 }}>
                    <InputLabel id="assigned-filter-label">
                      Assigned To
                    </InputLabel>
                    <Select
                      labelId="assigned-filter-label"
                      value={enqFilter.assigned_usr || ""}
                      label="Assigned To"
                      onChange={(e) =>
                        filterSelectionChanged("assigned_usr", e.target.value)
                      }
                      sx={{ borderRadius: 3 }}
                    >
                      <MenuItem value="">All Users</MenuItem>
                      {assignUsrData.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  {authData.user_type === "superuser" && (
                    <FormControlLabel
                      control={
                        <Checkbox // Changed from Switch to Checkbox for consistency and clarity in filter menu
                          checked={!allEnq}
                          onChange={() => {
                            setAllEnq(!allEnq);
                            setEnqData([]);
                            setRefresherNeeded(true);
                          }}
                          color="primary"
                        />
                      }
                      label="Show only enquiries assigned to me"
                      sx={{
                        display: "block",
                        mx: 0,
                        mb: 1,
                      }}
                    />
                  )}

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mt: 2,
                    }}
                  >
                    <Button
                      size="small"
                      onClick={clearFilter}
                      color="inherit"
                      sx={{ textTransform: "none" }}
                    >
                      Clear All
                    </Button>
                    <Button
                      size="small"
                      onClick={handleFilterClose}
                      variant="contained"
                      color="primary"
                      sx={{ textTransform: "none" }}
                    >
                      Apply Filters
                    </Button>
                  </Box>
                </Menu>

                <Button
                  variant="outlined"
                  startIcon={<VisibilityIcon />}
                  onClick={handleColumnFilterOpen}
                  aria-controls="column-menu"
                  aria-haspopup="true"
                  sx={{
                    borderRadius: 3,
                    borderColor: lavenderTheme.palette.primary.light, // Using actual color from theme
                  }}
                >
                  Columns
                </Button>

                <Menu
                  id="column-menu"
                  anchorEl={columnFilterAnchorEl}
                  keepMounted
                  open={Boolean(columnFilterAnchorEl)}
                  onClose={handleColumnFilterClose}
                  PaperProps={{
                    elevation: 3,
                    sx: {
                      mt: 1.5,
                      width: 200,
                      borderRadius: 3,
                      padding: 2,
                      boxShadow: `0 8px 20px ${lavenderTheme.palette.primary.main}30`,
                      border: `1px solid ${lavenderTheme.palette.primary.light}10`,
                    },
                  }}
                  transformOrigin={{ horizontal: "right", vertical: "top" }}
                  anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                >
                  <Typography variant="subtitle2" sx={{ mb: 2, px: 1 }}>
                    Show/Hide Columns
                  </Typography>

                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={!columnData.name}
                        onChange={() => toggleColumnVisibility("name")}
                        color="primary"
                      />
                    }
                    label="Student Name"
                    sx={{
                      display: "block",
                      mx: 0,
                      mb: 1,
                    }}
                  />

                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={!columnData.phone}
                        onChange={() => toggleColumnVisibility("phone")}
                        color="primary"
                      />
                    }
                    label="Phone Number"
                    sx={{
                      display: "block",
                      mx: 0,
                      mb: 1,
                    }}
                  />

                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={!columnData.email}
                        onChange={() => toggleColumnVisibility("email")}
                        color="primary"
                      />
                    }
                    label="Email Address"
                    sx={{
                      display: "block",
                      mx: 0,
                      mb: 1,
                    }}
                  />

                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={!columnData.current_edu}
                        onChange={() => toggleColumnVisibility("current_edu")}
                        color="primary"
                      />
                    }
                    label="Education"
                    sx={{
                      display: "block",
                      mx: 0,
                      mb: 1,
                    }}
                  />

                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={!columnData.country_interested}
                        onChange={() =>
                          toggleColumnVisibility("country_interested")
                        }
                        color="primary"
                      />
                    }
                    label="Country"
                    sx={{
                      display: "block",
                      mx: 0,
                      mb: 1,
                    }}
                  />

                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={!columnData.date}
                        onChange={() => toggleColumnVisibility("date")}
                        color="primary"
                      />
                    }
                    label="Enquiry Date"
                    sx={{
                      display: "block",
                      mx: 0,
                      mb: 1,
                    }}
                  />

                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={!columnData.added_by}
                        onChange={() => toggleColumnVisibility("added_by")}
                        color="primary"
                      />
                    }
                    label="Added By"
                    sx={{
                      display: "block",
                      mx: 0,
                      mb: 1,
                    }}
                  />

                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={!columnData.notes}
                        onChange={() => toggleColumnVisibility("notes")}
                        color="primary"
                      />
                    }
                    label="Notes"
                    sx={{
                      display: "block",
                      mx: 0,
                      mb: 1,
                    }}
                  />
                </Menu>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        <ActiveFiltersCard />

        <Card
          elevation={0}
          component={motion.div}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {isLoadingData && <LinearProgress color="secondary" />}

          <Box sx={{ position: "relative" }}>
            <TableContainer component={Paper} elevation={0}>
              <Table sx={{ minWidth: 850 }} aria-label="enquiries table">
                <TableHead>
                  <TableRow>
                    <TableCell>Actions</TableCell>
                    {!columnData.name && <TableCell>Student Name</TableCell>}
                    {!columnData.phone && <TableCell>Phone</TableCell>}
                    {!columnData.email && <TableCell>Email</TableCell>}
                    {!columnData.current_edu && (
                      <TableCell>Current Education</TableCell>
                    )}
                    {!columnData.country_interested && (
                      <TableCell>Country</TableCell>
                    )}
                    {!columnData.date && <TableCell>Enquiry Date</TableCell>}
                    {!columnData.added_by && <TableCell>Added By</TableCell>}
                    {!columnData.notes && <TableCell>Notes</TableCell>}
                    <TableCell align="center">Status</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {enqData.length > 0 ? (
                    enqData.map((row, index) => (
                      <TableRow
                        key={row.id}
                        hover
                        component={motion.tr}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        sx={{ cursor: "pointer" }}
                      >
                        <TableCell>
                          <Box sx={{ display: "flex", gap: 1 }}>
                            {row.application_id ? (
                              <Tooltip
                                title="Go To Dashboard"
                                arrow
                                TransitionComponent={Zoom}
                              >
                                <IconButton
                                  size="small"
                                  component={RouterLink}
                                  to={`/student/${row.id}`}
                                  sx={{
                                    bgcolor: lavenderTheme.palette.info.light, // Using actual color from theme
                                    color: lavenderTheme.palette.info.main,
                                  }}
                                >
                                  <HomeIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            ) : (
                              <Tooltip
                                title="Create Application"
                                arrow
                                TransitionComponent={Zoom}
                              >
                                <IconButton
                                  size="small"
                                  component={RouterLink}
                                  to={`/application/create/${row.id}`}
                                  sx={{
                                    bgcolor: lavenderTheme.palette.info.light, // Using actual color from theme
                                    color: lavenderTheme.palette.info.main,
                                  }}
                                >
                                  <AssignmentIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            )}

                            <Tooltip
                              title="Edit Enquiry"
                              arrow
                              TransitionComponent={Zoom}
                            >
                              <IconButton
                                size="small"
                                onClick={() =>
                                  navigate(`/enquiry/edit/${row.id}`)
                                }
                                sx={{
                                  bgcolor: lavenderTheme.palette.primary.light, // Using actual color from theme
                                  color: lavenderTheme.palette.primary.main,
                                }}
                              >
                                <EditIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>

                            <Tooltip
                              title="Delete Enquiry"
                              arrow
                              TransitionComponent={Zoom}
                            >
                              <IconButton
                                size="small"
                                onClick={() =>
                                  promptDelete(row.student_name, row.id)
                                }
                                sx={{
                                  bgcolor: lavenderTheme.palette.error.light, // Using actual color from theme
                                  color: lavenderTheme.palette.error.main,
                                }}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>

                            <Tooltip
                              title="Add Comment"
                              arrow
                              TransitionComponent={Zoom}
                            >
                              <IconButton
                                size="small"
                                onClick={() =>
                                  setShowCommentPopup({
                                    show: true,
                                    enqId: row.id,
                                    name: row.student_name,
                                  })
                                }
                                sx={{
                                  bgcolor: lavenderTheme.palette.warning.light, // Using actual color from theme
                                  color: lavenderTheme.palette.warning.main,
                                }}
                              >
                                <CommentIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </TableCell>

                        {!columnData.name && (
                          <TableCell>
                            <Box sx={{ display: "flex", alignItems: "center" }}>
                              <Avatar
                                sx={{
                                  width: 32,
                                  height: 32,
                                  mr: 1.5,
                                  bgcolor: lavenderTheme.palette.primary.light, // Using actual color from theme
                                  color: lavenderTheme.palette.primary.main,
                                }}
                              >
                                {row.student_name.charAt(0)}
                              </Avatar>
                              <Typography variant="body2" fontWeight="medium">
                                {row.student_name}
                              </Typography>
                            </Box>
                          </TableCell>
                        )}

                        {!columnData.phone && (
                          <TableCell>
                            <Box sx={{ display: "flex", alignItems: "center" }}>
                              <PhoneIcon
                                fontSize="small"
                                sx={{ mr: 0.75, opacity: 0.7 }}
                              />
                              {row.student_phone}
                            </Box>
                          </TableCell>
                        )}

                        {!columnData.email && (
                          <TableCell>
                            <Box sx={{ display: "flex", alignItems: "center" }}>
                              <EmailIcon
                                fontSize="small"
                                sx={{ mr: 0.75, opacity: 0.7 }}
                              />
                              {row.student_email}
                            </Box>
                          </TableCell>
                        )}

                        {!columnData.current_edu && (
                          <TableCell>{row.current_education}</TableCell>
                        )}

                        {!columnData.country_interested && (
                          <TableCell>
                            <Box sx={{ display: "flex", alignItems: "center" }}>
                              <FlagIcon
                                fontSize="small"
                                sx={{ mr: 0.75, opacity: 0.7 }}
                              />
                              {row.country_interested}
                            </Box>
                          </TableCell>
                        )}

                        {!columnData.date && (
                          <TableCell>
                            <Box sx={{ display: "flex", alignItems: "center" }}>
                              <CalendarTodayIcon
                                fontSize="small"
                                sx={{ mr: 0.75, opacity: 0.7 }}
                              />
                              {row.date_created}
                            </Box>
                          </TableCell>
                        )}

                        {!columnData.added_by && (
                          <TableCell>{row.added_by}</TableCell>
                        )}

                        {!columnData.notes && (
                          <TableCell>
                            <Tooltip
                              title={row.notes || ""}
                              arrow
                              placement="top"
                            >
                              <Typography
                                variant="body2"
                                noWrap
                                sx={{ maxWidth: 200 }}
                              >
                                {row.notes || "-"}
                              </Typography>
                            </Tooltip>
                          </TableCell>
                        )}

                        <TableCell align="center">
                          <StatusChip status={row.enquiry_status || "New"} />
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={12} align="center" sx={{ py: 10 }}>
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            gap: 2,
                          }}
                        >
                          <Avatar
                            sx={{
                              width: 60,
                              height: 60,
                              bgcolor: lavenderTheme.palette.info.light, // Using actual color from theme
                              color: lavenderTheme.palette.info.main,
                              mb: 1,
                            }}
                          >
                            {isLoadingData ? (
                              <CircularProgress size={30} color="inherit" />
                            ) : (
                              <SearchIcon sx={{ fontSize: 30 }} />
                            )}
                          </Avatar>
                          <Typography variant="h6" fontWeight="medium">
                            {isLoadingData
                              ? "Loading enquiries..."
                              : "No enquiries found"}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {isLoadingData
                              ? "Please wait while we fetch the data"
                              : "Try changing your search criteria or clearing the filters"}
                          </Typography>

                          {!isLoadingData &&
                            (hasActiveFilters() || searchText) && (
                              <Button
                                variant="outlined"
                                color="primary"
                                startIcon={<RefreshIcon />}
                                onClick={() => {
                                  clearFilter();
                                  clearSearch();
                                }}
                                sx={{ mt: 1 }}
                              >
                                Clear All Filters
                              </Button>
                            )}
                        </Box>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            <TablePagination
              component="div"
              count={totalRows}
              page={pageNo - 1} // MUI uses 0-based indexing
              rowsPerPage={perPage}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              rowsPerPageOptions={[5, 10, 25, 50, 100]}
              sx={{
                borderTop: "1px solid",
                borderColor: "divider",
              }}
            />
          </Box>
        </Card>

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={promptStatus}
          onClose={() => setPromptStatus(false)}
          PaperProps={{
            elevation: 3,
            sx: {
              borderRadius: 4,
              p: 1,
              maxWidth: 400,
            },
          }}
        >
          <DialogTitle sx={{ pb: 1 }}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Avatar
                sx={{
                  bgcolor: lavenderTheme.palette.error.light, // Using actual color from theme
                  color: lavenderTheme.palette.error.main,
                  mr: 2,
                }}
              >
                <WarningIcon />
              </Avatar>
              <Typography variant="h6">Delete Enquiry</Typography>
            </Box>
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete the enquiry for{" "}
              <strong>{deleteEntryDetails.current.name}</strong>? This action
              cannot be undone.
            </DialogContentText>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3 }}>
            <Button
              onClick={() => setPromptStatus(false)}
              color="inherit"
              sx={{ borderRadius: 10 }}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                deleteEnquiry(deleteEntryDetails.current.id);
                setPromptStatus(false);
              }}
              color="error"
              variant="contained"
              startIcon={<DeleteIcon />}
              sx={{ borderRadius: 10 }}
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>

        {/* Comment Popup */}
        {showCommentPopup.show && (
          <CommentPopup
            id={showCommentPopup.enqId}
            title={showCommentPopup.name}
            onHide={() => {
              setShowCommentPopup({ show: false, enqId: null, name: null });
            }}
          />
        )}
      </Box>
    </ThemeProvider>
  );
};

export default Enquiries;
