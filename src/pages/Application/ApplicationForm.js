import React, { useEffect, useReducer, useState, useCallback } from "react";
import {
  Box,
  Button,
  Typography,
  Grid,
  CircularProgress,
  Paper,
  ThemeProvider,
  Divider,
  CssBaseline,
  Container,
  styled,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ajaxCall, ajaxCallWithHeaderOnly } from "../../helpers/ajaxCall";
import { uiAction } from "../../store/uiStore";
import FileUpload from "../../components/UI/Form/FileUpload";
import SelectionBox from "../../components/UI/Form/SelectionBox";
import ApplicantDetails from "./ApplicantDetails";
import lavenderTheme from "../../theme";

const UploadBox = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(2),
  marginBottom: theme.spacing(2),
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  minHeight: 80,
  cursor: "pointer",
  transition: "all 0.2s ease",
  border: `1px solid ${theme.palette.primary.main}`,
  "&:hover": {
    backgroundColor: theme.palette.primary.light,
  },
}));

const UploadIcon = styled("div")(({ theme }) => ({
  color: theme.palette.primary.main,
  marginBottom: theme.spacing(1),
  display: "flex",
  justifyContent: "center",
}));

const SubmitButton = styled(Button)(({ theme }) => ({
  padding: theme.spacing(1, 4),
  marginTop: theme.spacing(2),
}));

const initialState = {
  enqId: null,
  tenthMarksheet: null,
  twelvethMarksheet: null,
  diplomaMarksheet: null,
  bachelorMarksheet: null,
  masterMarksheet: null,
  lor: null,
  resume: null,
  languageExam: null,
  passport: null,
  assignedUser: null,
  status: null,
  sop: null,
  rcvd_offer_letter: null,
  university_interested: "",
  course_interested: "",
  intake_interested: "",
  level_applying_for: "",
};

const reducerFile = (state, action) => {
  if (action?.all) {
    return {
      enqId: action.data.enqId,
      tenthMarksheet: action.data.tenthMarksheet,
      twelvethMarksheet: action.data.twelvethMarksheet,
      diplomaMarksheet: action.data.diplomaMarksheet,
      bachelorMarksheet: action.data.bachelorMarksheet,
      masterMarksheet: action.data.masterMarksheet,
      lor: action.data.lor,
      resume: action.data.resume,
      languageExam: action.data.languageExam,
      passport: action.data.passport,
      assignedUser: action.data.assignedUser,
      status: action.data.status,
      sop: action.data.sop,
      rcvd_offer_letter: action.data.rcvd_offer_letter,
      university_interested: action.data.university_interested,
      course_interested: action.data.course_interested,
      intake_interested: action.data.intake_interested,
      level_applying_for: action.data.level_applying_for,
    };
  }
  return { ...state, [action.type]: action.value };
};

const DocumentUpload = ({
  label,
  fieldName,
  file,
  onChange,
  linkText,
  linkUrl,
}) => {
  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="subtitle1" sx={{ mb: 1 }}>
        {label}{" "}
        {linkText && (
          <>
            /{" "}
            <a
              href={linkUrl}
              target="_blank"
              rel="noreferrer"
              style={{ color: "#9575cd" }}
            >
              {linkText}
            </a>
          </>
        )}
      </Typography>
      <UploadBox>
        <FileUpload
          isEdit={true}
          onChange={onChange}
          groupClassName="upload-box-inner"
          afile={file}
          minUploadSize="0.005"
          maxUploadSize="10"
        />
        <UploadIcon>
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M17 8L12 3L7 8"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M12 3V15"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </UploadIcon>
        <Typography variant="body2" color="text.secondary">
          {file
            ? file instanceof File
              ? `File: ${file.name}`
              : "File uploaded"
            : "No files uploaded yet"}
        </Typography>
      </UploadBox>
    </Box>
  );
};

