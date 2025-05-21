import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';

// MUI Core Components
import {
    Box,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Collapse,
    IconButton,
    Typography,
    Avatar,
    // Divider, // Not explicitly used in the final NavBar, but good to have if needed
    useTheme, // Used by MuiCollapsableMenu
    ThemeProvider,
    createTheme,
    alpha,
    ListSubheader,
    // Drawer, // Commented out as Box is used for simplicity based on original
} from '@mui/material';

// MUI Icons
import HomeIcon from '@mui/icons-material/Home';
import SearchIcon from '@mui/icons-material/Search';
import LayersIcon from '@mui/icons-material/Layers';
import ClipboardIcon from '@mui/icons-material/Assignment'; // Or AssignmentIcon, ensure consistency
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import PeopleIcon from '@mui/icons-material/People';
import LogoutIcon from '@mui/icons-material/Logout';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';

// Your project's specific imports
import { authAction } from "../../../store/authStore"; // Adjust path as necessary
import { deleteFromLocalStorage } from "../../../helpers/helperFunctions"; // Adjust path as necessary

// ----- Custom Lavender Theme (Corrected) -----
const getLavenderTheme = (mode) => {
    const lavenderPalette = {
        primary: { light: '#c5b0e6', main: '#9575cd', dark: '#7953b3', contrastText: '#fff' },
        secondary: { light: '#efc0ff', main: '#ba68c8', dark: '#883997', contrastText: '#fff' },
        success: { light: '#a7d7c5', main: '#66bb6a', dark: '#43a047', contrastText: '#fff' },
        error: { light: '#ffb3c4', main: '#f06292', dark: '#e91e63', contrastText: '#fff' },
        info: { light: '#b3e0ff', main: '#64b5f6', dark: '#1976d2', contrastText: '#fff' },
        warning: { light: '#fff1b8', main: '#ffb74d', dark: '#f57c00', contrastText: '#fff' },
    };

    // Define text colors based on mode BEFORE they are used in component overrides
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
                paper: mode === 'dark' ? '#2d2a45' : '#ffffff',
            },
            text: currentTextColors,
        },
        shape: { borderRadius: 16 },
        typography: {
            fontFamily: [
                'Poppins', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"',
                'Roboto', '"Helvetica Neue"', 'Arial', 'sans-serif',
            ].join(','),
        },
        components: {
            MuiButton: {
                styleOverrides: {
                    root: {
                        borderRadius: 12,
                        textTransform: 'none',
                        boxShadow: 'none',
                        transition: 'all 0.2s ease-in-out',
                        '&:hover': {
                            transform: 'translateY(-2px)',
                            boxShadow: `0 4px 10px ${alpha(lavenderPalette.primary.main, 0.25)}`,
                        },
                    },
                    contained: {
                        boxShadow: `0 2px 6px ${alpha(lavenderPalette.primary.main, 0.2)}`,
                    },
                },
            },
            MuiPaper: { // For Drawer paper or other Paper components
                styleOverrides: {
                    rounded: { borderRadius: 20 }, // Consistent with HomePage Card
                    elevation1: { boxShadow: mode === 'dark' ? '0 10px 20px rgba(0,0,0,0.19)' : '0 10px 20px rgba(149,117,205,0.1)' }, // Example shadow
                    elevation3: { boxShadow: mode === 'dark' ? '0 10px 25px rgba(0,0,0,0.22)' : '0 10px 25px rgba(149,117,205,0.15)' },// Example shadow
                },
            },
            MuiListItemButton: {
                styleOverrides: {
                    root: {
                        borderRadius: 12, // Matches MuiButton
                        margin: '4px 10px', // Increased margin for better spacing
                        padding: '10px 16px',
                        transition: 'all 0.2s ease-in-out, background-color 0.1s linear, color 0.1s linear', // Smoother transitions
                        '&:hover': {
                            backgroundColor: mode === 'dark' ? alpha(lavenderPalette.primary.light, 0.12) : alpha(lavenderPalette.primary.main, 0.08),
                            transform: 'translateX(4px) scale(1.01)', // Subtle hover effect
                            // boxShadow: `0 3px 9px ${alpha(lavenderPalette.primary.main, 0.12)}`, // Softer hover shadow
                        },
                        '&.Mui-selected': {
                            backgroundColor: lavenderPalette.primary.main,
                            color: lavenderPalette.primary.contrastText,
                            boxShadow: `0 5px 15px ${alpha(lavenderPalette.primary.dark, 0.3)}`, // Enhanced active shadow
                            transform: 'scale(1.03)', // Slightly more pop for active
                            '&:hover': {
                                backgroundColor: lavenderPalette.primary.dark, // Darken on hover when active
                            },
                            '& .MuiListItemIcon-root': {
                                color: lavenderPalette.primary.contrastText,
                            },
                            '& .MuiListItemText-primary': {
                                fontWeight: '600', // Bolder text for active
                            },
                        },
                    },
                },
            },
            MuiListItemIcon: {
                styleOverrides: {
                    root: {
                        minWidth: 0, // Allow icon to be closer to text
                        marginRight: '12px', // theme.spacing(1.5)
                        color: currentTextColors.secondary, // Use currentTextColors
                        transition: 'color 0.2s ease-in-out',
                    },
                },
            },
            MuiListSubheader: {
                styleOverrides: {
                    root: {
                        backgroundColor: 'transparent',
                        textTransform: 'uppercase',
                        fontSize: '0.65rem', // Slightly smaller for more subtlety
                        fontWeight: 700, // Bolder
                        letterSpacing: '0.07em',
                        lineHeight: 'normal',
                        padding: '20px 16px 6px 26px', // Adjusted padding for visual grouping
                        color: mode === 'dark' ? alpha(currentTextColors.secondary, 0.8) : alpha(currentTextColors.primary, 0.6),
                    },
                },
            },
            MuiAvatar: { // In case Avatar is used inside, e.g. for user profile pic
                styleOverrides: {
                    root: {
                        boxShadow: `0 4px 8px ${mode === 'dark' ? 'rgba(0,0,0,0.3)' : 'rgba(149,117,205,0.2)'}`,
                    }
                }
            }
        },
    });
};


