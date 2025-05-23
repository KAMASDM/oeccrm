import React, { useEffect, useReducer, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ajaxCall } from "../helpers/ajaxCall";
import { uiAction } from "../store/uiStore";
import UserCount from "../components/Users/UserCount";
import lavenderTheme from "../theme";
import {
  Box,
  Button,
  Card,
  Container,
  CssBaseline,
  Grid,
  TextField,
  ThemeProvider,
  Typography,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const initialState = {
  currentPass: "",
  NewPass: "",
  NewPassAgain: "",
};

const reducerPass = function (state, action) {
  return { ...state, [action.type]: action.value };
};

function UserProfile() {
  const [passData, dispatchPass] = useReducer(reducerPass, initialState);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showNewPasswordAgain, setShowNewPasswordAgain] = useState(false);
  const [formState, setFormState] = useState({
    error: false,
    errorText: "",
  });
  const [throwErr, setThrowErr] = useState(null);

  useEffect(() => {
    if (throwErr) throw throwErr;
  }, [throwErr]);

  const dispatch = useDispatch();
  const authData = useSelector((state) => state.authStore);
  const navigate = useNavigate();

  const changePass = async function (e) {
    e.preventDefault();
    setFormState({ error: false, errorText: "" });

    if (passData.NewPass.length < 8) {
      setFormState({
        error: true,
        errorText: "New Password must be at least 8 characters long",
      });
      return;
    }
    if (passData.NewPass !== passData.NewPassAgain) {
      setFormState({
        error: true,
        errorText: "Passwords do not match. Please check again.",
      });
      return;
    }

    const fdata = new FormData();
    fdata.append("current_password", passData.currentPass);
    fdata.append("password", passData.NewPass);
    fdata.append("password2", passData.NewPassAgain);

    const response = await ajaxCall(
      `user/changepassword/`,
      {
        Authorization: `Bearer ${authData.accessToken}`,
      },
      "POST",
      fdata
    );

    if (
      response?.isNetwork ||
      response?.status === 401 ||
      response?.status === 204
    ) {
      setThrowErr({ ...response, page: "userProfile" });
      return;
    }
    if (response?.status === 400) {
      setFormState({
        error: true,
        errorText: "Please check your current password!",
      });
      return;
    }
    if (response.msg === "Password changed") {
      dispatch(
        uiAction.setNotification({
          show: true,
          heading: "User Action",
          msg: `Password changed successfully`,
        })
      );
      navigate(`/`);
    } else {
      setFormState({
        error: true,
        errorText:
          response?.detail || "Some problem occurred. Please try again...",
      });
    }
  };

  return (
    <ThemeProvider theme={lavenderTheme}>
      <CssBaseline />
      <Box
        sx={{
          flexGrow: 1,
          p: { xs: 2, sm: 3, md: 4 },
          bgcolor: "background.default",
          color: "text.primary",
          transition: "all 0.3s ease",
          backgroundImage: `radial-gradient(${lavenderTheme.palette.primary.light}20 2px, transparent 0)`, // Using customTheme directly
          backgroundSize: "24px 24px",
          borderRadius: "24px",
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} justifyContent="center">
            <Grid item xs={12}>
              <Grid container spacing={4} justifyContent="center">
                <UserCount />
              </Grid>
            </Grid>

            <Grid item xs={12} md={8} lg={7}>
              <Card
                component="form"
                onSubmit={changePass}
                noValidate
                sx={{
                  p: { xs: 2, sm: 3, md: 5 },
                  mt: 4,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    width: "100%",
                  }}
                >
                  <Typography variant="h4" component="h2" sx={{ mb: 4 }}>
                    Change Password
                  </Typography>

                  <Box
                    sx={{
                      width: "100%",
                      display: "flex",
                      flexDirection: "column",
                      gap: 3,
                    }}
                  >
                    <TextField
                      label="Username"
                      fullWidth
                      InputProps={{
                        readOnly: true,
                      }}
                      defaultValue={authData.userName}
                      variant="outlined"
                    />
                    <TextField
                      label="Current Password"
                      type={showCurrentPassword ? "text" : "password"}
                      value={passData.currentPass}
                      onChange={(e) =>
                        dispatchPass({
                          type: "currentPass",
                          value: e.target.value,
                        })
                      }
                      fullWidth
                      required
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={() =>
                                setShowCurrentPassword(!showCurrentPassword)
                              }
                              edge="end"
                            >
                              {showCurrentPassword ? (
                                <VisibilityOff />
                              ) : (
                                <Visibility />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                    <TextField
                      label="New Password"
                      type={showNewPassword ? "text" : "password"}
                      value={passData.NewPass}
                      onChange={(e) =>
                        dispatchPass({ type: "NewPass", value: e.target.value })
                      }
                      fullWidth
                      required
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={() =>
                                setShowNewPassword(!showNewPassword)
                              }
                              edge="end"
                            >
                              {showNewPassword ? (
                                <VisibilityOff />
                              ) : (
                                <Visibility />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                    <TextField
                      label="New Password Again"
                      type={showNewPasswordAgain ? "text" : "password"}
                      value={passData.NewPassAgain}
                      onChange={(e) =>
                        dispatchPass({
                          type: "NewPassAgain",
                          value: e.target.value,
                        })
                      }
                      fullWidth
                      required
                      error={
                        passData.NewPass !== passData.NewPassAgain &&
                        passData.NewPassAgain !== ""
                      }
                      helperText={
                        passData.NewPass !== passData.NewPassAgain &&
                        passData.NewPassAgain !== ""
                          ? "Passwords do not match."
                          : ""
                      }
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={() =>
                                setShowNewPasswordAgain(!showNewPasswordAgain)
                              }
                              edge="end"
                            >
                              {showNewPasswordAgain ? (
                                <VisibilityOff />
                              ) : (
                                <Visibility />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Box>

                  {formState.error && (
                    <Typography color="error" variant="body2" sx={{ mt: 2 }}>
                      {formState.errorText}
                    </Typography>
                  )}

                  <Button
                    variant="contained"
                    type="submit"
                    color="primary"
                    disabled={
                      !passData.currentPass ||
                      !passData.NewPass ||
                      !passData.NewPassAgain
                    }
                    sx={{ mt: 3, width: { xs: "100%", sm: "auto" }, px: 5 }}
                  >
                    Change Password
                  </Button>
                </Box>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default UserProfile;
