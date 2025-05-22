import React from "react";
import {
  Typography,
  Grid,
  Card,
  CardContent,
  Box,
  Link,
  Divider,
} from "@mui/material";
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

function EnqDetails({ data }) {
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
              <Box display="flex" alignItems="center" mb={1}>
                <PersonIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="body1">
                  <Typography component="span" fontWeight="bold">
                    Name
                  </Typography>{" "}
                  : <span>{data.student_name}</span>
                </Typography>
              </Box>
              <Box display="flex" alignItems="center" mb={1}>
                <PhoneIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="body1">
                  <Typography component="span" fontWeight="bold">
                    Phone
                  </Typography>{" "}
                  : <span>{data.student_phone}</span>
                </Typography>
              </Box>
              <Box display="flex" alignItems="center" mb={1}>
                <EmailIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="body1">
                  <Typography component="span" fontWeight="bold">
                    Email Id
                  </Typography>{" "}
                  : <span>{data.student_email}</span>
                </Typography>
              </Box>
              <Box display="flex" alignItems="flex-start" mb={1}>
                <HomeIcon color="primary" sx={{ mr: 1, mt: 0.5 }} />
                <Typography variant="body1">
                  <Typography component="span" fontWeight="bold">
                    Address
                  </Typography>{" "}
                  :
                  <span>
                    {data.student_address}, {data.city}, {data.state},{" "}
                    {data.zipcode} -{data.country}
                  </span>
                </Typography>
              </Box>
              <Box display="flex" alignItems="center" mb={1}>
                <SchoolIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="body1">
                  <Typography component="span" fontWeight="bold">
                    Current Education
                  </Typography>{" "}
                  :<span>{data.current_education?.current_education}</span>
                </Typography>
              </Box>
              <Box display="flex" alignItems="flex-start" mb={1}>
                <DescriptionIcon color="primary" sx={{ mr: 1, mt: 0.5 }} />
                <Typography variant="body1">
                  <Typography component="span" fontWeight="bold">
                    Notes
                  </Typography>{" "}
                  : <span>{data.notes}</span>
                </Typography>
              </Box>
              <Box display="flex" alignItems="center" mb={1}>
                {data.visa_refusal ? (
                  <AssignmentLateIcon color="error" sx={{ mr: 1 }} />
                ) : (
                  <AssignmentTurnedInIcon color="success" sx={{ mr: 1 }} />
                )}
                <Typography variant="body1">
                  <Typography component="span" fontWeight="bold">
                    Previous Visa Refusal
                  </Typography>{" "}
                  :<span>{data.visa_refusal ? "YES" : "NO"}</span>
                </Typography>
              </Box>
              <Box display="flex" alignItems="center" mb={1}>
                <DescriptionIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="body1">
                  <Typography component="span" fontWeight="bold">
                    Visa Refusal File
                  </Typography>{" "}
                  :
                  <span>
                    {data.visa_file ? (
                      <Link
                        href={data.visa_file}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Download File
                      </Link>
                    ) : (
                      "-"
                    )}
                  </span>
                </Typography>
              </Box>
              <Box display="flex" alignItems="center" mb={1}>
                <CakeIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="body1">
                  <Typography component="span" fontWeight="bold">
                    DOB
                  </Typography>{" "}
                  : <span>{data.dob.split("-").reverse().join("-")}</span>
                </Typography>
              </Box>
              <Box display="flex" alignItems="center" mb={1}>
                <FingerprintIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="body1">
                  <Typography component="span" fontWeight="bold">
                    Passport Number
                  </Typography>{" "}
                  : <span>{data.passport_number}</span>
                </Typography>
              </Box>
              <Box display="flex" alignItems="center" mb={1}>
                <FavoriteIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="body1">
                  <Typography component="span" fontWeight="bold">
                    Is Married
                  </Typography>{" "}
                  : <span>{data.married ? "Yes" : "No"}</span>
                </Typography>
              </Box>
              <Box display="flex" alignItems="center" mb={1}>
                <PublicIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="body1">
                  <Typography component="span" fontWeight="bold">
                    Country Interested
                  </Typography>{" "}
                  : <span>{data.country_interested?.country_name}</span>
                </Typography>
              </Box>
              <Box display="flex" alignItems="center" mb={1}>
                <CalendarTodayIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="body1">
                  <Typography component="span" fontWeight="bold">
                    Enquiry Date
                  </Typography>{" "}
                  :
                  <span>
                    {data.date_created.split("-").reverse().join("-")}
                  </span>
                </Typography>
              </Box>
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
                  id={data.application[0].id}
                  docType="10th Marksheet"
                  name={data.student_name}
                  document={data.application[0]?.Tenth_Marksheet}
                  uploadKey="Tenth_Marksheet"
                  setRefresherNeeded={() => {}}
                />
              </Box>
              <Divider sx={{ my: 2 }} />
              <Box textAlign="center" mb={2}>
                <Typography variant="body1" fontWeight="bold">
                  12th Marksheet
                </Typography>
                <DocumentRow
                  id={data.application[0].id}
                  docType="12th Marksheet"
                  name={data.student_name}
                  document={data.application[0]?.Twelveth_Marksheet}
                  uploadKey="Twelveth_Marksheet"
                  setRefresherNeeded={() => {}}
                />
              </Box>
              <Divider sx={{ my: 2 }} />
              <Box textAlign="center" mb={2}>
                <Typography variant="body1" fontWeight="bold">
                  Diploma Marksheet
                </Typography>
                <DocumentRow
                  id={data.application[0].id}
                  docType="Diploma Marksheet"
                  name={data.student_name}
                  document={data.application[0]?.Diploma_Marksheet}
                  uploadKey="Diploma_Marksheet"
                  setRefresherNeeded={() => {}}
                />
              </Box>
              <Divider sx={{ my: 2 }} />
              <Box textAlign="center" mb={2}>
                <Typography variant="body1" fontWeight="bold">
                  Bachelor Marksheet
                </Typography>
                <DocumentRow
                  id={data.application[0].id}
                  docType="Bachelor_Marksheet"
                  name={data.student_name}
                  document={data.application[0]?.Bachelor_Marksheet}
                  uploadKey="Bachelor_Marksheet"
                  setRefresherNeeded={() => {}}
                />
              </Box>
              <Divider sx={{ my: 2 }} />
              <Box textAlign="center" mb={2}>
                <Typography variant="body1" fontWeight="bold">
                  Language Exam
                </Typography>
                <DocumentRow
                  id={data.application[0].id}
                  docType="Language_Exam"
                  name={data.student_name}
                  document={data.application[0]?.Language_Exam}
                  uploadKey="Language_Exam"
                  setRefresherNeeded={() => {}}
                />
              </Box>
              <Divider sx={{ my: 2 }} />
              <Box textAlign="center" mb={2}>
                <Typography variant="body1" fontWeight="bold">
                  Master Marksheet
                </Typography>
                <DocumentRow
                  id={data.application[0].id}
                  docType="Master_Marksheet"
                  name={data.student_name}
                  document={data.application[0]?.Master_Marksheet}
                  uploadKey="Master_Marksheet"
                  setRefresherNeeded={() => {}}
                />
              </Box>
              <Divider sx={{ my: 2 }} />
              <Box textAlign="center" mb={2}>
                <Typography variant="body1" fontWeight="bold">
                  Resume
                </Typography>
                <DocumentRow
                  id={data.application[0].id}
                  docType="Resume"
                  name={data.student_name}
                  document={data.application[0]?.Resume}
                  uploadKey="Resume"
                  setRefresherNeeded={() => {}}
                />
              </Box>
              <Divider sx={{ my: 2 }} />
              <Box textAlign="center" mb={2}>
                <Typography variant="body1" fontWeight="bold">
                  Lor
                </Typography>
                <DocumentRow
                  id={data.application[0].id}
                  docType="Lor"
                  name={data.student_name}
                  document={data.application[0]?.Lor}
                  uploadKey="Lor"
                  setRefresherNeeded={() => {}}
                />
              </Box>
              <Divider sx={{ my: 2 }} />
              <Box textAlign="center" mb={2}>
                <Typography variant="body1" fontWeight="bold">
                  Passport
                </Typography>
                <DocumentRow
                  id={data.application[0].id}
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
}

export default EnqDetails;