// Reusable NavLinkItem for MUI
const MuiNavLinkItem = ({ to, icon, primaryText, isExternal = false, subItem = false, sx, ...props }) => {
    const location = useLocation();
    const isActive = !isExternal && (location.pathname === to || (to !== "/" && location.pathname.startsWith(to + '/')));


    return (
        <ListItem disablePadding sx={{ display: 'block', my: subItem ? 0.25 : 0.5 }}> {/* Reduced vertical margin slightly */}
            <ListItemButton
                component={isExternal ? 'a' : NavLink}
                to={isExternal ? undefined : to}
                href={isExternal ? to : undefined}
                target={isExternal ? "_blank" : undefined}
                rel={isExternal ? "noreferrer" : undefined}
                selected={isActive}
                sx={{
                    minHeight: subItem ? 40 : 48, // Slightly smaller for sub-items
                    justifyContent: 'initial',
                    px: subItem ? 2 : 2.5, // Less padding for sub-items if needed
                    ...(subItem && { pl: 4.5 }), // Indent sub-items more
                    ...sx,
                }}
                {...props}
            >
                <ListItemIcon sx={{ minWidth: 0, mr: subItem ? 1.5 : 2, justifyContent: 'center' }}> {/* Icon color handled by Mui-selected or default */}
                    {React.cloneElement(icon, {style: { fontSize: subItem ? '1.1rem' : '1.25rem' }})}
                </ListItemIcon>
                <ListItemText
                    primary={primaryText}
                    primaryTypographyProps={{
                        sx: {
                            fontWeight: isActive ? 600 : 500,
                            fontSize: subItem ? '0.8rem' : '0.875rem', // Slightly adjusted sizes
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                        }
                    }}
                    sx={{ opacity: 1 }}
                />
            </ListItemButton>
        </ListItem>
    );
};

