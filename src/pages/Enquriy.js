import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useSelector } from "react-redux";

// MUI Core Components
import {
    Box,
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
    ThemeProvider,
    createTheme,
    alpha,
    Tooltip,
    IconButton,
    TableSortLabel, // For column sorting
    Button, // For Export button
} from '@mui/material';

// MUI Icons
import SearchIcon from '@mui/icons-material/Search'; // For no data state
import FileDownloadIcon from '@mui/icons-material/FileDownload'; // For Export button
// import VisibilityIcon from '@mui/icons-material/Visibility';
// import EditIcon from '@mui/icons-material/Edit';

// Your project's specific imports
import { ajaxCallWithHeaderOnly } from "../helpers/ajaxCall"; // Adjust path as necessary

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
            MuiButton: { // Added for Export button consistency
                styleOverrides: { 
                    root: { 
                        borderRadius: 12, textTransform: 'none', boxShadow: 'none', 
                        transition: 'all 0.2s ease-in-out', padding: '6px 16px', 
                        '&:hover': { 
                            transform: 'translateY(-1px)', 
                            boxShadow: `0 4px 10px ${alpha(lavenderPalette.primary.main, 0.25)}` 
                        } 
                    }, 
                    contained: { 
                        boxShadow: `0 2px 6px ${alpha(lavenderPalette.primary.main, 0.2)}` 
                    },
                    containedPrimary: { // Ensure primary buttons use the theme correctly
                        backgroundColor: lavenderPalette.primary.main,
                        color: lavenderPalette.primary.contrastText,
                        '&:hover': {
                            backgroundColor: lavenderPalette.primary.dark,
                        }
                    }
                } 
            },
            MuiPaper: { styleOverrides: { root: { borderRadius: 20, }, elevation1: { boxShadow: mode === 'dark' ? '0 10px 20px rgba(0,0,0,0.19)' : '0 10px 20px rgba(149,117,205,0.1)' } } },
            MuiTableCell: {
                styleOverrides: {
                    head: {
                        backgroundColor: mode === 'dark' ? alpha(lavenderPalette.primary.dark, 0.5) : alpha(lavenderPalette.primary.light, 0.4),
                        color: mode === 'dark' ? lavenderPalette.primary.light : lavenderPalette.primary.dark,
                        fontWeight: '600',
                        fontSize: '0.9rem',
                        padding: '12px 16px',
                        borderBottom: `1px solid ${mode === 'dark' ? alpha(lavenderPalette.primary.light, 0.3) : alpha(lavenderPalette.primary.dark, 0.3)}`
                    },
                    body: {
                        color: currentTextColors.secondary,
                        borderColor: mode === 'dark' ? alpha(currentTextColors.secondary, 0.2) : alpha(currentTextColors.secondary, 0.25),
                        fontSize: '0.875rem',
                        padding: '10px 16px',
                    },
                }
            },
            MuiTableSortLabel: { // Styling for sort labels
                styleOverrides: {
                    root: {
                        color: 'inherit !important', // Inherit color from TableCell head
                        '&:hover': {
                            color: 'inherit !important',
                        },
                        '&.Mui-active': {
                            color: 'inherit !important', // Keep active color same as head
                        },
                    },
                    icon: {
                        color: 'inherit !important', // Make sort icon inherit color
                        opacity: 0.7,
                        '&:hover': {
                            opacity: 1,
                        },
                    },
                },
            },
            MuiTablePagination: { styleOverrides: { root: { color: currentTextColors.secondary, borderTop: `1px solid ${mode === 'dark' ? alpha(currentTextColors.secondary, 0.2) : alpha(currentTextColors.secondary, 0.25)}` } } },
            MuiTooltip: {
                styleOverrides: {
                    tooltip: {
                        borderRadius: 12,
                        boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
                        backdropFilter: 'blur(4px)',
                        backgroundColor: mode === 'dark' ? alpha(lavenderPalette.primary.main, 0.9) : alpha(lavenderPalette.primary.main, 0.95),
                        color: lavenderPalette.primary.contrastText,
                        fontSize: '0.75rem',
                        maxWidth: 300,
                    }
                }
            }
        },
    });
};

