import React, { useTheme, useEffect, useReducer, useState, useMemo, useCallback } from "react";
import {
  Box,
  Button,
  Typography,
  Card,
  CardContent,
  Grid,
  Divider,
  CircularProgress,
  Alert,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  Tabs,
  Tab,
  Avatar,
  IconButton,
  InputAdornment,
  ThemeProvider,
  createTheme,
  alpha,
  CssBaseline,
  Breadcrumbs,
  Link as MuiLink,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link as RouterLink, useParams } from "react-router-dom";

// Helpers & Components
import { ajaxCall, ajaxCallWithHeaderOnly } from "../../helpers/ajaxCall";
import { uiAction } from "../../store/uiStore";

// Icons
import PersonIcon from "@mui/icons-material/Person";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import SchoolIcon from "@mui/icons-material/School";
import EventNoteIcon from "@mui/icons-material/EventNote";
import SaveIcon from "@mui/icons-material/Save";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DescriptionIcon from "@mui/icons-material/Description";
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import FlagIcon from '@mui/icons-material/Flag';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import InfoIcon from '@mui/icons-material/Info';
import HomeIcon from '@mui/icons-material/Home';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import CloseIcon from '@mui/icons-material/Close';

// Animation
import { motion } from 'framer-motion';

// ----- Theme Configuration -----
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
      mode, 
      ...lavenderPalette,
      background: { 
        default: mode === 'dark' ? '#232139' : '#f5f3fa', 
        paper: mode === 'dark' ? '#2d2a45' : '#ffffff' 
      },
      text: currentTextColors,
    },
    shape: { borderRadius: 16 },
    typography: { 
      fontFamily: ['Poppins', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', '"Helvetica Neue"', 'Arial', 'sans-serif'].join(','), 
    },
    components: {
      MuiButton: { 
        styleOverrides: { 
          root: { 
            borderRadius: 12, 
            textTransform: 'none', 
            boxShadow: 'none', 
            transition: 'all 0.2s ease-in-out', 
            padding: '8px 20px', 
            '&:hover': { 
              transform: 'translateY(-1px)', 
              boxShadow: `0 4px 10px ${alpha(lavenderPalette.primary.main, 0.25)}` 
            } 
          },
          contained: { 
            boxShadow: `0 2px 6px ${alpha(lavenderPalette.primary.main, 0.2)}` 
          },
          containedPrimary: { 
            backgroundColor: lavenderPalette.primary.main, 
            color: lavenderPalette.primary.contrastText, 
            '&:hover': { 
              backgroundColor: lavenderPalette.primary.dark 
            } 
          } 
        } 
      },
      MuiCard: { 
        styleOverrides: { 
          root: { 
            borderRadius: 20, 
            boxShadow: mode === 'dark' ? '0 10px 20px rgba(0,0,0,0.25)' : '0 10px 20px rgba(149,117,205,0.12)', 
          } 
        } 
      },
      MuiPaper: { 
        styleOverrides: { 
          rounded: { 
            borderRadius: 20, 
          } 
        } 
      },
      MuiTextField: { 
        styleOverrides: { 
          root: { 
            '& .MuiOutlinedInput-root': { 
              borderRadius: 12, 
              backgroundColor: mode === 'dark' ? alpha(currentTextColors.primary, 0.05) : alpha(currentTextColors.secondary, 0.03), 
              '& fieldset': { 
                borderColor: mode === 'dark' ? alpha(currentTextColors.secondary, 0.2) : alpha(currentTextColors.secondary, 0.3), 
              }, 
              '&:hover fieldset': { 
                borderColor: lavenderPalette.primary.light, 
              }, 
              '&.Mui-focused fieldset': { 
                borderColor: lavenderPalette.primary.main, 
                borderWidth: '1.5px' 
              }, 
            },
            '& .MuiInputLabel-root': {
              "&.Mui-focused": {
                color: lavenderPalette.primary.dark
              }
            }
          } 
        } 
      },
      MuiFormControl: { 
        styleOverrides: { 
          root: { 
            '& .MuiOutlinedInput-root': { 
              borderRadius: 12, 
              backgroundColor: mode === 'dark' ? alpha(currentTextColors.primary, 0.05) : alpha(currentTextColors.secondary, 0.03), 
              '& fieldset': { 
                borderColor: mode === 'dark' ? alpha(currentTextColors.secondary, 0.2) : alpha(currentTextColors.secondary, 0.3), 
              }, 
              '&:hover fieldset': { 
                borderColor: lavenderPalette.primary.light, 
              }, 
              '&.Mui-focused fieldset': { 
                borderColor: lavenderPalette.primary.main, 
                borderWidth: '1.5px' 
              }, 
            } 
          } 
        } 
      },
      MuiInputLabel: { 
        styleOverrides: { 
          outlined: { 
            "&.Mui-focused": { 
              color: lavenderPalette.primary.dark 
            }, 
            "&.MuiFormLabel-filled": { 
              transform: 'translate(14px, -9px) scale(0.75)', 
              backgroundColor: mode === 'dark' ? '#2d2a45' : '#ffffff', 
              paddingLeft: '4px', 
              paddingRight: '4px'
            } 
          } 
        } 
      },
      MuiTabs: { 
        styleOverrides: { 
          indicator: { 
            height: 3, 
            borderRadius: '3px 3px 0 0', 
            backgroundColor: lavenderPalette.primary.main 
          } 
        } 
      },
      MuiTab: { 
        styleOverrides: { 
          root: { 
            textTransform: 'none', 
            fontWeight: 500, 
            borderRadius: '12px 12px 0 0', 
            '&.Mui-selected': { 
              color: lavenderPalette.primary.dark, 
              fontWeight: 600 
            }, 
            '&:hover': {
              backgroundColor: alpha(lavenderPalette.primary.main, 0.05)
            } 
          } 
        } 
      },
      MuiAlert: { 
        styleOverrides: { 
          root: { 
            borderRadius: 12, 
            boxShadow: `0 4px 12px ${alpha(lavenderPalette.error.main, 0.15)}`
          } 
        } 
      },
    },
  });
};

