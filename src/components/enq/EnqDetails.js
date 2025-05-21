import React from 'react';
import { motion } from 'framer-motion';
// MUI Components
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  Divider,
  Stack,
  Avatar,
  Link,
  useTheme,
  alpha,
  Paper,
  ThemeProvider,
  createTheme,
  CssBaseline,
  Tooltip,
  Zoom,
  IconButton,
  Button,
} from '@mui/material';

// MUI Icons
import PersonIcon from '@mui/icons-material/Person';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import HomeIcon from '@mui/icons-material/Home';
import SchoolIcon from '@mui/icons-material/School';
import NoteIcon from '@mui/icons-material/Note'; // Generic note icon
import GavelIcon from '@mui/icons-material/Gavel'; // For Visa Refusal (implies legal/official matter)
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import FingerprintIcon from '@mui/icons-material/Fingerprint'; // Good for Passport
import FamilyRestroomIcon from '@mui/icons-material/FamilyRestroom';
import FlagIcon from '@mui/icons-material/Flag';
import EventIcon from '@mui/icons-material/Event';
import ArticleIcon from '@mui/icons-material/Article'; // Generic document
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import DescriptionIcon from '@mui/icons-material/Description'; // Can be used as a section icon
import FileUploadIcon from '@mui/icons-material/FileUpload'; // For upload action

// Assuming DocumentRow is a component you have that handles the actual upload/download logic
// For this example, I'll mock it. If DocumentRow has its own styling,
// you might need to adjust it or wrap it.
const DocumentRow = ({ id, name, document, uploadKey, setRefresherNeeded, docType }) => {
  const theme = useTheme();
  if (document) {
    return (
      <Link href={document} target="_blank" rel="noreferrer" sx={{ textDecoration: 'none' }}>
        <Button
          variant="outlined"
          color="primary"
          size="small"
          startIcon={<CloudDownloadIcon />}
          sx={{ 
            textTransform: 'none',
            borderRadius: '8px',
            '&:hover': {
                bgcolor: alpha(theme.palette.primary.main, 0.05)
            }
          }}
        >
          View/Download
        </Button>
      </Link>
    );
  }
  return (
    <Button
      variant="outlined"
      color="secondary"
      size="small"
      startIcon={<FileUploadIcon />}
      onClick={() => alert(`Upload for ${docType}`)} // Replace with actual upload logic trigger
      sx={{ 
        textTransform: 'none',
        borderRadius: '8px',
        '&:hover': {
            bgcolor: alpha(theme.palette.secondary.main, 0.05)
        }
       }}
    >
      Upload Now
    </Button>
  );
};


// Lavender Theme (ensure this is the same as your main theme or imported)
const getLavenderTheme = (mode = 'light') => {
  const lavenderPalette = {
    primary: { light: '#c5b0e6', main: '#9575cd', dark: '#7953b3', contrastText: '#fff' },
    secondary: { light: '#efc0ff', main: '#ba68c8', dark: '#883997', contrastText: '#fff' },
    success: { light: '#a7d7c5', main: '#66bb6a', dark: '#43a047', contrastText: '#fff' },
    error: { light: '#ffb3c4', main: '#f06292', dark: '#e91e63', contrastText: '#fff' },
    info: { light: '#b3e0ff', main: '#64b5f6', dark: '#1976d2', contrastText: '#fff' },
    warning: { light: '#fff1b8', main: '#ffb74d', dark: '#f57c00', contrastText: '#fff' },
  };

  return createTheme({
    palette: {
      mode,
      ...lavenderPalette,
      background: {
        default: mode === 'dark' ? '#232139' : '#f5f3fa',
        paper: mode === 'dark' ? '#2d2a45' : '#ffffff',
      },
      text: {
        primary: mode === 'dark' ? '#f5f3fa' : '#3f3b5b',
        secondary: mode === 'dark' ? '#b8b4d8' : '#69668a',
      },
    },
    shape: { borderRadius: 16 },
    typography: {
      fontFamily: ['Poppins', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', '"Helvetica Neue"', 'Arial', 'sans-serif'].join(','),
    },
    components: {
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 20,
            boxShadow: mode === 'dark' ? '0 10px 20px rgba(0, 0, 0, 0.19)' : '0 10px 20px rgba(149, 117, 205, 0.1)',
            transition: 'transform 0.2s, box-shadow 0.2s',
            '&:hover': { boxShadow: mode === 'dark' ? '0 15px 30px rgba(0, 0, 0, 0.25)' : '0 15px 30px rgba(149, 117, 205, 0.15)' },
            border: mode === 'dark' ? '1px solid rgba(255, 255, 255, 0.05)' : 'none',
          },
        },
      },
      MuiChip: { styleOverrides: { root: { borderRadius: 12, fontWeight: 500 } } },
      MuiAvatar: { styleOverrides: { root: { boxShadow: `0 4px 8px ${mode === 'dark' ? 'rgba(0, 0, 0, 0.3)' : 'rgba(149, 117, 205, 0.2)'}` } } },
      MuiPaper: { styleOverrides: { rounded: { borderRadius: 20 } } },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            textTransform: 'none',
          }
        }
      }
    },
  });
};

