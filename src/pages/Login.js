import React, { useReducer, useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Grid,
  InputAdornment,
  ThemeProvider,
} from "@mui/material";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import FacebookIcon from "@mui/icons-material/Facebook";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import InstagramIcon from "@mui/icons-material/Instagram";
import { ajaxCall } from "../helpers/ajaxCall";
import { setToLocalStorage } from "../helpers/helperFunctions";
import { authAction } from "../store/authStore";
import { uiAction } from "../store/uiStore";
import lavenderTheme from "../theme";

const InitialState = {
  userName: "",
  password: "",
  forgotEmail: "",
  submitBtn: { text: "Login", status: 0 },
  resetBtn: { text: "Click to get reset link", status: 0 },
};

const reducer = (state, action) => {
  if (action.type === "userName") {
    return { ...state, userName: action.value };
  }
  if (action.type === "password") {
    return { ...state, password: action.value };
  }
  if (action.type === "forgotEmail") {
    return { ...state, forgotEmail: action.value };
  }
  if (action.type === "submitBtn") {
    return {
      ...state,
      submitBtn: { text: action.text, status: action.status },
    };
  }
  if (action.type === "resetBtn") {
    return { ...state, resetBtn: { text: action.text, status: action.status } };
  }
  return state;
};

function Login() {
  const [loginFormStatus, setLoginFormStatus] = useState(true);
  const [errorLogin, setErrorLogin] = useState("");
  const [errorresetPass, setErrorresetPass] = useState("");
  const [formData, dispatchInputChange] = useReducer(reducer, InitialState);
  const [errorBou, setErrorBou] = useState(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const changeForm = () => {
    setLoginFormStatus((status) => !status);
    setErrorLogin("");
    setErrorresetPass("");
  };

  useEffect(() => {
    if (errorBou) {
      throw errorBou;
    }
  }, [errorBou]);

  const doLogin = async (e) => {
    e.preventDefault();
    setErrorLogin("");

    if (!formData.userName.trim() && !formData.password.trim()) {
      setErrorLogin("Username and password can't be empty.");
      return;
    }
    if (!formData.userName.trim()) {
      setErrorLogin("Username can't be empty.");
      return;
    }
    if (!formData.password.trim()) {
      setErrorLogin("Password can't be empty.");
      return;
    }

    dispatchInputChange({
      type: "submitBtn",
      text: "Logging In...",
      status: 1,
    });

    let body = {
      username: formData.userName,
      password: formData.password,
    };

    try {
      const response = await ajaxCall(
        "user/login/",
        {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        "POST",
        JSON.stringify(body)
      );

      if (response?.isNetwork) {
        setErrorBou({
          isNetwork: true,
          page: "login",
        });
        return;
      }
      if (response?.status && response?.status === 400 && response?.notOk) {
        setErrorLogin("Invalid username or password. Please try again.");
        return;
      }
      if (response?.notOk) {
        setErrorBou({ ...response, general: true });
        return;
      }

      if (response.msg === "Login Successful") {
        const localObj = {
          accessToken: response.token.access,
          refreshToken: response.token.refresh,
          user_type: response.user_status,
          userId: response.userid,
          timeOfLogin: Date.now(),
          userName: formData.userName,
        };
        setToLocalStorage("loginInfo", localObj, true);
        dispatch(
          authAction.setAuthStatus({
            userName: formData.userName,
            loggedIn: true,
            accessToken: response.token.access,
            refreshToken: response.token.refresh,
            user_type: response.user_status,
            userId: response.userid,
            timeOfLogin: Date.now(),
            logInOperation: 1,
          })
        );
        navigate(`/`);
      } else if (response.errors?.msg === -1) {
        setErrorLogin("Username or password is wrong. Please try again.");
      } else {
        // Generic error for unexpected responses
        setErrorLogin("An unexpected error occurred. Please try again.");
      }
    } catch (e) {
      // Catch any unhandled exceptions during ajaxCall
      setErrorLogin("An unexpected error occurred during login.");
      setErrorBou({ e, page: "login_catch" });
    } finally {
      dispatchInputChange({
        type: "submitBtn",
        text: "Login",
        status: 0,
      });
    }
  };

  const resetPassword = async () => {
    setErrorresetPass(""); // Clear previous errors
    dispatchInputChange({
      type: "resetBtn",
      text: "Validating Email...",
      status: 1,
    });

    const validRegex =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if (
      formData.forgotEmail.length < 1 ||
      !formData.forgotEmail.match(validRegex)
    ) {
      setErrorresetPass("Please enter a valid email address.");
      dispatchInputChange({
        type: "resetBtn",
        text: "Click to get reset link",
        status: 0,
      });
      return;
    }

    dispatchInputChange({
      type: "resetBtn",
      text: "Sending Request...",
      status: 1,
    });

    try {
      const response = await ajaxCall(
        "user/resetpassword/",
        {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        "POST",
        JSON.stringify({ email_id: formData.forgotEmail })
      );

      if (response?.notOk && response?.status === 400) {
        setErrorresetPass("Email ID isn't registered.");
      } else if (
        response.msg === "Temporary password has been sent to the email id!"
      ) {
        changeForm(); // Switch back to login form
        dispatchInputChange({ type: "forgotEmail", value: "" }); // Clear email
        dispatch(
          uiAction.setNotification({
            show: true,
            heading: "Reset Password Request Sent Successfully",
            msg: `<strong>Temporary password sent to your mail ID. Please check your spam folder too!</strong>`,
          })
        );
      } else {
        // Generic error for unexpected responses
        setErrorresetPass("An unexpected error occurred. Please try again.");
      }
    } catch (e) {
      // Catch any unhandled exceptions during ajaxCall
      setErrorresetPass("An unexpected error occurred during reset.");
      setErrorBou({ e, page: "reset_password_catch" });
    } finally {
      dispatchInputChange({
        type: "resetBtn",
        text: "Click to get reset link",
        status: 0,
      });
    }
  };

  return (
    <ThemeProvider theme={lavenderTheme}>
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          bgcolor: "background.default",
          py: 4,
          px: 2,
          backgroundImage: `radial-gradient(${lavenderTheme.palette.primary.light}20 2px, transparent 0)`,
          backgroundSize: "24px 24px",
        }}
      >
        <Grid
          container
          spacing={3}
          justifyContent="center"
          alignItems="center"
          sx={{ maxWidth: 1000, width: "100%" }}
        >
          <Grid
            item
            xs={12}
            md={6}
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              pr: { md: 4 },
              py: { xs: 3, md: 0 },
            }}
          >
            <Typography
              variant="h4"
              component="h1"
              align="center"
              fontWeight="bold"
              color="primary.dark"
              sx={{ mb: 6, mt: { xs: 0, md: 5 } }}
            >
              Welcome To OEC CRM
            </Typography>
            <Box
              component="img"
              src="https://www.oecindia.com/assets/images/finalpic.png"
              alt="OEC CRM Logo"
              sx={{
                maxWidth: { xs: 200, sm: 250, md: 300 },
                height: "auto",
                mb: 4,
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Card
              sx={{
                borderRadius: 4,
                p: { xs: 2, sm: 3, md: 4 },
                boxShadow: "0 10px 30px rgba(149, 117, 205, 0.15)",
                bgcolor: "background.paper",
              }}
            >
              <CardContent sx={{ p: 0 }}>
                {loginFormStatus ? (
                  <Box>
                    <Typography variant="h5" align="center" sx={{ mb: 1 }}>
                      Log In
                    </Typography>
                    <Typography
                      variant="body2"
                      align="center"
                      color="text.secondary"
                      sx={{ mb: 4 }}
                    >
                      Enter your username and password to login
                    </Typography>

                    <form onSubmit={doLogin}>
                      <TextField
                        fullWidth
                        label="Username"
                        name="userName"
                        value={formData.userName}
                        onChange={(e) =>
                          dispatchInputChange({
                            type: "userName",
                            value: e.target.value,
                          })
                        }
                        required
                        margin="normal"
                        sx={{ mb: 2 }}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <PersonOutlineIcon color="action" />
                            </InputAdornment>
                          ),
                        }}
                      />
                      <TextField
                        fullWidth
                        label="Password"
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={(e) =>
                          dispatchInputChange({
                            type: "password",
                            value: e.target.value,
                          })
                        }
                        required
                        margin="normal"
                        sx={{ mb: 2 }}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <LockOutlinedIcon color="action" />
                            </InputAdornment>
                          ),
                        }}
                      />
                      {errorLogin.length > 0 && (
                        <Typography
                          variant="body2"
                          color="error"
                          sx={{ mt: 1, mb: 2 }}
                        >
                          {errorLogin}
                        </Typography>
                      )}
                      <Box sx={{ textAlign: "center", mb: 3 }}>
                        <Typography
                          variant="body2"
                          color="primary.main"
                          onClick={changeForm}
                          sx={{
                            cursor: "pointer",
                            "&:hover": { textDecoration: "underline" },
                          }}
                        >
                          Forgot Password?
                        </Typography>
                      </Box>
                      <Button
                        fullWidth
                        variant="contained"
                        color="primary"
                        type="submit"
                        disabled={formData.submitBtn.status === 1}
                        sx={{
                          py: 1.5,
                          mt: 2,
                          borderRadius: 3,
                          textTransform: "none",
                        }}
                      >
                        {formData.submitBtn.text}
                      </Button>
                    </form>
                  </Box>
                ) : (
                  <Box>
                    <Typography variant="h5" align="center" sx={{ mb: 1 }}>
                      Forgot Password
                    </Typography>
                    <Typography
                      variant="body2"
                      align="center"
                      color="text.secondary"
                      sx={{ mb: 4 }}
                    >
                      Enter your email ID to get a reset password link
                    </Typography>
                    <TextField
                      fullWidth
                      label="Email"
                      name="forgotEmail"
                      type="email"
                      value={formData.forgotEmail}
                      onChange={(e) =>
                        dispatchInputChange({
                          type: "forgotEmail",
                          value: e.target.value,
                        })
                      }
                      required
                      margin="normal"
                      sx={{ mb: 2 }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <EmailOutlinedIcon color="action" />
                          </InputAdornment>
                        ),
                      }}
                    />
                    {errorresetPass.length > 0 && (
                      <Typography
                        variant="body2"
                        color="error"
                        sx={{ mt: 1, mb: 2 }}
                      >
                        {errorresetPass}
                      </Typography>
                    )}
                    <Box sx={{ textAlign: "center", mb: 3 }}>
                      <Typography
                        variant="body2"
                        color="primary.main"
                        onClick={changeForm}
                        sx={{
                          cursor: "pointer",
                          "&:hover": { textDecoration: "underline" },
                        }}
                      >
                        Return To Login Form
                      </Typography>
                    </Box>
                    <Button
                      fullWidth
                      variant="contained"
                      color="secondary"
                      onClick={resetPassword}
                      disabled={formData.resetBtn.status === 1}
                      sx={{
                        py: 1.5,
                        mt: 2,
                        borderRadius: 3,
                        textTransform: "none",
                      }}
                    >
                      {formData.resetBtn.text}
                    </Button>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        <Box
          sx={{
            position: "absolute",
            bottom: 20,
            width: "100%",
            textAlign: "center",
          }}
        >
          <Box
            sx={{
              display: "inline-flex",
              gap: 2,
              p: 1.5,
              borderRadius: 5,
              bgcolor: "background.paper",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            }}
          >
            <Button
              variant="text"
              color="primary"
              href="https://www.facebook.com/OECindia"
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                minWidth: 0,
                p: 1,
                borderRadius: "50%",
                "& .MuiSvgIcon-root": { fontSize: 28 },
              }}
            >
              <FacebookIcon />
            </Button>
            <Button
              variant="text"
              color="primary"
              href="https://in.linkedin.com/company/oecindia"
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                minWidth: 0,
                p: 1,
                borderRadius: "50%",
                "& .MuiSvgIcon-root": { fontSize: 28 },
              }}
            >
              <LinkedInIcon />
            </Button>
            <Button
              variant="text"
              color="primary"
              href="https://www.instagram.com/oec_india/"
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                minWidth: 0,
                p: 1,
                borderRadius: "50%",
                "& .MuiSvgIcon-root": { fontSize: 28 },
              }}
            >
              <InstagramIcon />
            </Button>
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default Login;
