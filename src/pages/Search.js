import React, { useEffect, useReducer, useState, useMemo, useCallback } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom'; // For navigation if needed from modal

// MUI Core Components
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
    DialogActions,
    IconButton,
    useTheme,
    ThemeProvider,
    createTheme,
    alpha,
    FormControl, // For wrapping SelectionBox if needed
    InputLabel   // For SelectionBox label
} from '@mui/material';

// MUI Icons
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';

// Your project's specific imports
import SelectionBox from "../components/UI/Form/SelectionBox"; // Assuming path is correct
import { ajaxCallWithHeaderOnly } from "../helpers/ajaxCall"; // Assuming path is correct
import LoadingData from "../components/UI/LoadingData"; // Assuming path is correct
import CreateEnquiry from "./Enquiry/CreateEnquiry"; // Assuming path is correct

// ----- Custom Lavender Theme (Ensure this is identical to the one used in other components) -----
const getLavenderTheme = (mode) => {
    const lavenderPalette = {
        primary: { light: '#c5b0e6', main: '#9575cd', dark: '#7953b3', contrastText: '#fff' },
        secondary: { light: '#efc0ff', main: '#ba68c8', dark: '#883997', contrastText: '#fff' },
        success: { light: '#a7d7c5', main: '#66bb6a', dark: '#43a047', contrastText: '#fff' },
        error: { light: '#ffb3c4', main: '#f06292', dark: '#e91e63', contrastText: '#fff' },
        info: { light: '#b3e0ff', main: '#64b5f6', dark: '#1976d2', contrastText: '#fff' },
        warning: { light: '#fff1b8', main: '#ffb74d', dark: '#f57c00', contrastText: '#fff' },
    };
    const currentTextColors = {
        primary: mode === 'dark' ? '#f5f3fa' : '#3f3b5b',
        secondary: mode === 'dark' ? '#b8b4d8' : '#69668a',
    };
    return createTheme({
        palette: {
            mode, ...lavenderPalette,
            background: { default: mode === 'dark' ? '#232139' : '#f5f3fa', paper: mode === 'dark' ? '#2d2a45' : '#ffffff' },
            text: currentTextColors,
        },
        shape: { borderRadius: 16 },
        typography: { fontFamily: [ 'Poppins', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', '"Helvetica Neue"', 'Arial', 'sans-serif'].join(','), },
        components: {
            MuiButton: { styleOverrides: { root: { borderRadius: 12, textTransform: 'none', boxShadow: 'none', transition: 'all 0.2s ease-in-out', padding: '8px 20px', '&:hover': { transform: 'translateY(-1px)', boxShadow: `0 4px 10px ${alpha(lavenderPalette.primary.main, 0.25)}` } }, contained: { boxShadow: `0 2px 6px ${alpha(lavenderPalette.primary.main, 0.2)}` }, containedPrimary: { backgroundColor: lavenderPalette.primary.main, color: lavenderPalette.primary.contrastText, '&:hover': { backgroundColor: lavenderPalette.primary.dark } } } },
            MuiPaper: { styleOverrides: { root: { borderRadius: 20, }, elevation1: { boxShadow: mode === 'dark' ? '0 10px 20px rgba(0,0,0,0.19)' : '0 10px 20px rgba(149,117,205,0.1)' } } },
            MuiTextField: { styleOverrides: { root: { '& .MuiOutlinedInput-root': { borderRadius: 12, '& fieldset': { borderColor: mode === 'dark' ? alpha(currentTextColors.secondary, 0.3) : alpha(currentTextColors.secondary, 0.4), }, '&:hover fieldset': { borderColor: lavenderPalette.primary.light, }, '&.Mui-focused fieldset': { borderColor: lavenderPalette.primary.main, borderWidth: '1px' }, }, input: { padding: '12.5px 14px' } } } },
            MuiTableCell: { styleOverrides: { head: { backgroundColor: mode === 'dark' ? alpha(lavenderPalette.primary.dark, 0.3) : alpha(lavenderPalette.primary.light, 0.2), color: currentTextColors.primary, fontWeight: '600', borderBottom: `1px solid ${mode === 'dark' ? alpha(lavenderPalette.primary.light, 0.2) : alpha(lavenderPalette.primary.dark, 0.2)}` }, body: { color: currentTextColors.secondary, borderColor: mode === 'dark' ? alpha(currentTextColors.secondary, 0.15) : alpha(currentTextColors.secondary, 0.2) } } },
            MuiTablePagination: { styleOverrides: { root: { color: currentTextColors.secondary } } },
            MuiDialogTitle: { styleOverrides: { root: { backgroundColor: mode === 'dark' ? (mode === 'dark' ? '#2d2a45' : '#ffffff') : lavenderPalette.primary.light, color: mode === 'dark' ? lavenderPalette.primary.light : lavenderPalette.primary.dark, fontWeight: '600' } } },
            MuiDialog: { styleOverrides: { paper: { borderRadius: 20, boxShadow: `0 10px 30px ${alpha(mode === 'dark' ? '#000' : lavenderPalette.primary.main, 0.2)}` } } }
        },
    });
};

const initialState = {
    name: null, examGiven: null, marks: null, engWaiver: null, levelId: null, levelName: null,
    intakeId: null, intakeName: null, ielts: null, toefl: null, pte: null, cSearch: "", // Initialize cSearch as empty string
    university: { id: null, name: null }, loadPercent: 0,
    loadText: "Fill all Details to load Courses", isAll: 0, filter: null, refresh: 0,
};

const reducer = (state, action) => {
    if (action.type === "resetRefresh") return { ...state, refresh: 0 };
    if (action.type === "checkThings") {
        let loadText = "Fill all Details to load Courses";
        let load = 0; let isAll = 1;
        if (state.ielts || state.toefl || state.pte) load += 25;
        if (state.intakeId) load += 25;
        if (state.levelId) load += 25;
        if (state.cSearch) load += 25;
        isAll = isAll && (state.ielts || state.toefl || state.pte);
        isAll = isAll && state.intakeId;
        isAll = isAll && state.levelId && state.cSearch;
        isAll = isAll ? 1 : 0;
        if (load) { const remainSteps = 4 - load / 25; loadText = `${remainSteps} steps remains to get list of courses`; }
        let filter = `?course_name=${state.cSearch || ""}`; // Ensure cSearch is not null
        return { ...state, loadPercent: load, isAll, loadText, filter };
    }
    let value = action.value;
    if (action.value === undefined || action.value === "") { // Check for empty string too
        value = null;
    }
    return { ...state, [action.type]: value, refresh: 1 };
};

function SearchMui() {
    const [throwErr, setThrowErr] = useState(null);
    const [uniData, setUniData] = useState([]);
    const [isUniLoadingData, setIsUniLoadingData] = useState(false);
    const [pageNo, setPageNo] = useState(0); // MUI TablePagination is 0-indexed
    const [perPage, setPerPage] = useState(10);
    const [totalRows, setTotalRows] = useState(0);
    const [enqPopup, setEnqPopup] = useState({ show: false, data: {} });

    const [uniState, dispatchUniState] = useReducer(reducer, initialState);
    const authData = useSelector((state) => state.authStore);
    
    // Example: Detect system dark mode preference. Replace with your app's dark mode state.
    const prefersDarkMode = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const [isDarkMode, setIsDarkMode] = useState(prefersDarkMode); // Or from global state
    const theme = useMemo(() => getLavenderTheme(isDarkMode ? 'dark' : 'light'), [isDarkMode]);


    useEffect(() => { if (throwErr) throw throwErr; }, [throwErr]);

    const goToEnqPage = useCallback((uniId, courseId, course_levels) => {
        setEnqPopup({ show: true, data: { levelId: course_levels, intake: uniState.intakeId, uniId, courseId } });
    }, [uniState.intakeId]);

    const handleCloseEnqPopup = () => setEnqPopup({ show: false, data: {} });

    const uniColumns = [
        { id: 'uniName', label: 'University Name', minWidth: 170, sortable: true },
        { id: 'courseName', label: 'Course Name', minWidth: 170, sortable: true },
        {
            id: 'action', label: 'Action', minWidth: 170, align: 'center',
            format: (row) => (
                <Button
                    variant="contained"
                    color="secondary" // Using secondary for apply button to differentiate
                    size="small"
                    onClick={() => goToEnqPage(row.uniId, row.courseId, row.course_levels)}
                    sx={{ borderRadius: '8px', py: 0.5 }}
                >
                    Apply
                </Button>
            ),
        },
    ];

    const getData = useCallback(async () => {
        if (!uniState.cSearch && !uniState.isAll) { // Don't fetch if cSearch is empty and not all filters are set
            setUniData([]);
            setTotalRows(0);
            return;
        }
        let courseUrl = `courseslistsuni/${uniState.filter}&p=${pageNo + 1}&records=${perPage}`; // pageNo + 1 for API
        if (uniState.intakeId) courseUrl += `&intake=${uniState.intakeId}`;
        if (uniState.levelId) courseUrl += `&course_levels=${uniState.levelId}`;
        
        setIsUniLoadingData(true);
        try {
            const response = await ajaxCallWithHeaderOnly(courseUrl, { Authorization: `Bearer ${authData.accessToken}` }, "POST", null);
            if (response?.isNetwork || response?.status === 401) { setThrowErr({ ...response, page: "search_courses" }); return; }
            if (response?.results?.length > 0) {
                const data = response.results.map((item) => ({
                    id: item.id, // Important for key in map
                    courseId: item.id,
                    courseName: item.course_name,
                    uniId: item.university?.id,
                    uniName: item.university?.univ_name,
                    course_levels: item.course_levels, // Ensure this is passed for the modal
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
    }, [authData.accessToken, pageNo, perPage, uniState.filter, uniState.intakeId, uniState.levelId, uniState.isAll, uniState.cSearch]);

    useEffect(() => {
        // Trigger getData if cSearch has value OR if all filters are set (isAll becomes true)
        // and refresh is triggered.
        if (uniState.refresh && (uniState.cSearch || uniState.isAll)) {
            getData();
        } else if (!uniState.cSearch && !uniState.isAll) { // Clear data if search is cleared
            setUniData([]);
            setTotalRows(0);
        }
    }, [uniState.refresh, uniState.cSearch, uniState.isAll, getData]);


    const selectValueChanged = useCallback((typeId, typeName, val, nameObj) => { // nameObj might be the selected option object
        const valueToSet = val; // Assuming val is the ID
        const nameToSet = nameObj ? nameObj.name : null; // Assuming the object has a 'name' property

        dispatchUniState({ type: typeId, value: valueToSet });
        if (typeName && nameToSet !== null) { // Only dispatch typeName if it's provided and nameToSet is valid
            dispatchUniState({ type: typeName, value: nameToSet });
        }
        dispatchUniState({ type: "checkThings" });
        // Data table will refresh via useEffect on uniState.refresh
    }, []);

    const handleSearchChange = (event) => {
        dispatchUniState({ type: "cSearch", value: event.target.value });
        dispatchUniState({ type: "checkThings" });
    };

    const handleChangePage = (event, newPage) => {
        setPageNo(newPage);
        // getData will be called by useEffect due to pageNo change if refresh is also set or conditions met
        dispatchUniState({ type: "resetRefresh" }); // Ensure refresh is 0
        dispatchUniState({ type: "refresh" }); // Then set to 1 to trigger fetch
    };

    const handleChangeRowsPerPage = (event) => {
        setPerPage(parseInt(event.target.value, 10));
        setPageNo(0);
        dispatchUniState({ type: "resetRefresh" });
        dispatchUniState({ type: "refresh" });
    };
    

    return (
        <ThemeProvider theme={theme}>
            <Box sx={{ p: { xs: 2, sm: 3 }, bgcolor: 'background.default', minHeight: 'calc(100vh - 64px)' /* Adjust based on header height */ }}>
                <Paper elevation={1} sx={{ p: { xs: 2, sm: 3 }, mb: 3 }}>
                    <Typography variant="h5" component="h1" sx={{ mb: 2.5, fontWeight: '600', color: 'primary.dark' }}>
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
                                <SearchIcon sx={{ mr: 1, color: 'action.active' }} />
                            ),
                        }}
                        sx={{ mb: 2 }}
                    />
                     {/* Progress bar can be added here if uniState.loadPercent is used */}
                </Paper>

                {uniState.cSearch && ( // Only show filters and table if there's a search term
                    <Paper elevation={1} sx={{ p: { xs: 2, sm: 3 } }}>
                        <Grid container spacing={2.5} sx={{ mb: 2.5, alignItems: 'flex-end' }}>
                            <Grid item xs={12} sm={6} md={3}>
                                <FormControl fullWidth variant="outlined">
                                    <InputLabel htmlFor="levelApplying-label" sx={{backgroundColor: 'background.paper', px:1, transform: uniState.levelId ? 'translate(14px, -9px) scale(0.75)' : 'translate(14px, 12px) scale(1)'}}>Level</InputLabel>
                                    <SelectionBox
                                        // No direct label prop, use FormControl's InputLabel
                                        groupClass="mui-selection-box" // Add a class for potential global styling
                                        groupId="levelApplying"
                                        value={uniState.levelId}
                                        onChange={selectValueChanged.bind(null, "levelId", "levelName")}
                                        name="levelApplying" // Important for SelectionBox internal logic
                                        url="courselevels/"
                                        isSearch={false}
                                        objKey="levels"
                                        placeholder="Select Level"
                                        sx={{'.select-search__input': {borderRadius: '12px'}}} // Example of trying to style SelectionBox
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                 <FormControl fullWidth variant="outlined">
                                    <InputLabel htmlFor="intakeInterested-label" sx={{backgroundColor: 'background.paper', px:1, transform: uniState.intakeId ? 'translate(14px, -9px) scale(0.75)' : 'translate(14px, 12px) scale(1)'}}>Intake</InputLabel>
                                    <SelectionBox
                                        groupClass="mui-selection-box"
                                        groupId="intakeInterested"
                                        value={uniState.intakeId}
                                        onChange={selectValueChanged.bind(null, "intakeId", "intakeName")}
                                        name="intakeInterested"
                                        url="intakes/"
                                        isSearch={true}
                                        objKey="it's different" // This might need adjustment based on API response for 'name'
                                        placeholder="Select Intake"
                                    />
                                </FormControl>
                            </Grid>
                            {/* Add other filters like IELTS, TOEFL, PTE here if needed, using similar structure */}
                        </Grid>

                        {isUniLoadingData ? (
                            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 5 }}>
                                <CircularProgress color="primary" size={40} />
                                <Typography sx={{ ml: 2, color: 'text.secondary' }}>Loading Courses...</Typography>
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
                                            <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
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
                             uniState.cSearch && !isUniLoadingData && // Show only if searched and not loading
                            <Box sx={{ textAlign: 'center', py: 5 }}>
                                <SearchIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }}/>
                                <Typography variant="h6" color="text.secondary">No Courses Found</Typography>
                                <Typography color="text.disabled">Try adjusting your search or filters.</Typography>
                            </Box>
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

                {/* Enquiry Popup Modal */}
                <Dialog
                    open={enqPopup.show}
                    onClose={handleCloseEnqPopup}
                    maxWidth="lg" // Or "md", "sm", "xl", false
                    fullWidth
                    PaperProps={{ sx: { borderRadius: 3 } }} // Consistent with theme's MuiPaper
                >
                    <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                       Apply to Course
                        <IconButton aria-label="close" onClick={handleCloseEnqPopup} sx={{color: (theme) => theme.palette.grey[500]}}>
                            <CloseIcon />
                        </IconButton>
                    </DialogTitle>
                    <DialogContent dividers> {/* Dividers add top/bottom borders */}
                        {enqPopup.data && ( // Ensure data exists before rendering CreateEnquiry
                            <CreateEnquiry
                                isModal // Pass a prop to tell CreateEnquiry it's in a modal
                                closeModal={handleCloseEnqPopup} // Function to close modal from child
                                levelId={enqPopup.data.levelId}
                                intake={enqPopup.data.intake}
                                uniId={enqPopup.data.uniId}
                                courseId={enqPopup.data.courseId}
                            />
                        )}
                    </DialogContent>
                    {/* DialogActions can be added here if CreateEnquiry doesn't handle its own submit/cancel buttons */}
                </Dialog>
            </Box>
        </ThemeProvider>
    );
}

export default SearchMui;
