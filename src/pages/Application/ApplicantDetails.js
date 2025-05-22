import React, { useCallback, useEffect, useState } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  styled,
  alpha,
  Divider,
} from "@mui/material";
import { ajaxCallWithHeaderOnly } from "../../helpers/ajaxCall";
import { useSelector } from "react-redux";
import SelectionBox from "../../components/UI/Form/SelectionBox";
import FileUpload from "../../components/UI/Form/FileUpload";

const DetailRow = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "flex-start",
  marginBottom: theme.spacing(1.5),
}));

const DetailLabel = styled(Typography)(({ theme }) => ({
  minWidth: "180px",
  color: theme.palette.text.secondary,
  fontWeight: 500,
  display: "flex",
  alignItems: "center",
}));

const DetailValue = styled(Typography)(({ theme }) => ({
  flex: 1,
  wordBreak: "break-word",
  color: theme.palette.text.primary,
}));

const UploadBox = styled(Box)(({ theme, isUploaded }) => ({
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
  border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
  "&:hover": {
    backgroundColor: alpha(theme.palette.primary.light, 0.1),
  },
}));

const UploadIcon = styled("div")(({ theme }) => ({
  color: theme.palette.primary.main,
  marginBottom: theme.spacing(1),
  display: "flex",
  justifyContent: "center",
}));