// MUI Collapsable Menu Item
const MuiCollapsableMenu = ({ icon, primaryText, subMenu, defaultOpen = false }) => {
    const location = useLocation();
    const theme = useTheme(); // Access theme for direct palette usage if needed

    const isAnySubItemActive = useMemo(() =>
        subMenu.some(item => location.pathname === item.link || (item.link !== "/" && location.pathname.startsWith(item.link + '/')) || location.pathname.startsWith(item.link + (item.link.endsWith('/') ? '' : '/'))),
        [subMenu, location.pathname]
    );

    const [open, setOpen] = useState(defaultOpen || isAnySubItemActive);

    useEffect(() => { // Keep open if a child becomes active
        if (isAnySubItemActive) {
            setOpen(true);
        }
    }, [isAnySubItemActive]);


    const handleClick = () => {
        setOpen(!open);
    };

    return (
        <>
            <ListItem disablePadding sx={{ display: 'block', my: 0.5 }}>
                <ListItemButton
                    onClick={handleClick}
                    selected={isAnySubItemActive && !open} // Visually mark as "active context" if collapsed but child is active
                    sx={{
                        minHeight: 48,
                        justifyContent: 'initial',
                        px: 2.5,
                        // Style if a child is active but this parent is collapsed (optional)
                        ...(isAnySubItemActive && !open && {
                            // backgroundColor: alpha(theme.palette.primary.main, 0.08), // Subtle indication
                            // borderLeft: `3px solid ${theme.palette.primary.main}`,
                        }),
                    }}
                >
                    <ListItemIcon sx={{ minWidth: 0, mr: 2, justifyContent: 'center' }}>
                         {React.cloneElement(icon, {style: { fontSize: '1.25rem' }})}
                    </ListItemIcon>
                    <ListItemText
                        primary={primaryText}
                        primaryTypographyProps={{
                            sx: {
                                fontWeight: (isAnySubItemActive && !open) ? 600 : 500,
                                fontSize: '0.875rem',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                            }
                        }}
                        sx={{ opacity: 1 }} />
                    {open ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
            </ListItem>
            <Collapse in={open} timeout="auto" unmountOnExit sx={{ pl: 0.5}}> {/* Slight indent for collapse content */}
                <List component="div" disablePadding>
                    {subMenu.map((item) => (
                        <MuiNavLinkItem
                            key={item.link}
                            to={item.link}
                            icon={item.icon || <Box sx={{ width: 5, height: 5, bgcolor: 'text.disabled', borderRadius: '50%', ml: 1.5, mr: 1.2 }} />}
                            primaryText={item.name}
                            subItem
                        />
                    ))}
                </List>
            </Collapse>
        </>
    );
};


function NavBarMui(props) { // Renamed to NavBarMui to avoid conflict if original NavBar exists
    const authData = useSelector((state) => state.authStore);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    // Example: Detect system dark mode preference. Replace with your app's dark mode state.
    const prefersDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const [isDarkMode, setIsDarkMode] = useState(prefersDarkMode); // Or from global state
    const lavenderTheme = useMemo(() => getLavenderTheme(isDarkMode ? 'dark' : 'light'), [isDarkMode]);


    const logout = () => {
        dispatch(
            authAction.setAuthStatus({
                userName: "", loggedIn: false, accessToken: null, refreshToken: null,
                userId: null, user_type: null, timeOfLogin: null, logInOperation: -1,
            })
        );
        deleteFromLocalStorage("loginInfo");
        navigate(`/`);
    };

    const isSidebarEffectivelyCollapsed = props.isSidebarCollapsed; // Assuming this prop comes from parent

    return (
        <ThemeProvider theme={lavenderTheme}>
            <Box
                sx={{
                    width: isSidebarEffectivelyCollapsed ? lavenderTheme.spacing(9) : 280, // Adjust collapsed width
                    height: '100vh',
                    bgcolor: 'background.paper', // Uses theme's paper color
                    boxShadow: lavenderTheme.components.MuiPaper.styleOverrides.elevation3.boxShadow, // Consistent shadow
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    zIndex: (theme) => theme.zIndex.drawer + 10, // Ensure it's above other content
                    transition: (theme) => theme.transitions.create('width', {
                        easing: theme.transitions.easing.sharp,
                        duration: theme.transitions.duration.leavingScreen,
                    }),
                    overflowX: 'hidden', // Hide content when collapsed
                    '& *': { // Ensure children also don't overflow visibly when collapsed
                        whiteSpace: isSidebarEffectivelyCollapsed ? 'nowrap' : 'normal',
                        overflow: isSidebarEffectivelyCollapsed ? 'hidden' : 'visible',
                    }
                }}
            >
                {/* Sidebar Header */}
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: isSidebarEffectivelyCollapsed ? 'center' : 'space-between',
                        p: isSidebarEffectivelyCollapsed ? '16px 0' : 2,
                        height: 70, // Slightly taller header
                        borderBottom: 1,
                        borderColor: 'divider',
                        flexShrink: 0,
                    }}
                >
                    <Box component={NavLink} to="/" sx={{ display: 'flex', alignItems: 'center', textDecoration: 'none', overflow: 'hidden' }}>
                        <Avatar
                            src="https://www.oecindia.com/assets/images/finalpic.png"
                            alt="OEC India Logo"
                            sx={{ width: 40, height: 40, ml: isSidebarEffectivelyCollapsed ? 0 : 0, mr: isSidebarEffectivelyCollapsed ? 0 : 1.5 }}
                        />
                        {!isSidebarEffectivelyCollapsed && (
                            <Typography
                                variant="h6"
                                noWrap
                                component="div"
                                sx={{ color: 'text.primary', fontWeight: 600 }}
                            >
                                OEC India
                            </Typography>
                        )}
                    </Box>
                    {!isSidebarEffectivelyCollapsed && (
                        <IconButton
                            onClick={() => props.sidebarStateChange((state) => !state)}
                            aria-label="Toggle sidebar"
                        >
                            <ChevronLeftIcon />
                        </IconButton>
                    )}
                </Box>

                {/* Navigation List */}
                <List sx={{ flexGrow: 1, overflowY: 'auto', py: 1, px: isSidebarEffectivelyCollapsed ? 0.5 : 1 }}>
                    <MuiNavLinkItem to="/" icon={<HomeIcon />} primaryText={isSidebarEffectivelyCollapsed ? '' : "Dashboard"} />

                    {authData.user_type !== "staff" && (
                        <>
                            <MuiNavLinkItem to="/search" icon={<SearchIcon />} primaryText={isSidebarEffectivelyCollapsed ? '' : "Search Courses"} />
                            <MuiNavLinkItem to="/university" icon={<LayersIcon />} primaryText={isSidebarEffectivelyCollapsed ? '' : "Search University"} />
                            <MuiNavLinkItem to="/website-enquiry" icon={<ClipboardIcon />} primaryText={isSidebarEffectivelyCollapsed ? '' : "Website Enquiry"} />
                            <MuiNavLinkItem to="https://oecindia.com/oeccrm/help/index.html" icon={<HelpOutlineIcon />} primaryText={isSidebarEffectivelyCollapsed ? '' : "Help"} isExternal />

                            {!isSidebarEffectivelyCollapsed && <ListSubheader component="div">Student Hub</ListSubheader>}
                            <MuiCollapsableMenu
                                icon={<ClipboardIcon />}
                                primaryText={isSidebarEffectivelyCollapsed ? '' : "Enquiries"}
                                defaultOpen={location.pathname.startsWith('/enquiry')}
                                subMenu={[
                                    { name: "All Enquiries", link: "/enquiries" },
                                    { name: "Create Enquiry", link: "/enquiry/create" },
                                ]}
                            />
                        </>
                    )}

                    {!isSidebarEffectivelyCollapsed && <ListSubheader component="div">Management</ListSubheader>}
                    <MuiCollapsableMenu
                        icon={<FileCopyIcon />}
                        primaryText={isSidebarEffectivelyCollapsed ? '' : "Applications"}
                        defaultOpen={location.pathname.startsWith('/application')}
                        subMenu={
                            authData.user_type !== "staff"
                                ? [
                                    { name: "All Applications", link: "/applications" },
                                    { name: "Create Application", link: "/application/create" },
                                ]
                                : [{ name: "All Applications", link: "/applications" }]
                        }
                    />

                    {!isSidebarEffectivelyCollapsed && <ListSubheader component="div">User Account</ListSubheader>}
                    <MuiNavLinkItem to="/user-profile" icon={<PeopleIcon />} primaryText={isSidebarEffectivelyCollapsed ? '' : "Profile"} />
                </List>

                {/* Logout Section */}
                <Box sx={{ p: isSidebarEffectivelyCollapsed ? 1 : 2, mt: 'auto', borderTop: 1, borderColor: 'divider', flexShrink: 0 }}>
                    <ListItemButton
                        onClick={logout}
                        sx={{
                            borderRadius: 2,
                            justifyContent: isSidebarEffectivelyCollapsed ? 'center' : 'flex-start',
                            '&:hover': {
                                bgcolor: alpha(lavenderTheme.palette.error.main, 0.1),
                                '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
                                    color: lavenderTheme.palette.error.dark,
                                },
                            },
                        }}
                    >
                        <ListItemIcon sx={{ color: 'text.secondary', minWidth: isSidebarEffectivelyCollapsed ? 'auto' : 40, justifyContent: 'center' }}>
                            <LogoutIcon />
                        </ListItemIcon>
                        {!isSidebarEffectivelyCollapsed && (
                            <ListItemText primary="Logout" primaryTypographyProps={{ sx: { color: 'text.secondary', fontSize: '0.875rem', fontWeight: 500 } }}/>
                        )}
                    </ListItemButton>
                </Box>
            </Box>
        </ThemeProvider>
    );
}

// To use it in your app, you might have something like:
// const App = () => {
//   const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
//   return (
//     <Box sx={{ display: 'flex' }}>
//       <NavBarMui isSidebarCollapsed={sidebarCollapsed} sidebarStateChange={setSidebarCollapsed} />
//       <Box component="main" sx={{ flexGrow: 1, p: 3, ml: sidebarCollapsed ? '72px' : '280px', transition: 'margin-left 0.2s ease-out' }}>
//         {/* Your page content here, e.g., <Routes>... */}
//       </Box>
//     </Box>
//   );
// };


export default NavBarMui; // Or NavBar, if you replace the original