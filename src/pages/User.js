import React, { useEffect, useReducer } from "react";
import { useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Password from "../components/UI/Password";
import { ajaxCall } from "../helpers/ajaxCall";
import { uiAction } from "../store/uiStore";
import UserCount from "../components/Users/UserCount";

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
  const [formState, setFormState] = useState({
    error: false,
    errorText: "",
    isSubmit: false,
    Success: "",
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
    if (passData.NewPass.length < 8 || passData.NewPassAgain.length < 8) {
      setFormState({
        error: true,
        errorText: "New Password must be 8 character long",
        isSubmit: false,
        Success: "",
      });
      return;
    } else if (passData.NewPass.length !== passData.NewPassAgain.length) {
      setFormState({
        error: true,
        errorText: "Password Doesn't match, Please chek again",
        isSubmit: false,
        Success: "",
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
    if (response?.isNetwork) {
      setThrowErr({ ...response, page: "enqForm" });
      return;
    }
    if (response?.status === 401 || response?.status === 204) {
      setThrowErr({ ...response, page: "enqForm" });
      return;
    }
    if (response?.status === 400) {
      setFormState({
        error: true,
        errorText: "Please check your current password!",
        isSubmit: false,
        Success: "",
      });
      return;
    }
    if (response.msg === "Password changed")
      dispatch(
        uiAction.setNotification({
          show: true,
          heading: "User Action",
          msg: `Password changed successfully`,
        })
      );
    else
      setFormState({
        error: true,
        errorText: "Some problem occured, Please try again...",
        isSubmit: false,
        Success: "",
      });
    navigate(`/`);
    return;
  };

  return (
    <div className="row">
      <UserCount />
      <div className="col-md-6">
        <div className="profile-update-form-center">
          <div className="neumorphism-box p50">
            <Form onSubmit={changePass}>
              <Form.Group
                as={Row}
                className="mb-3"
                controlId="formPlaintextEmail"
              >
                <Form.Label column sm="3">
                  UserName
                </Form.Label>
                <Col sm="9">
                  <Form.Control readOnly defaultValue={authData.userName} />
                </Col>
              </Form.Group>

              <Password
                label="Current Password"
                onChange={(e) => {
                  dispatchPass({ type: "currentPass", value: e.target.value });
                }}
                value={passData.currentPass}
              />
              <Password
                label="New Password"
                value={passData.NewPass}
                onChange={(e) => {
                  dispatchPass({ type: "NewPass", value: e.target.value });
                }}
              />
              <Password
                label="New Password Again"
                value={passData.NewPassAgain}
                onChange={(e) => {
                  dispatchPass({ type: "NewPassAgain", value: e.target.value });
                }}
              />

              {formState.error ? (
                <p className="dengor">{formState.errorText}</p>
              ) : (
                ""
              )}
              <Col sm="12" className="text-center">
                <Button
                  variant="primary"
                  type="submit"
                  disabled={
                    passData.currentPass &&
                    passData.NewPass &&
                    passData.NewPassAgain
                      ? false
                      : true
                  }
                >
                  Change Password
                </Button>
              </Col>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;
