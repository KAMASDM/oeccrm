import React, { useEffect, useState, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link as RouterLink } from "react-router-dom";
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
  Button,
  IconButton,
  Tooltip,
  TableSortLabel,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Grid,
  ButtonGroup,
  Link as MuiLink,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import SearchIcon from "@mui/icons-material/Search";
import UploadDoc from "../../components/app/UploadDoc";
import DocumentRow from "../../components/app/DocumentRow";
import useExportPDF from "../../hook/useExportPDF";
import ChangeAssignUser from "../../components/enq/ChangeAssignUser";
import SelectionBox from "../../components/UI/Form/SelectionBox";
import AddedByPopup from "../../components/app/AddedByPopup";
import CommentPopup from "../../components/enq/CommentPopup";
import ChangeStatus from "../../components/app/ChangeStatus";
import {
  ajaxCallWithHeaderOnly,
  ajaxCallWithoutBody,
} from "../../helpers/ajaxCall";
import { uiAction } from "../../store/uiStore";
import lavenderTheme from "../../theme";

// Improved parseData function with defensive coding
const parseData = function (response) {
  if (response?.results?.length) {
    return response.results.map((data) => {
      // Safe date handling with defaults
      const dateObj = new Date(data?.created_at || new Date());
      const day = dateObj.getDate();
      const month = dateObj.getMonth() + 1;
      const year = dateObj.getFullYear();
      const formattedDate = `${day < 10 ? "0" + day : day}-${
        month < 10 ? "0" + month : month
      }-${year}`;

      // Ensure id is available to avoid undefined id issues
      const id = data?.id ?? null;

      return {
        id, // Ensure id is never undefined
        ...data,
        application: id, // Make sure application has the same id
        created_at: formattedDate,
        name: data?.student_info?.name?.student_name || "N/A",
        email: data?.student_info?.name?.student_email || "",
        phone: data?.student_info?.name?.student_phone || "",
        address: data?.student_info?.name?.student_address || "",
        country_interested:
          data?.student_info?.name?.country_interested?.country_name ||
          data?.student_info?.name?.country_interested ||
          "",
        current_edu:
          data?.student_info?.name?.current_education?.current_education ||
          data?.student_info?.name?.current_education ||
          "",
        status: data?.status?.App_status || "-",
        statusId: data?.status?.id ?? null,
        added_by: data?.added_by?.username || "-",
        added_byId: data?.added_by?.id ?? null,
        assigned_users: data?.assigned_users?.username || "-",
        assigned_usersId: data?.assigned_users?.id ?? null,
        Tenth_Marksheet: data?.student_info?.Tenth_Marksheet || null,
        passport: data?.student_info?.passport || null,
        Twelveth_Marksheet: data?.student_info?.Twelveth_Marksheet || null,
        Diploma_Marksheet: data?.student_info?.Diploma_Marksheet || null,
        Bachelor_Marksheet: data?.student_info?.Bachelor_Marksheet || null,
        Master_Marksheet: data?.student_info?.Master_Marksheet || null,
        Lor: data?.student_info?.Lor || null,
        Resume: data?.student_info?.Resume || null,
        Language_Exam: data?.student_info?.Language_Exam || null,
        Sop: data?.student_info?.Sop || null,
        rcvd_offer_letter: data?.rcvd_offer_letter || null,
        student_info_id: data?.student_info?.name?.id ?? null,
        university_interested_name:
          data?.university_interested?.univ_name || "-",
        course_interested_name: data?.course_interested?.course_name || "-",
        intake_interested_display: data?.intake_interested
          ? `${data.intake_interested.intake_month || ""} ${
              data.intake_interested.intake_year || ""
            }`
          : "-",
      };
    });
  }
  return [];
};