function ApplicantDetails(props) {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState(null);
  const authData = useSelector((state) => state.authStore);
  const [throwErr, setThrowErr] = useState(null);

  useEffect(() => {
    if (throwErr) throw throwErr;
  }, [throwErr]);

  const getEnqdata = useCallback(async () => {
    try {
      const response = await ajaxCallWithHeaderOnly(
        `enquiries/${props.enqId}/`,
        { Authorization: `Bearer ${authData.accessToken}` },
        "POST",
        null
      );

      if (response?.isNetwork) {
        setThrowErr({ ...response, page: "enqForm" });
        return;
      }

      if (
        response?.status === 401 ||
        response?.status === 204 ||
        response?.status === 404
      ) {
        setThrowErr({ ...response, page: "enqForm" });
        return;
      }

      if (response?.status) {
        setThrowErr({ ...response, page: "enquiries" });
        return;
      }

      setData(response);
      setIsLoading(false);
    } catch (error) {
      setThrowErr({ error, page: "applicantDetails" });
      setIsLoading(false);
    }
  }, [authData.accessToken, props.enqId]);

  useEffect(() => {
    if (props.enqId) {
      setIsLoading(true);
      getEnqdata();
    }
  }, [getEnqdata, props.enqId]);

  if (isLoading || !data) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "300px",
        }}
      >
        <CircularProgress size={30} sx={{ color: "primary.main" }} />
      </Box>
    );
  }

  // Format date if available
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return dateString.split("-").reverse().join("-");
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Applicant Details
      </Typography>

      <DetailRow>
        <DetailLabel>Name</DetailLabel>
        <DetailValue>: {data.student_name}</DetailValue>
      </DetailRow>

      <DetailRow>
        <DetailLabel>Phone</DetailLabel>
        <DetailValue>: {data.student_phone || "-"}</DetailValue>
      </DetailRow>

      <DetailRow>
        <DetailLabel>Email Id</DetailLabel>
        <DetailValue>: {data.student_email || "-"}</DetailValue>
      </DetailRow>

      <DetailRow>
        <DetailLabel>Address</DetailLabel>
        <DetailValue>
          :{" "}
          {data.student_address
            ? `${data.student_address}${data.city ? `, ${data.city}` : ""}${
                data.state ? `, ${data.state}` : ""
              }${data.country ? `, ${data.country}` : ""}${
                data.zipcode ? ` - ${data.zipcode}` : ""
              }`
            : "-"}
        </DetailValue>
      </DetailRow>

      <DetailRow>
        <DetailLabel>Current Education</DetailLabel>
        <DetailValue>
          : {data.current_education?.current_education || "-"}
        </DetailValue>
      </DetailRow>

      <DetailRow>
        <DetailLabel>Previous Visa Refusal</DetailLabel>
        <DetailValue>: {data.visa_refusal ? "YES" : "NO"}</DetailValue>
      </DetailRow>

      {data.visa_refusal && data.visa_file && (
        <DetailRow>
          <DetailLabel>Visa Refusal File</DetailLabel>
          <DetailValue>
            :{" "}
            <a
              href={data.visa_file}
              target="_blank"
              rel="noreferrer"
              style={{ color: "#9575cd" }}
            >
              Download
            </a>
          </DetailValue>
        </DetailRow>
      )}

      <DetailRow>
        <DetailLabel>DOB</DetailLabel>
        <DetailValue>: {formatDate(data.dob)}</DetailValue>
      </DetailRow>

      <DetailRow>
        <DetailLabel>Passport Number</DetailLabel>
        <DetailValue>: {data.passport_number || "-"}</DetailValue>
      </DetailRow>

      <DetailRow>
        <DetailLabel>Is Married</DetailLabel>
        <DetailValue>: {data.married ? "Yes" : "No"}</DetailValue>
      </DetailRow>

      <DetailRow>
        <DetailLabel>Enquiry Date</DetailLabel>
        <DetailValue>: {formatDate(data.date_created)}</DetailValue>
      </DetailRow>

      <Divider
        sx={{
          my: 2,
          borderColor: (theme) => alpha(theme.palette.primary.main, 0.1),
        }}
      />

      <DetailRow>
        <DetailLabel>University Interested</DetailLabel>
        <DetailValue sx={{ alignSelf: "center" }}>:</DetailValue>
      </DetailRow>
      <Box sx={{ ml: 3, mr: 0, mb: 2 }}>
        <SelectionBox
          groupClass="mb-3 selectbox mui-selection-box"
          groupId="uniInterested"
          value={props.university_interested}
          onChange={(val) => {
            props.dispatchFunction({
              type: "university_interested",
              value: val,
            });
          }}
          name="uniInterested"
          url={`universitieslists/?country=${
            data.country_interested?.id || ""
          }`}
          isSearch={true}
          objKey="univ_name"
          placeholder="Select from options"
        />
      </Box>

      <DetailRow>
        <DetailLabel>Intake Interested</DetailLabel>
        <DetailValue sx={{ alignSelf: "center" }}>:</DetailValue>
      </DetailRow>
      <Box sx={{ ml: 3, mr: 0, mb: 2 }}>
        <SelectionBox
          groupClass="mb-3 selectbox mui-selection-box"
          groupId="intakeInterested"
          value={props.intake_interested}
          onChange={(val) => {
            props.dispatchFunction({
              type: "intake_interested",
              value: val,
            });
          }}
          name="intakeInterested"
          url="intakes/"
          isSearch={true}
          objKey="it's different"
          placeholder="Select from options"
        />
      </Box>

      <DetailRow>
        <DetailLabel>Level Applying For</DetailLabel>
        <DetailValue sx={{ alignSelf: "center" }}>:</DetailValue>
      </DetailRow>
      <Box sx={{ ml: 3, mr: 0, mb: 2 }}>
        <SelectionBox
          groupClass="mb-3 selectbox mui-selection-box"
          groupId="levelApplying"
          value={props.level_applying_for}
          onChange={(val) => {
            props.dispatchFunction({
              type: "level_applying_for",
              value: val,
            });
          }}
          name="levelApplying"
          url="courselevels/"
          isSearch={true}
          objKey="levels"
          placeholder="Select from options"
        />
      </Box>

      <DetailRow>
        <DetailLabel>Course Interested</DetailLabel>
        <DetailValue sx={{ alignSelf: "center" }}>:</DetailValue>
      </DetailRow>
      <Box sx={{ ml: 3, mr: 0, mb: 2 }}>
        <SelectionBox
          groupClass="mb-3 selectbox mui-selection-box"
          groupId="courseIntersted"
          value={props.course_interested}
          onChange={(val) => {
            props.dispatchFunction({
              type: "course_interested",
              value: val,
            });
          }}
          name="courseInterested"
          url={
            props.university_interested && props.level_applying_for
              ? `courseslists/?university=${props.university_interested}&course_levels=${props.level_applying_for}`
              : ""
          }
          isSearch={true}
          objKey="course_name"
          placeholder={
            props.university_interested && props.level_applying_for
              ? "Select from options"
              : "Select University, Intake & Course Level to load the courses"
          }
        />
      </Box>

      <DetailRow>
        <DetailLabel>SOP</DetailLabel>
        <DetailValue sx={{ alignSelf: "center" }}>:</DetailValue>
      </DetailRow>
      <Box sx={{ ml: 3, mr: 0, mb: 2 }}>
        <UploadBox>
          <FileUpload
            appId={props.appId}
            uploadId="Sop"
            isEdit={true}
            onChange={(val) => {
              props.dispatchFunction({
                type: "sop",
                value: val,
              });
            }}
            groupId="sopFile"
            groupClassName="enhanced-file-upload"
            fieldName="sopFileIp"
            minUploadSize="0.005"
            maxUploadSize="10"
            afile={props.sop}
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
            {props.sop ? "File uploaded" : "No file uploaded yet"}
          </Typography>
        </UploadBox>
      </Box>

      {authData.user_type === "superuser" && (
        <>
          <Divider
            sx={{
              my: 2,
              borderColor: (theme) => alpha(theme.palette.primary.main, 0.1),
            }}
          />

          <DetailRow>
            <DetailLabel>Assigned Users</DetailLabel>
            <DetailValue sx={{ alignSelf: "center" }}>:</DetailValue>
          </DetailRow>
          <Box sx={{ ml: 3, mr: 0, mb: 2 }}>
            <SelectionBox
              groupClass="mb-3 selectbox mui-selection-box"
              groupId="assignedUser"
              onChange={props.handleChange.bind(null, "assignedUser")}
              name="assignedUser"
              url="userlist/"
              value={props.assignedUser}
              isSearch={true}
              objKey="username"
              placeholder="Select from options"
            />
          </Box>
        </>
      )}

      {authData.user_type !== "Agent" && (
        <>
          <DetailRow>
            <DetailLabel>Status</DetailLabel>
            <DetailValue sx={{ alignSelf: "center" }}>:</DetailValue>
          </DetailRow>
          <Box sx={{ ml: 3, mr: 0, mb: 2 }}>
            <SelectionBox
              groupClass="mb-3 selectbox mui-selection-box"
              groupId="status"
              onChange={props.handleChange.bind(null, "status")}
              name="status"
              url="appstatus/"
              value={props.status}
              objKey="App_status"
              placeholder="Select from options"
            />
          </Box>
        </>
      )}
    </Box>
  );
}

export default ApplicantDetails;
