import React, { useEffect, useReducer, useState, useCallback } from "react";
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
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  ThemeProvider,
  FormControl,
  InputLabel,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import SelectionBox from "../components/UI/Form/SelectionBox";
import { ajaxCallWithHeaderOnly } from "../helpers/ajaxCall";
import CreateEnquiry from "./Enquiry/CreateEnquiry";
import lavenderTheme from "../theme";

const initialState = {
  name: null,
  examGiven: null,
  marks: null,
  engWaiver: null,
  levelId: null,
  levelName: null,
  intakeId: null,
  intakeName: null,
  ielts: null,
  toefl: null,
  pte: null,
  cSearch: "",
  university: { id: null, name: null },
  loadPercent: 0,
  loadText: "Fill all Details to load Courses",
  isAll: 0,
  filter: null,
  refresh: 0,
};

const reducer = (state, action) => {
  if (action.type === "resetRefresh") return { ...state, refresh: 0 };
  if (action.type === "checkThings") {
    let loadText = "Fill all Details to load Courses";
    let load = 0;
    let isAll = 1;
    if (state.ielts || state.toefl || state.pte) load += 25;
    if (state.intakeId) load += 25;
    if (state.levelId) load += 25;
    if (state.cSearch) load += 25;
    isAll = isAll && (state.ielts || state.toefl || state.pte);
    isAll = isAll && state.intakeId;
    isAll = isAll && state.levelId && state.cSearch;
    isAll = isAll ? 1 : 0;
    if (load) {
      const remainSteps = 4 - load / 25;
      loadText = `${remainSteps} steps remains to get list of courses`;
    }
    let filter = `?course_name=${state.cSearch || ""}`;
    return { ...state, loadPercent: load, isAll, loadText, filter };
  }
  let value = action.value;
  if (action.value === undefined || action.value === "") {
    value = null;
  }
  return { ...state, [action.type]: value, refresh: 1 };
};

