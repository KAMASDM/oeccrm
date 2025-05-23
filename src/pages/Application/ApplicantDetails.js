import React, { useCallback, useEffect, useState } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  alpha, 
  Divider,
} from "@mui/material";
import { ajaxCallWithHeaderOnly } from "../../helpers/ajaxCall";
import { useSelector } from "react-redux";
import SelectionBox from "../../components/UI/Form/SelectionBox";
import FileUpload from "../../components/UI/Form/FileUpload";
import lavenderTheme from "../../theme";

const ApplicantDetails = ({
  enqId,
  sop,
  appId,
  university_interested,
  course_interested,
  intake_interested,
  level_applying_for,
  dispatchFunction,
  handleChange,
  assignedUser,
  status,
}) => {
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
        `enquiries/${enqId}/`,
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
  }, [authData.accessToken, enqId]);

  useEffect(() => {
    if (enqId) {
      setIsLoading(true);
      getEnqdata();
    }
  }, [getEnqdata, enqId]);

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

      {/* Detail Row structure updated for responsiveness */}
      <Box
        sx={(theme) => ({
          display: "flex",
          flexDirection: { xs: "column", sm: "row" }, // Stack on xs, flex on sm+
          alignItems: "flex-start",
          marginBottom: theme.spacing(1.5),
        })}
      >
        <Typography
          variant="subtitle1" // Changed to subtitle1 for label prominence
          sx={(theme) => ({
            minWidth: { xs: "auto", sm: "180px" }, // Auto width on xs, fixed on sm+
            color: theme.palette.text.secondary,
            fontWeight: 500,
            marginBottom: { xs: theme.spacing(0.5), sm: 0 }, // Add margin bottom on xs for stacking
          })}
        >
          Name
        </Typography>
        <Typography
          variant="body1"
          sx={(theme) => ({
            flex: { xs: "none", sm: 1 }, // No flex on xs, flex on sm+
            wordBreak: "break-word",
            color: theme.palette.text.primary,
          })}
        >
          : {data.student_name}
        </Typography>
      </Box>

      <Box
        sx={(theme) => ({
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          alignItems: "flex-start",
          marginBottom: theme.spacing(1.5),
        })}
      >
        <Typography
          variant="subtitle1"
          sx={(theme) => ({
            minWidth: { xs: "auto", sm: "180px" },
            color: theme.palette.text.secondary,
            fontWeight: 500,
            marginBottom: { xs: theme.spacing(0.5), sm: 0 },
          })}
        >
          Phone
        </Typography>
        <Typography
          variant="body1"
          sx={(theme) => ({
            flex: { xs: "none", sm: 1 },
            wordBreak: "break-word",
            color: theme.palette.text.primary,
          })}
        >
          : {data.student_phone || "-"}
        </Typography>
      </Box>

      <Box
        sx={(theme) => ({
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          alignItems: "flex-start",
          marginBottom: theme.spacing(1.5),
        })}
      >
        <Typography
          variant="subtitle1"
          sx={(theme) => ({
            minWidth: { xs: "auto", sm: "180px" },
            color: theme.palette.text.secondary,
            fontWeight: 500,
            marginBottom: { xs: theme.spacing(0.5), sm: 0 },
          })}
        >
          Email Id
        </Typography>
        <Typography
          variant="body1"
          sx={(theme) => ({
            flex: { xs: "none", sm: 1 },
            wordBreak: "break-word",
            color: theme.palette.text.primary,
          })}
        >
          : {data.student_email || "-"}
        </Typography>
      </Box>

      <Box
        sx={(theme) => ({
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          alignItems: "flex-start",
          marginBottom: theme.spacing(1.5),
        })}
      >
        <Typography
          variant="subtitle1"
          sx={(theme) => ({
            minWidth: { xs: "auto", sm: "180px" },
            color: theme.palette.text.secondary,
            fontWeight: 500,
            marginBottom: { xs: theme.spacing(0.5), sm: 0 },
          })}
        >
          Address
        </Typography>
        <Typography
          variant="body1"
          sx={(theme) => ({
            flex: { xs: "none", sm: 1 },
            wordBreak: "break-word",
            color: theme.palette.text.primary,
          })}
        >
          :{" "}
          {data.student_address
            ? `${data.student_address}${data.city ? `, ${data.city}` : ""}${
                data.state ? `, ${data.state}` : ""
              }${data.country ? `, ${data.country}` : ""}${
                data.zipcode ? ` - ${data.zipcode}` : ""
              }`
            : "-"}
        </Typography>
      </Box>

      <Box
        sx={(theme) => ({
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          alignItems: "flex-start",
          marginBottom: theme.spacing(1.5),
        })}
      >
        <Typography
          variant="subtitle1"
          sx={(theme) => ({
            minWidth: { xs: "auto", sm: "180px" },
            color: theme.palette.text.secondary,
            fontWeight: 500,
            marginBottom: { xs: theme.spacing(0.5), sm: 0 },
          })}
        >
          Current Education
        </Typography>
        <Typography
          variant="body1"
          sx={(theme) => ({
            flex: { xs: "none", sm: 1 },
            wordBreak: "break-word",
            color: theme.palette.text.primary,
          })}
        >
          : {data.current_education?.current_education || "-"}
        </Typography>
      </Box>

      <Box
        sx={(theme) => ({
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          alignItems: "flex-start",
          marginBottom: theme.spacing(1.5),
        })}
      >
        <Typography
          variant="subtitle1"
          sx={(theme) => ({
            minWidth: { xs: "auto", sm: "180px" },
            color: theme.palette.text.secondary,
            fontWeight: 500,
            marginBottom: { xs: theme.spacing(0.5), sm: 0 },
          })}
        >
          Previous Visa Refusal
        </Typography>
        <Typography
          variant="body1"
          sx={(theme) => ({
            flex: { xs: "none", sm: 1 },
            wordBreak: "break-word",
            color: theme.palette.text.primary,
          })}
        >
          : {data.visa_refusal ? "YES" : "NO"}
        </Typography>
      </Box>

      {data.visa_refusal && data.visa_file && (
        <Box
          sx={(theme) => ({
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            alignItems: "flex-start",
            marginBottom: theme.spacing(1.5),
          })}
        >
          <Typography
            variant="subtitle1"
            sx={(theme) => ({
              minWidth: { xs: "auto", sm: "180px" },
              color: theme.palette.text.secondary,
              fontWeight: 500,
              marginBottom: { xs: theme.spacing(0.5), sm: 0 },
            })}
          >
            Visa Refusal File
          </Typography>
          <Typography
            variant="body1"
            sx={(theme) => ({
              flex: { xs: "none", sm: 1 },
              wordBreak: "break-word",
              color: theme.palette.text.primary,
            })}
          >
            :{" "}
            <a
              href={data.visa_file}
              target="_blank"
              rel="noreferrer"
              style={{ color: lavenderTheme.palette.primary.main }}
            >
              Download
            </a>
          </Typography>
        </Box>
      )}

      <Box
        sx={(theme) => ({
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          alignItems: "flex-start",
          marginBottom: theme.spacing(1.5),
        })}
      >
        <Typography
          variant="subtitle1"
          sx={(theme) => ({
            minWidth: { xs: "auto", sm: "180px" },
            color: theme.palette.text.secondary,
            fontWeight: 500,
            marginBottom: { xs: theme.spacing(0.5), sm: 0 },
          })}
        >
          DOB
        </Typography>
        <Typography
          variant="body1"
          sx={(theme) => ({
            flex: { xs: "none", sm: 1 },
            wordBreak: "break-word",
            color: theme.palette.text.primary,
          })}
        >
          : {formatDate(data.dob)}
        </Typography>
      </Box>

      <Box
        sx={(theme) => ({
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          alignItems: "flex-start",
          marginBottom: theme.spacing(1.5),
        })}
      >
        <Typography
          variant="subtitle1"
          sx={(theme) => ({
            minWidth: { xs: "auto", sm: "180px" },
            color: theme.palette.text.secondary,
            fontWeight: 500,
            marginBottom: { xs: theme.spacing(0.5), sm: 0 },
          })}
        >
          Passport Number
        </Typography>
        <Typography
          variant="body1"
          sx={(theme) => ({
            flex: { xs: "none", sm: 1 },
            wordBreak: "break-word",
            color: theme.palette.text.primary,
          })}
        >
          : {data.passport_number || "-"}
        </Typography>
      </Box>

      <Box
        sx={(theme) => ({
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          alignItems: "flex-start",
          marginBottom: theme.spacing(1.5),
        })}
      >
        <Typography
          variant="subtitle1"
          sx={(theme) => ({
            minWidth: { xs: "auto", sm: "180px" },
            color: theme.palette.text.secondary,
            fontWeight: 500,
            marginBottom: { xs: theme.spacing(0.5), sm: 0 },
          })}
        >
          Is Married
        </Typography>
        <Typography
          variant="body1"
          sx={(theme) => ({
            flex: { xs: "none", sm: 1 },
            wordBreak: "break-word",
            color: theme.palette.text.primary,
          })}
        >
          : {data.married ? "Yes" : "No"}
        </Typography>
      </Box>

      <Box
        sx={(theme) => ({
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          alignItems: "flex-start",
          marginBottom: theme.spacing(1.5),
        })}
      >
        <Typography
          variant="subtitle1"
          sx={(theme) => ({
            minWidth: { xs: "auto", sm: "180px" },
            color: theme.palette.text.secondary,
            fontWeight: 500,
            marginBottom: { xs: theme.spacing(0.5), sm: 0 },
          })}
        >
          Enquiry Date
        </Typography>
        <Typography
          variant="body1"
          sx={(theme) => ({
            flex: { xs: "none", sm: 1 },
            wordBreak: "break-word",
            color: theme.palette.text.primary,
          })}
        >
          : {formatDate(data.date_created)}
        </Typography>
      </Box>

      <Divider
        sx={{
          my: 2,
          borderColor: (theme) => alpha(theme.palette.primary.main, 0.1),
        }}
      />

      <Box
        sx={(theme) => ({
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          alignItems: "flex-start",
          marginBottom: theme.spacing(1.5),
        })}
      >
        <Typography
          variant="subtitle1"
          sx={(theme) => ({
            minWidth: { xs: "auto", sm: "180px" },
            color: theme.palette.text.secondary,
            fontWeight: 500,
            marginBottom: { xs: theme.spacing(0.5), sm: 0 },
          })}
        >
          University Interested
        </Typography>
        <Typography
          variant="body1"
          sx={{ alignSelf: "center", color: "text.primary" }}
        >
          :
        </Typography>
      </Box>
      <Box sx={{ ml: { xs: 0, sm: 3 }, mr: 0, mb: 2 }}>
        <SelectionBox
          groupClass="mb-3 selectbox mui-selection-box"
          groupId="uniInterested"
          value={university_interested}
          onChange={(val) => {
            dispatchFunction({
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

      <Box
        sx={(theme) => ({
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          alignItems: "flex-start",
          marginBottom: theme.spacing(1.5),
        })}
      >
        <Typography
          variant="subtitle1"
          sx={(theme) => ({
            minWidth: { xs: "auto", sm: "180px" },
            color: theme.palette.text.secondary,
            fontWeight: 500,
            marginBottom: { xs: theme.spacing(0.5), sm: 0 },
          })}
        >
          Intake Interested
        </Typography>
        <Typography
          variant="body1"
          sx={{ alignSelf: "center", color: "text.primary" }}
        >
          :
        </Typography>
      </Box>
      <Box sx={{ ml: { xs: 0, sm: 3 }, mr: 0, mb: 2 }}>
        <SelectionBox
          groupClass="mb-3 selectbox mui-selection-box"
          groupId="intakeInterested"
          value={intake_interested}
          onChange={(val) => {
            dispatchFunction({
              type: "intake_interested",
              value: val,
            });
          }}
          name="intakeInterested"
          url="intakes/"
          isSearch={true}
          objKey="it's different" // This key might need adjustment based on actual API response
          placeholder="Select from options"
        />
      </Box>

      <Box
        sx={(theme) => ({
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          alignItems: "flex-start",
          marginBottom: theme.spacing(1.5),
        })}
      >
        <Typography
          variant="subtitle1"
          sx={(theme) => ({
            minWidth: { xs: "auto", sm: "180px" },
            color: theme.palette.text.secondary,
            fontWeight: 500,
            marginBottom: { xs: theme.spacing(0.5), sm: 0 },
          })}
        >
          Level Applying For
        </Typography>
        <Typography
          variant="body1"
          sx={{ alignSelf: "center", color: "text.primary" }}
        >
          :
        </Typography>
      </Box>
      <Box sx={{ ml: { xs: 0, sm: 3 }, mr: 0, mb: 2 }}>
        <SelectionBox
          groupClass="mb-3 selectbox mui-selection-box"
          groupId="levelApplying"
          value={level_applying_for}
          onChange={(val) => {
            dispatchFunction({
              type: "level_applying_for",
              value: val,
            });
          }}
          name="levelApplying"
          url="courselevels/"
          isSearch={true}
          objKey="levels" // This key might need adjustment based on actual API response
          placeholder="Select from options"
        />
      </Box>

      <Box
        sx={(theme) => ({
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          alignItems: "flex-start",
          marginBottom: theme.spacing(1.5),
        })}
      >
        <Typography
          variant="subtitle1"
          sx={(theme) => ({
            minWidth: { xs: "auto", sm: "180px" },
            color: theme.palette.text.secondary,
            fontWeight: 500,
            marginBottom: { xs: theme.spacing(0.5), sm: 0 },
          })}
        >
          Course Interested
        </Typography>
        <Typography
          variant="body1"
          sx={{ alignSelf: "center", color: "text.primary" }}
        >
          :
        </Typography>
      </Box>
      <Box sx={{ ml: { xs: 0, sm: 3 }, mr: 0, mb: 2 }}>
        <SelectionBox
          groupClass="mb-3 selectbox mui-selection-box"
          groupId="courseIntersted"
          value={course_interested}
          onChange={(val) => {
            dispatchFunction({
              type: "course_interested",
              value: val,
            });
          }}
          name="courseInterested"
          url={
            university_interested && level_applying_for
              ? `courseslists/?university=${university_interested}&course_levels=${level_applying_for}`
              : ""
          }
          isSearch={true}
          objKey="course_name"
          placeholder={
            university_interested && level_applying_for
              ? "Select from options"
              : "Select University, Intake & Course Level to load the courses"
          }
        />
      </Box>

      <Box
        sx={(theme) => ({
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          alignItems: "flex-start",
          marginBottom: theme.spacing(1.5),
        })}
      >
        <Typography
          variant="subtitle1"
          sx={(theme) => ({
            minWidth: { xs: "auto", sm: "180px" },
            color: theme.palette.text.secondary,
            fontWeight: 500,
            marginBottom: { xs: theme.spacing(0.5), sm: 0 },
          })}
        >
          SOP
        </Typography>
        <Typography
          variant="body1"
          sx={{ alignSelf: "center", color: "text.primary" }}
        >
          :
        </Typography>
      </Box>
      <Box sx={{ ml: { xs: 0, sm: 3 }, mr: 0, mb: 2 }}>
        {/* Replaced UploadBox with direct Box component */}
        <Box
          sx={(theme) => ({
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
          })}
        >
          <FileUpload
            appId={appId}
            uploadId="Sop"
            isEdit={true}
            onChange={(val) => {
              dispatchFunction({
                type: "sop",
                value: val,
              });
            }}
            groupId="sopFile"
            groupClassName="enhanced-file-upload"
            fieldName="sopFileIp"
            minUploadSize="0.005"
            maxUploadSize="10"
            afile={sop}
          />
          {/* Replaced UploadIcon with direct Box component */}
          <Box
            sx={(theme) => ({
              color: theme.palette.primary.main,
              marginBottom: theme.spacing(1),
              display: "flex",
              justifyContent: "center",
            })}
          >
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
          </Box>
          <Typography variant="body2" color="text.secondary">
            {sop ? "File uploaded" : "No file uploaded yet"}
          </Typography>
        </Box>
      </Box>

      {authData.user_type === "superuser" && (
        <>
          <Divider
            sx={{
              my: 2,
              borderColor: (theme) => alpha(theme.palette.primary.main, 0.1),
            }}
          />

          <Box
            sx={(theme) => ({
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              alignItems: "flex-start",
              marginBottom: theme.spacing(1.5),
            })}
          >
            <Typography
              variant="subtitle1"
              sx={(theme) => ({
                minWidth: { xs: "auto", sm: "180px" },
                color: theme.palette.text.secondary,
                fontWeight: 500,
                marginBottom: { xs: theme.spacing(0.5), sm: 0 },
              })}
            >
              Assigned Users
            </Typography>
            <Typography
              variant="body1"
              sx={{ alignSelf: "center", color: "text.primary" }}
            >
              :
            </Typography>
          </Box>
          <Box sx={{ ml: { xs: 0, sm: 3 }, mr: 0, mb: 2 }}>
            <SelectionBox
              groupClass="mb-3 selectbox mui-selection-box"
              groupId="assignedUser"
              onChange={handleChange.bind(null, "assignedUser")}
              name="assignedUser"
              url="userlist/"
              value={assignedUser}
              isSearch={true}
              objKey="username"
              placeholder="Select from options"
            />
          </Box>
        </>
      )}

      {authData.user_type !== "Agent" && (
        <>
          <Box
            sx={(theme) => ({
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              alignItems: "flex-start",
              marginBottom: theme.spacing(1.5),
            })}
          >
            <Typography
              variant="subtitle1"
              sx={(theme) => ({
                minWidth: { xs: "auto", sm: "180px" },
                color: theme.palette.text.secondary,
                fontWeight: 500,
                marginBottom: { xs: theme.spacing(0.5), sm: 0 },
              })}
            >
              Status
            </Typography>
            <Typography
              variant="body1"
              sx={{ alignSelf: "center", color: "text.primary" }}
            >
              :
            </Typography>
          </Box>
          <Box sx={{ ml: { xs: 0, sm: 3 }, mr: 0, mb: 2 }}>
            <SelectionBox
              groupClass="mb-3 selectbox mui-selection-box"
              groupId="status"
              onChange={handleChange.bind(null, "status")}
              name="status"
              url="appstatus/"
              value={status}
              objKey="App_status" // This key might need adjustment based on actual API response
              placeholder="Select from options"
            />
          </Box>
        </>
      )}
    </Box>
  );
};

export default ApplicantDetails;