// ===== UI COMPONENTS =====
const ThemeToggle = React.memo(({ darkMode, setDarkMode }) => { 
  const theme = useTheme();
  
  return (
    <Box sx={{ 
      display: 'flex', 
      alignItems: 'center', 
      background: darkMode ? 'rgba(255, 255, 255, 0.05)' : alpha(theme.palette.primary.main, 0.08), 
      borderRadius: 30, 
      padding: '2px 10px', 
      boxShadow: darkMode ? 'none' : `0 2px 8px ${alpha(theme.palette.primary.main, 0.15)}`,
    }}>
      <LightModeIcon color={darkMode ? 'disabled' : 'warning'} sx={{ fontSize: 20 }} />
      <Switch 
        checked={darkMode} 
        onChange={() => setDarkMode(!darkMode)} 
        color="primary" 
        size="small" 
        sx={{ 
          '& .MuiSwitch-switchBase.Mui-checked': { color: theme.palette.primary.main }, 
          '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: theme.palette.primary.light }, 
        }} 
      />
      <DarkModeIcon color={darkMode ? 'primary' : 'disabled'} sx={{ fontSize: 20 }} />
    </Box>
  );
});

const PageHeader = React.memo(({ title, subtitle, icon, action }) => {
  const theme = useTheme();
  
  return (
    <Box 
      component={motion.div} 
      initial={{ opacity: 0, y: -20 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.5 }} 
      sx={{ 
        background: theme.palette.mode === 'dark' 
          ? 'linear-gradient(135deg, rgba(121, 83, 179, 0.8) 0%, rgba(149, 117, 205, 0.6) 100%)' 
          : 'linear-gradient(135deg, rgba(197, 176, 230, 0.8) 0%, rgba(149, 117, 205, 0.9) 100%)', 
        borderRadius: 4, 
        boxShadow: theme.palette.mode === 'dark' 
          ? '0 10px 30px rgba(0, 0, 0, 0.3)' 
          : `0 10px 30px ${alpha(theme.palette.primary.main, 0.2)}`, 
        p: 3, 
        mb: 3, 
        color: '#fff', 
        position: 'relative', 
        overflow: 'hidden', 
      }}
    > 
      <Box sx={{ 
        position: 'absolute', 
        top: 0, right: 0, bottom: 0, left: 0, 
        backgroundColor: 'transparent', 
        backgroundImage: `radial-gradient(${alpha('#fff', 0.1)} 1px, transparent 1px)`, 
        backgroundSize: '20px 20px', 
      }} /> 
      <Grid container spacing={2} alignItems="center" position="relative"> 
        <Grid item> 
          <Avatar sx={{ 
            bgcolor: 'rgba(255, 255, 255, 0.2)', 
            color: '#fff', 
            width: 50, 
            height: 50, 
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)', 
          }}> 
            {icon || <PersonIcon />} 
          </Avatar> 
        </Grid> 
        <Grid item xs> 
          <Typography 
            variant="h4" 
            component="h1" 
            fontWeight="bold" 
            gutterBottom 
            sx={{ 
              textShadow: '0 2px 10px rgba(0, 0, 0, 0.1)', 
              fontSize: { xs: '1.75rem', md: '2.25rem' } 
            }}
          > 
            {title} 
          </Typography> 
          {subtitle && ( 
            <Typography variant="body1" sx={{ opacity: 0.95, fontWeight: 300 }}> 
              {subtitle} 
            </Typography> 
          )} 
        </Grid> 
        {action && ( 
          <Grid item sx={{ textAlign: 'right' }}> 
            {action} 
          </Grid> 
        )} 
      </Grid> 
    </Box> 
  );
});