function WebsiteEnquiriesMui() {
    const authData = useSelector((state) => state.authStore);
    const [contactData, setContactData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [pageNo, setPageNo] = useState(0);
    const [perPage, setPerPage] = useState(10);
    const [totalRows, setTotalRows] = useState(0);
    const [throwErr, setThrowErr] = useState(null);

    // State for sorting
    const [order, setOrder] = useState('desc'); // Default to latest first
    const [orderBy, setOrderBy] = useState('id'); // Default sort by 'id' or a date field if available

    const prefersDarkMode = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const [isDarkMode, setIsDarkMode] = useState(prefersDarkMode);
    const theme = useMemo(() => getLavenderTheme(isDarkMode ? 'dark' : 'light'), [isDarkMode]);

    useEffect(() => { if (throwErr) throw throwErr; }, [throwErr]);

    const enquiryColumns = [
        // Make sure 'id' matches the actual field name from your API for sorting
        { id: 'firstname', label: 'First Name', minWidth: 120, sortable: true },
        { id: 'lastname', label: 'Last Name', minWidth: 120, sortable: true },
        { id: 'country_interested', label: 'Country Interested', minWidth: 150, sortable: true },
        { id: 'intake_year', label: 'Intake Year', minWidth: 100, align: 'center', sortable: true },
        { id: 'level_applying', label: 'Level Applying For', minWidth: 150, sortable: true },
        { id: 'email', label: 'Email', minWidth: 170, sortable: true },
        { id: 'phone', label: 'Phone', minWidth: 120, sortable: true },
        {
            id: 'notes',
            label: 'Notes',
            minWidth: 200,
            sortable: false, // Notes usually not sorted
            format: (value) => (
                <Tooltip title={value || ""} arrow placement="top-start">
                    <Typography variant="body2" noWrap sx={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', cursor: 'default' }}>
                        {value || '-'}
                    </Typography>
                </Tooltip>
            ),
        },
    ];

    const handleSortRequest = (property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
        // getData will be called by useEffect due to order/orderBy change
    };

    const getData = useCallback(async (currentPage = pageNo, rowsPerPage = perPage, currentOrder = order, currentOrderBy = orderBy) => {
        setIsLoading(true);
        let url = `create/contactus/?p=${currentPage + 1}&records=${rowsPerPage}`;
        // Add ordering to the URL
        if (currentOrderBy) {
            url += `&ordering=${currentOrder === 'desc' ? '-' : ''}${currentOrderBy}`;
        }

        try {
            const response = await ajaxCallWithHeaderOnly(
                url,
                { Authorization: `Bearer ${authData.accessToken}` },
                "GET",
                null
            );

            if (response?.isNetwork || (response?.status && response.status !== 200)) {
                console.error("API Error:", response);
                setThrowErr({ message: response?.message || "Failed to fetch enquiries", data: response, page: "website_enquiries" });
                setContactData([]); setTotalRows(0); return;
            }
            if (response?.results?.length > 0) {
                setTotalRows(response.count);
                setContactData(response.results);
            } else {
                setTotalRows(0); setContactData([]);
            }
        } catch (error) {
            console.error("Fetch Error:", error);
            setThrowErr({ message: error.message || "An unexpected error occurred", errorObj: error, page: "website_enquiries_fetch" });
            setContactData([]); setTotalRows(0);
        } finally {
            setIsLoading(false);
        }
    }, [authData.accessToken]); // Removed pageNo, perPage, order, orderBy from deps, pass as args

    useEffect(() => {
        getData(pageNo, perPage, order, orderBy);
    }, [pageNo, perPage, order, orderBy, getData]);

    const handleChangePage = (event, newPage) => {
        setPageNo(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setPerPage(parseInt(event.target.value, 10));
        setPageNo(0);
    };

    const handleExportData = () => {
        if (contactData.length === 0) {
            alert("No data to export.");
            return;
        }

        const headers = enquiryColumns.map(col => col.label).join(',');
        const rows = contactData.map(row => 
            enquiryColumns.map(col => {
                const value = row[col.id] || ''; // Handle undefined or null values
                return `"${String(value).replace(/"/g, '""')}"`; // Escape double quotes and enclose in quotes
            }).join(',')
        ).join('\n');

        const csvString = `${headers}\n${rows}`;
        const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", "website_enquiries.csv");
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };


    return (
        <ThemeProvider theme={theme}>
            <Box sx={{ p: { xs: 2, sm: 3 }, bgcolor: 'background.default', minHeight: 'calc(100vh - 64px)' }}>
                <Paper elevation={1} sx={{ p: { xs: 2, sm: 3 } }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.5 }}>
                        <Typography variant="h5" component="h1" sx={{ fontWeight: '600', color: 'primary.dark' }}>
                            Website Enquiries
                        </Typography>
                        <Button
                            variant="contained"
                            color="primary"
                            startIcon={<FileDownloadIcon />}
                            onClick={handleExportData}
                            disabled={isLoading || contactData.length === 0}
                        >
                            Export CSV
                        </Button>
                    </Box>

                    {isLoading && contactData.length === 0 ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 10, minHeight: 300 }}>
                            <CircularProgress color="primary" size={50} />
                            <Typography sx={{ ml: 2, color: 'text.secondary' }}>Loading Enquiries...</Typography>
                        </Box>
                    ) : (
                        <>
                            <TableContainer sx={{ maxHeight: { xs: 'calc(100vh - 320px)', sm: 'calc(100vh - 300px)' } }}> {/* Adjusted maxHeight */}
                                <Table stickyHeader aria-label="sticky website enquiries table">
                                    <TableHead>
                                        <TableRow>
                                            {enquiryColumns.map((column) => (
                                                <TableCell
                                                    key={column.id}
                                                    align={column.align}
                                                    style={{ minWidth: column.minWidth }}
                                                    sortDirection={orderBy === column.id ? order : false}
                                                >
                                                    {column.sortable !== false ? ( // Check if column is sortable
                                                        <TableSortLabel
                                                            active={orderBy === column.id}
                                                            direction={orderBy === column.id ? order : 'asc'}
                                                            onClick={() => handleSortRequest(column.id)}
                                                        >
                                                            {column.label}
                                                        </TableSortLabel>
                                                    ) : (
                                                        column.label
                                                    )}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {isLoading && contactData.length > 0 && (
                                            <TableRow>
                                                <TableCell colSpan={enquiryColumns.length} align="center" sx={{py: 3}}>
                                                    <CircularProgress size={24} sx={{mr: 1}}/> Refreshing data...
                                                </TableCell>
                                            </TableRow>
                                        )}
                                        {!isLoading && contactData.length === 0 && (
                                            <TableRow>
                                                <TableCell colSpan={enquiryColumns.length} align="center" sx={{py: 5}}>
                                                    <SearchIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }}/>
                                                    <Typography variant="body1" color="text.secondary">No enquiries found.</Typography>
                                                </TableCell>
                                            </TableRow>
                                        )}
                                        {!isLoading && contactData.map((row) => (
                                            <TableRow hover role="checkbox" tabIndex={-1} key={row.id || row.email}>
                                                {enquiryColumns.map((column) => {
                                                    const value = row[column.id];
                                                    return (
                                                        <TableCell key={column.id} align={column.align}>
                                                            {column.format ? column.format(value, row) : (value !== null && value !== undefined ? String(value) : '-')}
                                                        </TableCell>
                                                    );
                                                })}
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                            {totalRows > 0 && (
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
                        </>
                    )}
                </Paper>
            </Box>
        </ThemeProvider>
    );
}

export default WebsiteEnquiriesMui;
