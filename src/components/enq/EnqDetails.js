import React from "react";
import { Typography, Grid, Card, CardContent, Box, Link } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import HomeIcon from "@mui/icons-material/Home";
import SchoolIcon from "@mui/icons-material/School";
import DescriptionIcon from "@mui/icons-material/Description";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import AssignmentLateIcon from "@mui/icons-material/AssignmentLate";
import CakeIcon from "@mui/icons-material/Cake";
import FingerprintIcon from "@mui/icons-material/Fingerprint";
import FavoriteIcon from "@mui/icons-material/Favorite";
import PublicIcon from "@mui/icons-material/Public";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import DocumentRow from "../app/DocumentRow";

const EnqDetails = ({ data }) => {
  const DetailRow = ({
    icon,
    label,
    value,
    isAddress = false,
    isLink = false,
    linkUrl = null,
  }) => (
    <Box
      sx={(theme) => ({
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        alignItems: isAddress
          ? "flex-start"
          : { xs: "flex-start", sm: "center" },
        marginBottom: theme.spacing(1.5),
        "&:last-child": {
          marginBottom: 0,
        },
      })}
    >
      <Box
        sx={(theme) => ({
          display: "flex",
          alignItems: isAddress ? "flex-start" : "center",
          marginBottom: { xs: theme.spacing(0.5), sm: 0 },
          minWidth: { xs: "auto", sm: "180px" },
        })}
      >
        {icon &&
          React.cloneElement(icon, {
            color: icon.props.color || "primary",
            sx: { mr: 1, mt: isAddress ? 0.5 : 0 },
          })}
        <Typography
          component="span"
          fontWeight="bold"
          variant="subtitle1"
          sx={{ color: "text.secondary" }}
        >
          {label}
        </Typography>
      </Box>
      <Typography
        variant="body1"
        sx={(theme) => ({
          flex: { xs: "none", sm: 1 },
          wordBreak: "break-word",
          color: theme.palette.text.primary,
        })}
      >
        :{" "}
        {isLink && linkUrl ? (
          <Link
            href={linkUrl}
            target="_blank"
            rel="noreferrer"
            sx={{ color: "primary.main" }}
          >
            {value}
          </Link>
        ) : (
          <span>{value || "-"}</span>
        )}
      </Typography>
    </Box>
  );

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return dateString.split("-").reverse().join("-");
  };

  return (
    <>
      <Grid container justifyContent="center" sx={{ mb: 3 }}>
        <Grid item xs={12}>
          <Typography variant="h4" align="center" gutterBottom>
            Applicant Details
          </Typography>
        </Grid>
      </Grid>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <DetailRow
                icon={<PersonIcon />}
                label="Name"
                value={data.student_name}
              />
              <DetailRow
                icon={<PhoneIcon />}
                label="Phone"
                value={data.student_phone}
              />
              <DetailRow
                icon={<EmailIcon />}
                label="Email Id"
                value={data.student_email}
              />
              <DetailRow
                icon={<HomeIcon />}
                label="Address"
                value={`${data.student_address || ""}${
                  data.city ? `, ${data.city}` : ""
                }${data.state ? `, ${data.state}` : ""}${
                  data.zipcode ? `, ${data.zipcode}` : ""
                }${data.country ? ` - ${data.country}` : ""}`}
                isAddress={true}
              />
              <DetailRow
                icon={<SchoolIcon />}
                label="Current Education"
                value={data.current_education?.current_education}
              />
              <DetailRow
                icon={<DescriptionIcon />}
                label="Notes"
                value={data.notes}
              />
              <DetailRow
                icon={
                  data.visa_refusal ? (
                    <AssignmentLateIcon color="error" />
                  ) : (
                    <AssignmentTurnedInIcon color="success" />
                  )
                }
                label="Previous Visa Refusal"
                value={data.visa_refusal ? "YES" : "NO"}
              />
              <DetailRow
                icon={<DescriptionIcon />}
                label="Visa Refusal File"
                value={data.visa_file ? "Download File" : "-"}
                isLink={!!data.visa_file}
                linkUrl={data.visa_file}
              />
              <DetailRow
                icon={<CakeIcon />}
                label="DOB"
                value={formatDate(data.dob)}
              />
              <DetailRow
                icon={<FingerprintIcon />}
                label="Passport Number"
                value={data.passport_number}
              />
              <DetailRow
                icon={<FavoriteIcon />}
                label="Is Married"
                value={data.married ? "Yes" : "No"}
              />
              <DetailRow
                icon={<PublicIcon />}
                label="Country Interested"
                value={data.country_interested?.country_name}
              />
              <DetailRow
                icon={<CalendarTodayIcon />}
                label="Enquiry Date"
                value={formatDate(data.date_created)}
              />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box textAlign="center" mb={2}>
                <Typography variant="body1" fontWeight="bold">
                  10th Marksheet
                </Typography>
                <DocumentRow
                  id={data.application[0]?.id}
                  docType="10th Marksheet"
                  name={data.student_name}
                  document={data.application[0]?.Tenth_Marksheet}
                  uploadKey="Tenth_Marksheet"
                  setRefresherNeeded={() => {}}
                />
              </Box>
              <Box textAlign="center" mb={2}>
                <Typography variant="body1" fontWeight="bold">
                  12th Marksheet
                </Typography>
                <DocumentRow
                  id={data.application[0]?.id}
                  docType="12th Marksheet"
                  name={data.student_name}
                  document={data.application[0]?.Twelveth_Marksheet}
                  uploadKey="Twelveth_Marksheet"
                  setRefresherNeeded={() => {}}
                />
              </Box>
              <Box textAlign="center" mb={2}>
                <Typography variant="body1" fontWeight="bold">
                  Diploma Marksheet
                </Typography>
                <DocumentRow
                  id={data.application[0]?.id}
                  docType="Diploma Marksheet"
                  name={data.student_name}
                  document={data.application[0]?.Diploma_Marksheet}
                  uploadKey="Diploma_Marksheet"
                  setRefresherNeeded={() => {}}
                />
              </Box>
              <Box textAlign="center" mb={2}>
                <Typography variant="body1" fontWeight="bold">
                  Bachelor Marksheet
                </Typography>
                <DocumentRow
                  id={data.application[0]?.id}
                  docType="Bachelor_Marksheet"
                  name={data.student_name}
                  document={data.application[0]?.Bachelor_Marksheet}
                  uploadKey="Bachelor_Marksheet"
                  setRefresherNeeded={() => {}}
                />
              </Box>
              <Box textAlign="center" mb={2}>
                <Typography variant="body1" fontWeight="bold">
                  Language Exam
                </Typography>
                <DocumentRow
                  id={data.application[0]?.id}
                  docType="Language_Exam"
                  name={data.student_name}
                  document={data.application[0]?.Language_Exam}
                  uploadKey="Language_Exam"
                  setRefresherNeeded={() => {}}
                />
              </Box>
              <Box textAlign="center" mb={2}>
                <Typography variant="body1" fontWeight="bold">
                  Master Marksheet
                </Typography>
                <DocumentRow
                  id={data.application[0]?.id}
                  docType="Master_Marksheet"
                  name={data.student_name}
                  document={data.application[0]?.Master_Marksheet}
                  uploadKey="Master_Marksheet"
                  setRefresherNeeded={() => {}}
                />
              </Box>
              <Box textAlign="center" mb={2}>
                <Typography variant="body1" fontWeight="bold">
                  Resume
                </Typography>
                <DocumentRow
                  id={data.application[0]?.id}
                  docType="Resume"
                  name={data.student_name}
                  document={data.application[0]?.Resume}
                  uploadKey="Resume"
                  setRefresherNeeded={() => {}}
                />
              </Box>
              <Box textAlign="center" mb={2}>
                <Typography variant="body1" fontWeight="bold">
                  Lor
                </Typography>
                <DocumentRow
                  id={data.application[0]?.id}
                  docType="Lor"
                  name={data.student_name}
                  document={data.application[0]?.Lor}
                  uploadKey="Lor"
                  setRefresherNeeded={() => {}}
                />
              </Box>
              <Box textAlign="center" mb={2}>
                <Typography variant="body1" fontWeight="bold">
                  Passport
                </Typography>
                <DocumentRow
                  id={data.application[0]?.id}
                  docType="passport"
                  name={data.student_name}
                  document={data.application[0]?.passport}
                  uploadKey="passport"
                  setRefresherNeeded={() => {}}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </>
  );
};

export default EnqDetails;