const NavigationBreadcrumbs = React.memo(({ items = [] }) => {
  const theme = useTheme();
  
  return (
    <Breadcrumbs 
      separator={<NavigateNextIcon fontSize="small" />} 
      aria-label="breadcrumb" 
      sx={{ 
        mb: 2.5, 
        '& .MuiButton-root': {
          color: alpha(theme.palette.text.secondary, 0.9), 
          '&:hover': {
            backgroundColor: alpha(theme.palette.primary.main, 0.05)
          }
        }, 
        '& .MuiTypography-root': {
          color: theme.palette.text.primary
        } 
      }} 
    > 
      <Button 
        component={RouterLink} 
        to="/" 
        size="small" 
        startIcon={<HomeIcon fontSize="small" />} 
        sx={{ textTransform: 'none', fontWeight: 400}} 
      > 
        Dashboard 
      </Button> 
      {items.map((item, index) => ( 
        item.link ? ( 
          <Button 
            key={index} 
            component={RouterLink} 
            to={item.link} 
            size="small" 
            sx={{ textTransform: 'none', fontWeight: 400 }}
          > 
            {item.label} 
          </Button> 
        ) : ( 
          <Typography key={index} color="text.primary" fontWeight="medium" variant="body2"> 
            {item.label} 
          </Typography> 
        ) 
      ))} 
    </Breadcrumbs> 
  );
});

// Tab panel component to avoid repetition
const TabPanel = React.memo(({ children, value, index }) => {
  return (
    <Box 
      role="tabpanel" 
      hidden={value !== index} 
      component={motion.div} 
      initial={{ opacity: 0 }} 
      animate={value === index ? { opacity: 1 } : {}} 
      transition={{ duration: 0.4 }}
    >
      {value === index && children}
    </Box>
  );
});

// ===== FORM REDUCER =====
// Initial state for the form data
const initialFormData = {
  // Student Info
  student_name: '', 
  student_phone: '', 
  student_email: '', 
  passport_number: '',
  marital_status: '',
  nationality: 'Indian', 
  date_of_birth: '', 
  assigned_users: '',
  
  // Address
  address: '', 
  state: '', 
  country: 'India',
  zip_code: '', 
  city: '', 
  
  // Education & Preferences
  country_interested: '', 
  current_education: '', 
  level_applying_for: '', 
  intake_interested: '', 
  university_interested: '',
  course_interested: '', 
  previous_visa_refusal: false, 
  refusal_doc: null,
  
  // Additional Info
  notes: '', 
  enquiry_status: ''
};

function formReducer(state, action) {
  switch (action.type) {
    case 'SET_FIELD':
      return { ...state, [action.field]: action.value };
    case 'SET_MANY_FIELDS':
      return { ...state, ...action.fields };
    case 'RESET_FORM':
      return { ...initialFormData, ...action.initialValues };
    default:
      return state;
  }
}