const Applications = () => {
  const [enqData, setEnqData] = useState([]);
  const [allEnq, setAllEnq] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [assignUsrData, setAssignUsrData] = useState([]);
  const [allStatus, setAllStatus] = useState([]);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [promptDeleteModal, setPromptDeleteModal] = useState(false);
  const [offerLetterUpload, setOfferLetterUpload] = useState({
    show: false,
    id: null,
    name: "",
  });
  const [showCommentPopup, setShowCommentPopup] = useState({
    show: false,
    enqId: null,
    name: null,
  });

  const [appFilter, setAppFilter] = useState({
    enquiry_status: null,
    assigned_usr: null,
  });
  const [generatedPdfUrl, setGeneratedPdfUrl] = useExportPDF();

  const [pageNo, setPageNo] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [totalRows, setTotalRows] = useState(0);
  const [throwErr, setThrowErr] = useState(null);
  const [refreshNeeded, setRefresherNeeded] = useState(true);

  const deleteAppDetails = useRef({});
  const dispatch = useDispatch();
  const authData = useSelector((state) => state.authStore);
  const columnData = useSelector((store) => store.appColumn) || {};

  const [order, setOrder] = useState("desc");
  const [orderBy, setOrderBy] = useState("created_at");

  useEffect(() => {
    if (throwErr) throw throwErr;
  }, [throwErr]);

  const getAssignUsrData = useCallback(async () => {
    const response = await ajaxCallWithHeaderOnly(
      "userlist/?course_related=true",
      { Authorization: `Bearer ${authData.accessToken}` }
    );
    if (response?.isNetwork || (response?.status && response.status !== 200)) {
      setThrowErr({ ...response, page: "applications_users" });
      return;
    }
    if (response?.length)
      setAssignUsrData(
        response.map((option) => ({ value: option.id, name: option.username }))
      );
  }, [authData.accessToken]);

  const getAllStatusData = useCallback(async () => {
    const response = await ajaxCallWithHeaderOnly("appstatus/", {
      Authorization: `Bearer ${authData.accessToken}`,
    });
    if (response?.isNetwork || (response?.status && response.status !== 200)) {
      setThrowErr({ ...response, page: "applications_status" });
      return;
    }
    if (response?.length)
      setAllStatus(
        response.map((option) => ({
          value: option.id,
          name: option.App_status,
        }))
      );
  }, [authData.accessToken]);

  useEffect(() => {
    getAssignUsrData();
    getAllStatusData();
  }, [getAssignUsrData, getAllStatusData]);

  const handleSortRequest = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
    setRefresherNeeded(true);
  };

  const getAppData = useCallback(
    async (url) => {
      setIsLoadingData(true);
      try {
        const response = await ajaxCallWithHeaderOnly(
          url,
          { Authorization: `Bearer ${authData.accessToken}` },
          "POST",
          null
        );
        if (
          response?.isNetwork ||
          (response?.status && response.status !== 200)
        ) {
          setThrowErr({ ...response, page: "applications" });
          setEnqData([]);
          setTotalRows(0);
          setIsLoadingData(false);
          setRefresherNeeded(false);
          return;
        }
        const enqParsed = parseData(response);
        setEnqData(enqParsed);
        setTotalRows(response.count);
      } catch (error) {
        setThrowErr({ error, page: "applications_fetch" });
        setEnqData([]);
        setTotalRows(0);
      } finally {
        setIsLoadingData(false);
        setRefresherNeeded(false);
      }
    },
    [authData.accessToken]
  );

  useEffect(() => {
    if (refreshNeeded) {
      let url = `get/courseinfo/?ordering=${
        order === "desc" ? "-" : ""
      }${orderBy}&p=${pageNo + 1}&records=${perPage}`;
      if (searchText?.length)
        url += `&search=${encodeURIComponent(searchText)}`;
      if (appFilter.enquiry_status)
        url += `&status=${appFilter.enquiry_status}`;
      if (appFilter.assigned_usr)
        url += `&assigned_users=${appFilter.assigned_usr}`;
      if (authData.user_type === "superuser" && !allEnq)
        url += "&assigned_usersf=1";
      getAppData(url);
    }
  }, [
    refreshNeeded,
    pageNo,
    perPage,
    searchText,
    authData.user_type,
    allEnq,
    getAppData,
    appFilter.enquiry_status,
    appFilter.assigned_usr,
    order,
    orderBy,
  ]);

  const handlePerRowsChange = (event) => {
    setPerPage(parseInt(event.target.value, 10));
    setPageNo(0);
    setRefresherNeeded(true);
  };
  const handleChangePage = (event, newPage) => {
    setPageNo(newPage);
    setRefresherNeeded(true);
  };

  const promptDelete = (student_name, deleteId) => {
    deleteAppDetails.current = { name: student_name, id: deleteId };
    setPromptDeleteModal(true);
  };
  const closeDeleteModal = () => setPromptDeleteModal(false);

  const deleteApp = async () => {
    if (!deleteAppDetails.current.id) return;
    try {
      setIsLoadingData(true);
      const response = await ajaxCallWithoutBody(
        `get/courseinfo/${deleteAppDetails.current.id}/`,
        { Authorization: `Bearer ${authData.accessToken}` },
        "DELETE"
      );
      closeDeleteModal();
      if (response !== true) {
        setThrowErr({ ...response, page: "applications_delete" });
        setIsLoadingData(false);
        return;
      }
      dispatch(
        uiAction.setNotification({
          show: true,
          heading: "Application Deleted",
          msg: `<strong>${deleteAppDetails.current.name}</strong> application deleted successfully.`,
        })
      );
      deleteAppDetails.current = {};
      setRefresherNeeded(true);
    } catch (e) {
      setThrowErr({ e, page: "applications_delete_catch" });
      setIsLoadingData(false);
    }
  };

  const filterSelectionChanged = (filterName, val) => {
    setAppFilter((oldFilter) => ({ ...oldFilter, [filterName]: val }));
    setPageNo(0);
    setRefresherNeeded(true);
  };

  const searchThroughText = (e) => {
    e.preventDefault();
    setPageNo(0);
    setRefresherNeeded(true);
  };

  const assignedUserFilterToggle = () => {
    setAllEnq((status) => !status);
    setPageNo(0);
    setRefresherNeeded(true);
  };

  // Enhanced column definitions with defensive programming
  const muiColumns = [
    {
      id: "actions",
      label: "Actions",
      minWidth: 100,
      align: "center",
      format: (value, row) => {
        if (!row) return "-";
        return (
          <Box sx={{ display: "flex", gap: 0.5, justifyContent: "center" }}>
            <Tooltip title="Export PDF">
              <IconButton
                size="small"
                onClick={() => setGeneratedPdfUrl(row)}
                sx={{ color: "info.main" }}
              >
                <PictureAsPdfIcon fontSize="inherit" />
              </IconButton>
            </Tooltip>
            {row.id !== undefined && (
              <Tooltip title="Edit Application">
                <IconButton
                  size="small"
                  sx={{ color: "primary.main" }}
                  component={RouterLink}
                  to={`/application/edit/${row.id}`}
                >
                  <EditIcon fontSize="inherit" />
                </IconButton>
              </Tooltip>
            )}
            {authData.user_type === "superuser" &&
              row.id !== undefined &&
              row.name !== undefined && (
                <Tooltip title="Delete Application">
                  <IconButton
                    size="small"
                    onClick={() => promptDelete(row.name, row.id)}
                    sx={{ color: "error.main" }}
                  >
                    <DeleteIcon fontSize="inherit" />
                  </IconButton>
                </Tooltip>
              )}
          </Box>
        );
      },
    },
    {
      id: "name",
      label: "Name",
      minWidth: 170,
      sortable: true,
      format: (value, row) => {
        if (!row || row.student_info_id === undefined) return value || "-";
        return row.student_info_id ? (
          <MuiLink
            component={RouterLink}
            to={`/student/${row.student_info_id}`}
            sx={{
              color: "primary.main",
              "&:hover": { textDecoration: "underline" },
            }}
          >
            {value}
          </MuiLink>
        ) : (
          value || "-"
        );
      },
    },
    { id: "created_at", label: "App Date", minWidth: 100, sortable: true },
    {
      id: "university_interested_name",
      label: "University",
      minWidth: 150,
      sortable: true,
    },
    {
      id: "course_interested_name",
      label: "Course",
      minWidth: 150,
      sortable: true,
    },
    {
      id: "intake_interested_display",
      label: "Intake",
      minWidth: 120,
      sortable: true,
    },
    {
      id: "assigned_users",
      label: "Assigned To",
      minWidth: 150,
      sortable: true,
      omit: columnData.assignedUser,
      format: (value, row) => {
        if (!row || row.assigned_usersId === undefined || row.id === undefined)
          return value || "-";
        return (
          <ChangeAssignUser
            enqName={row.name || "Unknown"}
            allUser={assignUsrData}
            name={value}
            assignId={row.assigned_usersId}
            courseId={row.id}
          />
        );
      },
    },
    {
      id: "Sop",
      label: "SOP",
      minWidth: 100,
      sortable: false,
      omit: columnData.tenthMarksheet,
      format: (value, row) => {
        if (!row || row.application === undefined) return "-";
        return (
          <DocumentRow
            id={row.application}
            docType="SOP"
            name={row.name || "Unknown"}
            document={value}
            uploadKey="Sop"
            setRefresherNeeded={setRefresherNeeded}
          />
        );
      },
    },
    {
      id: "rcvd_offer_letter",
      label: "Offer Letter",
      minWidth: 120,
      sortable: false,
      omit: columnData.tenthMarksheet,
      format: (value, row) => {
        if (!row || row.id === undefined) return "-";
        return (
          <DocumentRow
            id={row.id}
            docType="Offer Letter"
            name={row.name || "Unknown"}
            document={value}
            uploadKey="rcvd_offer_letter"
            setRefresherNeeded={setRefresherNeeded}
          />
        );
      },
    },
    {
      id: "Tenth_Marksheet",
      label: "10th Marksheet",
      minWidth: 130,
      sortable: false,
      omit: columnData.tenthMarksheet,
      format: (value, row) => {
        if (!row || row.application === undefined) return "-";
        return (
          <DocumentRow
            id={row.application}
            docType="Tenth Marksheet"
            name={row.name || "Unknown"}
            document={value}
            uploadKey="Tenth_Marksheet"
            setRefresherNeeded={setRefresherNeeded}
          />
        );
      },
    },
    {
      id: "Twelveth_Marksheet",
      label: "12th Marksheet",
      minWidth: 130,
      sortable: false,
      omit: columnData.twelvethMarksheet,
      format: (value, row) => {
        if (!row || row.application === undefined) return "-";
        return (
          <DocumentRow
            id={row.application}
            docType="Twelveth Marksheet"
            name={row.name || "Unknown"}
            document={value}
            uploadKey="Twelveth_Marksheet"
            setRefresherNeeded={setRefresherNeeded}
          />
        );
      },
    },
    {
      id: "passport",
      label: "Passport",
      minWidth: 100,
      sortable: false,
      omit: columnData.passport,
      format: (value, row) => {
        if (!row || row.application === undefined) return "-";
        return (
          <DocumentRow
            id={row.application}
            docType="Passport"
            name={row.name || "Unknown"}
            document={value}
            uploadKey="passport"
            setRefresherNeeded={setRefresherNeeded}
          />
        );
      },
    },
    {
      id: "Bachelor_Marksheet",
      label: "Bachelor MS",
      minWidth: 130,
      sortable: false,
      omit: columnData.bachelorMarksheet,
      format: (value, row) => {
        if (!row || row.application === undefined) return "-";
        return (
          <DocumentRow
            id={row.application}
            docType="Bachelor Marksheet"
            name={row.name || "Unknown"}
            document={value}
            uploadKey="Bachelor_Marksheet"
            setRefresherNeeded={setRefresherNeeded}
          />
        );
      },
    },
    {
      id: "Master_Marksheet",
      label: "Master MS",
      minWidth: 130,
      sortable: false,
      omit: columnData.masterMarksheet,
      format: (value, row) => {
        if (!row || row.application === undefined) return "-";
        return (
          <DocumentRow
            id={row.application}
            docType="Master Marksheet"
            name={row.name || "Unknown"}
            document={value}
            uploadKey="Master_Marksheet"
            setRefresherNeeded={setRefresherNeeded}
          />
        );
      },
    },
    {
      id: "Lor",
      label: "LOR",
      minWidth: 100,
      sortable: false,
      omit: columnData.lor,
      format: (value, row) => {
        if (!row || row.application === undefined) return "-";
        return (
          <DocumentRow
            id={row.application}
            docType="LOR"
            name={row.name || "Unknown"}
            document={value}
            uploadKey="Lor"
            setRefresherNeeded={setRefresherNeeded}
          />
        );
      },
    },
    {
      id: "Resume",
      label: "Resume",
      minWidth: 100,
      sortable: false,
      omit: columnData.resume,
      format: (value, row) => {
        if (!row || row.application === undefined) return "-";
        return (
          <DocumentRow
            id={row.application}
            docType="Resume"
            name={row.name || "Unknown"}
            document={value}
            uploadKey="Resume"
            setRefresherNeeded={setRefresherNeeded}
          />
        );
      },
    },
    {
      id: "Language_Exam",
      label: "Lang. Exam",
      minWidth: 120,
      sortable: false,
      omit: columnData.languageExam,
      format: (value, row) => {
        if (!row || row.application === undefined) return "-";
        return (
          <DocumentRow
            id={row.application}
            docType="Language Exam"
            name={row.name || "Unknown"}
            document={value}
            uploadKey="Language_Exam"
            setRefresherNeeded={setRefresherNeeded}
          />
        );
      },
    },
    {
      id: "status",
      label: "Status",
      minWidth: 150,
      sortable: true,
      omit: columnData.status,
      format: (value, row) => {
        if (!row || row.statusId === undefined || row.id === undefined)
          return value || "-";
        return (
          <ChangeStatus
            enqName={row.name || "Unknown"}
            allStatus={allStatus}
            name={value}
            statusId={row.statusId}
            courseId={row.id}
          />
        );
      },
    },
    {
      id: "added_by",
      label: "Added By",
      minWidth: 120,
      sortable: true,
      omit: columnData.addedBy,
      format: (value, row) => {
        if (!row || row.added_byId === undefined) return value || "-";
        return <AddedByPopup id={row.added_byId} name={value} />;
      },
    },
    {
      id: "comments",
      label: "Comments",
      minWidth: 100,
      sortable: false,
      omit: columnData.comments,
      format: (value, row) => {
        if (!row || row.id === undefined) return "-";
        return (
          <Button
            size="small"
            variant="text"
            onClick={() =>
              setShowCommentPopup({
                show: true,
                enqId: row.id,
                name: row.name || "Unknown",
              })
            }
            sx={{ textTransform: "none", fontSize: "0.8rem" }}
          >
            View
          </Button>
        );
      },
    },
  ].filter(
    (col) => authData.user_type === "superuser" || col.id !== "assigned_users"
  );

  return (
    <ThemeProvider theme={lavenderTheme}>
      <Box
        sx={{
          flexGrow: 1,
          p: { xs: 2, sm: 3, md: 4 },
          minHeight: "100vh",
          bgcolor: "background.default",
          color: "text.primary",
          transition: "all 0.3s ease",
          backgroundImage: `radial-gradient(${lavenderTheme.palette.primary.light}20 2px, transparent 0)`, // Using customTheme directly
          backgroundSize: "24px 24px",
          borderRadius: "24px",
        }}
      >
        <Paper elevation={1} sx={{ p: { xs: 2, sm: 3 }, mb: 3 }}>
          <Grid container spacing={2} alignItems="flex-end">
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                label="Search Applications (Name, Email, etc.)"
                variant="outlined"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && searchThroughText(e)}
                InputProps={{
                  endAdornment: (
                    <IconButton
                      onClick={searchThroughText}
                      size="small"
                      aria-label="search applications"
                    >
                      <SearchIcon />
                    </IconButton>
                  ),
                }}
              />
            </Grid>
            {authData.user_type === "superuser" && (
              <Grid item xs={12} sm={6} md={4}>
                <SelectionBox
                  groupClass="mui-selection-box"
                  label="Assigned User"
                  value={appFilter.assigned_usr}
                  onChange={(val, nameObj) =>
                    filterSelectionChanged("assigned_usr", val)
                  }
                  name="assUser"
                  url="userlist/?course_related=true"
                  isSearch={true}
                  objKey="username"
                  placeholder="Filter by Assigned User"
                />
              </Grid>
            )}
            <Grid item xs={12} sm={6} md={4}>
              <SelectionBox
                groupClass="mui-selection-box"
                label="Application Status"
                value={appFilter.enquiry_status}
                onChange={(val, nameObj) =>
                  filterSelectionChanged("enquiry_status", val)
                }
                name="appStatus"
                url="appstatus/"
                isSearch={true}
                objKey="App_status"
                placeholder="Filter by Status"
              />
            </Grid>
          </Grid>
          {authData.user_type === "superuser" && (
            <Box sx={{ my: 2.5, display: "flex", justifyContent: "center" }}>
              <ButtonGroup
                variant="outlined"
                aria-label="outlined primary button group"
              >
                <Button
                  onClick={assignedUserFilterToggle}
                  variant={allEnq ? "contained" : "outlined"}
                >
                  All Applications
                </Button>
                <Button
                  onClick={assignedUserFilterToggle}
                  variant={!allEnq ? "contained" : "outlined"}
                >
                  Unassigned
                </Button>
              </ButtonGroup>
            </Box>
          )}
        </Paper>

        <Paper elevation={1} sx={{ p: { xs: 1, sm: 2 } }}>
          {isLoadingData && enqData.length === 0 ? (
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
                Loading Applications...
              </Typography>
            </Box>
          ) : (
            <>
              <TableContainer
                sx={{
                  maxHeight: {
                    xs: "calc(100vh - 450px)",
                    sm: "calc(100vh - 420px)",
                  },
                }}
              >
                <Table stickyHeader aria-label="sticky applications table">
                  <TableHead>
                    <TableRow>
                      {muiColumns
                        .filter((col) => !col.omit)
                        .map((column) => (
                          <TableCell
                            key={column.id}
                            align={column.align}
                            style={{ minWidth: column.minWidth }}
                            sortDirection={
                              orderBy === column.id ? order : false
                            }
                          >
                            {column.sortable ? (
                              <TableSortLabel
                                active={orderBy === column.id}
                                direction={
                                  orderBy === column.id ? order : "asc"
                                }
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
                    {isLoadingData && enqData.length > 0 && (
                      <TableRow>
                        <TableCell
                          colSpan={muiColumns.filter((col) => !col.omit).length}
                          align="center"
                          sx={{ py: 3 }}
                        >
                          <CircularProgress size={24} sx={{ mr: 1 }} />{" "}
                          Refreshing data...
                        </TableCell>
                      </TableRow>
                    )}
                    {!isLoadingData && enqData.length === 0 && (
                      <TableRow>
                        <TableCell
                          colSpan={muiColumns.filter((col) => !col.omit).length}
                          align="center"
                          sx={{ py: 5 }}
                        >
                          <SearchIcon
                            sx={{ fontSize: 48, color: "text.disabled", mb: 1 }}
                          />
                          <Typography variant="body1" color="text.secondary">
                            No applications found.
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}
                    {!isLoadingData &&
                      enqData.length > 0 &&
                      enqData.map((row, idx) => (
                        <TableRow
                          hover
                          role="checkbox"
                          tabIndex={-1}
                          key={row?.id || `row-${idx}`}
                        >
                          {muiColumns
                            .filter((col) => !col.omit)
                            .map((column) => {
                              const value = row ? row[column.id] : null;
                              return (
                                <TableCell
                                  key={column.id}
                                  align={column.align || "left"}
                                >
                                  {column.format && row
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
                  onRowsPerPageChange={handlePerRowsChange}
                />
              )}
            </>
          )}
        </Paper>

        <Dialog
          open={promptDeleteModal}
          onClose={closeDeleteModal}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          PaperProps={{ sx: { borderRadius: 3, p: 1, minWidth: "320px" } }}
        >
          <DialogTitle
            id="alert-dialog-title"
            sx={{ display: "flex", alignItems: "center", pt: 2 }}
          >
            <WarningAmberIcon
              sx={{ color: "warning.main", mr: 1.5, fontSize: "2.2rem" }}
            />
            Confirm Deletion
          </DialogTitle>
          <DialogContent>
            <DialogContentText
              id="alert-dialog-description"
              sx={{ color: "text.secondary" }}
            >
              Are you sure you want to delete the application for{" "}
              <strong>{deleteAppDetails.current.name}</strong>? This action
              cannot be undone.
            </DialogContentText>
          </DialogContent>
          <DialogActions sx={{ pb: 2, pr: 2, pt: 1 }}>
            <Button
              onClick={closeDeleteModal}
              color="secondary"
              variant="outlined"
              sx={{ borderRadius: 2 }}
            >
              Cancel
            </Button>
            <Button
              onClick={deleteApp}
              color="error"
              variant="contained"
              autoFocus
              sx={{ borderRadius: 2 }}
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>

        {offerLetterUpload.show && (
          <UploadDoc
            changeMode={() =>
              setOfferLetterUpload({ show: false, id: null, name: "" })
            }
            name={offerLetterUpload.name}
            resetApp={() => setRefresherNeeded(true)}
            id={offerLetterUpload.id}
          />
        )}

        {showCommentPopup.show && (
          <CommentPopup
            id={showCommentPopup.enqId}
            title={showCommentPopup.name}
            onHide={() =>
              setShowCommentPopup({ show: false, enqId: null, name: null })
            }
          />
        )}
      </Box>
    </ThemeProvider>
  );
};

export default Applications;
