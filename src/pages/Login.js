import React, { useState, useReducer, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Button from "../components/UI/Form/Button";
import InputBox from "../components/UI/Form/InputBox";
import Notification from "../components/UI/Notification";
import { ajaxCall } from "../helpers/ajaxCall";
import { setToLocalStorage } from "../helpers/helperFunctions";
import { authAction } from "../store/authStore";
import { uiAction } from "../store/uiStore";
import { Form } from "react-bootstrap";

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
};
function Login() {
  const [loginFormStatus, setLoginFormStatus] = useState(true);
  const [errorLogin, setErrorLogin] = useState("");
  const [errorresetPass, setErrorresetPass] = useState("");
  const [formData, dispatchInputChange] = useReducer(reducer, InitialState);
  const [errorBou, setErrorBou] = useState(null);
  const dispath = useDispatch();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const uiData = useSelector((state) => state.uiStore);
  const changeForm = () => {
    setLoginFormStatus((status) => !status);
  };

  useEffect(() => {
    if (errorBou) {
      throw errorBou;
    }
  }, [errorBou]);

  let doLogin;
  doLogin = async (e) => {
    e.preventDefault();
    if (!formData.userName?.length && !formData.password?.length) {
      setErrorLogin("Username and password can't be empty");
      return;
    }
    if (!formData.userName?.length) {
      setErrorLogin("Username can't be empty");
      return;
    }
    if (!formData.password?.length) {
      setErrorLogin("Password can't be empty");
      return;
    }
    dispatchInputChange({
      type: "submitBtn",
      text: "Logging In",
      status: 1,
    });
    let body = {
      username: formData.userName,
      password: formData.password,
    };

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
      setErrorLogin("Username or Password can't be empty, Please try again..");
      dispatchInputChange({
        type: "submitBtn",
        text: "Login",
        status: 0,
      });
      return;
    }
    if (response?.notOk) {
      setErrorBou({ ...response, general: true });
    }
    if (response.msg === "Login Successful") {
      // let's set to localstorage
      const localObj = {
        accessToken: response.token.access,
        refreshToken: response.token.refresh,
        user_type: response.user_status,
        userId: response.userid,
        timeOfLogin: Date.now(),
        userName: formData.userName,
      };
      setToLocalStorage("loginInfo", localObj, true);
      dispath(
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
    } else if (response.errors.msg === -1) {
      setErrorLogin("Username or password is wrong please try again");
      dispatchInputChange({
        type: "submitBtn",
        text: "Login",
        status: 0,
      });
    }
  };

  const resetPassword = async () => {
    dispatchInputChange({
      type: "resetBtn",
      text: "Validating Email",
      status: 1,
    });
    const validRegex =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if (
      formData.forgotEmail.length < 1 ||
      !formData.forgotEmail.match(validRegex)
    ) {
      setErrorresetPass("Please write valid email address");
      dispatchInputChange({
        type: "resetBtn",
        text: "Click to get reset link",
        status: 0,
      });
      return;
    }
    dispatchInputChange({
      type: "resetBtn",
      text: "Sending Request",
      status: 1,
    });
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
      setErrorresetPass("Email id isn't registered.");
    }
    if (response.msg === "Temporary password has been sent to the email id!") {
      changeForm();
      dispatchInputChange({ type: "forgotEmail", value: "" });
      dispatch(
        uiAction.setNotification({
          show: true,
          heading: "Reset Password Request Sent Succesfully",
          msg: `<strong>Temporary password sent to your mail id ,Please check spam folder too!</strong>`,
        })
      );
    }
    dispatchInputChange({
      type: "resetBtn",
      text: "Click to get reset link",
      status: 0,
    });
  };
  return (
    <>
      <div className="form">
        <div className="auth-container">
          <h1
            className="text-center"
            style={{ marginBottom: "100px", marginTop: "50px" }}
          >
            Welcome To OEC CRM
          </h1>
          <div className="container mx-auto align-self-center">
            <div className="row ">
              <div className="col-md-12 col-12 d-flex flex-row align-self-center mx-auto flexCols">
                <div className="text-center">
                  <img
                    src="https://www.oecindia.com/assets/images/finalpic.png"
                    alt="OEC CRM Logo"
                    className="logo-login"
                  />
                </div>
                <div className="card mt-3 mb-3 neumorphism-box nmb">
                  <div className="card-body">
                    <div className="row ">
                      {loginFormStatus ? (
                        <>
                          <div className="col-md-12 mb-3">
                            <h2 className="text-center">Log In</h2>
                            <p className="text-center">
                              Enter your email and password to login
                            </p>
                          </div>
                          <Form>
                            <div className="col-md-12">
                              <InputBox
                                divClassName="mb-3"
                                label="UserName"
                                type="text"
                                required={true}
                                value={formData.userName}
                                onChange={dispatchInputChange}
                                reducerName="userName"
                              />
                            </div>
                            <div className="col-12">
                              <InputBox
                                divClassName="mb-4"
                                label="Password"
                                type="password"
                                required={true}
                                value={formData.password}
                                onChange={dispatchInputChange}
                                reducerName="password"
                              />
                              {errorLogin.length ? (
                                <p style={{ color: "red" }}>{errorLogin}</p>
                              ) : (
                                ""
                              )}

                              <div className="text-center">
                                <p
                                  className="text-warning forgotPass"
                                  onClick={changeForm}
                                >
                                  Forgot Password?
                                </p>
                              </div>
                            </div>

                            <div className="col-12">
                              <Button
                                divClassName="mb-4"
                                btnClassName="btn btn-primary w-100"
                                onClick={doLogin}
                                btnLabel={formData.submitBtn.text}
                                disabled={
                                  formData.submitBtn.status ? true : false
                                }
                              />
                            </div>
                          </Form>
                        </>
                      ) : (
                        <div className="forgotPass-form hideForm">
                          <div className="col-md-12 mb-3 forgotPass-form hideForm">
                            <h2>Forgot Password</h2>
                            <p>
                              Enter your email id to get reset Password link
                            </p>
                          </div>
                          <div className="col-md-12">
                            <InputBox
                              divClassName="mb-3"
                              label="Email"
                              type="email"
                              required={true}
                              value={formData.forgotEmail}
                              onChange={dispatchInputChange}
                              reducerName="forgotEmail"
                            />
                          </div>
                          {errorresetPass.length ? (
                            <p style={{ color: "red" }}>{errorresetPass}</p>
                          ) : (
                            ""
                          )}
                          <div className="col-12">
                            <div className="text-center">
                              <p
                                className="text-warning returnToLogin"
                                onClick={changeForm}
                              >
                                Return To Login Form
                              </p>
                            </div>
                          </div>
                          <div className="col-12">
                            <Button
                              divClassName="mb-4"
                              btnClassName="btn btn-secondary w-100"
                              onClick={resetPassword}
                              btnLabel={formData.resetBtn.text}
                              disabled={formData.resetBtn.status ? true : false}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="iconWrapper">
              <a
                className="icon-10 facebook loginPageIcon"
                href=" "
                title="Facebook"
              >
                <div class="ir">
                  <svg
                    viewBox="0 0 512 512"
                    preserveAspectRatio="xMidYMid meet"
                    width="512"
                    height="512"
                  >
                    <path d="M211.9 197.4h-36.7v59.9h36.7V433.1h70.5V256.5h49.2l5.2-59.1h-54.4c0 0 0-22.1 0-33.7 0-13.9 2.8-19.5 16.3-19.5 10.9 0 38.2 0 38.2 0V82.9c0 0-40.2 0-48.8 0 -52.5 0-76.1 23.1-76.1 67.3C211.9 188.8 211.9 197.4 211.9 197.4z"></path>
                  </svg>
                </div>
              </a>
              <a
                className="icon-17 linkedin loginPageIcon"
                href=" "
                title="LinkedIn"
              >
                <div class="ir">
                  <svg
                    viewBox="0 0 512 512"
                    preserveAspectRatio="xMidYMid meet"
                    width="512"
                    height="512"
                  >
                    <path d="M186.4 142.4c0 19-15.3 34.5-34.2 34.5 -18.9 0-34.2-15.4-34.2-34.5 0-19 15.3-34.5 34.2-34.5C171.1 107.9 186.4 123.4 186.4 142.4zM181.4 201.3h-57.8V388.1h57.8V201.3zM273.8 201.3h-55.4V388.1h55.4c0 0 0-69.3 0-98 0-26.3 12.1-41.9 35.2-41.9 21.3 0 31.5 15 31.5 41.9 0 26.9 0 98 0 98h57.5c0 0 0-68.2 0-118.3 0-50-28.3-74.2-68-74.2 -39.6 0-56.3 30.9-56.3 30.9v-25.2H273.8z"></path>
                  </svg>
                </div>
              </a>
              <a
                className="icon-15 instagram loginPageIcon"
                href=" "
                title="Instagram"
              >
                <div class="ir">
                  <svg
                    viewBox="0 0 512 512"
                    preserveAspectRatio="xMidYMid meet"
                    width="512"
                    height="512"
                  >
                    <path d="M256 109.3c47.8 0 53.4 0.2 72.3 1 17.4 0.8 26.9 3.7 33.2 6.2 8.4 3.2 14.3 7.1 20.6 13.4 6.3 6.3 10.1 12.2 13.4 20.6 2.5 6.3 5.4 15.8 6.2 33.2 0.9 18.9 1 24.5 1 72.3s-0.2 53.4-1 72.3c-0.8 17.4-3.7 26.9-6.2 33.2 -3.2 8.4-7.1 14.3-13.4 20.6 -6.3 6.3-12.2 10.1-20.6 13.4 -6.3 2.5-15.8 5.4-33.2 6.2 -18.9 0.9-24.5 1-72.3 1s-53.4-0.2-72.3-1c-17.4-0.8-26.9-3.7-33.2-6.2 -8.4-3.2-14.3-7.1-20.6-13.4 -6.3-6.3-10.1-12.2-13.4-20.6 -2.5-6.3-5.4-15.8-6.2-33.2 -0.9-18.9-1-24.5-1-72.3s0.2-53.4 1-72.3c0.8-17.4 3.7-26.9 6.2-33.2 3.2-8.4 7.1-14.3 13.4-20.6 6.3-6.3 12.2-10.1 20.6-13.4 6.3-2.5 15.8-5.4 33.2-6.2C202.6 109.5 208.2 109.3 256 109.3M256 77.1c-48.6 0-54.7 0.2-73.8 1.1 -19 0.9-32.1 3.9-43.4 8.3 -11.8 4.6-21.7 10.7-31.7 20.6 -9.9 9.9-16.1 19.9-20.6 31.7 -4.4 11.4-7.4 24.4-8.3 43.4 -0.9 19.1-1.1 25.2-1.1 73.8 0 48.6 0.2 54.7 1.1 73.8 0.9 19 3.9 32.1 8.3 43.4 4.6 11.8 10.7 21.7 20.6 31.7 9.9 9.9 19.9 16.1 31.7 20.6 11.4 4.4 24.4 7.4 43.4 8.3 19.1 0.9 25.2 1.1 73.8 1.1s54.7-0.2 73.8-1.1c19-0.9 32.1-3.9 43.4-8.3 11.8-4.6 21.7-10.7 31.7-20.6 9.9-9.9 16.1-19.9 20.6-31.7 4.4-11.4 7.4-24.4 8.3-43.4 0.9-19.1 1.1-25.2 1.1-73.8s-0.2-54.7-1.1-73.8c-0.9-19-3.9-32.1-8.3-43.4 -4.6-11.8-10.7-21.7-20.6-31.7 -9.9-9.9-19.9-16.1-31.7-20.6 -11.4-4.4-24.4-7.4-43.4-8.3C310.7 77.3 304.6 77.1 256 77.1L256 77.1z"></path>
                    <path d="M256 164.1c-50.7 0-91.9 41.1-91.9 91.9s41.1 91.9 91.9 91.9 91.9-41.1 91.9-91.9S306.7 164.1 256 164.1zM256 315.6c-32.9 0-59.6-26.7-59.6-59.6s26.7-59.6 59.6-59.6 59.6 26.7 59.6 59.6S288.9 315.6 256 315.6z"></path>
                    <circle cx="351.5" cy="160.5" r="21.5"></circle>
                  </svg>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
      <Notification
        show={uiData.notification.show}
        heading={uiData.notification.heading}
        msg={uiData.notification.msg}
      />
    </>
  );
}

export default Login;
