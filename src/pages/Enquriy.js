import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useSelector } from "react-redux";
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
  Tooltip,
  TableSortLabel,
  Button,
  Stack,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { ajaxCallWithHeaderOnly } from "../helpers/ajaxCall";
import lavenderTheme from "../theme";

const Enquriy = () => {
  const authData = useSelector((state) => state.authStore);
  const [contactData, setContactData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [pageNo, setPageNo] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [totalRows, setTotalRows] = useState(0);
  const [throwErr, setThrowErr] = useState(null);

  const [order, setOrder] = useState("desc");
  const [orderBy, setOrderBy] = useState("id");

  const theme = useMemo(() => lavenderTheme, []);

  useEffect(() => {
    if (throwErr) throw throwErr;
  }, [throwErr]);

  const enquiryColumns = [
    { id: "firstname", label: "First Name", minWidth: 120, sortable: true },
    { id: "lastname", label: "Last Name", minWidth: 120, sortable: true },
    {
      id: "country_interested",
      label: "Country Interested",
      minWidth: 150,
      sortable: true,
    },
    {
      id: "intake_year",
      label: "Intake Year",
      minWidth: 100,
      align: "center",
      sortable: true,
    },
    {
      id: "level_applying",
      label: "Level Applying For",
      minWidth: 150,
      sortable: true,
    },
    { id: "email", label: "Email", minWidth: 170, sortable: true },
    { id: "phone", label: "Phone", minWidth: 120, sortable: true },
    {
      id: "notes",
      label: "Notes",
      minWidth: 200,
      sortable: false,
      format: (value) => (
        <Tooltip title={value || ""} arrow placement="top-start">
          <Typography
            variant="body2"
            noWrap
            sx={{
              maxWidth: 200,
              overflow: "hidden",
              textOverflow: "ellipsis",
              cursor: "default",
            }}
          >
            {value || "-"}
          </Typography>
        </Tooltip>
      ),
    },
  ];

  const handleSortRequest = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const getData = useCallback(
    async (
      currentPage = pageNo,
      rowsPerPage = perPage,
      currentOrder = order,
      currentOrderBy = orderBy
    ) => {
      setIsLoading(true);
      let url = `create/contactus/?p=${currentPage + 1}&records=${rowsPerPage}`;
      // Add ordering to the URL
      if (currentOrderBy) {
        url += `&ordering=${
          currentOrder === "desc" ? "-" : ""
        }${currentOrderBy}`;
      }

      try {
        const response = await ajaxCallWithHeaderOnly(
          url,
          { Authorization: `Bearer ${authData.accessToken}` },
          "GET",
          null
        );

        if (
          response?.isNetwork ||
          (response?.status && response.status !== 200)
        ) {
          console.error("API Error:", response);
          setThrowErr({
            message: response?.message || "Failed to fetch enquiries",
            data: response,
            page: "website_enquiries",
          });
          setContactData([]);
          setTotalRows(0);
          return;
        }
        if (response?.results?.length > 0) {
          setTotalRows(response.count);
          setContactData(response.results);
        } else {
          setTotalRows(0);
          setContactData([]);
        }
      } catch (error) {
        console.error("Fetch Error:", error);
        setThrowErr({
          message: error.message || "An unexpected error occurred",
          errorObj: error,
          page: "website_enquiries_fetch",
        });
        setContactData([]);
        setTotalRows(0);
      } finally {
        setIsLoading(false);
      }
    },
    [authData.accessToken, order, orderBy, pageNo, perPage]
  );

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

    const headers = enquiryColumns.map((col) => col.label).join(",");
    const rows = contactData
      .map((row) =>
        enquiryColumns
          .map((col) => {
            const value = row[col.id] || ""; // Handle undefined or null values
            return `"${String(value).replace(/"/g, '""')}"`; // Escape double quotes and enclose in quotes
          })
          .join(",")
      )
      .join("\n");

    const csvString = `${headers}\n${rows}`;
    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", "website_enquiries.csv");
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <ThemeProvider theme={theme}>
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
        <Paper elevation={1} sx={{ p: { xs: 2, sm: 3 } }}>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            justifyContent="space-between"
            alignItems={{ xs: "flex-start", sm: "center" }}
            spacing={{ xs: 2, sm: 0 }}
            mb={2.5}
          >
            <Typography
              variant="h5"
              component="h1"
              sx={{ fontWeight: "600", color: "primary.dark" }}
            >
              Website Enquiries
            </Typography>
            <Button
              variant="contained"
              color="primary"
              startIcon={<FileDownloadIcon />}
              onClick={handleExportData}
              disabled={isLoading || contactData.length === 0}
              sx={{ width: { xs: "100%", sm: "auto" } }}
            >
              Export CSV
            </Button>
          </Stack>

          {isLoading && contactData.length === 0 ? (
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
                Loading Enquiries...
              </Typography>
            </Box>
          ) : (
            <>
              <TableContainer
                sx={{
                  maxHeight: {
                    xs: "calc(100vh - 320px)",
                    sm: "calc(100vh - 300px)",
                  },
                }}
              >
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
                              direction={orderBy === column.id ? order : "asc"}
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
                        <TableCell
                          colSpan={enquiryColumns.length}
                          align="center"
                          sx={{ py: 3 }}
                        >
                          <CircularProgress size={24} sx={{ mr: 1 }} />{" "}
                          Refreshing data...
                        </TableCell>
                      </TableRow>
                    )}
                    {!isLoading && contactData.length === 0 && (
                      <TableRow>
                        <TableCell
                          colSpan={enquiryColumns.length}
                          align="center"
                          sx={{ py: 5 }}
                        >
                          <SearchIcon
                            sx={{ fontSize: 48, color: "text.disabled", mb: 1 }}
                          />
                          <Typography variant="body1" color="text.secondary">
                            No enquiries found.
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}
                    {!isLoading &&
                      contactData.map((row) => (
                        <TableRow
                          hover
                          role="checkbox"
                          tabIndex={-1}
                          key={row.id || row.email}
                        >
                          {enquiryColumns.map((column) => {
                            const value = row[column.id];
                            return (
                              <TableCell key={column.id} align={column.align}>
                                {column.format
                                  ? column.format(value, row)
                                  : value !== null && value !== undefined
                                  ? String(value)
                                  : "-"}
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
};

export default Enquriy;
