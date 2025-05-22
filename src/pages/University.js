import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useSelector } from "react-redux";
import {
  Box,
  Grid,
  TextField,
  Button,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  CircularProgress,
  IconButton,
  ThemeProvider,
  createTheme,
  alpha,
  FormControl,
  InputLabel,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SchoolIcon from "@mui/icons-material/School";
import { ajaxCallWithHeaderOnly } from "../helpers/ajaxCall";
import CourseLists from "../components/University/CourseLists";
import SelectionBox from "../components/UI/Form/SelectionBox";

const getLavenderTheme = (mode) => {
  const lavenderPalette = {
    primary: {
      light: "#c5b0e6",
      main: "#9575cd",
      dark: "#7953b3",
      contrastText: "#fff",
    },
    secondary: {
      light: "#efc0ff",
      main: "#ba68c8",
      dark: "#883997",
      contrastText: "#fff",
    },
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
  const currentTextColors = {
    primary: mode === "dark" ? "#f5f3fa" : "#3f3b5b",
    secondary: mode === "dark" ? "#b8b4d8" : "#69668a",
  };
  return createTheme({
    palette: {
      mode,
      ...lavenderPalette,
      background: {
        default: mode === "dark" ? "#232139" : "#f5f3fa",
        paper: mode === "dark" ? "#2d2a45" : "#ffffff",
      },
      text: currentTextColors,
    },
    shape: { borderRadius: 16 },
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
            padding: "6px 16px",
            "&:hover": {
              transform: "translateY(-1px)",
              boxShadow: `0 4px 10px ${alpha(
                lavenderPalette.primary.main,
                0.25
              )}`,
            },
          },
          contained: {
            boxShadow: `0 2px 6px ${alpha(lavenderPalette.primary.main, 0.2)}`,
          },
          containedPrimary: {
            backgroundColor: lavenderPalette.primary.main,
            color: lavenderPalette.primary.contrastText,
            "&:hover": { backgroundColor: lavenderPalette.primary.dark },
          },
          containedSecondary: {
            backgroundColor: lavenderPalette.secondary.main,
            color: lavenderPalette.secondary.contrastText,
            "&:hover": { backgroundColor: lavenderPalette.secondary.dark },
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: { borderRadius: 20 },
          elevation1: {
            boxShadow:
              mode === "dark"
                ? "0 10px 20px rgba(0,0,0,0.19)"
                : "0 10px 20px rgba(149,117,205,0.1)",
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            "& .MuiOutlinedInput-root": {
              borderRadius: 12,
              backgroundColor:
                mode === "dark"
                  ? alpha(currentTextColors.primary, 0.05)
                  : alpha(currentTextColors.secondary, 0.05),
              "& fieldset": {
                borderColor:
                  mode === "dark"
                    ? alpha(currentTextColors.secondary, 0.2)
                    : alpha(currentTextColors.secondary, 0.3),
              },
              "&:hover fieldset": {
                borderColor: lavenderPalette.primary.light,
              },
              "&.Mui-focused fieldset": {
                borderColor: lavenderPalette.primary.main,
                borderWidth: "1px",
              },
            },
            input: { padding: "12.5px 14px" },
          },
        },
      },
      MuiFormControl: {
        styleOverrides: {
          root: {
            "& .MuiOutlinedInput-root": {
              borderRadius: 12,
              backgroundColor:
                mode === "dark"
                  ? alpha(currentTextColors.primary, 0.05)
                  : alpha(currentTextColors.secondary, 0.05),
              "& fieldset": {
                borderColor:
                  mode === "dark"
                    ? alpha(currentTextColors.secondary, 0.2)
                    : alpha(currentTextColors.secondary, 0.3),
              },
              "&:hover fieldset": {
                borderColor: lavenderPalette.primary.light,
              },
              "&.Mui-focused fieldset": {
                borderColor: lavenderPalette.primary.main,
                borderWidth: "1px",
              },
            },
          },
        },
      },
      MuiInputLabel: {
        styleOverrides: {
          outlined: {
            "&.Mui-focused": { color: lavenderPalette.primary.main },
            "&.MuiFormLabel-filled": {
              transform: "translate(14px, -9px) scale(0.75)",
              backgroundColor: mode === "dark" ? "#2d2a45" : "#ffffff",
              paddingLeft: "4px",
              paddingRight: "4px",
            },
          },
        },
      },
      MuiTableCell: {
        styleOverrides: {
          head: {
            backgroundColor:
              mode === "dark"
                ? alpha(lavenderPalette.primary.dark, 0.4)
                : alpha(lavenderPalette.primary.light, 0.3),
            color: currentTextColors.primary,
            fontWeight: "bold",
            fontSize: "0.9rem",
            borderBottom: `1px solid ${
              mode === "dark"
                ? alpha(lavenderPalette.primary.light, 0.25)
                : alpha(lavenderPalette.primary.dark, 0.25)
            }`,
          },
          body: {
            color: currentTextColors.secondary,
            borderColor:
              mode === "dark"
                ? alpha(currentTextColors.secondary, 0.2)
                : alpha(currentTextColors.secondary, 0.25),
            fontSize: "0.875rem",
          },
        },
      },
      MuiTablePagination: {
        styleOverrides: { root: { color: currentTextColors.secondary } },
      },
    },
  });
};

