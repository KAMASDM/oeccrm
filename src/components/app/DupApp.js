import React from "react";
import { ajaxCallWithHeaderOnly } from "../../helpers/ajaxCall";
import { useDispatch, useSelector } from "react-redux";
import { uiAction } from "../../store/uiStore";

function DupApp(props) {
  const dispatch = useDispatch();
  const authData = useSelector((state) => state.authStore);
  const dupApplication = async function () {
    const response = await ajaxCallWithHeaderOnly(
      `duplicate-application/${props.appID}`,
      {
        Authorization: `Bearer ${authData.accessToken}`,
      },
      "POST",
      null
    );
    console.log(response);
    if (response?.isNetwork) {
      return;
    }
    if (response?.status === 401 || response?.status === 204) {
      return;
    }
    if (response?.status === 400) {
      return;
    }
    dispatch(
      uiAction.setNotification({
        show: true,
        heading: "Application",
        msg: `<strong>${props.name}</strong> Application Duplicated Succesfully`,
      })
    );
    props.refresh(true);
  };
  
  return (
    <button
      className="enquiryAction"
      title="Copy Application"
      onClick={() => {
        dupApplication();
      }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="feather feather-file-plus"
      >
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
        <polyline points="14 2 14 8 20 8"></polyline>
        <line x1="12" y1="18" x2="12" y2="12"></line>
        <line x1="9" y1="15" x2="15" y2="15"></line>
      </svg>
    </button>
  );
}

export default DupApp;