// Memoized Information item component
const InfoItem = React.memo(({ icon, label, value, isLink = false, chipValue = null, chipColor = "default" }) => {
  const theme = useTheme();
  return (
    <Grid item xs={12} sm={6} sx={{ display: 'flex', alignItems: 'flex-start', mb: 2.5 }}>
      <Avatar
        variant="rounded"
        sx={{
          width: 40,
          height: 40,
          bgcolor: alpha(theme.palette.primary.main, 0.1),
          color: theme.palette.primary.main,
          mr: 2,
          borderRadius: '12px',
        }}
      >
        {icon}
      </Avatar>
      <Box>
        <Typography variant="caption" color="text.secondary" display="block" sx={{ lineHeight: 1.2 }}>
          {label}
        </Typography>
        {chipValue !== null ? (
          <Chip
            label={chipValue ? "Yes" : "No"}
            color={chipColor}
            size="small"
            icon={chipValue ? <CheckCircleIcon fontSize="small" /> : <CancelIcon fontSize="small" />}
            sx={{ mt: 0.5 }}
          />
        ) : isLink && value ? (
          <Link href={value} target="_blank" rel="noreferrer"
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              color: theme.palette.primary.main,
              textDecoration: 'none',
              fontWeight: 500,
              '&:hover': { textDecoration: 'underline' }
            }}
          >
            <CloudDownloadIcon fontSize="small" sx={{ mr: 0.5 }} />
            View Document
          </Link>
        ) : (
          <Typography variant="body1" fontWeight="medium" sx={{ lineHeight: 1.4 }}>
            {value || <Typography component="span" fontStyle="italic" color="text.disabled">- Not Provided -</Typography>}
          </Typography>
        )}
      </Box>
    </Grid>
  );
});

// Memoized Document item component
const DocumentItem = React.memo(({ label, id, docType, name, document, uploadKey, setRefresherNeeded }) => {
  const theme = useTheme();
  return (
    <Grid item xs={12} sm={6} md={4}>
      <Paper
        elevation={0}
        sx={{
          p: 2.5,
          textAlign: 'center',
          border: `1px solid ${alpha(theme.palette.primary.main, 0.15)}`,
          borderRadius: 3,
          bgcolor: alpha(theme.palette.background.default, 0.5),
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}
      >
        <Stack spacing={1} alignItems="center" sx={{mb:1.5}}>
          <Avatar
            variant="rounded"
            sx={{
              bgcolor: document ? alpha(theme.palette.success.light, 0.3) : alpha(theme.palette.warning.light, 0.3),
              color: document ? theme.palette.success.dark : theme.palette.warning.dark,
              width: 48,
              height: 48,
              borderRadius: '12px'
            }}
          >
            <ArticleIcon />
          </Avatar>
          <Typography variant="subtitle2" fontWeight="medium" color="text.primary">
            {label}
          </Typography>
        </Stack>
        <DocumentRow
          id={id}
          docType={docType}
          name={name}
          document={document}
          uploadKey={uploadKey}
          setRefresherNeeded={setRefresherNeeded}
        />
      </Paper>
    </Grid>
  );
});

// Section Header
const SectionHeader = ({ title, icon, actionComponent = null }) => {
  const theme = useTheme();
  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        mb: 3,
        pb: 1.5,
        borderBottom: `2px solid ${alpha(theme.palette.primary.main, 0.2)}`,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Avatar
          variant="rounded"
          sx={{
            width: 44,
            height: 44,
            bgcolor: alpha(theme.palette.primary.main, 0.12),
            color: theme.palette.primary.main,
            mr: 2,
            borderRadius: '12px',
          }}
        >
          {icon}
        </Avatar>
        <Typography variant="h5" fontWeight="bold" color={theme.palette.mode === 'dark' ? theme.palette.primary.light : theme.palette.primary.dark}>
          {title}
        </Typography>
      </Box>
      {actionComponent}
    </Box>
  );
};

