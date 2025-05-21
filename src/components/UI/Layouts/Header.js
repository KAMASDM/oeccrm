import React, { useMemo, useState } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

// MUI Core Components
import {
    AppBar,
    Toolbar,
    IconButton,
    Typography,
    Box,
    Breadcrumbs,
    Link as MuiLink, // Renamed to avoid conflict with RouterLink
    Button,
    useTheme,
    ThemeProvider,
    Paper,
    Divider,
    createTheme,
    alpha,
    Container, // For consistent max-width if needed
    Hidden, // For responsive visibility
} from '@mui/material';

// MUI Icons
import MenuIcon from '@mui/icons-material/Menu';
import AddIcon from '@mui/icons-material/Add'; // For create buttons
import NavigateNextIcon from '@mui/icons-material/NavigateNext'; // For breadcrumbs

// ----- Custom Lavender Theme (Copied from previous examples, ensure it's available) -----
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
            // Add specific styles for breadcrumbs if needed
            caption: { // Example for breadcrumbs
                fontSize: '0.8rem',
                color: currentTextColors.secondary,
            }
        },
        components: {
            MuiButton: {
                styleOverrides: {
                    root: {
                        borderRadius: 12,
                        textTransform: 'none',
                        boxShadow: 'none',
                        transition: 'all 0.2s ease-in-out',
                        padding: '6px 16px', // Standard button padding
                        '&:hover': {
                            transform: 'translateY(-1px)',
                            boxShadow: `0 4px 10px ${alpha(lavenderPalette.primary.main, 0.25)}`,
                        },
                    },
                    contained: {
                        boxShadow: `0 2px 6px ${alpha(lavenderPalette.primary.main, 0.2)}`,
                    },
                    containedPrimary: { // Ensure primary buttons use the theme correctly
                        backgroundColor: lavenderPalette.primary.main,
                        color: lavenderPalette.primary.contrastText,
                        '&:hover': {
                            backgroundColor: lavenderPalette.primary.dark,
                        }
                    }
                },
            },
            MuiAppBar: {
                styleOverrides: {
                    root: {
                        backgroundColor: mode === 'dark' ? alpha('#2d2a45', 0.8) : alpha('#ffffff', 0.85), // Slightly transparent for a modern feel
                        backdropFilter: 'blur(8px)', // Frosted glass effect
                        boxShadow: mode === 'dark' ? `0 2px 8px ${alpha('#000', 0.3)}` : `0 2px 8px ${alpha(lavenderPalette.primary.main, 0.1)}`, // Softer shadow
                        color: currentTextColors.primary,
                    }
                }
            },
            MuiBreadcrumbs: {
                styleOverrides: {
                    separator: {
                        color: currentTextColors.secondary,
                    },
                    li: { // Style for each breadcrumb item container
                        '& .MuiTypography-root': { // Target Typography if it's the last item
                            color: currentTextColors.primary,
                            fontWeight: 500,
                        },
                    }
                }
            },
            MuiLink: { // Styling for MUI Link components (used in Breadcrumbs)
                styleOverrides: {
                    root: {
                        color: currentTextColors.secondary,
                        textDecoration: 'none',
                        fontWeight: 400,
                        transition: 'color 0.2s ease-in-out',
                        '&:hover': {
                            color: lavenderPalette.primary.main,
                            textDecoration: 'underline',
                        },
                    }
                }
            },
            // ... other component overrides from HomePage's getLavenderTheme if needed
        },
    });
};


