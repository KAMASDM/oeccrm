import React, { useCallback, useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  IconButton,
  CircularProgress,
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
  Paper,
  ThemeProvider,
  CssBaseline,
} from "@mui/material";
import {
  Delete as DeleteIcon,
  Warning as WarningIcon,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import {
  ajaxCallWithHeaderOnly,
  ajaxCallWithoutBody,
} from "../../helpers/ajaxCall";
import DocumentRow from "../app/DocumentRow";
import ExportPDF from "../app/ExportPDF";
import { uiAction } from "../../store/uiStore";
import ChangeAssignUser from "../enq/ChangeAssignUser";
import ChangeStatus from "../app/ChangeStatus";
import lavenderTheme from "../../theme";

const CourseUniData = ({
  appId,
  stuName,
  refreshNeeded,
  setRefresherNeeded,
}) => {
  const [enqData, setEnqData] = useState([]);
  const [assignUsrData, setAssignUsrData] = useState([]);
  const [allStatus, setAllStatus] = useState([]);
  const [pageNo, setPageNo] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [totalRows, setTotalRows] = useState(0);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [promptStatus, setPromptStatus] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const authData = useSelector((state) => state.authStore);
  const [throwErr, setThrowErr] = useState(null);
  const dispatch = useDispatch();

  const getAssignUsrData = useCallback(async () => {
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
  }, [authData.accessToken]);

  const getAllStatusData = useCallback(async () => {
    const response = await ajaxCallWithHeaderOnly("appstatus/", {
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
    setAllStatus(
      response.map((option) => ({
        value: option.id,
        name: option.App_status,
      }))
    );
  }, [authData.accessToken]);

  const getUniData = useCallback(
    async (url) => {
      setIsLoadingData(true);
      try {
        const response = await ajaxCallWithHeaderOnly(
          url,
          {
            Authorization: `Bearer ${authData.accessToken}`,
          },
          "GET",
          null
        );

        if (response?.isNetwork || response?.status === 401) {
          setThrowErr({ ...response, page: "enquiries" });
          return;
        }

        if (response?.results?.length > 0) {
          setEnqData(response.results);
          setTotalRows(response.count);
          if (!assignUsrData.length) getAssignUsrData();
          if (!allStatus.length) getAllStatusData();
        } else {
          setEnqData([]);
        }
      } catch (error) {
        setThrowErr({ error, page: "enquiries" });
      } finally {
        setIsLoadingData(false);
        setRefresherNeeded(false);
      }
    },
    [
      authData.accessToken,
      setRefresherNeeded,
      getAssignUsrData,
      getAllStatusData,
      assignUsrData.length,
      allStatus.length,
    ]
  );

  useEffect(() => {
    if (refreshNeeded) {
      getUniData(
        `get/courseinfo/?application=${appId}&page=${
          pageNo + 1
        }&page_size=${perPage}`
      );
    }
  }, [appId, getUniData, refreshNeeded, pageNo, perPage]);

  const handleChangePage = (event, newPage) => {
    setPageNo(newPage);
    setRefresherNeeded(true);
  };

  const handleChangeRowsPerPage = (event) => {
    setPerPage(parseInt(event.target.value, 10));
    setPageNo(0);
    setRefresherNeeded(true);
  };

  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setPromptStatus(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      setIsLoadingData(true);
      const response = await ajaxCallWithoutBody(
        `get/courseinfo/${deleteId}/`,
        {
          Authorization: `Bearer ${authData.accessToken}`,
        },
        "DELETE"
      );

      if (response !== true) {
        setThrowErr({ ...response, page: "applications" });
        return;
      }

      dispatch(
        uiAction.setNotification({
          show: true,
          heading: "Application Deleted Successfully",
          msg: `Application for <strong>${stuName}</strong> deleted successfully`,
        })
      );
      setEnqData([]);
      setRefresherNeeded(true);
    } catch (error) {
      setThrowErr({ error, page: "enquiries" });
    } finally {
      setPromptStatus(false);
      setIsLoadingData(false);
    }
  };

  const renderActionButtons = (row) => (
    <Box display="flex" gap={1}>
      <ExportPDF data={row} />
      {authData.user_type === "superuser" && (
        <Tooltip title="Delete Application">
          <IconButton
            color="error"
            onClick={() => handleDeleteClick(row.id)}
            size="small"
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      )}
    </Box>
  );

  const renderDocumentCell = (row, docType, documentKey) => (
    <DocumentRow
      id={row.id}
      docType={docType}
      name={row.student_name}
      document={row[documentKey]}
      uploadKey={documentKey}
    />
  );

  const columns = [
    {
      id: "actions",
      label: "Actions",
      render: renderActionButtons,
      align: "center",
      width: "120px",
    },
    {
      id: "university",
      label: "University Interested",
      render: (row) => row.university_interested?.univ_name || "-",
      sortable: true,
    },
    {
      id: "level",
      label: "Level Applying For",
      render: (row) => row.level_applying_for?.levels || "-",
    },
    {
      id: "intake",
      label: "Intake Interested",
      render: (row) =>
        row.intake_interested
          ? `${row.intake_interested.intake_month} ${row.intake_interested.intake_year}`
          : "-",
    },
    {
      id: "course",
      label: "Course Interested",
      render: (row) => row.course_interested?.course_name || "-",
    },
    {
      id: "sop",
      label: "SOP",
      render: (row) => renderDocumentCell(row, "SOP", "Sop"),
    },
    {
      id: "offerLetter",
      label: "Offer Letter",
      render: (row) =>
        renderDocumentCell(row, "Offer Letter", "rcvd_offer_letter"),
    },
    ...(authData.user_type === "superuser"
      ? [
          {
            id: "assignedUsers",
            label: "Assigned Users",
            render: (row) => (
              <ChangeAssignUser
                enqName={row.name}
                allUser={assignUsrData}
                name={row.assigned_users?.username || "-"}
                assignId={row.assigned_users?.id}
                courseId={row.id}
              />
            ),
          },
        ]
      : []),
    {
      id: "status",
      label: "Status",
      render: (row) => (
        <ChangeStatus
          enqName={row.name}
          allStatus={allStatus}
          name={row.status?.App_status || "-"}
          statusId={row.status?.id}
          courseId={row.id}
        />
      ),
    },
  ];

  return (
    <ThemeProvider theme={lavenderTheme}>
      <CssBaseline />
      <Paper elevation={0} sx={{ p: 2, borderRadius: 3 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align || "left"}
                    sx={{ fontWeight: 600 }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoadingData ? (
                <TableRow>
                  <TableCell colSpan={columns.length} align="center">
                    <CircularProgress color="primary" />
                  </TableCell>
                </TableRow>
              ) : enqData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={columns.length} align="center">
                    <Typography variant="body2" color="textSecondary">
                      No data available
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                enqData.map((row) => (
                  <TableRow key={row.id} hover>
                    {columns.map((column) => (
                      <TableCell
                        key={`${row.id}-${column.id}`}
                        align={column.align || "left"}
                      >
                        {column.render ? column.render(row) : row[column.id]}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={totalRows}
          rowsPerPage={perPage}
          page={pageNo}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      <Dialog
        open={promptStatus}
        onClose={() => setPromptStatus(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>
          <Box display="flex" alignItems="center" gap={1}>
            <WarningIcon color="error" />
            <Typography variant="h6">Confirm Delete</Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the application for{" "}
            <strong>{stuName}</strong>? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setPromptStatus(false)}
            color="primary"
            variant="outlined"
          >
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
            autoFocus
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </ThemeProvider>
  );
};

export default CourseUniData;