function UniversityMui() {
  const [throwErr, setThrowErr] = useState(null);
  const [uniData, setUniData] = useState([]);
  const [searchUni, setSearchUni] = useState("");
  const [isUniLoadingData, setIsUniLoadingData] = useState(false);
  const [pageNo, setPageNo] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [totalRows, setTotalRows] = useState(0);
  const [loadCourse, setLoadCourse] = useState({
    loadCourse: false,
    uniId: -1,
    type: -1,
    uniName: "",
  });

  const [levelId, setLevelId] = useState(null);
  const [intakeId, setIntakeId] = useState(null);

  const authData = useSelector((state) => state.authStore);

  const prefersDarkMode =
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches;

  const isDarkMode = prefersDarkMode;

  const theme = useMemo(
    () => getLavenderTheme(isDarkMode ? "dark" : "light"),
    [isDarkMode]
  );

  useEffect(() => {
    if (throwErr) throw throwErr;
  }, [throwErr]);

  const goToCoursePage = useCallback((uniId, courseType, uniName) => {
    setLoadCourse({ loadCourse: true, uniId, type: courseType, uniName });
  }, []);

  const handleBackToUniversities = useCallback(() => {
    setLoadCourse({ loadCourse: false, uniId: -1, type: -1, uniName: "" });
  }, []);

  const uniColumns = [
    { id: "univ_name", label: "University Name", minWidth: 200 },
    {
      id: "action",
      label: "Actions",
      minWidth: 300,
      align: "center",
      format: (row) => (
        <Box
          sx={{
            display: "flex",
            gap: 1,
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <Button
            variant="outlined"
            color="primary"
            size="small"
            startIcon={<SchoolIcon sx={{ fontSize: "1rem" }} />}
            onClick={() => goToCoursePage(row.id, 2, row.univ_name)}
            sx={{
              borderRadius: "8px",
              py: 0.5,
              fontSize: "0.7rem",
              textTransform: "none",
              minWidth: "120px",
            }}
          >
            UG Courses
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            size="small"
            startIcon={<SchoolIcon sx={{ fontSize: "1rem" }} />}
            onClick={() => goToCoursePage(row.id, 1, row.univ_name)}
            sx={{
              borderRadius: "8px",
              py: 0.5,
              fontSize: "0.7rem",
              textTransform: "none",
              minWidth: "120px",
            }}
          >
            PG Courses
          </Button>
        </Box>
      ),
    },
  ];

  const getData = useCallback(
    async (
      searchTerm = searchUni,
      currentLevelId = levelId,
      currentIntakeId = intakeId,
      currentPage = pageNo,
      rowsPerPage = perPage
    ) => {
      setIsUniLoadingData(true);
      let courseUrl = `get/unilistapply/?p=${
        currentPage + 1
      }&records=${rowsPerPage}`;
      if (searchTerm?.length) {
        courseUrl += `&search=${encodeURIComponent(searchTerm)}`;
      }
      if (currentLevelId) {
        courseUrl += `&course_levels=${currentLevelId}`;
      }
      if (currentIntakeId) {
        courseUrl += `&intake=${currentIntakeId}`;
      }

      try {
        const response = await ajaxCallWithHeaderOnly(
          courseUrl,
          { Authorization: `Bearer ${authData.accessToken}` },
          "POST",
          null
        );
        if (
          response?.isNetwork ||
          (response?.status && response.status !== 200)
        ) {
          console.error("API Error:", response);
          setThrowErr({
            message: response?.message || "Failed to fetch universities",
            data: response,
            page: "university_search",
          });
          setUniData([]);
          setTotalRows(0);
          return;
        }
        if (response?.results?.length > 0) {
          setTotalRows(response.count);
          setUniData(response.results);
        } else {
          setTotalRows(0);
          setUniData([]);
        }
      } catch (error) {
        console.error("Fetch Error:", error);
        setThrowErr({
          message: error.message || "An unexpected error occurred",
          errorObj: error,
          page: "university_search_fetch",
        });
        setUniData([]);
        setTotalRows(0);
      } finally {
        setIsUniLoadingData(false);
      }
    },
    [authData.accessToken, intakeId, levelId, pageNo, perPage, searchUni]
  );

  useEffect(() => {
    getData(searchUni, levelId, intakeId, pageNo, perPage);
  }, [searchUni, levelId, intakeId, pageNo, perPage, getData]);

  const handleSearchChange = (event) => {
    setSearchUni(event.target.value);
    setPageNo(0);
  };

  const handleLevelChange = (val, nameObj) => {
    setLevelId(val);
    setPageNo(0);
  };

  const handleIntakeChange = (val, nameObj) => {
    setIntakeId(val);
    setPageNo(0);
  };

  const handleChangePage = (event, newPage) => {
    setPageNo(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPerPage(parseInt(event.target.value, 10));
    setPageNo(0);
  };

  if (loadCourse.loadCourse) {
    return (
      <ThemeProvider theme={theme}>
        <Box
          sx={{
            p: { xs: 2, sm: 3 },
            bgcolor: "background.default",
            minHeight: "calc(100vh - 64px)",
          }}
        >
          <Paper elevation={1} sx={{ p: { xs: 2, sm: 3 } }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <IconButton
                onClick={handleBackToUniversities}
                sx={{
                  mr: 1,
                  color: "primary.main",
                  "&:hover": {
                    bgcolor: alpha(theme.palette.primary.main, 0.08),
                  },
                }}
              >
                <ArrowBackIcon />
              </IconButton>
              <Typography
                variant="h5"
                component="h1"
                sx={{ fontWeight: "600", color: "primary.dark" }}
              >
                Courses at {loadCourse.uniName || "Selected University"}
              </Typography>
            </Box>
            <CourseLists
              uniId={loadCourse.uniId}
              courseLevel={loadCourse.type}
              goToCourse={handleBackToUniversities}
            />
          </Paper>
        </Box>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          p: { xs: 2, sm: 3 },
          bgcolor: "background.default",
          minHeight: "calc(100vh - 64px)",
        }}
      >
        <Paper elevation={1} sx={{ p: { xs: 2, sm: 3 }, mb: 3 }}>
          <Typography
            variant="h5"
            component="h1"
            sx={{ mb: 2.5, fontWeight: "600", color: "primary.dark" }}
          >
            Search Universities
          </Typography>
          <TextField
            fullWidth
            id="uniSearch"
            label="Search by University Name"
            variant="outlined"
            value={searchUni}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <SearchIcon sx={{ mr: 1, color: "action.active" }} />
              ),
            }}
            sx={{ mb: 2.5 }}
          />
          <Grid container spacing={2.5} alignItems="flex-end">
            <Grid item xs={12} sm={6} md={4}>
              <FormControl
                fullWidth
                variant="outlined"
                sx={{ minHeight: "56px" }}
              >
                <InputLabel
                  htmlFor="levelApplying-select"
                  sx={{
                    ...(levelId && {
                      transform: "translate(14px, -9px) scale(0.75)",
                      backgroundColor: theme.palette.background.paper,
                      px: 0.5,
                    }),
                  }}
                >
                  Level Applying
                </InputLabel>
                <SelectionBox
                  groupClass="mui-selection-box"
                  groupId="levelApplying"
                  value={levelId}
                  onChange={handleLevelChange}
                  name="levelApplying"
                  url="courselevels/"
                  isSearch={false}
                  objKey="levels"
                  placeholder="All Levels"
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <FormControl
                fullWidth
                variant="outlined"
                sx={{ minHeight: "56px" }}
              >
                <InputLabel
                  htmlFor="intakeInterested-select"
                  sx={{
                    ...(intakeId && {
                      transform: "translate(14px, -9px) scale(0.75)",
                      backgroundColor: theme.palette.background.paper,
                      px: 0.5,
                    }),
                  }}
                >
                  Intake
                </InputLabel>
                <SelectionBox
                  groupClass="mui-selection-box"
                  groupId="intakeInterested"
                  value={intakeId}
                  onChange={handleIntakeChange}
                  name="intakeInterested"
                  url="intakes/"
                  isSearch={true}
                  objKey="name"
                  placeholder="All Intakes"
                />
              </FormControl>
            </Grid>
          </Grid>
        </Paper>

        <Paper elevation={1} sx={{ p: { xs: 1, sm: 2 } }}>
          {isUniLoadingData ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                py: 10,
                minHeight: 300,
              }}
            >
              <CircularProgress color="primary" size={50} />
              <Typography sx={{ ml: 2, color: "text.secondary" }}>
                Loading Universities...
              </Typography>
            </Box>
          ) : uniData.length > 0 ? (
            <>
              <TableContainer
                sx={{
                  maxHeight: {
                    xs: "calc(100vh - 400px)",
                    sm: "calc(100vh - 380px)",
                  },
                }}
              >
                <Table stickyHeader aria-label="sticky university table">
                  <TableHead>
                    <TableRow>
                      {uniColumns.map((column) => (
                        <TableCell
                          key={column.id}
                          align={column.align}
                          style={{ minWidth: column.minWidth }}
                        >
                          {column.label}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {uniData.map((row) => (
                      <TableRow
                        hover
                        role="checkbox"
                        tabIndex={-1}
                        key={row.id}
                      >
                        {uniColumns.map((column) => {
                          const value =
                            column.id === "univ_name"
                              ? row.univ_name
                              : row[column.id];
                          return (
                            <TableCell key={column.id} align={column.align}>
                              {column.format ? column.format(row) : value}
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                rowsPerPageOptions={[10, 25, 50, 100]}
                component="div"
                count={totalRows}
                rowsPerPage={perPage}
                page={pageNo}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </>
          ) : (
            (searchUni || levelId || intakeId) &&
            !isUniLoadingData && (
              <Box sx={{ textAlign: "center", py: 10, minHeight: 300 }}>
                <SearchIcon
                  sx={{ fontSize: 60, color: "text.disabled", mb: 2 }}
                />
                <Typography variant="h6" color="text.secondary">
                  No Universities Found
                </Typography>
                <Typography color="text.disabled">
                  Try adjusting your search or filters.
                </Typography>
              </Box>
            )
          )}
        </Paper>
      </Box>
    </ThemeProvider>
  );
}

export default UniversityMui;