function HeaderMui(props) {
    const location = useLocation();
    const currentPathname = location.pathname;

    // Example: Detect system dark mode preference. Replace with your app's dark mode state.
    const prefersDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const [isDarkMode, setIsDarkMode] = useState(prefersDarkMode); // Or from global state
    const theme = useMemo(() => getLavenderTheme(isDarkMode ? 'dark' : 'light'), [isDarkMode]);


    const generateBreadcrumbs = () => {
        if (currentPathname === "/") {
            return [<Typography key="home" color="text.primary" sx={{fontWeight: 500}}>Dashboard</Typography>];
        }

        const pathnames = currentPathname.split("/").filter((x) => x);
        let breadcrumbPath = "";

        const breadcrumbItems = pathnames.map((name, index) => {
            breadcrumbPath += `/${name}`;
            const isLast = index === pathnames.length - 1;
            const displayName = name.charAt(0).toUpperCase() + name.slice(1).replace(/-/g, ' '); // Capitalize and replace hyphens

            return isLast ? (
                <Typography key={breadcrumbPath} color="text.primary" sx={{fontWeight: 500, fontSize: '0.9rem'}}>
                    {displayName}
                </Typography>
            ) : (
                <MuiLink
                    key={breadcrumbPath}
                    component={RouterLink}
                    to={breadcrumbPath}
                    underline="hover"
                    color="inherit" // Will inherit from Breadcrumbs li or MuiLink overrides
                    sx={{fontSize: '0.9rem'}}
                >
                    {displayName}
                </MuiLink>
            );
        });

        // Add Home/Dashboard link at the beginning
        return [
            <MuiLink key="home-link" component={RouterLink} to="/" underline="hover" color="inherit" sx={{fontSize: '0.9rem'}}>
                Dashboard
            </MuiLink>,
            ...breadcrumbItems,
        ];
    };

    return (
        <ThemeProvider theme={theme}>
            {/* The original had two header sections. This combines them into one main AppBar.
                The 'hideOnMobile' class is handled by MUI's responsive display properties if needed,
                but typically the AppBar is always visible.
            */}
            <AppBar
                position="sticky" // Or "fixed" if you want it fixed regardless of scroll
                elevation={0} // Shadow is handled by theme override for MuiAppBar
                sx={{
                    // If you had a top bar that was sometimes hidden:
                    // display: { xs: 'none', md: 'block' } // This would hide the entire app bar on mobile
                }}
            >
                <Container maxWidth="xl"> {/* Use container for consistent padding and max-width */}
                    <Toolbar disableGutters sx={{ minHeight: { xs: 56, sm: 64 } }}>
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            edge="start"
                            onClick={() => props.sidebarStateChange((old) => !old)}
                            sx={{
                                mr: 2,
                                color: 'text.primary' // Ensure icon color matches text
                            }}
                        >
                            <MenuIcon />
                        </IconButton>

                        <Box sx={{ flexGrow: 1 }}>
                            <Breadcrumbs
                                separator={<NavigateNextIcon fontSize="small" />}
                                aria-label="breadcrumb"
                                sx={{
                                    '& .MuiBreadcrumbs-ol': {
                                        alignItems: 'center', // Vertically align items
                                    }
                                }}
                            >
                                {generateBreadcrumbs()}
                            </Breadcrumbs>
                        </Box>

                        {/* Conditional Action Buttons */}
                        <Box sx={{ flexShrink: 0, ml: 2 }}>
                            {currentPathname === "/enquiries" && (
                                <Button
                                    variant="contained"
                                    color="primary" // Uses primary from theme
                                    component={RouterLink}
                                    to="/enquiry/create"
                                    startIcon={<AddIcon />}
                                >
                                    Create Enquiry
                                </Button>
                            )}
                            {currentPathname === "/applications" && (
                                <Button
                                    variant="contained"
                                    color="primary"
                                    component={RouterLink}
                                    to="/application/create"
                                    startIcon={<AddIcon />}
                                >
                                    Create Application
                                </Button>
                            )}
                        </Box>
                    </Toolbar>
                </Container>
            </AppBar>
            {/* The <hr /> is typically not needed as the AppBar provides visual separation.
                If you need a divider below the AppBar content, you can add <Divider />
                within your main page layout, not as part of the Header itself.
            */}
        </ThemeProvider>
    );
}

export default HeaderMui;