// ===== MAIN COMPONENT =====
function EnquiryFormMui(props) {
  const { 
    enqId: propEnqId, 
    title, 
    edit = false, 
    isFlow = false, 
    level, 
    intake, 
    courseId, 
    uniId,
    onSuccess,
    onCancel,
    closeIt
  } = props;
  
  const params = useParams();
  const enqId = edit ? (propEnqId || params.enqId) : null;

  // Theme state
  const [darkMode, setDarkMode] = useState(false);
  const theme = useMemo(() => getLavenderTheme(darkMode ? 'dark' : 'light'), [darkMode]);
  
  // Router and Redux
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const authData = useSelector((state) => state.authStore);
  
  // Form state with useReducer
  const [formData, dispatchFormData] = useReducer(formReducer, {
    ...initialFormData,
    level_applying_for: level || '',
    intake_interested: intake || '',
    university_interested: uniId || '',
    course_interested: courseId || '',
  });
  
  // UI state
  const [loading, setLoading] = useState(edit && enqId);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [throwErr, setThrowErr] = useState(null);
  
  // Options for select fields
  const [educationOptions, setEducationOptions] = useState([]);
  const [countryOptions, setCountryOptions] = useState([]);
  const [statusOptions, setStatusOptions] = useState([]);
  const [levelOptions, setLevelOptions] = useState([]);
  const [intakeOptions, setIntakeOptions] = useState([]);
  const [universityOptions, setUniversityOptions] = useState([]);
  const [courseOptions, setCourseOptions] = useState([]);
  const [userOptions, setUserOptions] = useState([]);
  
  // Error handling
  useEffect(() => { 
    if (throwErr) throw throwErr; 
  }, [throwErr]);
  
  // Fetch all dropdown options at once
  const fetchDropdownOptions = useCallback(async () => {
    const endpoints = [
      { url: 'current-education/', setter: setEducationOptions, key: 'current_education' },
      { url: 'countries/', setter: setCountryOptions, key: 'country_name' },
      { url: 'enquiry-status/', setter: setStatusOptions, key: 'status' },
      { url: 'level-applying-for/', setter: setLevelOptions, key: 'levels' },
      { url: 'intake-month-year/', setter: setIntakeOptions, keyMap: item => ({
        value: item.id, 
        name: `${item.intake_month} ${item.intake_year}`
      })},
      { url: 'universities/', setter: setUniversityOptions, key: 'univ_name' },
      { url: 'userlist/', setter: setUserOptions, key: 'username' },
    ];
    
    try {
      await Promise.all(endpoints.map(async (endpoint) => {
        const response = await ajaxCallWithHeaderOnly(
          endpoint.url, 
          { Authorization: `Bearer ${authData.accessToken}` }
        );
        
        if (response?.length) {
          endpoint.setter(
            response.map(option => 
              endpoint.keyMap 
                ? endpoint.keyMap(option) 
                : ({ value: option.id, name: option[endpoint.key] })
            )
          );
        }
      }));
    } catch (err) {
      setThrowErr({ ...err, page: 'enquiry_form_dropdowns' });
    }
  }, [authData.accessToken]);

  // Fetch single enquiry data for editing
  const fetchEnquiryData = useCallback(async () => {
    if (!enqId) return;
    
    setLoading(true);
    try {
      const response = await ajaxCallWithHeaderOnly(
        `enquiries/${enqId}/`, 
        { Authorization: `Bearer ${authData.accessToken}` }
      );
      
      if (response) {
        // Map API response to form state
        const formattedData = {
          student_name: response.student_name || '',
          student_phone: response.student_phone || '',
          student_email: response.student_email || '',
          address: response.address || '',
          state: response.state || '',
          country: response.country || 'India',
          country_interested: response.country_interested?.id || '',
          zip_code: response.zip_code || '',
          city: response.city || '',
          previous_visa_refusal: response.previous_visa_refusal || false,
          refusal_doc: response.refusal_doc || null,
          current_education: response.current_education?.id || '',
          level_applying_for: response.level_applying_for?.id || level || '',
          intake_interested: response.intake_interested?.id || intake || '',
          university_interested: response.university_interested?.id || uniId || '',
          course_interested: response.course_interested?.id || courseId || '',
          notes: response.notes || '',
          enquiry_status: response.enquiry_status?.id || '',
          passport_number: response.passport_number || '',
          marital_status: response.marital_status || '',
          nationality: response.nationality || 'Indian',
          date_of_birth: response.date_of_birth 
            ? new Date(response.date_of_birth).toISOString().split('T')[0] 
            : '',
          assigned_users: response.assigned_users?.id || ''
        };
        
        dispatchFormData({ type: 'SET_MANY_FIELDS', fields: formattedData });
        
        // Pre-fetch courses if uni is set
        if (response.university_interested?.id) {
          const courseResponse = await ajaxCallWithHeaderOnly(
            `courses/?university=${response.university_interested.id}`,
            { Authorization: `Bearer ${authData.accessToken}` }
          );
          
          if (courseResponse?.length) {
            setCourseOptions(
              courseResponse.map(option => ({ 
                value: option.id, 
                name: option.course_name 
              }))
            );
          }
        }
      } else {
        setError("Failed to load enquiry data.");
      }
    } catch (err) {
      setThrowErr({ ...err, page: 'enquiry_form_fetch_single' });
      setError("Error fetching enquiry.");
    } finally {
      setLoading(false);
    }
  }, [enqId, authData.accessToken, level, intake, courseId, uniId]);

  // Initial data loading
  useEffect(() => {
    fetchDropdownOptions();
    
    if (edit && enqId) {
      fetchEnquiryData();
    } else if (!edit) {
      // Reset form for new entry, apply flow props
      dispatchFormData({ 
        type: 'RESET_FORM', 
        initialValues: {
          level_applying_for: level || '',
          intake_interested: intake || '',
          university_interested: uniId || '',
          course_interested: courseId || '',
        }
      });
    }
  }, [edit, enqId, fetchDropdownOptions, fetchEnquiryData, level, intake, courseId, uniId]);
  
  // Fetch courses when university changes
  useEffect(() => {
    const fetchCoursesForSelectedUni = async () => {
      if (formData.university_interested) {
        try {
          const response = await ajaxCallWithHeaderOnly(
            `courses/?university=${formData.university_interested}`,
            { Authorization: `Bearer ${authData.accessToken}` }
          );
          
          if (response?.length) {
            setCourseOptions(
              response.map(option => ({ value: option.id, name: option.course_name }))
            );
            
            // Clear course if not in new list
            if (!response.some(c => c.id === formData.course_interested)) {
              dispatchFormData({ type: 'SET_FIELD', field: 'course_interested', value: '' });
            }
          } else {
            setCourseOptions([]);
          }
        } catch (error) {
          setThrowErr({ ...error, page: 'enquiry_form_fetch_courses' });
          setCourseOptions([]);
        }
      } else {
        setCourseOptions([]);
        dispatchFormData({ type: 'SET_FIELD', field: 'course_interested', value: '' });
      }
    };
    
    fetchCoursesForSelectedUni();
  }, [formData.university_interested, authData.accessToken, formData.course_interested]);
  
  // Form field change handlers
  const handleInputChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    dispatchFormData({ 
      type: 'SET_FIELD', 
      field: name, 
      value: type === 'checkbox' ? checked : value 
    });
    
    if (error) setError(null); // Clear global error on input change
  }, [error]);
  
  const handleFileChange = useCallback((e) => {
    if (e.target.files && e.target.files[0]) {
      dispatchFormData({ 
        type: 'SET_FIELD', 
        field: 'refusal_doc', 
        value: e.target.files[0] 
      });
    } else {
      dispatchFormData({ 
        type: 'SET_FIELD', 
        field: 'refusal_doc', 
        value: null 
      });
    }
  }, []);
  
  const handleTabChange = useCallback((event, newValue) => {
    setActiveTab(newValue);
  }, []);
  
  // Form submission
  const prepareFormDataForSubmit = useCallback(() => {
    const dataToSubmit = new FormData();
    
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== null && value !== '' && value !== undefined) {
        if (key === 'refusal_doc' && value instanceof File) {
          dataToSubmit.append(key, value);
        } else if (key !== 'refusal_doc') {
          dataToSubmit.append(key, value);
        }
      }
    });
    
    return dataToSubmit;
  }, [formData]);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    const validationErrors = [];
    
    if (!formData.student_name.trim()) validationErrors.push('Student name is required.');
    if (!formData.student_phone.trim()) validationErrors.push('Phone number is required.');
    if (!formData.student_email.trim() || !formData.student_email.includes('@')) 
      validationErrors.push('Valid email is required.');
    if (!formData.country_interested) {
      validationErrors.push('Country interested is required.');
      setActiveTab(2);
    }
    if (!formData.current_education) {
      validationErrors.push('Current education is required.');
      setActiveTab(2);
    }
    if (!formData.level_applying_for) {
      validationErrors.push('Level applying for is required.');
      setActiveTab(2);
    }
    if (!formData.intake_interested) {
      validationErrors.push('Intake interested is required.');
      setActiveTab(2);
    }
    
    if (validationErrors.length > 0) {
      setError(validationErrors.join(' '));
      return;
    }

    setSubmitting(true);
    setError(null);
    const payload = prepareFormDataForSubmit();
    
    const url = edit && enqId ? `update-enquiry/${enqId}/` : "create-enquiry/";
    const method = edit && enqId ? "PUT" : "POST";
    
    try {
      const response = await ajaxCall(
        url, 
        payload, 
        { Authorization: `Bearer ${authData.accessToken}` }, 
        method
      );
      
      if (response) {
        dispatch(uiAction.setNotification({ 
          show: true, 
          heading: edit ? 'Enquiry Updated' : 'Enquiry Created', 
          msg: `<strong>${formData.student_name}</strong> enquiry ${edit ? 'updated' : 'created'} successfully.` 
        }));
        
        if (isFlow && onSuccess) {
          onSuccess(response);
        } else if (closeIt) {
          closeIt();
        } else {
          navigate('/enquiries');
        }
      } else {
        setError(response?.detail || 'Submission failed. Please check details.');
      }
    } catch (err) {
      const errorData = err.response?.data;
      let errorMessage = "An unexpected error occurred.";
      
      if (errorData && typeof errorData === 'object') {
        errorMessage = Object.entries(errorData)
          .map(([key, value]) => 
            `${key.replace(/_/g, ' ')}: ${Array.isArray(value) ? value.join(', ') : value}`
          )
          .join('; ');
      } else if (typeof errorData === 'string') {
        errorMessage = errorData;
      }
      
      setError(errorMessage);
      setThrowErr({ ...err, page: 'enquiry_form_submit' });
    } finally {
      setSubmitting(false);
    }
  };
  
  if (loading && edit) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  // Dynamic title for the page
  const pageTitle = title || (edit ? 'Edit Enquiry Details' : 'Create New Student Enquiry');
  const pageSubtitle = edit 
    ? `Update information for ${formData.student_name || 'student'}` 
    : 'Fill in the details below to add a new enquiry.';

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ 
        flexGrow: 1, 
        p: { xs: 1, sm: 2, md: 3 }, 
        bgcolor: 'background.default', 
        minHeight: '100vh', 
        color: 'text.primary', 
        transition: 'all 0.3s ease', 
        backgroundImage: darkMode 
          ? 'radial-gradient(rgba(149, 117, 205, 0.08) 2px, transparent 0)' 
          : 'radial-gradient(rgba(149, 117, 205, 0.1) 2px, transparent 0)', 
        backgroundSize: '24px 24px', 
      }}>
        {!isFlow && (
          <>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
              <ThemeToggle darkMode={darkMode} setDarkMode={setDarkMode} />
            </Box>
            <NavigationBreadcrumbs 
              items={[
                { label: 'Enquiries', link: '/enquiries' }, 
                { label: edit ? 'Edit' : 'Create' }
              ]} 
            />
            <PageHeader 
              title={pageTitle}
              subtitle={pageSubtitle}
              icon={<PersonIcon />}
              action={
                <Button 
                  variant="outlined" 
                  color="inherit" 
                  startIcon={<ArrowBackIcon />} 
                  component={RouterLink} 
                  to="/enquiries" 
                  sx={{ 
                    px: 3, 
                    py: 1.2, 
                    fontSize: '0.9rem', 
                    borderColor: 'rgba(255,255,255,0.4)', 
                    color: '#fff', 
                    '&:hover': { 
                      backgroundColor: 'rgba(255,255,255,0.1)', 
                      borderColor: '#fff'
                    }
                  }}
                >
                  Back to List
                </Button>
              }
            />
          </>
        )}
        
        <Card 
          elevation={1} 
          component={motion.div} 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.5 }}
        >
          <Box sx={{ 
            borderBottom: 1, 
            borderColor: 'divider', 
            bgcolor: alpha(theme.palette.background.paper, 0.7) 
          }}>
            <Tabs 
              value={activeTab} 
              onChange={handleTabChange} 
              variant="scrollable" 
              scrollButtons="auto" 
              aria-label="enquiry form tabs" 
              sx={{ px: 2, '& .MuiTab-root': { minHeight: 56, py: 1.5 } }}
            >
              <Tab 
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <PersonIcon sx={{ mr: 1 }} />Student Info
                  </Box>
                } 
              />
              <Tab 
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <LocationOnIcon sx={{ mr: 1 }} />Address
                  </Box>
                } 
              />
              <Tab 
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <SchoolIcon sx={{ mr: 1 }} />Education & Preferences
                  </Box>
                } 
              />
              <Tab 
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <EventNoteIcon sx={{ mr: 1 }} />Additional Info
                  </Box>
                } 
              />
            </Tabs>
          </Box>
          
          <form onSubmit={handleSubmit}>
            <CardContent sx={{ p: { xs: 2, md: 3 } }}>
              {/* Student Information Tab */}
              <TabPanel value={activeTab} index={0}>
                <Grid container spacing={2.5}>
                  <Grid item xs={12} sm={6}>
                    <TextField 
                      fullWidth 
                      label="Student Name" 
                      name="student_name" 
                      value={formData.student_name} 
                      onChange={handleInputChange} 
                      required 
                      InputProps={{ 
                        startAdornment: (
                          <InputAdornment position="start">
                            <PersonIcon color="action" />
                          </InputAdornment>
                        ) 
                      }} 
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField 
                      fullWidth 
                      label="Phone Number" 
                      name="student_phone" 
                      value={formData.student_phone} 
                      onChange={handleInputChange} 
                      required 
                      InputProps={{ 
                        startAdornment: (
                          <InputAdornment position="start">
                            <PhoneIcon color="action" />
                          </InputAdornment>
                        ) 
                      }} 
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField 
                      fullWidth 
                      label="Email Address" 
                      name="student_email" 
                      type="email" 
                      value={formData.student_email} 
                      onChange={handleInputChange} 
                      required 
                      InputProps={{ 
                        startAdornment: (
                          <InputAdornment position="start">
                            <EmailIcon color="action" />
                          </InputAdornment>
                        ) 
                      }} 
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField 
                      fullWidth 
                      label="Passport Number" 
                      name="passport_number" 
                      value={formData.passport_number} 
                      onChange={handleInputChange} 
                      InputProps={{ 
                        startAdornment: (
                          <InputAdornment position="start">
                            <BookmarkBorderIcon color="action" />
                          </InputAdornment>
                        ) 
                      }} 
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel>Marital Status</InputLabel>
                      <Select 
                        name="marital_status" 
                        value={formData.marital_status} 
                        label="Marital Status" 
                        onChange={handleInputChange}
                      >
                        <MenuItem value=""><em>Select</em></MenuItem>
                        <MenuItem value="single">Single</MenuItem>
                        <MenuItem value="married">Married</MenuItem>
                        <MenuItem value="divorced">Divorced</MenuItem>
                        <MenuItem value="widowed">Widowed</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField 
                      fullWidth 
                      label="Nationality" 
                      name="nationality" 
                      value={formData.nationality} 
                      onChange={handleInputChange} 
                      InputProps={{ 
                        startAdornment: (
                          <InputAdornment position="start">
                            <FlagIcon color="action" />
                          </InputAdornment>
                        ) 
                      }} 
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField 
                      fullWidth 
                      label="Date of Birth" 
                      name="date_of_birth" 
                      type="date" 
                      value={formData.date_of_birth} 
                      onChange={handleInputChange} 
                      InputLabelProps={{ shrink: true }} 
                      InputProps={{ 
                        startAdornment: (
                          <InputAdornment position="start">
                            <CalendarTodayIcon color="action" />
                          </InputAdornment>
                        ) 
                      }} 
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel>Assigned To</InputLabel>
                      <Select 
                        name="assigned_users" 
                        value={formData.assigned_users} 
                        label="Assigned To" 
                        onChange={handleInputChange}
                      >
                        <MenuItem value=""><em>Not Assigned</em></MenuItem>
                        {userOptions.map(option => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              </TabPanel>
              
              {/* Address Details Tab */}
              <TabPanel value={activeTab} index={1}>
                <Grid container spacing={2.5}>
                  <Grid item xs={12}>
                    <TextField 
                      fullWidth 
                      label="Address" 
                      name="address" 
                      value={formData.address} 
                      onChange={handleInputChange} 
                      multiline 
                      rows={3} 
                      InputProps={{ 
                        startAdornment: (
                          <InputAdornment position="start" sx={{alignSelf: 'flex-start', mt:1.5}}>
                            <LocationOnIcon color="action" />
                          </InputAdornment>
                        ) 
                      }} 
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField 
                      fullWidth 
                      label="Country" 
                      name="country" 
                      value={formData.country} 
                      onChange={handleInputChange} 
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField 
                      fullWidth 
                      label="State/Province" 
                      name="state" 
                      value={formData.state} 
                      onChange={handleInputChange} 
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField 
                      fullWidth 
                      label="City" 
                      name="city" 
                      value={formData.city} 
                      onChange={handleInputChange} 
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField 
                      fullWidth 
                      label="Zip/Postal Code" 
                      name="zip_code" 
                      value={formData.zip_code} 
                      onChange={handleInputChange} 
                    />
                  </Grid>
                </Grid>
              </TabPanel>
              
              {/* Education & Preferences Tab */}
              <TabPanel value={activeTab} index={2}>
                <Grid container spacing={2.5}>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel>Current Education *</InputLabel>
                      <Select 
                        name="current_education" 
                        value={formData.current_education} 
                        label="Current Education *" 
                        onChange={handleInputChange} 
                        required
                      >
                        <MenuItem value=""><em>Select</em></MenuItem>
                        {educationOptions.map(option => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel>Level Applying For *</InputLabel>
                      <Select 
                        name="level_applying_for" 
                        value={formData.level_applying_for} 
                        label="Level Applying For *" 
                        onChange={handleInputChange} 
                        required
                      >
                        <MenuItem value=""><em>Select</em></MenuItem>
                        {levelOptions.map(option => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel>Country Interested *</InputLabel>
                      <Select 
                        name="country_interested" 
                        value={formData.country_interested} 
                        label="Country Interested *" 
                        onChange={handleInputChange} 
                        required
                      >
                        <MenuItem value=""><em>Select</em></MenuItem>
                        {countryOptions.map(option => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel>Intake Interested *</InputLabel>
                      <Select 
                        name="intake_interested" 
                        value={formData.intake_interested} 
                        label="Intake Interested *" 
                        onChange={handleInputChange} 
                        required
                      >
                        <MenuItem value=""><em>Select</em></MenuItem>
                        {intakeOptions.map(option => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel>University Interested</InputLabel>
                      <Select 
                        name="university_interested" 
                        value={formData.university_interested} 
                        label="University Interested" 
                        onChange={handleInputChange}
                      >
                        <MenuItem value=""><em>Select</em></MenuItem>
                        {universityOptions.map(option => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl 
                      fullWidth 
                      disabled={!formData.university_interested}
                    >
                      <InputLabel>Course Interested</InputLabel>
                      <Select 
                        name="course_interested" 
                        value={formData.course_interested} 
                        label="Course Interested" 
                        onChange={handleInputChange}
                      >
                        <MenuItem value=""><em>Select</em></MenuItem>
                        {courseOptions.map(option => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <FormControlLabel 
                      control={
                        <Switch 
                          checked={formData.previous_visa_refusal} 
                          onChange={handleInputChange} 
                          name="previous_visa_refusal" 
                          color="secondary" 
                        />
                      } 
                      label="Previous Visa Refusal" 
                    />
                  </Grid>
                  {formData.previous_visa_refusal && (
                    <Grid item xs={12} sm={6} md={4}>
                      <Card 
                        variant="outlined" 
                        sx={{
                          p: 1.5, 
                          borderRadius: 3, 
                          borderStyle: 'dashed', 
                          borderColor: 'grey.400'
                        }}
                      >
                        <Box sx={{display:'flex', alignItems:'center', mb:1.5}}>
                          <UploadFileIcon sx={{mr:1, color:'secondary.main'}}/>
                          <Typography variant="caption" fontWeight="500">
                            Upload Refusal Doc
                          </Typography>
                        </Box>
                        <input 
                          accept="application/pdf,image/*" 
                          style={{display:'none'}} 
                          id="refusal-doc-upload" 
                          type="file" 
                          onChange={handleFileChange}
                        />
                        <label htmlFor="refusal-doc-upload">
                          <Button 
                            variant="outlined" 
                            component="span" 
                            startIcon={<CloudUploadIcon/>} 
                            fullWidth 
                            size="small"
                          >
                            Select Document
                          </Button>
                        </label>
                        {formData.refusal_doc && (
                          <Box sx={{mt:1, display:'flex', alignItems:'center'}}>
                            <DescriptionIcon sx={{mr:1, color:'primary.main', fontSize:'1rem'}}/>
                            <Typography variant="caption" noWrap>
                              {formData.refusal_doc instanceof File 
                                ? formData.refusal_doc.name 
                                : 'Uploaded'}
                            </Typography>
                            <IconButton 
                              size="small" 
                              sx={{ml:'auto'}} 
                              onClick={() => dispatchFormData({ 
                                type: 'SET_FIELD',
                                field: 'refusal_doc',
                                value: null
                              })}
                            >
                              <CloseIcon fontSize="inherit"/>
                            </IconButton>
                          </Box>
                        )}
                      </Card>
                    </Grid>
                  )}
                </Grid>
              </TabPanel>
              
              {/* Additional Information Tab */}
              <TabPanel value={activeTab} index={3}>
                <Grid container spacing={2.5}>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel>Enquiry Status</InputLabel>
                      <Select 
                        name="enquiry_status" 
                        value={formData.enquiry_status} 
                        label="Enquiry Status" 
                        onChange={handleInputChange}
                      >
                        <MenuItem value=""><em>Select</em></MenuItem>
                        {statusOptions.map(option => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField 
                      fullWidth 
                      label="Notes" 
                      name="notes" 
                      value={formData.notes} 
                      onChange={handleInputChange} 
                      multiline 
                      rows={5} 
                      placeholder="Add any additional notes or comments..." 
                      InputProps={{ 
                        startAdornment: (
                          <InputAdornment position="start" sx={{alignSelf: 'flex-start', mt:1.5}}>
                            <EventNoteIcon color="action" />
                          </InputAdornment>
                        ) 
                      }} 
                    />
                  </Grid>
                </Grid>
              </TabPanel>

              {error && (
                <Alert 
                  severity="error" 
                  icon={<ErrorOutlineIcon fontSize="inherit" />} 
                  sx={{ mt: 3, borderRadius: 2 }}
                >
                  {error}
                </Alert>
              )}
              
              <Box 
                sx={{ 
                  mt: 4, 
                  pt: 2, 
                  borderTop: 1, 
                  borderColor: 'divider',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <Button 
                  variant="outlined" 
                  color="inherit" 
                  onClick={() => isFlow 
                    ? (onCancel && onCancel()) 
                    : navigate('/enquiries')
                  } 
                  sx={{ borderRadius: 10, px: 3 }}
                >
                  Cancel
                </Button>
                <Box>
                  {activeTab > 0 && (
                    <Button 
                      variant="text" 
                      color="secondary" 
                      onClick={() => setActiveTab(activeTab - 1)} 
                      sx={{ mr: 1.5, borderRadius: 10, px: 3 }}
                    >
                      Previous
                    </Button>
                  )}
                  {activeTab < 3 ? (
                    <Button 
                      variant="contained" 
                      color="primary" 
                      onClick={() => setActiveTab(activeTab + 1)} 
                      sx={{ borderRadius: 10, px: 3 }}
                    >
                      Next
                    </Button>
                  ) : (
                    <Button 
                      variant="contained" 
                      color="primary" 
                      type="submit" 
                      disabled={submitting} 
                      startIcon={submitting 
                        ? <CircularProgress size={18} color="inherit" /> 
                        : <SaveIcon />
                      } 
                      sx={{ borderRadius: 10, px: 3 }}
                    >
                      {submitting 
                        ? 'Submitting...' 
                        : edit ? 'Update Enquiry' : 'Submit Enquiry'
                      }
                    </Button>
                  )}
                </Box>
              </Box>
            </CardContent>
          </form>
        </Card>
      </Box>
    </ThemeProvider>
  );
}

export default React.memo(EnquiryFormMui);