const ApplicationForm = ({ edit, enqID, appId }) => {
  const [fileData, dispatchFile] = useReducer(reducerFile, initialState);
  const [loadError, setLoadError] = useState({
    isLoading: edit,
    isError: false,
    isSubmitting: false,
  });
  const [throwErr, setThrowErr] = useState(null);
  const [studentName, setStudentName] = useState("");

  const authData = useSelector((state) => state.authStore);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (throwErr) throw throwErr;
  }, [throwErr]);

  const fetchApplicationData = useCallback(async () => {
    if (!appId) {
      setLoadError({
        isLoading: false,
        isError: "Application ID is missing.",
        isSubmitting: false,
      });
      return;
    }
    setLoadError((prev) => ({ ...prev, isLoading: true, isError: false }));
    try {
      const response = await ajaxCallWithHeaderOnly(
        `get/courseinfo/?courseinfo_id=${appId}`,
        { Authorization: `Bearer ${authData.accessToken}` },
        "POST",
        null
      );
      if (response?.isNetwork) {
        setThrowErr({ ...response, page: "appForm" });
        return;
      }
      if (response?.status === 401 || response?.status === 204) {
        setThrowErr({ ...response, page: "appForm" });
        return;
      }
      if (response?.status === 404) {
        setThrowErr({ ...response, status: 204, page: "appForm" });
        return;
      }
      if (!response?.results || response.results.length === 0) {
        setLoadError({
          isLoading: false,
          isError: "Application data not found.",
          isSubmitting: false,
        });
        return;
      }

      const mainResponse = response.results[0];
      dispatchFile({
        all: true,
        data: {
          enqId: mainResponse?.student_info?.name?.id,
          tenthMarksheet: mainResponse.student_info?.Tenth_Marksheet,
          twelvethMarksheet: mainResponse.student_info?.Twelveth_Marksheet,
          diplomaMarksheet: mainResponse.student_info?.Diploma_Marksheet,
          bachelorMarksheet: mainResponse.student_info?.Bachelor_Marksheet,
          masterMarksheet: mainResponse.student_info?.Master_Marksheet,
          passport: mainResponse.student_info?.passport,
          lor: mainResponse.student_info?.Lor,
          resume: mainResponse.student_info?.Resume,
          languageExam: mainResponse.student_info?.Language_Exam,
          assignedUser: mainResponse?.assigned_users?.id,
          status: mainResponse?.status?.id,
          sop: mainResponse?.student_info?.Sop,
          rcvd_offer_letter: mainResponse?.rcvd_offer_letter,
          university_interested: mainResponse?.university_interested?.id,
          course_interested: mainResponse?.course_interested?.id,
          intake_interested: mainResponse?.intake_interested?.id,
          level_applying_for: mainResponse?.level_applying_for?.id,
        },
      });
      setLoadError({ isLoading: false, isError: false, isSubmitting: false });
    } catch (e) {
      setThrowErr({ e, page: "appForm_fetch" });
      setLoadError({
        isLoading: false,
        isError: "Failed to load application data.",
        isSubmitting: false,
      });
    }
  }, [appId, authData.accessToken]);

  useEffect(() => {
    if (!edit) {
      if (enqID) {
        dispatchFile({ type: "enqId", value: enqID });
      }
      setLoadError({ isLoading: false, isError: false, isSubmitting: false });
      return;
    }
    fetchApplicationData();
  }, [edit, enqID, fetchApplicationData]);

  const handleChange = (fileName, file) => {
    dispatchFile({ type: fileName, value: file });
  };

  const handleStudentSelect = (val, nameObj) => {
    dispatchFile({ type: "enqId", value: val });
    if (nameObj) {
      setStudentName(nameObj.name);
    }
  };

  const submitApp = async function () {
    // Validation
    if (!fileData.enqId) {
      setLoadError({
        isError: "Please Select Student Name",
        isLoading: false,
        isSubmitting: false,
      });
      return;
    }

    let err = "Please upload ",
      isErr = false;
    if (!fileData.tenthMarksheet) {
      err += "10th Marksheet";
      isErr = true;
    }
    if (!fileData.twelvethMarksheet) {
      err += isErr ? ", " : "";
      err += "12th Marksheet";
      isErr = true;
    }
    if (!fileData.passport) {
      err += isErr ? ", " : "";
      err += "passport";
      isErr = true;
    }

    if (isErr) {
      setLoadError({
        isError: err + " document(s).",
        isLoading: false,
        isSubmitting: false,
      });
      return;
    }

    setLoadError({ isLoading: false, isError: false, isSubmitting: true });

    const fdata = new FormData();
    fdata.append("name", fileData.enqId);

    // Append files only if they are File objects (newly uploaded)
    if (fileData.tenthMarksheet instanceof File)
      fdata.append("Tenth_Marksheet", fileData.tenthMarksheet);
    if (fileData.diplomaMarksheet instanceof File)
      fdata.append("Diploma_Marksheet", fileData.diplomaMarksheet);
    if (fileData.twelvethMarksheet instanceof File)
      fdata.append("Twelveth_Marksheet", fileData.twelvethMarksheet);
    if (fileData.bachelorMarksheet instanceof File)
      fdata.append("Bachelor_Marksheet", fileData.bachelorMarksheet);
    if (fileData.masterMarksheet instanceof File)
      fdata.append("Master_Marksheet", fileData.masterMarksheet);
    if (fileData.lor instanceof File) fdata.append("Lor", fileData.lor);
    if (fileData.resume instanceof File)
      fdata.append("Resume", fileData.resume);
    if (fileData.languageExam instanceof File)
      fdata.append("Language_Exam", fileData.languageExam);
    if (fileData.passport instanceof File)
      fdata.append("passport", fileData.passport);
    if (fileData.sop instanceof File) fdata.append("Sop", fileData.sop);
    if (fileData.rcvd_offer_letter instanceof File)
      fdata.append("rcvd_offer_letter", fileData.rcvd_offer_letter);

    // Append other IDs if they exist
    if (fileData.university_interested)
      fdata.append("university_interested", fileData.university_interested);
    if (fileData.course_interested)
      fdata.append("course_interested", fileData.course_interested);
    if (fileData.intake_interested)
      fdata.append("intake_interested", fileData.intake_interested);
    if (fileData.level_applying_for)
      fdata.append("level_applying_for", fileData.level_applying_for);
    if (fileData.assignedUser)
      fdata.append("assigned_users", fileData.assignedUser);
    if (fileData.status) fdata.append("status", fileData.status);

    let url, method;
    if (edit && appId) {
      url = `create/app/courseinfo/${appId}/`;
      method = "PATCH";
    } else {
      url = "create/app/courseinfo/";
      method = "POST";
    }

    try {
      const response = await ajaxCall(
        url,
        { Authorization: `Bearer ${authData.accessToken}` },
        method,
        fdata
      );
      if (response?.isNetwork) {
        setThrowErr({ ...response, page: "appForm_submit" });
        return;
      }
      if (response?.status === 401 || response?.status === 204) {
        setThrowErr({ ...response, page: "appForm_submit_auth" });
        return;
      }
      if (response?.status === 400) {
        setLoadError({
          isError:
            response.data?.detail ||
            "Please check all form fields and try again.",
          isLoading: false,
          isSubmitting: false,
        });
        return;
      }
      if (response?.status >= 500) {
        setLoadError({
          isError: "Server error, please try again later.",
          isLoading: false,
          isSubmitting: false,
        });
        return;
      }

      setLoadError({ isLoading: false, isError: false, isSubmitting: false });
      dispatch(
        uiAction.setNotification({
          show: true,
          heading: "Application",
          msg: `Application ${edit ? "updated" : "created"} successfully.`,
        })
      );
      navigate(`/applications/`);
    } catch (e) {
      setThrowErr({ e, page: "appForm_submit_catch" });
      setLoadError({
        isLoading: false,
        isError: "An unexpected error occurred.",
        isSubmitting: false,
      });
    }
  };

  if (loadError.isLoading && edit) {
    return (
      <ThemeProvider theme={lavenderTheme}>
        <CssBaseline />
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "80vh",
            bgcolor: "background.default",
          }}
        >
          <CircularProgress size={40} sx={{ color: "primary.main", mr: 2 }} />
          <Typography variant="h6">Loading Application Details...</Typography>
        </Box>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={lavenderTheme}>
      <CssBaseline />
      <Box
        sx={{
          py: 3,
          px: 3,
          bgcolor: "background.default",
          minHeight: "calc(100vh - 64px)",
        }}
      >
        <Container maxWidth="xl" disableGutters>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Paper elevation={0} sx={{ p: 3, height: "100%" }}>
                <Typography
                  variant="h5"
                  component="h1"
                  sx={{ mb: 3, color: "text.primary" }}
                >
                  {edit ? "Edit Application" : "Create Application"}
                </Typography>

                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle1" sx={{ mb: 1 }}>
                    Name
                  </Typography>
                  <SelectionBox
                    disabled={edit && !!fileData.enqId}
                    groupClass="mui-selection-box"
                    groupId="enqId"
                    value={fileData.enqId}
                    onChange={handleStudentSelect}
                    name="enqId"
                    url={
                      edit && fileData.enqId
                        ? `view-enquiry/?id=${fileData.enqId}`
                        : `view-enquiry/`
                    }
                    isSearch={true}
                    objKey="student_name"
                    placeholder="Select a student"
                  />
                  {loadError.isError &&
                    loadError.isError.includes("Student Name") && (
                      <Typography color="error" variant="caption">
                        Please select a student
                      </Typography>
                    )}
                </Box>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={4}>
                    <DocumentUpload
                      label="Passport"
                      fieldName="passport"
                      file={fileData.passport}
                      onChange={(file) => handleChange("passport", file)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <DocumentUpload
                      label="10th Marksheet"
                      fieldName="tenthMarksheet"
                      file={fileData.tenthMarksheet}
                      onChange={(file) => handleChange("tenthMarksheet", file)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <DocumentUpload
                      label="12th Marksheet"
                      fieldName="twelvethMarksheet"
                      file={fileData.twelvethMarksheet}
                      onChange={(file) =>
                        handleChange("twelvethMarksheet", file)
                      }
                    />
                  </Grid>
                </Grid>

                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <DocumentUpload
                      label="Resume"
                      fieldName="resume"
                      file={fileData.resume}
                      onChange={(file) => handleChange("resume", file)}
                      linkText="Create Resume Now"
                      linkUrl="https://getcv.me"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <DocumentUpload
                      label="Lor"
                      fieldName="lor"
                      file={fileData.lor}
                      onChange={(file) => handleChange("lor", file)}
                    />
                  </Grid>
                </Grid>
                <Divider
                  sx={{
                    my: 2,
                    borderColor: lavenderTheme.palette.primary.main,
                  }}
                />
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <DocumentUpload
                      label="Diploma Marksheet"
                      fieldName="diplomaMarksheet"
                      file={fileData.diplomaMarksheet}
                      onChange={(file) =>
                        handleChange("diplomaMarksheet", file)
                      }
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <DocumentUpload
                      label="Bachelor Marksheet"
                      fieldName="bachelorMarksheet"
                      file={fileData.bachelorMarksheet}
                      onChange={(file) =>
                        handleChange("bachelorMarksheet", file)
                      }
                    />
                  </Grid>
                </Grid>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <DocumentUpload
                      label="Master Marksheet"
                      fieldName="masterMarksheet"
                      file={fileData.masterMarksheet}
                      onChange={(file) => handleChange("masterMarksheet", file)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <DocumentUpload
                      label="Language Exam"
                      fieldName="languageExam"
                      file={fileData.languageExam}
                      onChange={(file) => handleChange("languageExam", file)}
                    />
                  </Grid>
                </Grid>
                <SubmitButton
                  variant="contained"
                  onClick={submitApp}
                  disabled={loadError.isSubmitting}
                >
                  {loadError.isSubmitting ? (
                    <>
                      <CircularProgress
                        size={20}
                        color="inherit"
                        sx={{ mr: 1 }}
                      />
                      Submitting...
                    </>
                  ) : (
                    "Submit"
                  )}
                </SubmitButton>
                {loadError.isError &&
                  !loadError.isError.includes("Student Name") && (
                    <Typography color="error" sx={{ mt: 2 }}>
                      {loadError.isError}
                    </Typography>
                  )}
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper elevation={0} sx={{ p: 3, height: "100%" }}>
                {fileData.enqId ? (
                  <ApplicantDetails
                    enqId={fileData.enqId}
                    sop={fileData.sop}
                    rcvd_offer_letter={fileData.rcvd_offer_letter}
                    university_interested={fileData.university_interested}
                    course_interested={fileData.course_interested}
                    intake_interested={fileData.intake_interested}
                    level_applying_for={fileData.level_applying_for}
                    dispatchFunction={dispatchFile}
                    handleChange={handleChange}
                    assignedUser={fileData.assignedUser}
                    status={fileData.status}
                  />
                ) : (
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      height: "100%",
                      minHeight: 300,
                      color: "text.secondary",
                    }}
                  >
                    <Typography variant="h5" gutterBottom>
                      Applicant Details
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{ mt: 2, textAlign: "center" }}
                    >
                      Please select a student to view their details
                    </Typography>
                  </Box>
                )}
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default ApplicationForm;
