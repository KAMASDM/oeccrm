import React, { useReducer, useState } from "react";
import SelectionBox from "../UI/Form/SelectionBox";
import FileUpload from "../UI/Form/FileUpload";
import { Button, Form } from "react-bootstrap";
import { ajaxCall } from "../../helpers/ajaxCall";
import { useDispatch, useSelector } from "react-redux";
import { uiAction } from "../../store/uiStore";

const initialState = {
  sop: null,
  rcvd_offer_letter: null,
  university_interested: "",
  course_interested: "",
  intake_interested: "",
  level_applying_for: "",
  assignedUser: "",
  status: "",
};
const reducerFile = (state, action) => {
  return { ...state, [action.type]: action.value };
};
function CourseUniForm(props) {
  const [fileData, dispatchFunction] = useReducer(reducerFile, initialState);
  const authData = useSelector((state) => state.authStore);
  const [loadError, setLoadError] = useState({
    isError: false,
    isSubmitting: false,
  });
  const dispatch = useDispatch();
  const uploadUniCourseData = async function (appID, e) {
    e.preventDefault();
    if (
      !fileData.university_interested ||
      !fileData.course_interested ||
      !fileData.intake_interested ||
      !fileData.level_applying_for ||
      !fileData.sop
    ) {
      setLoadError({
        isError: "Please Fill all the details",
        isSubmitting: false,
      });
      return;
    }
    setLoadError({
      isError: false,
      isSubmitting: true,
    });
    const fdata = new FormData();
    fdata.append("university_interested", fileData.university_interested);
    fdata.append("course_interested", fileData.course_interested);
    fdata.append("intake_interested", fileData.intake_interested);
    fdata.append("level_applying_for", fileData.level_applying_for);
    fdata.append("application", appID);
    if (fileData.assignedUser)
      fdata.append("assigned_users", fileData.assignedUser);
    if (fileData.status) fdata.append("status", fileData.status);
    if (fileData.sop instanceof File) fdata.append("Sop", fileData.sop);
    if (fileData.rcvd_offer_letter instanceof File)
      fdata.append("rcvd_offer_letter", fileData.rcvd_offer_letter);
    let url, method;
    url = "get/courseinfo/";
    method = "POST";
    const response = await ajaxCall(
      url,
      {
        Authorization: `Bearer ${authData.accessToken}`,
      },
      method,
      fdata
    );
    console.log(response);
    setLoadError({
      isError: false,
      isSubmitting: false,
    });
    dispatch(
      uiAction.setNotification({
        show: true,
        heading: "Application",
        msg: `Applied To University For ${props.appName} Student`,
      })
    );
    props.hideModal(true);
    props.setRefresherNeeded(true);
  };
  const handleChange = (fileName, file) => {
    dispatchFunction({ type: fileName, value: file });
  };

  return (
    <Form
      className="row"
      onSubmit={uploadUniCourseData.bind(null, props.appId)}
    >
      <SelectionBox
        groupClass={`mb-3  selectbox ${props.clssName}`}
        groupId="uniInterested"
        label="University Interested"
        value={fileData.university_interested}
        onChange={(val) => {
          dispatchFunction({
            type: "university_interested",
            value: val,
          });
        }}
        name="uniInterested"
        url={`universitieslists/?country=${props.country}`}
        isSearch={true}
        objKey="univ_name"
      />
      <SelectionBox
        groupClass={`mb-3  selectbox ${props.clssName}`}
        groupId="intakeInterested"
        label="Intake Interested"
        value={fileData.intake_interested}
        onChange={(val) => {
          dispatchFunction({
            type: "intake_interested",
            value: val,
          });
        }}
        name="intakeInterested"
        url="intakes/"
        isSearch={true}
        objKey="it's different"
      />
      <SelectionBox
        label="Level Applying For"
        groupClass={`mb-3  selectbox ${props.clssName}`}
        groupId="levelApplying"
        value={fileData.level_applying_for}
        onChange={(val) => {
          dispatchFunction({
            type: "level_applying_for",
            value: val,
          });
        }}
        name="levelApplying"
        url="courselevels/"
        isSearch={true}
        objKey="levels"
      />
      <SelectionBox
        groupClass={`mb-3  selectbox ${props.clssName}`}
        groupId="courseIntersted"
        label="Course Interested"
        value={fileData.course_interested}
        onChange={(val) => {
          dispatchFunction({
            type: "course_interested",
            value: val,
          });
        }}
        name="courseInterested"
        url={
          fileData.university_interested && fileData.level_applying_for
            ? `courseslists/?university=${fileData.university_interested}&course_levels=${fileData.level_applying_for}`
            : ""
        }
        isSearch={true}
        objKey="course_name"
      />
      <FileUpload
        label="SOP"
        appId={props.appId}
        uploadId="Sop"
        isEdit={props.edit}
        onChange={(val) => {
          dispatchFunction({
            type: "sop",
            value: val,
          });
        }}
        groupId="sopFile"
        groupClassName={`mb-3  dragDropUpload noHeight ${props.clssName}`}
        fieldName="sopFileIp"
        minUploadSize="0.005"
        maxUploadSize="10"
        afile={fileData.sop}
      />
      <FileUpload
        appId={props.appId}
        uploadId="rcvd_offer_letter"
        label="Offer Letter"
        isEdit={props.edit}
        onChange={(val) => {
          dispatchFunction({
            type: "rcvd_offer_letter",
            value: val,
          });
        }}
        groupId="rcvd_offer_letter"
        groupClassName={`mb-3  dragDropUpload noHeight ${props.clssName}`}
        fieldName="rcvd_offer_letterIP"
        minUploadSize="0.005"
        maxUploadSize="10"
        afile={fileData.rcvd_offer_letter}
      />
      {authData.user_type === "superuser" ? (
        <SelectionBox
          groupClass={`mb-3 selectbox col-md-6 `}
          groupId="assignedUser"
          onChange={handleChange.bind(null, "assignedUser")}
          name="assignedUser"
          url="userlist/"
          value={fileData.assignedUser}
          isSearch={true}
          objKey="username"
          label="Assigned Users"
        />
      ) : (
        ""
      )}
      {authData.user_type !== "Agent" ? (
        <SelectionBox
          label="Status"
          groupClass={`mb-3 selectbox col-md-6 `}
          groupId="status"
          onChange={handleChange.bind(null, "status")}
          name="status"
          url="appstatus/"
          value={fileData.status}
          objKey="App_status"
        />
      ) : (
        ""
      )}
      <div className="col-md-12 text-center">
        <Button
          variant="primary"
          type="submit"
          disabled={loadError.isSubmitting}
        >
          {loadError.isSubmitting ? "Applying" : "Apply To University"}
        </Button>
        {loadError.isError ? <p className="dengor">{loadError.isError}</p> : ""}
      </div>
    </Form>
  );
}

export default CourseUniForm;
