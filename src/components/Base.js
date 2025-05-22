import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Header from "./UI/Layouts/Header";
import Sidebar from "./UI/Layouts/Sidebar";
import Notification from "./UI/Notification";
import { uiAction } from "../store/uiStore";

function Base() {
  const navigate = useNavigate();

  const uiData = useSelector((state) => state.uiStore);
  const authData = useSelector((state) => state.authStore);
  const dispatch = useDispatch();
  const isSmallDevice = window.innerWidth > 992;
  const [sideBarStatus, setSideBarStatus] = useState(isSmallDevice);

  const location = useLocation();
  const checkRestrictedStaffPath = useCallback(() => {
    if (
      location.pathname === "/search" ||
      location.pathname === "/university" ||
      location.pathname === "/enquiries" ||
      location.pathname === "/enquiry/create" ||
      location.pathname === "/application/create"
    ) {
      return true;
    }
    return false;
  }, [location.pathname]);

  useEffect(() => {
    if (authData.user_type === "staff" && checkRestrictedStaffPath()) {
      dispatch(
        uiAction.setNotification({
          show: true,
          heading: "Authentication Error",
          msg: `You do not have permission to view that page`,
        })
      );
      navigate("/");
    }
    if (!isSmallDevice) {
      setSideBarStatus(false);
    }
  }, [
    location.pathname,
    isSmallDevice,
    authData.user_type,
    checkRestrictedStaffPath,
    dispatch,
    navigate,
  ]);

  useEffect(() => {}, []);
  return (
    <>
      <div
        className={`main-container ${
          sideBarStatus ? "sbar-open" : "sidebar-closed"
        }`}
        id="container"
      >
        <Sidebar sidebarStateChange={setSideBarStatus} />
        <div id="content" className="main-content">
          <div className="layout-px-spacing">
            <div className="middle-content p-0">
              <div className="container-fluid">
                <Header sidebarStateChange={setSideBarStatus} />
                <Outlet />
              </div>
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

export default Base;