const Search = () => {
  const [throwErr, setThrowErr] = useState(null);
  const [uniData, setUniData] = useState([]);
  const [isUniLoadingData, setIsUniLoadingData] = useState(false);
  const [pageNo, setPageNo] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [totalRows, setTotalRows] = useState(0);
  const [enqPopup, setEnqPopup] = useState({ show: false, data: {} });

  const [uniState, dispatchUniState] = useReducer(reducer, initialState);
  const authData = useSelector((state) => state.authStore);

  useEffect(() => {
    if (throwErr) throw throwErr;
  }, [throwErr]);

  const goToEnqPage = useCallback(
    (uniId, courseId, course_levels) => {
      setEnqPopup({
        show: true,
        data: {
          levelId: course_levels,
          intake: uniState.intakeId,
          uniId,
          courseId,
        },
      });
    },
    [uniState.intakeId]
  );

  const handleCloseEnqPopup = () => setEnqPopup({ show: false, data: {} });

  const uniColumns = [
    { id: "uniName", label: "University Name", minWidth: 170, sortable: true },
    { id: "courseName", label: "Course Name", minWidth: 170, sortable: true },
    {
      id: "action",
      label: "Action",
      minWidth: 170,
      align: "center",
      format: (row) => (
        <Button
          variant="contained"
          color="secondary"
          size="small"
          onClick={() =>
            goToEnqPage(row.uniId, row.courseId, row.course_levels)
          }
          sx={{ borderRadius: "8px", py: 0.5 }}
        >
          Apply
        </Button>
      ),
    },
  ];

  const getData = useCallback(async () => {
    if (!uniState.cSearch && !uniState.isAll) {
      setUniData([]);
      setTotalRows(0);
      return;
    }
    let courseUrl = `courseslistsuni/${uniState.filter}&p=${
      pageNo + 1
    }&records=${perPage}`;
    if (uniState.intakeId) courseUrl += `&intake=${uniState.intakeId}`;
    if (uniState.levelId) courseUrl += `&course_levels=${uniState.levelId}`;

    setIsUniLoadingData(true);
    try {
      const response = await ajaxCallWithHeaderOnly(
        courseUrl,
        { Authorization: `Bearer ${authData.accessToken}` },
        "POST",
        null
      );
      if (response?.isNetwork || response?.status === 401) {
        setThrowErr({ ...response, page: "search_courses" });
        return;
      }
      if (response?.results?.length > 0) {
        const data = response.results.map((item) => ({
          id: item.id,
          courseId: item.id,
          courseName: item.course_name,
          uniId: item.university?.id,
          uniName: item.university?.univ_name,
          course_levels: item.course_levels,
        }));
        setTotalRows(response.count);
        setUniData(data);
      } else {
        setTotalRows(0);
        setUniData([]);
      }
    } catch (error) {
      setThrowErr({ error, page: "search_courses_fetch" });
    } finally {
      setIsUniLoadingData(false);
      dispatchUniState({ type: "resetRefresh" });
    }
  }, [
    authData.accessToken,
    pageNo,
    perPage,
    uniState.filter,
    uniState.intakeId,
    uniState.levelId,
    uniState.isAll,
    uniState.cSearch,
  ]);

  useEffect(() => {
    if (uniState.refresh && (uniState.cSearch || uniState.isAll)) {
      getData();
    } else if (!uniState.cSearch && !uniState.isAll) {
      setUniData([]);
      setTotalRows(0);
    }
  }, [uniState.refresh, uniState.cSearch, uniState.isAll, getData]);

  const selectValueChanged = useCallback((typeId, typeName, val, nameObj) => {
    const valueToSet = val;
    const nameToSet = nameObj ? nameObj.name : null;

    dispatchUniState({ type: typeId, value: valueToSet });
    if (typeName && nameToSet !== null) {
      dispatchUniState({ type: typeName, value: nameToSet });
    }
    dispatchUniState({ type: "checkThings" });
  }, []);

  const handleSearchChange = (event) => {
    dispatchUniState({ type: "cSearch", value: event.target.value });
    dispatchUniState({ type: "checkThings" });
  };

  const handleChangePage = (event, newPage) => {
    setPageNo(newPage);
    dispatchUniState({ type: "resetRefresh" });
    dispatchUniState({ type: "refresh" });
  };

  const handleChangeRowsPerPage = (event) => {
    setPerPage(parseInt(event.target.value, 10));
    setPageNo(0);
    dispatchUniState({ type: "resetRefresh" });
    dispatchUniState({ type: "refresh" });
  };

  return (
    <ThemeProvider theme={lavenderTheme}>
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
            Find Your Course
          </Typography>
          <TextField
            fullWidth
            id="cSearch"
            label="Search Course Name (e.g., Engineering, Business)"
            variant="outlined"
            value={uniState.cSearch}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <SearchIcon sx={{ mr: 1, color: "action.active" }} />
              ),
            }}
            sx={{ mb: 2 }}
          />
        </Paper>
        {uniState.cSearch && (
          <Paper elevation={1} sx={{ p: { xs: 2, sm: 3 } }}>
            <Grid
              container
              spacing={2.5}
              sx={{ mb: 2.5, alignItems: "flex-end" }}
            >
              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel
                    htmlFor="levelApplying-label"
                    sx={{
                      backgroundColor: "background.paper",
                      px: 1,
                      transform: uniState.levelId
                        ? "translate(14px, -9px) scale(0.75)"
                        : "translate(14px, 12px) scale(1)",
                    }}
                  >
                    Level
                  </InputLabel>
                  <SelectionBox
                    groupClass="mui-selection-box"
                    groupId="levelApplying"
                    value={uniState.levelId}
                    onChange={selectValueChanged.bind(
                      null,
                      "levelId",
                      "levelName"
                    )}
                    name="levelApplying"
                    url="courselevels/"
                    isSearch={false}
                    objKey="levels"
                    placeholder="Select Level"
                    sx={{ ".select-search__input": { borderRadius: "12px" } }}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel
                    htmlFor="intakeInterested-label"
                    sx={{
                      backgroundColor: "background.paper",
                      px: 1,
                      transform: uniState.intakeId
                        ? "translate(14px, -9px) scale(0.75)"
                        : "translate(14px, 12px) scale(1)",
                    }}
                  >
                    Intake
                  </InputLabel>
                  <SelectionBox
                    groupClass="mui-selection-box"
                    groupId="intakeInterested"
                    value={uniState.intakeId}
                    onChange={selectValueChanged.bind(
                      null,
                      "intakeId",
                      "intakeName"
                    )}
                    name="intakeInterested"
                    url="intakes/"
                    isSearch={true}
                    objKey="it's different"
                    placeholder="Select Intake"
                  />
                </FormControl>
              </Grid>
            </Grid>
            {isUniLoadingData ? (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  py: 5,
                }}
              >
                <CircularProgress color="primary" size={40} />
                <Typography sx={{ ml: 2, color: "text.secondary" }}>
                  Loading Courses...
                </Typography>
              </Box>
            ) : uniData.length > 0 ? (
              <TableContainer>
                <Table stickyHeader aria-label="sticky table">
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
                          const value = row[column.id];
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
            ) : (
              uniState.cSearch &&
              !isUniLoadingData && (
                <Box sx={{ textAlign: "center", py: 5 }}>
                  <SearchIcon
                    sx={{ fontSize: 48, color: "text.disabled", mb: 1 }}
                  />
                  <Typography variant="h6" color="text.secondary">
                    No Courses Found
                  </Typography>
                  <Typography color="text.disabled">
                    Try adjusting your search or filters.
                  </Typography>
                </Box>
              )
            )}
            {totalRows > 0 && !isUniLoadingData && (
              <TablePagination
                rowsPerPageOptions={[10, 25, 50, 100]}
                component="div"
                count={totalRows}
                rowsPerPage={perPage}
                page={pageNo}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            )}
          </Paper>
        )}
        <Dialog
          open={enqPopup.show}
          onClose={handleCloseEnqPopup}
          maxWidth="lg"
          fullWidth
          PaperProps={{ sx: { borderRadius: 3 } }}
        >
          <DialogTitle
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              // Styles for DialogTitle specific to lavenderTheme
              backgroundColor: lavenderTheme.palette.primary.light,
              color: lavenderTheme.palette.primary.dark,
              fontWeight: "600",
            }}
          >
            Apply to Course
            <IconButton
              aria-label="close"
              onClick={handleCloseEnqPopup}
              sx={{ color: (theme) => theme.palette.grey[500] }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent dividers>
            {enqPopup.data && (
              <CreateEnquiry
                isModal
                closeModal={handleCloseEnqPopup}
                levelId={enqPopup.data.levelId}
                intake={enqPopup.data.intake}
                uniId={enqPopup.data.uniId}
                courseId={enqPopup.data.courseId}
              />
            )}
          </DialogContent>
        </Dialog>
      </Box>
    </ThemeProvider>
  );
};

export default Search;