// Main EnqDetails component
const EnqDetails = ({ data, darkMode = false }) => { // Added darkMode prop
  const theme = getLavenderTheme(darkMode ? 'dark' : 'light'); // Use prop to set mode
  
  const formatAddress = React.useCallback(() => {
    if (!data) return "-";
    const parts = [
      data.student_address,
      data.city,
      data.state,
      data.zipcode,
      data.country
    ].filter(Boolean); // Filter out null/empty strings
    return parts.length > 0 ? parts.join(', ') : "-";
  }, [data]);

  if (!data || Object.keys(data).length === 0) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <Typography variant="h6" color="text.secondary">No Enquiry Data Available.</Typography>
        </Box>
      </ThemeProvider>
    );
  }
  
  // Ensure application data exists and is an array
  const applicationDocuments = data.application && Array.isArray(data.application) && data.application.length > 0 
    ? data.application[0] 
    : {};

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box 
        component={motion.div}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        sx={{ 
          p: { xs: 2, sm: 3, md: 4 }, 
          bgcolor: 'background.default',
        }}
      >
        <Typography
          component={motion.h1}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          variant="h3"
          align="center"
          fontWeight="bold"
          gutterBottom
          color={theme.palette.mode === 'dark' ? theme.palette.primary.light : theme.palette.primary.dark}
          sx={{
            mb: 5,
            position: 'relative',
            textShadow: theme.palette.mode === 'dark' ? '0 1px 3px rgba(0,0,0,0.3)' : 'none',
            '&:after': {
              content: '""',
              position: 'absolute',
              bottom: -12,
              left: '50%',
              transform: 'translateX(-50%)',
              width: 100,
              height: 4,
              borderRadius: 2,
              bgcolor: theme.palette.primary.main,
              boxShadow: `0 2px 8px ${alpha(theme.palette.primary.main, 0.5)}`
            }
          }}
        >
          Applicant Profile
        </Typography>

        <Grid container spacing={4}>
          {/* Personal Information Card */}
          <Grid item xs={12} lg={7}>
            <Card
              component={motion.div}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              elevation={0}
              sx={{ height: '100%', overflow: 'visible' }} // Allow shadows to be visible
            >
              <CardContent sx={{ p: { xs: 2, md: 3 } }}>
                <SectionHeader title="Personal Information" icon={<PersonIcon />} />
                <Grid container spacing={1}>
                  <InfoItem icon={<PersonIcon />} label="Full Name" value={data.student_name} />
                  <InfoItem icon={<PhoneIcon />} label="Phone Number" value={data.student_phone} />
                  <InfoItem icon={<EmailIcon />} label="Email Address" value={data.student_email} />
                  <InfoItem icon={<HomeIcon />} label="Full Address" value={formatAddress()} />
                  <InfoItem icon={<SchoolIcon />} label="Current Education" value={data.current_education?.current_education} />
                  <InfoItem icon={<GavelIcon />} label="Previous Visa Refusal" chipValue={data.visa_refusal} chipColor={data.visa_refusal ? "error" : "success"} />
                  {data.visa_refusal && (
                    <InfoItem icon={<ArticleIcon />} label="Visa Refusal Document" value={data.visa_file} isLink={true} />
                  )}
                  <InfoItem icon={<CalendarTodayIcon />} label="Date of Birth" value={data.dob ? data.dob.split("-").reverse().join("-") : "-"} />
                  <InfoItem icon={<FingerprintIcon />} label="Passport Number" value={data.passport_number} />
                  <InfoItem icon={<FamilyRestroomIcon />} label="Marital Status" chipValue={data.married} chipColor={data.married ? "info" : "default"} />
                  <InfoItem icon={<FlagIcon />} label="Country Interested" value={data.country_interested?.country_name} />
                  <InfoItem icon={<EventIcon />} label="Enquiry Date" value={data.date_created ? data.date_created.split("-").reverse().join("-") : "-"}/>
                </Grid>
                 {data.notes && (
                    <>
                        <Divider sx={{ my: 2.5, borderColor: alpha(theme.palette.primary.main, 0.1) }} />
                        <InfoItem icon={<NoteIcon />} label="Additional Notes" value={data.notes} />
                    </>
                 )}
              </CardContent>
            </Card>
          </Grid>

          {/* Documents Section Card */}
          <Grid item xs={12} lg={5}>
            <Card
              component={motion.div}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              elevation={0}
              sx={{ height: '100%' }}
            >
              <CardContent sx={{ p: { xs: 2, md: 3 } }}>
                <SectionHeader title="Academic & Travel Documents" icon={<DescriptionIcon />} />
                <Box
                  sx={{
                    maxHeight: {lg: 'calc(100vh - 280px)', md: 'auto'}, // Adjust max height for scroll
                    overflowY: 'auto',
                    pr: 0.5, 
                    '&::-webkit-scrollbar': { width: '6px' },
                    '&::-webkit-scrollbar-track': { bgcolor: alpha(theme.palette.primary.light, 0.1), borderRadius: 3 },
                    '&::-webkit-scrollbar-thumb': { bgcolor: alpha(theme.palette.primary.main, 0.3), borderRadius: 3, '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.5) } }
                  }}
                >
                  <Grid container spacing={2.5}>
                    <DocumentItem label="10th Marksheet" id={applicationDocuments.id} docType="10th Marksheet" name={data.student_name} document={applicationDocuments?.Tenth_Marksheet} uploadKey="Tenth_Marksheet" setRefresherNeeded={() => {}} />
                    <DocumentItem label="12th Marksheet" id={applicationDocuments.id} docType="12th Marksheet" name={data.student_name} document={applicationDocuments?.Twelveth_Marksheet} uploadKey="Twelveth_Marksheet" setRefresherNeeded={() => {}} />
                    <DocumentItem label="Passport" id={applicationDocuments.id} docType="passport" name={data.student_name} document={applicationDocuments?.passport} uploadKey="passport" setRefresherNeeded={() => {}} />
                    <DocumentItem label="Diploma Marksheet" id={applicationDocuments.id} docType="Diploma Marksheet" name={data.student_name} document={applicationDocuments?.Diploma_Marksheet} uploadKey="Diploma_Marksheet" setRefresherNeeded={() => {}} />
                    <DocumentItem label="Bachelor Marksheet" id={applicationDocuments.id} docType="Bachelor Marksheet" name={data.student_name} document={applicationDocuments?.Bachelor_Marksheet} uploadKey="Bachelor_Marksheet" setRefresherNeeded={() => {}} />
                    <DocumentItem label="Master Marksheet" id={applicationDocuments.id} docType="Master Marksheet" name={data.student_name} document={applicationDocuments?.Master_Marksheet} uploadKey="Master_Marksheet" setRefresherNeeded={() => {}} />
                    <DocumentItem label="Language Exam" id={applicationDocuments.id} docType="Language Exam" name={data.student_name} document={applicationDocuments?.Language_Exam} uploadKey="Language_Exam" setRefresherNeeded={() => {}} />
                    <DocumentItem label="Resume" id={applicationDocuments.id} docType="Resume" name={data.student_name} document={applicationDocuments?.Resume} uploadKey="Resume" setRefresherNeeded={() => {}} />
                    <DocumentItem label="Letter of Recommendation (LOR)" id={applicationDocuments.id} docType="Lor" name={data.student_name} document={applicationDocuments?.Lor} uploadKey="Lor" setRefresherNeeded={() => {}} />
                  </Grid>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </ThemeProvider>
  );
};

export default EnqDetails;